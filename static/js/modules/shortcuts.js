/**
 * G-VET Keyboard Shortcuts System
 * Handles all keyboard shortcuts and quick commands
 */

const GVETShortcuts = (() => {
  const SHORTCUTS = {
    // Navigation
    "?": { key: "Shift+?", title: "Show help", handler: showHelp },
    "Ctrl+?": {
      key: "Ctrl+Shift+?",
      title: "Show keyboard shortcuts",
      handler: showShortcuts,
    },
    "Ctrl+k": { key: "Ctrl+K", title: "Search modules", handler: openSearch },
    "Ctrl+h": { key: "Ctrl+H", title: "Go to home", handler: goHome },

    // Quick Module Access
    "Ctrl+1": {
      key: "Ctrl+1",
      title: "Open KEW.PA (Assets)",
      handler: () => GVETModules.open("kewpa-dashboard"),
    },
    "Ctrl+2": {
      key: "Ctrl+2",
      title: "Open KEW.PS (Store)",
      handler: () => GVETModules.open("kewps-dashboard"),
    },
    "Ctrl+3": {
      key: "Ctrl+3",
      title: "Open KEW.AH (Livestock)",
      handler: () => GVETModules.open("kewah-dashboard"),
    },

    // Common Actions
    "Ctrl+,": { key: "Ctrl+,", title: "Open settings", handler: openSettings },
    "Ctrl+l": { key: "Ctrl+L", title: "Logout", handler: logout },
  };

  let isShortcutsOpen = false;

  /**
   * Initialize shortcuts system
   */
  const init = () => {
    attachKeyboardListener();
    console.log("🎮 Keyboard shortcuts system initialized");
  };

  /**
   * Attach global keyboard listener
   */
  const attachKeyboardListener = () => {
    document.addEventListener("keydown", (e) => {
      handleKeyDown(e);
    });
  };

  /**
   * Handle keydown event
   * @param {KeyboardEvent} e
   */
  const handleKeyDown = (e) => {
    // Ignore if user is typing in an input/textarea
    if (isTyping(e.target)) {
      return;
    }

    // Build shortcut key combination
    const shortcut = buildShortcut(e);

    // Check if shortcut exists
    const action = SHORTCUTS[shortcut];
    if (action && action.handler) {
      e.preventDefault();
      console.log(`⌨️ Shortcut triggered: ${shortcut}`);
      action.handler();
    }
  };

  /**
   * Build shortcut string from keyboard event
   * @param {KeyboardEvent} e
   * @returns {string}
   */
  const buildShortcut = (e) => {
    const parts = [];

    if (e.ctrlKey || e.metaKey) parts.push("Ctrl");
    if (e.altKey) parts.push("Alt");
    if (e.shiftKey) parts.push("Shift");

    // Add the key
    if (e.key === "?" || e.key === "/") {
      if (e.shiftKey) parts.push("?");
      else return ""; // Don't process single ? without Shift
    } else if (e.key === "/") {
      parts.push("/");
    } else if (e.key.length === 1) {
      parts.push(e.key.toLowerCase());
    } else {
      return ""; // Ignore special keys like Enter, Space, etc.
    }

    return parts.join("+").toLowerCase();
  };

  /**
   * Check if user is typing in an input
   * @param {Element} el
   * @returns {boolean}
   */
  const isTyping = (el) => {
    const tagName = el.tagName.toLowerCase();
    const isInput =
      tagName === "input" || tagName === "textarea" || tagName === "select";
    const isContentEditable = el.contentEditable === "true";

    return isInput || isContentEditable;
  };

  /**
   * Show keyboard shortcuts modal
   */
  function showShortcuts() {
    if (isShortcutsOpen) return;
    isShortcutsOpen = true;

    const modal = createShortcutsModal();
    document.body.appendChild(modal);

    // Close on escape
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        modal.remove();
        document.removeEventListener("keydown", handleEscape);
        isShortcutsOpen = false;
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Close on overlay click
    modal.querySelector(".modal-overlay").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        modal.remove();
        document.removeEventListener("keydown", handleEscape);
        isShortcutsOpen = false;
      }
    });
  }

  /**
   * Create shortcuts modal element
   * @returns {HTMLElement}
   */
  const createShortcutsModal = () => {
    const overlay = document.createElement("div");
    overlay.className =
      "modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50";

    overlay.innerHTML = `
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
          <button class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                  title="Close (Esc)">×</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-4">Navigation</h3>
            <div class="space-y-3 text-sm">
              ${createShortcutRow("Ctrl+Shift+?", "Show keyboard shortcuts")}
              ${createShortcutRow("Ctrl+K", "Search modules")}
              ${createShortcutRow("Ctrl+H", "Go to home")}
              ${createShortcutRow("Ctrl+,", "Open settings")}
              ${createShortcutRow("Ctrl+L", "Logout")}
            </div>
          </div>

          <div>
            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-4">Quick Module Access</h3>
            <div class="space-y-3 text-sm">
              ${createShortcutRow("Ctrl+1", "KEW.PA - Asset Management")}
              ${createShortcutRow("Ctrl+2", "KEW.PS - Store Management")}
              ${createShortcutRow("Ctrl+3", "KEW.AH - Livestock Management")}
            </div>
          </div>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded text-sm text-blue-800 dark:text-blue-200">
          <i class="fas fa-lightbulb mr-2"></i>
          <strong>Tip:</strong> Press Escape to close any dialog or modal.
        </div>
      </div>
    `;

    overlay.querySelector("button").addEventListener("click", () => {
      overlay.remove();
      isShortcutsOpen = false;
    });

    return overlay;
  };

  /**
   * Create shortcut row HTML
   * @param {string} keys
   * @param {string} description
   * @returns {string}
   */
  const createShortcutRow = (keys, description) => {
    const keyParts = keys.split("+");
    const keyHtml = keyParts
      .map(
        (k) =>
          `<kbd class="inline-block bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-semibold">${k}</kbd>`,
      )
      .join(" ");

    return `
      <div class="flex justify-between items-center">
        <div class="space-x-1">${keyHtml}</div>
        <span class="text-gray-600 dark:text-gray-400">${description}</span>
      </div>
    `;
  };

  /**
   * Show help dialog
   */
  function showHelp() {
    if (window.GVETNotifications) {
      window.GVETNotifications.show(
        "<strong>Need help?</strong> Press Ctrl+Shift+? for keyboard shortcuts",
        "info",
        8000,
      );
    }
  }

  /**
   * Open search dialog
   */
  function openSearch() {
    // Create search modal
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50";

    overlay.innerHTML = `
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl">
        <div class="p-4 border-b dark:border-gray-700">
          <input type="text"
                 placeholder="Search modules, features, documents..."
                 class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                 autofocus>
        </div>
        <div id="search-results" class="max-h-96 overflow-y-auto p-4">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Type to search...</p>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const searchInput = overlay.querySelector("input");
    const resultsDiv = overlay.querySelector("#search-results");

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      if (query.length === 0) {
        resultsDiv.innerHTML =
          '<p class="text-gray-500 dark:text-gray-400 text-sm">Type to search...</p>';
        return;
      }

      const results = GVETModules.search(query);
      if (results.length === 0) {
        resultsDiv.innerHTML =
          '<p class="text-gray-500 dark:text-gray-400 text-sm">No results found</p>';
        return;
      }

      resultsDiv.innerHTML = results
        .map(
          (r) => `
        <div class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
             onclick="GVETModules.open('${r.id}')">
          <div class="font-semibold text-gray-900 dark:text-white">${r.title}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">${r.path}</div>
        </div>
      `,
        )
        .join("");
    });

    // Close on escape
    document.addEventListener("keydown", function closeSearch(e) {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", closeSearch);
      }
    });

    // Close on outside click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }

  /**
   * Go to home
   */
  function goHome() {
    window.location.href = "/dashboard-main.html";
  }

  /**
   * Open settings
   */
  function openSettings() {
    if (window.GVETNotifications) {
      window.GVETNotifications.show("Settings page coming soon", "info");
    }
  }

  /**
   * Logout
   */
  function logout() {
    if (confirm("Are you sure you want to logout?")) {
      GVETAuth.logout();
    }
  }

  /**
   * Get all shortcuts
   * @returns {object}
   */
  const getAll = () => {
    return SHORTCUTS;
  };

  // Public API
  return {
    init,
    getAll,
    showShortcuts,
  };
})();

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  GVETShortcuts.init();
});* Logout
   */
  function logout() {
    if (confirm("Are you sure you want to logout?")) {
      GVETAuth.logout();
    }
  }

  /**
   * Get all shortcuts
   * @returns {object}
   */
  const getAll = () => {
    return SHORTCUTS;
  };

  // Public API
  return {
    init,
    getAll,
    showShortcuts,
  };
})();

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  GVETShortcuts.init();
});* Logout
   */
  function logout() {
    if (confirm("Are you sure you want to logout?")) {
      GVETAuth.logout();
    }
  }

  /**
   * Get all shortcuts
   * @returns {object}
   */
  const getAll = () => {
    return SHORTCUTS;
  };

  // Public API
  return {
    init,
    getAll,
    showShortcuts,
  };
})();

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  GVETShortcuts.init();
});
