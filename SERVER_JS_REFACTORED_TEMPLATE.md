/\*\*

- REFACTORED SERVER.JS TEMPLATE
-
- This is how server.js should look after restructuring to the new domain-driven architecture.
- Replace your current server.js with this after running the migration script.
  \*/

require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

// Import configuration
const logger = require('./src/config/logger');
const { sequelize } = require('./src/database/models');

// Import shared middleware
const { verifyToken, checkRole } = require('./src/shared/middleware/auth');
const { auditLog } = require('./src/shared/middleware/audit');

// Import module routes
const authRoutes = require('./src/modules/auth/auth.routes');
const kewPARoutes = require('./src/modules/kew-pa/routes/asset.routes');
const kewPSInventoryRoutes = require('./src/modules/kew-ps/routes/inventory.routes');
const kewPSRejectionRoutes = require('./src/modules/kew-ps/routes/inventoryRejection.routes');
const kewPSDisposalRoutes = require('./src/modules/kew-ps/routes/inventoryDisposal.routes');
const kewAHLivestockRoutes = require('./src/modules/kew-ah/routes/livestock.routes');
const kewAHCareRecordRoutes = require('./src/modules/kew-ah/routes/livestockCareRecord.routes');
const kewAHIncidentRoutes = require('./src/modules/kew-ah/routes/livestockIncident.routes');
const kewAHMovementRoutes = require('./src/modules/kew-ah/routes/livestockMovement.routes');
const kewAHTransferRoutes = require('./src/modules/kew-ah/routes/livestockTransfer.routes');
const kewAHDisposalRoutes = require('./src/modules/kew-ah/routes/livestockDisposal.routes');
const kewAHInspectionRoutes = require('./src/modules/kew-ah/routes/livestockInspection.routes');
const kewAHLossRoutes = require('./src/modules/kew-ah/routes/livestockLoss.routes');
const kewAHCategoryBRoutes = require('./src/modules/kew-ah/routes/livestockCategoryB.routes');
const animalRejectionRoutes = require('./src/modules/kew-ah/routes/animalRejection.routes');
const userRoutes = require('./src/modules/core/routes/user.routes');
const auditRoutes = require('./src/modules/core/routes/audit.routes');
const reportRoutes = require('./src/modules/core/routes/report.routes');

// Initialize Express & HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
cors: { origin: '\*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging
app.use((req, res, next) => {
logger.info(`${req.method} ${req.path}`);
next();
});

// Serve public folder (static files & HTML)
app.use(express.static(path.join(\_\_dirname, 'public')));

/\*\*

- API Routes (v1)
  \*/
  const apiV1 = express.Router();

// Auth routes (public)
apiV1.use('/auth', authRoutes);

// KEW.PA (Asset Management) routes
apiV1.use('/assets', verifyToken, kewPARoutes);

// KEW.PS (Store & Inventory) routes
apiV1.use('/inventory', verifyToken, kewPSInventoryRoutes);
apiV1.use('/inventory-rejections', verifyToken, kewPSRejectionRoutes);
apiV1.use('/inventory-disposals', verifyToken, kewPSDisposalRoutes);

// KEW.AH (Livestock Management) routes
apiV1.use('/livestock', verifyToken, kewAHLivestockRoutes);
apiV1.use('/livestock/care-records', verifyToken, kewAHCareRecordRoutes);
apiV1.use('/livestock/incidents', verifyToken, kewAHIncidentRoutes);
apiV1.use('/livestock/movements', verifyToken, kewAHMovementRoutes);
apiV1.use('/livestock/transfers', verifyToken, kewAHTransferRoutes);
apiV1.use('/livestock/disposals', verifyToken, kewAHDisposalRoutes);
apiV1.use('/livestock/inspections', verifyToken, kewAHInspectionRoutes);
apiV1.use('/livestock/losses', verifyToken, kewAHLossRoutes);
apiV1.use('/livestock/category-b', verifyToken, kewAHCategoryBRoutes);
apiV1.use('/animal-rejections', verifyToken, animalRejectionRoutes);

// Core module routes
apiV1.use('/users', verifyToken, checkRole(['admin']), userRoutes);
apiV1.use('/audit-logs', verifyToken, auditRoutes);
apiV1.use('/reports', verifyToken, reportRoutes);

// Mount API routes
app.use('/api/v1', apiV1);

/\*\*

- Health Check Endpoint
  \*/
  app.get('/api/health', (req, res) => {
  res.json({
  status: 'ok',
  timestamp: new Date(),
  environment: process.env.NODE_ENV || 'development',
  database: sequelize.authenticate() ? 'connected' : 'disconnected'
  });
  });

/\*\*

- SPA Fallback (for client-side routing)
  _/
  app.get('_', (req, res) => {
  if (!req.path.startsWith('/api')) {
  res.sendFile(path.join(\_\_dirname, 'public', 'dashboard.html'));
  }
  });

/\*\*

- Error Handling Middleware
  \*/
  app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, err);

// JWT errors
if (err.name === 'JsonWebTokenError') {
return res.status(401).json({ error: 'Invalid token' });
}

if (err.name === 'TokenExpiredError') {
return res.status(401).json({ error: 'Token expired' });
}

// Validation errors
if (err.isJoi) {
return res.status(400).json({ error: err.message });
}

// Database errors
if (err.name === 'SequelizeUniqueConstraintError') {
return res.status(409).json({ error: 'Duplicate entry' });
}

// Default error
res.status(err.status || 500).json({
error: err.message || 'Internal Server Error',
...(process.env.NODE_ENV === 'development' && { stack: err.stack })
});
});

/\*\*

- WebSocket Events (Real-time updates)
  \*/
  io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

socket.on('disconnect', () => {
logger.info(`Client disconnected: ${socket.id}`);
});

// Listen for specific events and broadcast updates
socket.on('livestock:updated', (data) => {
io.emit('livestock:changed', data);
});

socket.on('inventory:updated', (data) => {
io.emit('inventory:changed', data);
});

socket.on('asset:updated', (data) => {
io.emit('asset:changed', data);
});
});

// Make io accessible to routes
app.use((req, res, next) => {
req.io = io;
next();
});

/\*\*

- Database Synchronization & Server Start
  \*/
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || 'localhost';

async function startServer() {
try {
// Authenticate database connection
await sequelize.authenticate();
logger.info('Database connection established');

    // Sync database models
    await sequelize.sync({ alter: false });
    logger.info('Database synchronized');

    // Start server
    server.listen(PORT, HOST, () => {
      logger.info(`🚀 Server started on http://${HOST}:${PORT}`);
      logger.info(`📡 WebSocket server ready`);
      logger.info(`📚 API Documentation: http://${HOST}:${PORT}/api/v1`);
      logger.info(`🏥 Health check: http://${HOST}:${PORT}/api/health`);
    });

} catch (error) {
logger.error('Failed to start server:', error);
process.exit(1);
}
}

/\*\*

- Graceful Shutdown
  \*/
  process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
  logger.info('HTTP server closed');
  sequelize.close().then(() => {
  logger.info('Database connection closed');
  process.exit(0);
  });
  });
  });

process.on('SIGINT', () => {
logger.info('SIGINT signal received: closing HTTP server');
server.close(() => {
logger.info('HTTP server closed');
process.exit(0);
});
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
logger.error('Uncaught Exception:', error);
process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
process.exit(1);
});

// Start the server
startServer();

module.exports = { app, io, server };
