// Animal Rejection Routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/animalRejection.controller");
const { verifyToken, checkRole } = require("../../../shared/middleware/auth");

// GET /api/v1/animal-rejections
router.get("/", verifyToken, controller.getAll.bind(controller));

// GET /api/v1/animal-rejections/:id
router.get("/:id", verifyToken, controller.getById.bind(controller));

// POST /api/v1/animal-rejections
router.post(
  "/",
  verifyToken,
  checkRole(["veterinarian", "livestock_manager", "admin"]),
  controller.create.bind(controller),
);

// PUT /api/v1/animal-rejections/:id
router.put(
  "/:id",
  verifyToken,
  checkRole(["veterinarian", "livestock_manager", "admin"]),
  controller.update.bind(controller),
);

// DELETE /api/v1/animal-rejections/:id
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.delete.bind(controller),
);

// POST /api/v1/animal-rejections/:id/approve-reversal
router.post(
  "/:id/approve-reversal",
  verifyToken,
  checkRole(["livestock_manager", "admin"]),
  controller.approveReversal.bind(controller),
);

module.exports = router;

