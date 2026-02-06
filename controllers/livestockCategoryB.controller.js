// Livestock Category B Controller (Small Animals/Birds/Insects <12 months)
const { LivestockCategoryB, User } = require("../models");
const logger = require("../config/logger");

class LivestockCategoryBController {
  async getAll(req, res) {
    try {
      const { family, breed, status, page = 1, limit = 20 } = req.query;
      const where = {};
      if (family) where.animalFamily = family;
      if (breed) where.breed = breed;
      if (status) where.status = status;

      const offset = (page - 1) * limit;
      const { rows: animals, count } = await LivestockCategoryB.findAndCountAll(
        {
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["recordedDate", "DESC"]],
          include: [
            {
              model: User,
              as: "recordedBy",
              attributes: ["id", "username", "email"],
            },
          ],
        },
      );

      res.json({
        animals,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error("Get category B animals error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch animals", details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const animal = await LivestockCategoryB.findByPk(req.params.id, {
        include: [{ model: User, as: "recordedBy" }],
      });
      if (!animal)
        return res.status(404).json({ error: "Animal record not found" });
      res.json({ animal });
    } catch (error) {
      logger.error("Get category B animal error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch animal", details: error.message });
    }
  }

  async create(req, res) {
    try {
      const animal = await LivestockCategoryB.create({
        ...req.body,
        recordedById: req.user.id,
      });
      logger.info(`Category B animal created: ${animal.id}`);
      res.status(201).json({ animal });
    } catch (error) {
      logger.error("Create category B animal error:", error);
      res
        .status(500)
        .json({
          error: "Failed to create animal record",
          details: error.message,
        });
    }
  }

  async update(req, res) {
    try {
      const animal = await LivestockCategoryB.findByPk(req.params.id);
      if (!animal)
        return res.status(404).json({ error: "Animal record not found" });
      await animal.update(req.body);
      logger.info(`Category B animal updated: ${animal.id}`);
      res.json({ animal });
    } catch (error) {
      logger.error("Update category B animal error:", error);
      res
        .status(500)
        .json({
          error: "Failed to update animal record",
          details: error.message,
        });
    }
  }

  async delete(req, res) {
    try {
      const animal = await LivestockCategoryB.findByPk(req.params.id);
      if (!animal)
        return res.status(404).json({ error: "Animal record not found" });
      await animal.destroy();
      logger.info(`Category B animal deleted: ${animal.id}`);
      res.json({ message: "Animal record deleted" });
    } catch (error) {
      logger.error("Delete category B animal error:", error);
      res
        .status(500)
        .json({
          error: "Failed to delete animal record",
          details: error.message,
        });
    }
  }

  async groupByFamily(req, res) {
    try {
      const groupData = await LivestockCategoryB.findAll({
        attributes: [
          "animalFamily",
          [
            require("sequelize").fn("COUNT", require("sequelize").col("id")),
            "count",
          ],
        ],
        group: ["animalFamily"],
        raw: true,
      });
      res.json({ groupedData: groupData });
    } catch (error) {
      logger.error("Get grouped data error:", error);
      res
        .status(500)
        .json({
          error: "Failed to fetch grouped data",
          details: error.message,
        });
    }
  }
}

module.exports = new LivestockCategoryBController();
