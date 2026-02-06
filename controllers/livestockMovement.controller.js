// Livestock Movement Controller (Loan/Relocation Tracking)
const { Livestock, LivestockMovement, User } = require("../models");
const logger = require("../config/logger");

class LivestockMovementController {
  async getAll(req, res) {
    try {
      const {
        livestockId,
        movementType,
        status,
        page = 1,
        limit = 20,
      } = req.query;
      const where = {};
      if (livestockId) where.livestockId = livestockId;
      if (movementType) where.movementType = movementType;
      if (status) where.status = status;

      const offset = (page - 1) * limit;
      const { rows: movements, count } =
        await LivestockMovement.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["movementDate", "DESC"]],
          include: [
            {
              model: Livestock,
              as: "livestock",
              attributes: ["id", "animalCode", "name"],
            },
            {
              model: User,
              as: "movedBy",
              attributes: ["id", "username", "email"],
            },
          ],
        });

      res.json({
        movements,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error("Get movements error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch movements", details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const movement = await LivestockMovement.findByPk(req.params.id, {
        include: [
          { model: Livestock, as: "livestock" },
          { model: User, as: "movedBy" },
        ],
      });
      if (!movement)
        return res.status(404).json({ error: "Movement not found" });
      res.json({ movement });
    } catch (error) {
      logger.error("Get movement error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch movement", details: error.message });
    }
  }

  async create(req, res) {
    try {
      const movement = await LivestockMovement.create({
        ...req.body,
        movedById: req.user.id,
        status: "pending",
      });
      logger.info(`Movement created: ${movement.id}`);
      res.status(201).json({ movement });
    } catch (error) {
      logger.error("Create movement error:", error);
      res
        .status(500)
        .json({ error: "Failed to create movement", details: error.message });
    }
  }

  async update(req, res) {
    try {
      const movement = await LivestockMovement.findByPk(req.params.id);
      if (!movement)
        return res.status(404).json({ error: "Movement not found" });
      await movement.update(req.body);
      logger.info(`Movement updated: ${movement.id}`);
      res.json({ movement });
    } catch (error) {
      logger.error("Update movement error:", error);
      res
        .status(500)
        .json({ error: "Failed to update movement", details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const movement = await LivestockMovement.findByPk(req.params.id);
      if (!movement)
        return res.status(404).json({ error: "Movement not found" });
      await movement.destroy();
      logger.info(`Movement deleted: ${movement.id}`);
      res.json({ message: "Movement deleted" });
    } catch (error) {
      logger.error("Delete movement error:", error);
      res
        .status(500)
        .json({ error: "Failed to delete movement", details: error.message });
    }
  }

  async approveMovement(req, res) {
    try {
      const movement = await LivestockMovement.findByPk(req.params.id);
      if (!movement)
        return res.status(404).json({ error: "Movement not found" });
      await movement.update({
        status: "approved",
        approvalDate: new Date(),
        approvedBy: req.user.id,
      });
      logger.info(`Movement approved: ${movement.id}`);
      res.json({ movement });
    } catch (error) {
      logger.error("Approve movement error:", error);
      res
        .status(500)
        .json({ error: "Failed to approve movement", details: error.message });
    }
  }

  async recordReturn(req, res) {
    try {
      const movement = await LivestockMovement.findByPk(req.params.id);
      if (!movement)
        return res.status(404).json({ error: "Movement not found" });
      await movement.update({
        status: "returned",
        returnDate: new Date(),
        returnedCondition: req.body.returnedCondition,
        remarks: req.body.remarks,
      });
      logger.info(`Movement returned: ${movement.id}`);
      res.json({ movement });
    } catch (error) {
      logger.error("Record return error:", error);
      res
        .status(500)
        .json({ error: "Failed to record return", details: error.message });
    }
  }
}

module.exports = new LivestockMovementController();
