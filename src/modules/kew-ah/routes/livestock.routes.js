// Livestock Routes - KEW.AH Management
const express = require("express");
const router = express.Router();
const { Livestock } = require("../../../database/models");
const { verifyToken, checkRole } = require("../../../shared/middleware/auth");
const auditLog = require("../../../shared/middleware/audit");
const { Op } = require("sequelize");
const livestockController = require("../controllers/livestock.controller");
const {
  livestockSchemas,
  validate: validateLivestock,
} = require("../validators/livestock.validator");

// Get all livestock
router.get("/", verifyToken, (req, res) =>
  livestockController.getAll(req, res),
);

// Get single livestock
router.get("/:id", verifyToken, (req, res) =>
  livestockController.getById(req, res),
);

// Create new livestock
router.post(
  "/",
  verifyToken,
  checkRole("admin", "manager", "staff"),
  validateLivestock(livestockSchemas.create),
  auditLog("create", "livestock"),
  (req, res) => livestockController.create(req, res),
);

// Update livestock
router.put(
  "/:id",
  verifyToken,
  checkRole("admin", "manager", "staff"),
  validateLivestock(livestockSchemas.update),
  auditLog("update", "livestock"),
  (req, res) => livestockController.update(req, res),
);

// Delete livestock
router.delete(
  "/:id",
  verifyToken,
  checkRole("admin", "manager"),
  auditLog("delete", "livestock"),
  (req, res) => livestockController.delete(req, res),
);

// Get livestock statistics
router.get("/stats/summary", verifyToken, (req, res) =>
  livestockController.getStatistics(req, res),
);

module.exports = router;
