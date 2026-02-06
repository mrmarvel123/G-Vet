// Livestock Incident Routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/livestockIncident.controller");
const { verifyToken, checkRole } = require("../middleware/auth");

// GET /api/v1/livestock-incidents
router.get("/", verifyToken, controller.getAll.bind(controller));

// GET /api/v1/livestock-incidents/:id
router.get("/:id", verifyToken, controller.getById.bind(controller));

// POST /api/v1/livestock-incidents
router.post(
  "/",
  verifyToken,
  checkRole(["veterinarian", "livestock_manager", "admin"]),
  controller.create.bind(controller),
);

// PUT /api/v1/livestock-incidents/:id
router.put(
  "/:id",
  verifyToken,
  checkRole(["veterinarian", "livestock_manager", "admin"]),
  controller.update.bind(controller),
);

// DELETE /api/v1/livestock-incidents/:id
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.delete.bind(controller),
);

// POST /api/v1/livestock-incidents/:id/approve
router.post(
  "/:id/approve",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.approveIncident.bind(controller),
);

// POST /api/v1/livestock-incidents/:id/reject
router.post(
  "/:id/reject",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.rejectIncident.bind(controller),
);

// POST /api/v1/livestock-incidents/:id/generate-pdf
router.post(
  "/:id/generate-pdf",
  verifyToken,
  controller.generatePDF.bind(controller),
);

module.exports = router;
