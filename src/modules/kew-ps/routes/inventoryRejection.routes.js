// Inventory Rejection Routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/inventoryRejection.controller");
const { verifyToken, checkRole } = require("../../../shared/middleware/auth");

// GET /api/v1/inventory-rejections
router.get("/", verifyToken, controller.getAll.bind(controller));

// GET /api/v1/inventory-rejections/:id
router.get("/:id", verifyToken, controller.getById.bind(controller));

// POST /api/v1/inventory-rejections
router.post(
  "/",
  verifyToken,
  checkRole(["store_keeper", "inventory_manager", "admin"]),
  controller.create.bind(controller),
);

// PUT /api/v1/inventory-rejections/:id
router.put(
  "/:id",
  verifyToken,
  checkRole(["store_keeper", "inventory_manager", "admin"]),
  controller.update.bind(controller),
);

// DELETE /api/v1/inventory-rejections/:id
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.delete.bind(controller),
);

// POST /api/v1/inventory-rejections/:id/approve
router.post(
  "/:id/approve",
  verifyToken,
  checkRole(["inventory_manager", "admin"]),
  controller.approveRejection.bind(controller),
);

module.exports = router;

