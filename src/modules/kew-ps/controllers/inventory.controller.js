// Inventory Controller - KEW.PS Management
const { Inventory, User } = require("../../../database/models");
const { Op } = require("sequelize");
const logger = require("../../../../config/logger");

class InventoryController {
  // Get all inventory items
  async getAll(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        status,
        location,
        search,
        lowStock,
      } = req.query;

      const where = {};

      if (category) where.category = category;
      if (status) where.status = status;
      if (location) where.location = { [Op.like]: `%${location}%` };
      if (lowStock === "true") {
        where.currentStock = {
          [Op.lte]: require("sequelize").col("minimumStock"),
        };
      }
      if (search) {
        where[Op.or] = [
          { itemCode: { [Op.like]: `%${search}%` } },
          { itemName: { [Op.like]: `%${search}%` } },
        ];
      }

      const offset = (page - 1) * limit;

      const { rows: items, count } = await Inventory.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullName"],
          },
        ],
      });

      res.json({
        items,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error("Get inventory error:", error);
      res.status(500).json({
        error: "Failed to fetch inventory",
        details: error.message,
      });
    }
  }

  // Get single item
  async getById(req, res) {
    try {
      const item = await Inventory.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullName"],
          },
        ],
      });

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json({ item });
    } catch (error) {
      logger.error("Get inventory item error:", error);
      res.status(500).json({
        error: "Failed to fetch item",
        details: error.message,
      });
    }
  }

  // Create new item
  async create(req, res) {
    try {
      const itemData = {
        ...req.body,
        userId: req.user.id,
      };

      const item = await Inventory.create(itemData);

      // Emit WebSocket event
      if (req.app.get("socketio")) {
        req.app.get("socketio").emit("inventory:created", item);
      }

      logger.info(
        `Inventory item created: ${item.itemCode} by ${req.user.username}`,
      );

      res.status(201).json({
        message: "Inventory item created successfully",
        item,
      });
    } catch (error) {
      logger.error("Create inventory item error:", error);
      res.status(500).json({
        error: "Failed to create item",
        details: error.message,
      });
    }
  }

  // Update item
  async update(req, res) {
    try {
      const item = await Inventory.findByPk(req.params.id);

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      await item.update(req.body);

      // Check for low stock alert
      if (item.currentStock <= item.minimumStock && req.app.get("socketio")) {
        req.app.get("socketio").emit("inventory:lowStock", item);
      }

      // Emit WebSocket event
      if (req.app.get("socketio")) {
        req.app.get("socketio").emit("inventory:updated", item);
      }

      logger.info(
        `Inventory item updated: ${item.itemCode} by ${req.user.username}`,
      );

      res.json({
        message: "Inventory item updated successfully",
        item,
      });
    } catch (error) {
      logger.error("Update inventory item error:", error);
      res.status(500).json({
        error: "Failed to update item",
        details: error.message,
      });
    }
  }

  // Delete item
  async delete(req, res) {
    try {
      const item = await Inventory.findByPk(req.params.id);

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      const itemCode = item.itemCode;
      await item.destroy();

      // Emit WebSocket event
      if (req.app.get("socketio")) {
        req.app
          .get("socketio")
          .emit("inventory:deleted", { id: req.params.id });
      }

      logger.info(
        `Inventory item deleted: ${itemCode} by ${req.user.username}`,
      );

      res.json({ message: "Inventory item deleted successfully" });
    } catch (error) {
      logger.error("Delete inventory item error:", error);
      res.status(500).json({
        error: "Failed to delete item",
        details: error.message,
      });
    }
  }

  // Adjust stock
  async adjustStock(req, res) {
    try {
      const { adjustment, reason } = req.body;

      if (!adjustment || adjustment === 0) {
        return res.status(400).json({ error: "Invalid adjustment value" });
      }

      const item = await Inventory.findByPk(req.params.id);

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      const previousStock = item.currentStock;
      const newStock = previousStock + parseInt(adjustment);

      if (newStock < 0) {
        return res.status(400).json({ error: "Insufficient stock" });
      }

      await item.update({ currentStock: newStock });

      // Emit WebSocket event
      if (req.app.get("socketio")) {
        req.app.get("socketio").emit("inventory:stockAdjusted", {
          item,
          adjustment,
          reason,
        });
      }

      logger.info(
        `Stock adjusted: ${item.itemCode} (${adjustment}) by ${req.user.username}`,
      );

      res.json({
        message: "Stock adjusted successfully",
        item,
        adjustment,
        previousStock,
        newStock,
      });
    } catch (error) {
      logger.error("Adjust stock error:", error);
      res.status(500).json({
        error: "Failed to adjust stock",
        details: error.message,
      });
    }
  }

  // Get inventory statistics
  async getStatistics(req, res) {
    try {
      const totalItems = await Inventory.count();
      const lowStockItems = await Inventory.count({
        where: {
          currentStock: { [Op.lte]: require("sequelize").col("minimumStock") },
        },
      });
      const outOfStockItems = await Inventory.count({
        where: { currentStock: 0 },
      });

      const byCategory = await Inventory.findAll({
        attributes: [
          "category",
          [require("sequelize").fn("COUNT", "*"), "count"],
          [
            require("sequelize").fn(
              "SUM",
              require("sequelize").col("totalValue"),
            ),
            "value",
          ],
        ],
        group: ["category"],
      });

      const totalValue = (await Inventory.sum("totalValue")) || 0;

      res.json({
        totalItems,
        lowStockItems,
        outOfStockItems,
        byCategory,
        totalValue,
      });
    } catch (error) {
      logger.error("Get inventory statistics error:", error);
      res.status(500).json({
        error: "Failed to fetch statistics",
        details: error.message,
      });
    }
  }
}

module.exports = new InventoryController();
