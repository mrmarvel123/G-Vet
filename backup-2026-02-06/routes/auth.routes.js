// Authentication Routes (thin wrappers using AuthController)
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth");

// Public
router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/refresh", (req, res) => authController.refreshToken(req, res));

// Protected
router.post("/logout", verifyToken, (req, res) =>
  authController.logout(req, res),
);
router.get("/me", verifyToken, (req, res) =>
  authController.getProfile(req, res),
);
router.put("/change-password", verifyToken, (req, res) =>
  authController.changePassword(req, res),
);

module.exports = router;
