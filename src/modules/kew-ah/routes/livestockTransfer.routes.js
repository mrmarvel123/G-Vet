// Livestock Transfer Routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/livestockTransfer.controller");
const { verifyToken, checkRole } = require("../../../shared/middleware/auth");

// GET /api/v1/livestock-transfers
router.get("/", verifyToken, controller.getAll.bind(controller));

// GET /api/v1/livestock-transfers/:id
router.get("/:id", verifyToken, controller.getById.bind(controller));

// POST /api/v1/livestock-transfers
router.post(
  "/",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.create.bind(controller),
);

// PUT /api/v1/livestock-transfers/:id
router.put(
  "/:id",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.update.bind(controller),
);

// DELETE /api/v1/livestock-transfers/:id
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.delete.bind(controller),
);

// POST /api/v1/livestock-transfers/:id/approve
router.post(
  "/:id/approve",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.approveTransfer.bind(controller),
);

// POST /api/v1/livestock-transfers/:id/record-receipt
router.post(
  "/:id/record-receipt",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.recordReceipt.bind(controller),
);

module.exports = router;

