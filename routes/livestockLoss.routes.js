// Livestock Loss Routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/livestockLoss.controller");
const { verifyToken, checkRole } = require("../middleware/auth");

// GET /api/v1/livestock-losses
router.get("/", verifyToken, controller.getAll.bind(controller));

// GET /api/v1/livestock-losses/:id
router.get("/:id", verifyToken, controller.getById.bind(controller));

// POST /api/v1/livestock-losses
router.post(
  "/",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.create.bind(controller),
);

// PUT /api/v1/livestock-losses/:id
router.put(
  "/:id",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.update.bind(controller),
);

// DELETE /api/v1/livestock-losses/:id
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.delete.bind(controller),
);

// POST /api/v1/livestock-losses/:id/approve
router.post(
  "/:id/approve",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.approveLoss.bind(controller),
);

// POST /api/v1/livestock-losses/:id/reject
router.post(
  "/:id/reject",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.rejectLoss.bind(controller),
);

module.exports = router;
