// Animal Rejection Controller (Tracks Rejected Incoming Animals)
const { AnimalRejection, User } = require("../../../database/models");
const logger = require("../../../../config/logger");

class AnimalRejectionController {
  async getAll(req, res) {
    try {
      const { rejectionReason, status, page = 1, limit = 20 } = req.query;
      const where = {};
      if (rejectionReason) where.rejectionReason = rejectionReason;
      if (status) where.status = status;

      const offset = (page - 1) * limit;
      const { rows: rejections, count } = await AnimalRejection.findAndCountAll(
        {
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["rejectionDate", "DESC"]],
          include: [
            {
              model: User,
              as: "rejectedBy",
              attributes: ["id", "username", "email"],
            },
          ],
        },
      );

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
      logger.error("Get rejections error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch rejections", details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const rejection = await AnimalRejection.findByPk(req.params.id, {
        include: [{ model: User, as: "rejectedBy" }],
      });
      if (!rejection)
        return res.status(404).json({ error: "Rejection record not found" });
      res.json({ rejection });
    } catch (error) {
      logger.error("Get rejection error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch rejection", details: error.message });
    }
  }

  async create(req, res) {
    try {
      const rejection = await AnimalRejection.create({
        ...req.body,
        rejectedById: req.user.id,
        status: "recorded",
      });
      logger.info(`Animal rejection recorded: ${rejection.id}`);
      res.status(201).json({ rejection });
    } catch (error) {
      logger.error("Create rejection error:", error);
      res
        .status(500)
        .json({ error: "Failed to record rejection", details: error.message });
    }
  }

  async update(req, res) {
    try {
      const rejection = await AnimalRejection.findByPk(req.params.id);
      if (!rejection)
        return res.status(404).json({ error: "Rejection record not found" });
      await rejection.update(req.body);
      logger.info(`Rejection record updated: ${rejection.id}`);
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
      const rejection = await AnimalRejection.findByPk(req.params.id);
      if (!rejection)
        return res.status(404).json({ error: "Rejection record not found" });
      await rejection.destroy();
      logger.info(`Rejection record deleted: ${rejection.id}`);
      res.json({ message: "Rejection record deleted" });
    } catch (error) {
      logger.error("Delete rejection error:", error);
      res
        .status(500)
        .json({ error: "Failed to delete rejection", details: error.message });
    }
  }

  async approveReversal(req, res) {
    try {
      const rejection = await AnimalRejection.findByPk(req.params.id);
      if (!rejection)
        return res.status(404).json({ error: "Rejection record not found" });
      await rejection.update({
        status: "reversal_approved",
        reversalApprovedDate: new Date(),
        reversalApprovedBy: req.user.id,
        reversalNotes: req.body.notes,
      });
      logger.info(`Rejection reversal approved: ${rejection.id}`);
      res.json({ rejection });
    } catch (error) {
      logger.error("Approve reversal error:", error);
      res
        .status(500)
        .json({ error: "Failed to approve reversal", details: error.message });
    }
  }
}

module.exports = new AnimalRejectionController();
