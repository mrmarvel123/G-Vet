// Audit Log Routes
const express = require("express");
const router = express.Router();
const { AuditLog } = require("../../../database/models");
const { verifyToken, checkRole } = require("../../../shared/middleware/auth");
const { Op } = require("sequelize");

// Get audit logs (Admin and Manager only)
router.get(
  "/",
  verifyToken,
  checkRole("admin", "manager"),
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 50,
        userId,
        action,
        module,
        status,
        startDate,
        endDate,
      } = req.query;

      const where = {};

      if (userId) where.userId = userId;
      if (action) where.action = action;
      if (module) where.module = module;
      if (status) where.status = status;

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate);
      }

      const offset = (page - 1) * limit;

      const { rows: logs, count } = await AuditLog.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: require("../../../database/models").User,
            as: "user",
            attributes: ["id", "username", "fullName"],
            required: false,
          },
        ],
      });

      res.json({
        logs,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch audit logs", details: error.message });
    }
  },
);

// Get audit log statistics
router.get(
  "/stats/summary",
  verifyToken,
  checkRole("admin", "manager"),
  async (req, res) => {
    try {
      const totalLogs = await AuditLog.count();
      const todayLogs = await AuditLog.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      });

      const byAction = await AuditLog.findAll({
        attributes: [
          "action",
          [require("sequelize").fn("COUNT", "*"), "count"],
        ],
        group: ["action"],
        limit: 10,
        order: [[require("sequelize").fn("COUNT", "*"), "DESC"]],
      });

      const byModule = await AuditLog.findAll({
        attributes: [
          "module",
          [require("sequelize").fn("COUNT", "*"), "count"],
        ],
        group: ["module"],
      });

      res.json({
        totalLogs,
        todayLogs,
        byAction,
        byModule,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Failed to fetch audit statistics",
          details: error.message,
        });
    }
  },
);

module.exports = router;
