// Authentication Controller
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../database/models");
const logger = require("../../../config/logger");

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const {
        username,
        email,
        password,
        fullName,
        role = "staff",
        department,
        position,
        phoneNumber,
      } = req.body;

      // Validate required fields
      if (!username || !email || !password || !fullName) {
        return res.status(400).json({
          error: "Username, email, password, and full name are required",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [require("sequelize").Op.or]: [{ username }, { email }],
        },
      });

      if (existingUser) {
        return res.status(409).json({
          error: "Username or email already exists",
        });
      }

      // Create user (password hashing handled by model hook)
      const user = await User.create({
        username,
        email,
        password,
        fullName,
        role,
        department,
        position,
        phoneNumber,
      });

      logger.info(`New user registered: ${username}`);

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error) {
      logger.error("Registration error:", error);
      res.status(500).json({
        error: "Failed to register user",
        details: error.message,
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: "Username and password are required",
        });
      }

      // Find user
      const user = await User.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(403).json({
          error: "Account is deactivated. Please contact administrator.",
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "24h" },
      );

      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
      });

      // Update user record
      await user.update({
        refreshToken,
        lastLogin: new Date(),
      });

      logger.info(`User logged in: ${username}`);

      res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          department: user.department,
          position: user.position,
        },
      });
    } catch (error) {
      logger.error("Login error:", error);
      res.status(500).json({
        error: "Failed to login",
        details: error.message,
      });
    }
  }

  // Refresh access token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: "Refresh token is required",
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

      // Find user
      const user = await User.findByPk(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({
          error: "Invalid refresh token",
        });
      }

      // Generate new access token
      const accessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "24h" },
      );

      res.json({
        message: "Token refreshed successfully",
        accessToken,
      });
    } catch (error) {
      logger.error("Token refresh error:", error);
      res.status(401).json({
        error: "Invalid or expired refresh token",
        details: error.message,
      });
    }
  }

  // Logout user
  async logout(req, res) {
    try {
      const user = await User.findByPk(req.user.id);

      if (user) {
        await user.update({ refreshToken: null });
        logger.info(`User logged out: ${user.username}`);
      }

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      logger.error("Logout error:", error);
      res.status(500).json({
        error: "Failed to logout",
        details: error.message,
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password", "refreshToken"] },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      logger.error("Get profile error:", error);
      res.status(500).json({
        error: "Failed to fetch profile",
        details: error.message,
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Current password and new password are required",
        });
      }

      const user = await User.findByPk(req.user.id);

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isValidPassword) {
        return res.status(401).json({
          error: "Current password is incorrect",
        });
      }

      // Update password (model hook will hash)
      await user.update({ password: newPassword });

      logger.info(`Password changed for user: ${user.username}`);

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      logger.error("Change password error:", error);
      res.status(500).json({
        error: "Failed to change password",
        details: error.message,
      });
    }
  }
}

module.exports = new AuthController();
