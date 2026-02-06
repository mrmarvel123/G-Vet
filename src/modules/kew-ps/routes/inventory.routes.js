// Inventory Routes - KEW.PS Management
const express = require("express");
const router = express.Router();
const { Inventory } = require("../../../database/models");
const { verifyToken, checkRole } = require("../../../shared/middleware/auth");
const auditLog = require("../../../shared/middleware/audit");
const { Op } = require("sequelize");

const inventoryController = require("../controllers/inventory.controller");
const {
  inventorySchemas,
  validate: validateInventory,
} = require("../validators/inventory.validator");

// Get all inventory items
router.get("/", verifyToken, (req, res) =>
  inventoryController.getAll(req, res),
);

// Get single item
router.get("/:id", verifyToken, (req, res) =>
  inventoryController.getById(req, res),
);

// Create new item
router.post(
  "/",
  verifyToken,
  checkRole("admin", "manager", "staff"),
  validateInventory(inventorySchemas.create),
  auditLog("create", "inventory"),
  (req, res) => inventoryController.create(req, res),
);

// Update item
router.put(
  "/:id",
  verifyToken,
  checkRole("admin", "manager", "staff"),
  validateInventory(inventorySchemas.update),
  auditLog("update", "inventory"),
  (req, res) => inventoryController.update(req, res),
);

// Delete item
router.delete(
  "/:id",
  verifyToken,
  checkRole("admin", "manager"),
  auditLog("delete", "inventory"),
  (req, res) => inventoryController.delete(req, res),
);

// Adjust stock
router.post(
  "/:id/adjust",
  verifyToken,
  checkRole("admin", "manager", "staff"),
  validateInventory(inventorySchemas.adjustStock),
  auditLog("adjust_stock", "inventory"),
  (req, res) => inventoryController.adjustStock(req, res),
);

// Get inventory statistics
router.get("/stats/summary", verifyToken, (req, res) =>
  inventoryController.getStatistics(req, res),
);

module.exports = router;
