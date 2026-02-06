// Livestock Disposal Routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/livestockDisposal.controller");
const { verifyToken, checkRole } = require("../../../shared/middleware/auth");

// GET /api/v1/livestock-disposals
router.get("/", verifyToken, controller.getAll.bind(controller));

// GET /api/v1/livestock-disposals/:id
router.get("/:id", verifyToken, controller.getById.bind(controller));

// POST /api/v1/livestock-disposals
router.post(
  "/",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.create.bind(controller),
);

// PUT /api/v1/livestock-disposals/:id
router.put(
  "/:id",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.update.bind(controller),
);

// DELETE /api/v1/livestock-disposals/:id
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.delete.bind(controller),
);

// POST /api/v1/livestock-disposals/:id/approve
router.post(
  "/:id/approve",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.approve.bind(controller),
);

// POST /api/v1/livestock-disposals/:id/reject
router.post(
  "/:id/reject",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.reject.bind(controller),
);

module.exports = router;

