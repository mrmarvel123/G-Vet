// Livestock Care Record Routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/livestockCareRecord.controller");
const { verifyToken, checkRole } = require("../middleware/auth");

// GET /api/v1/livestock-care-records
router.get("/", verifyToken, controller.getAll.bind(controller));

// GET /api/v1/livestock-care-records/:id
router.get("/:id", verifyToken, controller.getById.bind(controller));

// POST /api/v1/livestock-care-records
router.post(
  "/",
  verifyToken,
  checkRole(["veterinarian", "livestock_manager", "admin"]),
  controller.create.bind(controller),
);

// PUT /api/v1/livestock-care-records/:id
router.put(
  "/:id",
  verifyToken,
  checkRole(["veterinarian", "livestock_manager", "admin"]),
  controller.update.bind(controller),
);

// DELETE /api/v1/livestock-care-records/:id
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.delete.bind(controller),
);

// POST /api/v1/livestock-care-records/:id/generate-pdf
router.post(
  "/:id/generate-pdf",
  verifyToken,
  controller.generatePDF.bind(controller),
);

module.exports = router;
