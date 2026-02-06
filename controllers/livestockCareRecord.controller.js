// Livestock Care Record Controller
const { Livestock, LivestockCareRecord, User } = require("../models");
const { Op } = require("sequelize");
const logger = require("../config/logger");
const pdfService = require("../services/pdf.service");
const KEWFormConverter = require("../services/kew-form.converter");

class LivestockCareRecordController {
  async getAll(req, res) {
    try {
      const { livestockId, careType, page = 1, limit = 20 } = req.query;
      const where = {};
      if (livestockId) where.livestockId = livestockId;
      if (careType) where.careType = careType;

      const offset = (page - 1) * limit;
      const { rows: records, count } =
        await LivestockCareRecord.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["dateOfCare", "DESC"]],
          include: [
            {
              model: Livestock,
              as: "livestock",
              attributes: ["id", "animalCode", "name"],
            },
          ],
        });

      res.json({
        records,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error("Get care records error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch records", details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const record = await LivestockCareRecord.findByPk(req.params.id, {
        include: [{ model: Livestock, as: "livestock" }],
      });
      if (!record) return res.status(404).json({ error: "Record not found" });
      res.json({ record });
    } catch (error) {
      logger.error("Get care record error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch record", details: error.message });
    }
  }

  async create(req, res) {
    try {
      // Validate form data
      const validation = await KEWFormConverter.validateCareRecord(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          error: "Validation failed",
          details: validation.errors,
        });
      }

      const record = await LivestockCareRecord.create({
        ...req.body,
        livestockId: req.body.livestockId,
        recordedBy: req.user.id,
      });
      logger.info(`Care record created: ${record.id}`);
      res.status(201).json({ record });
    } catch (error) {
      logger.error("Create care record error:", error);
      res
        .status(500)
        .json({ error: "Failed to create record", details: error.message });
    }
  }

  async update(req, res) {
    try {
      const record = await LivestockCareRecord.findByPk(req.params.id);
      if (!record) return res.status(404).json({ error: "Record not found" });
      await record.update(req.body);
      logger.info(`Care record updated: ${record.id}`);
      res.json({ record });
    } catch (error) {
      logger.error("Update care record error:", error);
      res
        .status(500)
        .json({ error: "Failed to update record", details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const record = await LivestockCareRecord.findByPk(req.params.id);
      if (!record) return res.status(404).json({ error: "Record not found" });
      await record.destroy();
      logger.info(`Care record deleted: ${record.id}`);
      res.json({ message: "Record deleted" });
    } catch (error) {
      logger.error("Delete care record error:", error);
      res
        .status(500)
        .json({ error: "Failed to delete record", details: error.message });
    }
  }

  async generatePDF(req, res) {
    try {
      const record = await LivestockCareRecord.findByPk(req.params.id, {
        include: [{ model: Livestock, as: "livestock" }],
      });
      if (!record) return res.status(404).json({ error: "Record not found" });

      const pdfBuffer = await pdfService.generateCareRecordPDF(record);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="care-record-${record.id}.pdf"`,
      );
      res.send(pdfBuffer);
      logger.info(`PDF generated for care record: ${record.id}`);
    } catch (error) {
      logger.error("PDF generation error:", error);
      res
        .status(500)
        .json({ error: "Failed to generate PDF", details: error.message });
    }
  }
}

module.exports = new LivestockCareRecordController();
