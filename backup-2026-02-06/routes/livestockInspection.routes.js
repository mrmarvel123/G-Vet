// Livestock Inspection Routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/livestockInspection.controller");
const { verifyToken, checkRole } = require("../middleware/auth");

// GET /api/v1/livestock-inspections
router.get("/", verifyToken, controller.getAll.bind(controller));

// GET /api/v1/livestock-inspections/:id
router.get("/:id", verifyToken, controller.getById.bind(controller));

// POST /api/v1/livestock-inspections
router.post(
  "/",
  verifyToken,
  checkRole(["veterinarian", "livestock_manager", "admin"]),
  controller.create.bind(controller),
);

// PUT /api/v1/livestock-inspections/:id
router.put(
  "/:id",
  verifyToken,
  checkRole(["veterinarian", "livestock_manager", "admin"]),
  controller.update.bind(controller),
);

// DELETE /api/v1/livestock-inspections/:id
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.delete.bind(controller),
);

// POST /api/v1/livestock-inspections/:id/submit
router.post(
  "/:id/submit",
  verifyToken,
  checkRole(["veterinarian", "livestock_manager", "admin"]),
  controller.submitInspection.bind(controller),
);

module.exports = router;
