// Livestock Loss Controller (Loss Investigation & Write-off)
const { Livestock, LivestockLoss, User } = require("../../../database/models");
const logger = require("../../../../config/logger");

class LivestockLossController {
  async getAll(req, res) {
    try {
      const {
        livestockId,
        reasonForLoss,
        status,
        page = 1,
        limit = 20,
      } = req.query;
      const where = {};
      if (livestockId) where.livestockId = livestockId;
      if (reasonForLoss) where.reasonForLoss = reasonForLoss;
      if (status) where.status = status;

      const offset = (page - 1) * limit;
      const { rows: losses, count } = await LivestockLoss.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["reportDate", "DESC"]],
        include: [
          {
            model: Livestock,
            as: "livestock",
            attributes: ["id", "animalCode", "name"],
          },
        ],
      });

      res.json({
        losses,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error("Get losses error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch losses", details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const loss = await LivestockLoss.findByPk(req.params.id, {
        include: [{ model: Livestock, as: "livestock" }],
      });
      if (!loss)
        return res.status(404).json({ error: "Loss record not found" });
      res.json({ loss });
    } catch (error) {
      logger.error("Get loss error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch loss", details: error.message });
    }
  }

  async create(req, res) {
    try {
      const loss = await LivestockLoss.create({
        ...req.body,
        reportedBy: req.user.id,
        status: "pending",
      });
      logger.info(`Loss record created: ${loss.id}`);
      res.status(201).json({ loss });
    } catch (error) {
      logger.error("Create loss error:", error);
      res.status(500).json({
        error: "Failed to create loss record",
        details: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const loss = await LivestockLoss.findByPk(req.params.id);
      if (!loss)
        return res.status(404).json({ error: "Loss record not found" });
      await loss.update(req.body);
      logger.info(`Loss record updated: ${loss.id}`);
      res.json({ loss });
    } catch (error) {
      logger.error("Update loss error:", error);
      res.status(500).json({
        error: "Failed to update loss record",
        details: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const loss = await LivestockLoss.findByPk(req.params.id);
      if (!loss)
        return res.status(404).json({ error: "Loss record not found" });
      await loss.destroy();
      logger.info(`Loss record deleted: ${loss.id}`);
      res.json({ message: "Loss record deleted" });
    } catch (error) {
      logger.error("Delete loss error:", error);
      res.status(500).json({
        error: "Failed to delete loss record",
        details: error.message,
      });
    }
  }

  async approveLoss(req, res) {
    try {
      const loss = await LivestockLoss.findByPk(req.params.id);
      if (!loss)
        return res.status(404).json({ error: "Loss record not found" });
      await loss.update({
        status: "approved",
        approvalDate: new Date(),
        approvedBy: req.user.id,
        writeOffAmount: req.body.writeOffAmount,
      });
      logger.info(`Loss approved and written off: ${loss.id}`);
      res.json({ loss });
    } catch (error) {
      logger.error("Approve loss error:", error);
      res
        .status(500)
        .json({ error: "Failed to approve loss", details: error.message });
    }
  }

  async rejectLoss(req, res) {
    try {
      const loss = await LivestockLoss.findByPk(req.params.id);
      if (!loss)
        return res.status(404).json({ error: "Loss record not found" });
      await loss.update({
        status: "rejected",
        rejectionReason: req.body.reason,
      });
      logger.info(`Loss rejection: ${loss.id}`);
      res.json({ loss });
    } catch (error) {
      logger.error("Reject loss error:", error);
      res
        .status(500)
        .json({ error: "Failed to reject loss", details: error.message });
    }
  }
}

module.exports = new LivestockLossController();
