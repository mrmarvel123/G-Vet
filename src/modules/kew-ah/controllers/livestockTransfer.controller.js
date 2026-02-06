// Livestock Transfer Controller (Inter-departmental Transfers)
const {
  Livestock,
  LivestockTransfer,
  User,
} = require("../../../database/models");
const logger = require("../../../../config/logger");

class LivestockTransferController {
  async getAll(req, res) {
    try {
      const { livestockId, status, page = 1, limit = 20 } = req.query;
      const where = {};
      if (livestockId) where.livestockId = livestockId;
      if (status) where.status = status;

      const offset = (page - 1) * limit;
      const { rows: transfers, count } =
        await LivestockTransfer.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["transferDate", "DESC"]],
          include: [
            {
              model: Livestock,
              as: "livestock",
              attributes: ["id", "animalCode", "name"],
            },
            {
              model: User,
              as: "initiatedBy",
              attributes: ["id", "username", "email"],
            },
          ],
        });

      res.json({
        transfers,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error("Get livestock transfers error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch transfers", details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const transfer = await LivestockTransfer.findByPk(req.params.id, {
        include: [
          { model: Livestock, as: "livestock" },
          { model: User, as: "initiatedBy" },
          { model: User, as: "approvedBy" },
        ],
      });
      if (!transfer)
        return res.status(404).json({ error: "Transfer not found" });
      res.json({ transfer });
    } catch (error) {
      logger.error("Get livestock transfer error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch transfer", details: error.message });
    }
  }

  async create(req, res) {
    try {
      const transfer = await LivestockTransfer.create({
        ...req.body,
        initiatedById: req.user.id,
        status: "pending",
      });
      logger.info(`Livestock transfer created: ${transfer.id}`);
      res.status(201).json({ transfer });
    } catch (error) {
      logger.error("Create transfer error:", error);
      res
        .status(500)
        .json({ error: "Failed to create transfer", details: error.message });
    }
  }

  async update(req, res) {
    try {
      const transfer = await LivestockTransfer.findByPk(req.params.id);
      if (!transfer)
        return res.status(404).json({ error: "Transfer not found" });
      await transfer.update(req.body);
      logger.info(`Livestock transfer updated: ${transfer.id}`);
      res.json({ transfer });
    } catch (error) {
      logger.error("Update transfer error:", error);
      res
        .status(500)
        .json({ error: "Failed to update transfer", details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const transfer = await LivestockTransfer.findByPk(req.params.id);
      if (!transfer)
        return res.status(404).json({ error: "Transfer not found" });
      await transfer.destroy();
      logger.info(`Livestock transfer deleted: ${transfer.id}`);
      res.json({ message: "Transfer deleted" });
    } catch (error) {
      logger.error("Delete transfer error:", error);
      res
        .status(500)
        .json({ error: "Failed to delete transfer", details: error.message });
    }
  }

  async approveTransfer(req, res) {
    try {
      const transfer = await LivestockTransfer.findByPk(req.params.id);
      if (!transfer)
        return res.status(404).json({ error: "Transfer not found" });
      await transfer.update({
        status: "approved",
        approvedBy: req.user.id,
        approvalDate: new Date(),
        notes: req.body.notes,
      });
      logger.info(`Livestock transfer approved: ${transfer.id}`);
      res.json({ transfer });
    } catch (error) {
      logger.error("Approve transfer error:", error);
      res
        .status(500)
        .json({ error: "Failed to approve transfer", details: error.message });
    }
  }

  async recordReceipt(req, res) {
    try {
      const transfer = await LivestockTransfer.findByPk(req.params.id);
      if (!transfer)
        return res.status(404).json({ error: "Transfer not found" });
      await transfer.update({
        status: "completed",
        receivedDate: new Date(),
        receivedBy: req.user.id,
        receiptNotes: req.body.notes,
      });
      logger.info(`Livestock transfer receipt recorded: ${transfer.id}`);
      res.json({ transfer });
    } catch (error) {
      logger.error("Record receipt error:", error);
      res
        .status(500)
        .json({ error: "Failed to record receipt", details: error.message });
    }
  }
}

module.exports = new LivestockTransferController();
