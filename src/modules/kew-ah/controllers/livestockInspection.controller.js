// Livestock Inspection Controller (Physical vs Recorded Verification)
const {
  Livestock,
  LivestockInspection,
  User,
} = require("../../../database/models");
const logger = require("../../../../config/logger");

class LivestockInspectionController {
  async getAll(req, res) {
    try {
      const { livestockId, inspectionType, page = 1, limit = 20 } = req.query;
      const where = {};
      if (livestockId) where.livestockId = livestockId;
      if (inspectionType) where.inspectionType = inspectionType;

      const offset = (page - 1) * limit;
      const { rows: inspections, count } =
        await LivestockInspection.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["inspectionDate", "DESC"]],
          include: [
            {
              model: Livestock,
              as: "livestock",
              attributes: ["id", "animalCode", "name"],
            },
          ],
        });

      res.json({
        inspections,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error("Get inspections error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch inspections", details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const inspection = await LivestockInspection.findByPk(req.params.id, {
        include: [{ model: Livestock, as: "livestock" }],
      });
      if (!inspection)
        return res.status(404).json({ error: "Inspection not found" });
      res.json({ inspection });
    } catch (error) {
      logger.error("Get inspection error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch inspection", details: error.message });
    }
  }

  async create(req, res) {
    try {
      const inspection = await LivestockInspection.create({
        ...req.body,
        inspectorId: req.user.id,
      });
      logger.info(`Inspection created: ${inspection.id}`);
      res.status(201).json({ inspection });
    } catch (error) {
      logger.error("Create inspection error:", error);
      res
        .status(500)
        .json({ error: "Failed to create inspection", details: error.message });
    }
  }

  async update(req, res) {
    try {
      const inspection = await LivestockInspection.findByPk(req.params.id);
      if (!inspection)
        return res.status(404).json({ error: "Inspection not found" });
      await inspection.update(req.body);
      logger.info(`Inspection updated: ${inspection.id}`);
      res.json({ inspection });
    } catch (error) {
      logger.error("Update inspection error:", error);
      res
        .status(500)
        .json({ error: "Failed to update inspection", details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const inspection = await LivestockInspection.findByPk(req.params.id);
      if (!inspection)
        return res.status(404).json({ error: "Inspection not found" });
      await inspection.destroy();
      logger.info(`Inspection deleted: ${inspection.id}`);
      res.json({ message: "Inspection deleted" });
    } catch (error) {
      logger.error("Delete inspection error:", error);
      res
        .status(500)
        .json({ error: "Failed to delete inspection", details: error.message });
    }
  }

  async submitInspection(req, res) {
    try {
      const inspection = await LivestockInspection.findByPk(req.params.id);
      if (!inspection)
        return res.status(404).json({ error: "Inspection not found" });

      const discrepancies = req.body.discrepancies || [];
      await inspection.update({
        recordedCount: req.body.recordedCount,
        actualCount: req.body.actualCount,
        discrepancies,
        discrepancyFound: discrepancies.length > 0,
        submittedDate: new Date(),
      });
      logger.info(
        `Inspection submitted: ${inspection.id}, discrepancies: ${discrepancies.length}`,
      );
      res.json({ inspection });
    } catch (error) {
      logger.error("Submit inspection error:", error);
      res
        .status(500)
        .json({ error: "Failed to submit inspection", details: error.message });
    }
  }
}

module.exports = new LivestockInspectionController();
