// Livestock Category B Routes (Small Animals/Birds/Insects)
const express = require("express");
const router = express.Router();
const controller = require("../controllers/livestockCategoryB.controller");
const { verifyToken, checkRole } = require("../middleware/auth");

// GET /api/v1/livestock-category-b
router.get("/", verifyToken, controller.getAll.bind(controller));

// GET /api/v1/livestock-category-b/groups/family
router.get(
  "/groups/family",
  verifyToken,
  controller.groupByFamily.bind(controller),
);

// GET /api/v1/livestock-category-b/:id
router.get("/:id", verifyToken, controller.getById.bind(controller));

// POST /api/v1/livestock-category-b
router.post(
  "/",
  verifyToken,
  checkRole(["veterinarian", "livestock_manager", "admin"]),
  controller.create.bind(controller),
);

// PUT /api/v1/livestock-category-b/:id
router.put(
  "/:id",
  verifyToken,
  checkRole(["veterinarian", "livestock_manager", "admin"]),
  controller.update.bind(controller),
);

// DELETE /api/v1/livestock-category-b/:id
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.delete.bind(controller),
);

module.exports = router;
