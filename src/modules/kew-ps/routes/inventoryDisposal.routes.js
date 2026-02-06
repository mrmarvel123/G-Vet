// Inventory Disposal Routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/inventoryDisposal.controller");
const { verifyToken, checkRole } = require("../../../shared/middleware/auth");

// GET /api/v1/inventory-disposals
router.get("/", verifyToken, controller.getAll.bind(controller));

// GET /api/v1/inventory-disposals/:id
router.get("/:id", verifyToken, controller.getById.bind(controller));

// POST /api/v1/inventory-disposals
router.post(
  "/",
  verifyToken,
  checkRole(["store_keeper", "inventory_manager", "admin"]),
  controller.create.bind(controller),
);

// PUT /api/v1/inventory-disposals/:id
router.put(
  "/:id",
  verifyToken,
  checkRole(["store_keeper", "inventory_manager", "admin"]),
  controller.update.bind(controller),
);

// DELETE /api/v1/inventory-disposals/:id
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.delete.bind(controller),
);

// POST /api/v1/inventory-disposals/:id/approve
router.post(
  "/:id/approve",
  verifyToken,
  checkRole(["inventory_manager", "admin"]),
  controller.approveDisposal.bind(controller),
);

// POST /api/v1/inventory-disposals/:id/record
router.post(
  "/:id/record",
  verifyToken,
  checkRole(["store_keeper", "inventory_manager", "admin"]),
  controller.recordDisposal.bind(controller),
);

module.exports = router;

