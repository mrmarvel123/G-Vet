const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
let autoUpdater;
try {
  // lazy require electron-updater to avoid loading in environments without it
  autoUpdater = require("electron-updater").autoUpdater;
} catch (e) {
  autoUpdater = null;
}
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");

let mainWindow;
let serverProcess;
const SERVER_PORT = 3000;
const SERVER_HOST = "localhost";

// Function to start the Node.js server
function startServer() {
  return new Promise((resolve, reject) => {
    const serverScript = path.join(__dirname, "server.js");

    // Set environment variables
    const env = {
      ...process.env,
      NODE_ENV: "production",
      ELECTRON_APP: "true",
    };

    // Spawn the server process
    serverProcess = spawn("node", [serverScript], {
      cwd: __dirname,
      env,
      stdio: "pipe",
    });

    let isResolved = false;

    serverProcess.stdout.on("data", (data) => {
      console.log(`[Server] ${data}`);
      // Resolve when server starts
      if (!isResolved && data.toString().includes("Server running")) {
        isResolved = true;
        resolve();
      }
    });

    serverProcess.stderr.on("data", (data) => {
      console.error(`[Server Error] ${data}`);
    });

    serverProcess.on("error", (err) => {
      console.error("Failed to start server:", err);
      if (!isResolved) {
        isResolved = true;
        reject(err);
      }
    });

    // Timeout fallback - assume server started after 3 seconds
    setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        resolve();
      }
    }, 3000);
  });
}

// Function to create the window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "electron-preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, "assets", "icon.png"), // Optional: add your app icon
  });

  const startURL = isDev
    ? `http://${SERVER_HOST}:${SERVER_PORT}`
    : `http://${SERVER_HOST}:${SERVER_PORT}`;

  mainWindow.loadURL(startURL);

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Handle app ready
app.on("ready", async () => {
  try {
    // Start the server first
    await startServer();

    // Create the window
    createWindow();

    // Auto-update: check for updates in production
    if (!isDev && autoUpdater) {
      autoUpdater.autoDownload = true;
      autoUpdater.on("checking-for-update", () =>
        console.log("Checking for updates..."),
      );
      autoUpdater.on("update-available", (info) => {
        console.log("Update available:", info.version);
      });
      autoUpdater.on("update-not-available", () =>
        console.log("No updates available"),
      );
      autoUpdater.on("error", (err) =>
        console.error("AutoUpdater error:", err),
      );
      autoUpdater.on("update-downloaded", (info) => {
        console.log("Update downloaded:", info.version);
        // Prompt user to install on quit
        const choice = dialog.showMessageBoxSync(mainWindow, {
          type: "question",
          buttons: ["Install and Relaunch", "Later"],
          defaultId: 0,
          cancelId: 1,
          title: "Update ready",
          message: `Version ${info.version} has been downloaded. Install now?`,
        });
        if (choice === 0) {
          autoUpdater.quitAndInstall();
        }
      });

      // Trigger check
      setTimeout(() => {
        try {
          autoUpdater.checkForUpdatesAndNotify();
        } catch (e) {
          console.error(e);
        }
      }, 3000);
    }
    // Create menu
    createMenu();
  } catch (error) {
    console.error("Failed to start app:", error);
    app.quit();
  }
});

// Handle app quit
app.on("window-all-closed", () => {
  // Kill server process
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
  }

  // On macOS, apps typically stay active until user quits explicitly
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("get-app-path", () => {
  return app.getAppPath();
});

ipcMain.handle("get-user-data-path", () => {
  return app.getPath("userData");
});

// Create application menu
function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Exit",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            if (serverProcess) {
              serverProcess.kill("SIGTERM");
            }
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About G-VET System",
          click: () => {
            // You can create an about window here
            console.log("G-VET System v2.0.0");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
