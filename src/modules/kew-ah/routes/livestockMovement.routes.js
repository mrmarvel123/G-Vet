// Livestock Movement Routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/livestockMovement.controller");
const { verifyToken, checkRole } = require("../../../shared/middleware/auth");

// GET /api/v1/livestock-movements
router.get("/", verifyToken, controller.getAll.bind(controller));

// GET /api/v1/livestock-movements/:id
router.get("/:id", verifyToken, controller.getById.bind(controller));

// POST /api/v1/livestock-movements
router.post(
  "/",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.create.bind(controller),
);

// PUT /api/v1/livestock-movements/:id
router.put(
  "/:id",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.update.bind(controller),
);

// DELETE /api/v1/livestock-movements/:id
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.delete.bind(controller),
);

// POST /api/v1/livestock-movements/:id/approve
router.post(
  "/:id/approve",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.approveMovement.bind(controller),
);

// POST /api/v1/livestock-movements/:id/return
router.post(
  "/:id/return",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.recordReturn.bind(controller),
);

module.exports = router;

