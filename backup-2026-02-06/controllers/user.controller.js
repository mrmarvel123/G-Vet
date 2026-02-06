// User Controller
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const logger = require("../config/logger");

class UserController {
  // Get all users (admin only)
  async getAll(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        role,
        department,
        search,
        isActive,
      } = req.query;

      const where = {};

      if (role) where.role = role;
      if (department) where.department = { [Op.like]: `%${department}%` };
      if (isActive !== undefined) where.isActive = isActive === "true";
      if (search) {
        where[Op.or] = [
          { username: { [Op.like]: `%${search}%` } },
          { fullName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ];
      }

      const offset = (page - 1) * limit;

      const { rows: users, count } = await User.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
        attributes: { exclude: ["password", "refreshToken"] },
      });

      res.json({
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error("Get users error:", error);
      res.status(500).json({
        error: "Failed to fetch users",
        details: error.message,
      });
    }
  }

  // Get single user
  async getById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password", "refreshToken"] },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      logger.error("Get user error:", error);
      res.status(500).json({
        error: "Failed to fetch user",
        details: error.message,
      });
    }
  }

  // Update user (admin only)
  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't allow password change through this endpoint
      const { password, refreshToken, ...updateData } = req.body;

      await user.update(updateData);

      logger.info(`User updated: ${user.username} by ${req.user.username}`);

      res.json({
        message: "User updated successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      logger.error("Update user error:", error);
      res.status(500).json({
        error: "Failed to update user",
        details: error.message,
      });
    }
  }

  // Delete user (admin only)
  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Prevent self-deletion
      if (user.id === req.user.id) {
        return res
          .status(400)
          .json({ error: "Cannot delete your own account" });
      }

      const username = user.username;
      await user.destroy();

      logger.info(`User deleted: ${username} by ${req.user.username}`);

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      logger.error("Delete user error:", error);
      res.status(500).json({
        error: "Failed to delete user",
        details: error.message,
      });
    }
  }

  // Reset user password (admin only)
  async resetPassword(req, res) {
    try {
      const { newPassword } = req.body;

      if (!newPassword) {
        return res.status(400).json({ error: "New password is required" });
      }

      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update password (model hook will hash)
      await user.update({ password: newPassword });

      logger.info(
        `Password reset for user: ${user.username} by ${req.user.username}`,
      );

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      logger.error("Reset password error:", error);
      res.status(500).json({
        error: "Failed to reset password",
        details: error.message,
      });
    }
  }

  // Toggle user active status
  async toggleStatus(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Prevent self-deactivation
      if (user.id === req.user.id) {
        return res
          .status(400)
          .json({ error: "Cannot deactivate your own account" });
      }

      const updated = await user.update({ isActive: !user.isActive });

      logger.info(
        `User ${updated.isActive ? "activated" : "deactivated"}: ${user.username} by ${req.user.username}`,
      );

      res.json({
        message: `User ${updated.isActive ? "activated" : "deactivated"} successfully`,
        user: {
          id: updated.id,
          username: updated.username,
          isActive: updated.isActive,
        },
      });
    } catch (error) {
      logger.error("Toggle user status error:", error);
      res.status(500).json({
        error: "Failed to toggle user status",
        details: error.message,
      });
    }
  }
}

module.exports = new UserController();
