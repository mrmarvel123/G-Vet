// Livestock Disposal Controller (Sale/Handover/Destruction)
const {
  Livestock,
  LivestockDisposal,
  User,
} = require("../../../database/models");
const { Op } = require("sequelize");
const logger = require("../../../../config/logger");

class LivestockDisposalController {
  async getAll(req, res) {
    try {
      const {
        livestockId,
        disposalMethod,
        status,
        page = 1,
        limit = 20,
      } = req.query;
      const where = {};
      if (livestockId) where.livestockId = livestockId;
      if (disposalMethod) where.disposalMethod = disposalMethod;
      if (status) where.status = status;

      const offset = (page - 1) * limit;
      const { rows: disposals, count } =
        await LivestockDisposal.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["disposalDate", "DESC"]],
          include: [
            {
              model: Livestock,
              as: "livestock",
              attributes: ["id", "animalCode", "name"],
            },
          ],
        });

      res.json({
        disposals,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error("Get disposals error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch disposals", details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const disposal = await LivestockDisposal.findByPk(req.params.id, {
        include: [{ model: Livestock, as: "livestock" }],
      });
      if (!disposal)
        return res.status(404).json({ error: "Disposal not found" });
      res.json({ disposal });
    } catch (error) {
      logger.error("Get disposal error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch disposal", details: error.message });
    }
  }

  async create(req, res) {
    try {
      const disposal = await LivestockDisposal.create({
        ...req.body,
        authorizedBy: req.user.id,
        status: "pending",
      });
      logger.info(`Disposal created: ${disposal.id}`);
      res.status(201).json({ disposal });
    } catch (error) {
      logger.error("Create disposal error:", error);
      res
        .status(500)
        .json({ error: "Failed to create disposal", details: error.message });
    }
  }

  async update(req, res) {
    try {
      const disposal = await LivestockDisposal.findByPk(req.params.id);
      if (!disposal)
        return res.status(404).json({ error: "Disposal not found" });
      await disposal.update(req.body);
      logger.info(`Disposal updated: ${disposal.id}`);
      res.json({ disposal });
    } catch (error) {
      logger.error("Update disposal error:", error);
      res
        .status(500)
        .json({ error: "Failed to update disposal", details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const disposal = await LivestockDisposal.findByPk(req.params.id);
      if (!disposal)
        return res.status(404).json({ error: "Disposal not found" });
      await disposal.destroy();
      logger.info(`Disposal deleted: ${disposal.id}`);
      res.json({ message: "Disposal deleted" });
    } catch (error) {
      logger.error("Delete disposal error:", error);
      res
        .status(500)
        .json({ error: "Failed to delete disposal", details: error.message });
    }
  }

  async approve(req, res) {
    try {
      const disposal = await LivestockDisposal.findByPk(req.params.id);
      if (!disposal)
        return res.status(404).json({ error: "Disposal not found" });
      await disposal.update({
        status: "approved",
        approvedBy: req.user.id,
        approvalDate: new Date(),
      });
      logger.info(`Disposal approved: ${disposal.id}`);
      res.json({ disposal });
    } catch (error) {
      logger.error("Approve disposal error:", error);
      res
        .status(500)
        .json({ error: "Failed to approve disposal", details: error.message });
    }
  }

  async reject(req, res) {
    try {
      const disposal = await LivestockDisposal.findByPk(req.params.id);
      if (!disposal)
        return res.status(404).json({ error: "Disposal not found" });
      await disposal.update({
        status: "rejected",
        rejectionReason: req.body.reason,
      });
      logger.info(`Disposal rejected: ${disposal.id}`);
      res.json({ disposal });
    } catch (error) {
      logger.error("Reject disposal error:", error);
      res
        .status(500)
        .json({ error: "Failed to reject disposal", details: error.message });
    }
  }
}

module.exports = new LivestockDisposalController();
