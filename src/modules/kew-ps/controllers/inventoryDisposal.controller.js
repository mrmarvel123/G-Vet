// Inventory Disposal Controller (Stock Disposal)
const {
  InventoryDisposal,
  Inventory,
  User,
} = require("../../../database/models");
const logger = require("../../../../config/logger");

class InventoryDisposalController {
  async getAll(req, res) {
    try {
      const {
        inventoryId,
        disposalMethod,
        status,
        page = 1,
        limit = 20,
      } = req.query;
      const where = {};
      if (inventoryId) where.inventoryId = inventoryId;
      if (disposalMethod) where.disposalMethod = disposalMethod;
      if (status) where.status = status;

      const offset = (page - 1) * limit;
      const { rows: disposals, count } =
        await InventoryDisposal.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["disposalDate", "DESC"]],
          include: [
            {
              model: Inventory,
              as: "inventory",
              attributes: ["id", "itemCode", "itemName"],
            },
            {
              model: User,
              as: "disposedBy",
              attributes: ["id", "username", "email"],
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
      const disposal = await InventoryDisposal.findByPk(req.params.id, {
        include: [
          { model: Inventory, as: "inventory" },
          { model: User, as: "disposedBy" },
        ],
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
      const disposal = await InventoryDisposal.create({
        ...req.body,
        disposedById: req.user.id,
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
      const disposal = await InventoryDisposal.findByPk(req.params.id);
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
      const disposal = await InventoryDisposal.findByPk(req.params.id);
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

  async approveDisposal(req, res) {
    try {
      const disposal = await InventoryDisposal.findByPk(req.params.id);
      if (!disposal)
        return res.status(404).json({ error: "Disposal not found" });
      await disposal.update({
        status: "approved",
        approvalDate: new Date(),
        approvedBy: req.user.id,
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

  async recordDisposal(req, res) {
    try {
      const disposal = await InventoryDisposal.findByPk(req.params.id);
      if (!disposal)
        return res.status(404).json({ error: "Disposal not found" });
      await disposal.update({
        status: "completed",
        completedDate: new Date(),
        proceedsAmount: req.body.proceedsAmount,
        remarks: req.body.remarks,
      });
      logger.info(`Disposal completed: ${disposal.id}`);
      res.json({ disposal });
    } catch (error) {
      logger.error("Record disposal error:", error);
      res
        .status(500)
        .json({ error: "Failed to record disposal", details: error.message });
    }
  }
}

module.exports = new InventoryDisposalController();
