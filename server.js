// G-VET System - Main Server
// Version: 2.0.0
// Date: December 2025

require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const path = require("path");
const rateLimit = require("express-rate-limit");

// Import configurations
const { sequelize } = require("./src/config/database");
const logger = require("./src/config/logger");

// Import routes from new module structure
const authRoutes = require("./src/modules/auth/auth.routes");
const assetRoutes = require("./src/modules/kew-pa/routes/asset.routes");
const inventoryRoutes = require("./src/modules/kew-ps/routes/inventory.routes");
const livestockRoutes = require("./src/modules/kew-ah/routes/livestock.routes");
const reportRoutes = require("./src/modules/core/routes/report.routes");
const userRoutes = require("./src/modules/core/routes/user.routes");
const auditRoutes = require("./src/modules/core/routes/audit.routes");
const livestockCareRecordRoutes = require("./src/modules/kew-ah/routes/livestockCareRecord.routes");
const livestockDisposalRoutes = require("./src/modules/kew-ah/routes/livestockDisposal.routes");
const livestockLossRoutes = require("./src/modules/kew-ah/routes/livestockLoss.routes");
const livestockInspectionRoutes = require("./src/modules/kew-ah/routes/livestockInspection.routes");
const livestockMovementRoutes = require("./src/modules/kew-ah/routes/livestockMovement.routes");
const livestockIncidentRoutes = require("./src/modules/kew-ah/routes/livestockIncident.routes");
const animalRejectionRoutes = require("./src/modules/kew-ah/routes/animalRejection.routes");
const inventoryRejectionRoutes = require("./src/modules/kew-ps/routes/inventoryRejection.routes");
const livestockTransferRoutes = require("./src/modules/kew-ah/routes/livestockTransfer.routes");
const inventoryDisposalRoutes = require("./src/modules/kew-ps/routes/inventoryDisposal.routes");
const livestockCategoryBRoutes = require("./src/modules/kew-ah/routes/livestockCategoryB.routes");
const pageRoutes = require("./server-routes");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Make io accessible to routes
app.set("socketio", io);

// Trust proxy
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.tailwindcss.com",
          "https://cdnjs.cloudflare.com",
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.tailwindcss.com",
          "https://cdnjs.cloudflare.com",
          "https://unpkg.com",
        ],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      },
    },
  }),
);

// CORS middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  }),
);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", { stream: logger.stream }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || 100),
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Static files
app.use(express.static(path.join(__dirname)));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
const apiPrefix = process.env.API_PREFIX || "/api";
const apiVersion = process.env.API_VERSION || "v1";

app.use(`${apiPrefix}/${apiVersion}/auth`, authRoutes);
app.use(`${apiPrefix}/${apiVersion}/assets`, assetRoutes);
app.use(`${apiPrefix}/${apiVersion}/inventory`, inventoryRoutes);
app.use(`${apiPrefix}/${apiVersion}/livestock`, livestockRoutes);
app.use(
  `${apiPrefix}/${apiVersion}/livestock-care-records`,
  livestockCareRecordRoutes,
);
app.use(
  `${apiPrefix}/${apiVersion}/livestock-disposals`,
  livestockDisposalRoutes,
);
app.use(`${apiPrefix}/${apiVersion}/livestock-losses`, livestockLossRoutes);
app.use(
  `${apiPrefix}/${apiVersion}/livestock-inspections`,
  livestockInspectionRoutes,
);
app.use(
  `${apiPrefix}/${apiVersion}/livestock-movements`,
  livestockMovementRoutes,
);
app.use(
  `${apiPrefix}/${apiVersion}/livestock-incidents`,
  livestockIncidentRoutes,
);
app.use(`${apiPrefix}/${apiVersion}/animal-rejections`, animalRejectionRoutes);
app.use(
  `${apiPrefix}/${apiVersion}/inventory-rejections`,
  inventoryRejectionRoutes,
);
app.use(
  `${apiPrefix}/${apiVersion}/livestock-transfers`,
  livestockTransferRoutes,
);
app.use(
  `${apiPrefix}/${apiVersion}/inventory-disposals`,
  inventoryDisposalRoutes,
);
app.use(
  `${apiPrefix}/${apiVersion}/livestock-category-b`,
  livestockCategoryBRoutes,
);
app.use(`${apiPrefix}/${apiVersion}/reports`, reportRoutes);
app.use(`${apiPrefix}/${apiVersion}/users`, userRoutes);
app.use(`${apiPrefix}/${apiVersion}/audit`, auditRoutes);

// Page routes (must come before catch-all)
app.use("/", pageRoutes);

// Health check endpoint
app.get(`${apiPrefix}/health`, async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: "2.0.0",
      database: "Connected",
    });
  } catch (err) {
    logger.error("Health check failed:", err.message || err);
    res.status(503).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: "2.0.0",
      database: "Disconnected",
      error: err.message || "Database connection failed",
    });
  }
});

// Serve HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

// Catch all route for SPA
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api/")) {
    const filePath = path.join(__dirname, req.path + ".html");
    res.sendFile(filePath, (err) => {
      if (err) {
        res.sendFile(path.join(__dirname, "dashboard.html"));
      }
    });
  } else {
    res.status(404).json({ error: "API endpoint not found" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Error:", err.message || err);

  // Handle Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      details: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Handle Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      error: "Duplicate Entry",
      details: `${err.errors[0].path} already exists`,
    });
  }

  // Handle Sequelize foreign key errors
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      error: "Invalid Reference",
      details: "Referenced record does not exist",
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid Token",
      details: "Token is invalid or malformed",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token Expired",
      details: "Please refresh your token",
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    status: err.status || 500,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err,
    }),
  });
});

// WebSocket connection handling
io.on("connection", (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    logger.info(`Client ${socket.id} joined room: ${room}`);
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);
    logger.info(`Client ${socket.id} left room: ${room}`);
  });
});

// Database connection and server start
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

async function startServer() {
  try {
    // Load all models with their associations
    require("./src/database/models");

    // Test database connection
    await sequelize.authenticate();
    logger.info("✅ Database connection established successfully");

    // Sync database (use migrations in production)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      logger.info("✅ Database synchronized");
    }

    // Start server
    server.listen(PORT, HOST, () => {
      logger.info("🏛️ ============================================");
      logger.info("🏛️  G-VET ASSET & iSTOR SYSTEM");
      logger.info("🏛️  Jabatan Perkhidmatan Veterinar Negeri Perak");
      logger.info("🏛️ ============================================");
      logger.info(`🚀 Server running on http://${HOST}:${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
      logger.info(`📊 API: http://${HOST}:${PORT}${apiPrefix}/${apiVersion}`);
      logger.info(`🔌 WebSocket: Ready`);
      logger.info("🏛️ ============================================");
    });
  } catch (error) {
    logger.error("❌ Unable to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    logger.info("HTTP server closed");
    await sequelize.close();
    logger.info("Database connection closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  logger.info("SIGINT signal received: closing HTTP server");
  server.close(async () => {
    logger.info("HTTP server closed");
    await sequelize.close();
    logger.info("Database connection closed");
    process.exit(0);
  });
});

// Start the server
startServer();

module.exports = { app, server, io };
