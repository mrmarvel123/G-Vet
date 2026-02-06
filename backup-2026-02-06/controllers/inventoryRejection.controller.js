// Inventory Rejection Controller (Goods Rejection Tracking)
const { InventoryRejection, Inventory, User } = require("../models");
const logger = require("../config/logger");

class InventoryRejectionController {
  async getAll(req, res) {
    try {
      const { itemCode, status, page = 1, limit = 20 } = req.query;
      const where = {};
      if (itemCode) where.itemCode = itemCode;
      if (status) where.status = status;

      const offset = (page - 1) * limit;
      const { rows: rejections, count } =
        await InventoryRejection.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["reportedAt", "DESC"]],
        });

      res.json({
        rejections,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error("Get inventory rejections error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch rejections", details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const rejection = await InventoryRejection.findByPk(req.params.id);
      if (!rejection)
        return res.status(404).json({ error: "Rejection not found" });
      res.json({ rejection });
    } catch (error) {
      logger.error("Get inventory rejection error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch rejection", details: error.message });
    }
  }

  async create(req, res) {
    try {
      const rejection = await InventoryRejection.create({
        ...req.body,
        reportedBy: req.user.id,
      });
      logger.info(`Inventory rejection created: ${rejection.id}`);
      res.status(201).json({ rejection });
    } catch (error) {
      logger.error("Create rejection error:", error);
      res
        .status(500)
        .json({ error: "Failed to create rejection", details: error.message });
    }
  }

  async update(req, res) {
    try {
      const rejection = await InventoryRejection.findByPk(req.params.id);
      if (!rejection)
        return res.status(404).json({ error: "Rejection not found" });
      await rejection.update(req.body);
      logger.info(`Inventory rejection updated: ${rejection.id}`);
      res.json({ rejection });
    } catch (error) {
      logger.error("Update rejection error:", error);
      res
        .status(500)
        .json({ error: "Failed to update rejection", details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const rejection = await InventoryRejection.findByPk(req.params.id);
      if (!rejection)
        return res.status(404).json({ error: "Rejection not found" });
      await rejection.destroy();
      logger.info(`Inventory rejection deleted: ${rejection.id}`);
      res.json({ message: "Rejection deleted" });
    } catch (error) {
      logger.error("Delete rejection error:", error);
      res
        .status(500)
        .json({ error: "Failed to delete rejection", details: error.message });
    }
  }

  async approveRejection(req, res) {
    try {
      const rejection = await InventoryRejection.findByPk(req.params.id);
      if (!rejection)
        return res.status(404).json({ error: "Rejection not found" });
      await rejection.update({ status: "approved", notes: req.body.notes });
      logger.info(`Inventory rejection approved: ${rejection.id}`);
      res.json({ rejection });
    } catch (error) {
      logger.error("Approve rejection error:", error);
      res
        .status(500)
        .json({ error: "Failed to approve rejection", details: error.message });
    }
  }
}

module.exports = new InventoryRejectionController();
