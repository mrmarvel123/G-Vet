// Livestock Incident Controller (Illness/Injury/Death/Loss Reports)
const {
  Livestock,
  LivestockIncident,
  User,
} = require("../../../database/models");
const logger = require("../../../../config/logger");
const pdfService = require("../../../shared/services/pdf.service");
const KEWFormConverter = require("../../../shared/services/kew-form.converter");

class LivestockIncidentController {
  async getAll(req, res) {
    try {
      const {
        livestockId,
        incidentType,
        status,
        page = 1,
        limit = 20,
      } = req.query;
      const where = {};
      if (livestockId) where.livestockId = livestockId;
      if (incidentType) where.incidentType = incidentType;
      if (status) where.status = status;

      const offset = (page - 1) * limit;
      const { rows: incidents, count } =
        await LivestockIncident.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["incidentDate", "DESC"]],
          include: [
            {
              model: Livestock,
              as: "livestock",
              attributes: ["id", "animalCode", "name"],
            },
            {
              model: User,
              as: "reportedBy",
              attributes: ["id", "username", "email"],
            },
          ],
        });

      res.json({
        incidents,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      logger.error("Get incidents error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch incidents", details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const incident = await LivestockIncident.findByPk(req.params.id, {
        include: [
          { model: Livestock, as: "livestock" },
          { model: User, as: "reportedBy" },
        ],
      });
      if (!incident)
        return res.status(404).json({ error: "Incident not found" });
      res.json({ incident });
    } catch (error) {
      logger.error("Get incident error:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch incident", details: error.message });
    }
  }

  async create(req, res) {
    try {
      // Validate form data
      const validation = await KEWFormConverter.validateIncident(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          error: "Validation failed",
          details: validation.errors,
        });
      }

      const incident = await LivestockIncident.create({
        ...req.body,
        reportedById: req.user.id,
        status: "pending",
      });
      logger.info(`Incident created: ${incident.id}`);
      res.status(201).json({ incident });
    } catch (error) {
      logger.error("Create incident error:", error);
      res
        .status(500)
        .json({ error: "Failed to create incident", details: error.message });
    }
  }

  async update(req, res) {
    try {
      const incident = await LivestockIncident.findByPk(req.params.id);
      if (!incident)
        return res.status(404).json({ error: "Incident not found" });
      await incident.update(req.body);
      logger.info(`Incident updated: ${incident.id}`);
      res.json({ incident });
    } catch (error) {
      logger.error("Update incident error:", error);
      res
        .status(500)
        .json({ error: "Failed to update incident", details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const incident = await LivestockIncident.findByPk(req.params.id);
      if (!incident)
        return res.status(404).json({ error: "Incident not found" });
      await incident.destroy();
      logger.info(`Incident deleted: ${incident.id}`);
      res.json({ message: "Incident deleted" });
    } catch (error) {
      logger.error("Delete incident error:", error);
      res
        .status(500)
        .json({ error: "Failed to delete incident", details: error.message });
    }
  }

  async approveIncident(req, res) {
    try {
      const incident = await LivestockIncident.findByPk(req.params.id);
      if (!incident)
        return res.status(404).json({ error: "Incident not found" });
      await incident.update({
        status: "approved",
        approvalDate: new Date(),
        approvedBy: req.user.id,
        costApproved: req.body.costApproved,
      });
      logger.info(`Incident approved: ${incident.id}`);
      res.json({ incident });
    } catch (error) {
      logger.error("Approve incident error:", error);
      res
        .status(500)
        .json({ error: "Failed to approve incident", details: error.message });
    }
  }

  async rejectIncident(req, res) {
    try {
      const incident = await LivestockIncident.findByPk(req.params.id);
      if (!incident)
        return res.status(404).json({ error: "Incident not found" });
      await incident.update({
        status: "rejected",
        rejectionReason: req.body.reason,
      });
      logger.info(`Incident rejected: ${incident.id}`);
      res.json({ incident });
    } catch (error) {
      logger.error("Reject incident error:", error);
      res
        .status(500)
        .json({ error: "Failed to reject incident", details: error.message });
    }
  }

  async generatePDF(req, res) {
    try {
      const incident = await LivestockIncident.findByPk(req.params.id, {
        include: [
          { model: Livestock, as: "livestock" },
          { model: User, as: "reportedBy" },
        ],
      });
      if (!incident)
        return res.status(404).json({ error: "Incident not found" });

      const pdfBuffer = await pdfService.generateIncidentReportPDF(incident);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="incident-report-${incident.id}.pdf"`,
      );
      res.send(pdfBuffer);
      logger.info(`PDF generated for incident: ${incident.id}`);
    } catch (error) {
      logger.error("PDF generation error:", error);
      res
        .status(500)
        .json({ error: "Failed to generate PDF", details: error.message });
    }
  }
}

module.exports = new LivestockIncidentController();
