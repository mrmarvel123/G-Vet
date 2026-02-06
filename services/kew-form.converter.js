// KEW Form Converter & Validator
// Converts HTML KEW forms to model data and validates against requirements

const Joi = require("joi");
const logger = require("../config/logger");

class KEWFormConverter {
  /**
   * KEW.AH-3: Livestock Registration (Category A) Schema
   */
  static livestockRegistrationSchema = Joi.object({
    registrationNumber: Joi.string()
      .required()
      .description("KEW AH-3 Registration Number"),
    animalCode: Joi.string().required(),
    name: Joi.string().required(),
    species: Joi.string().required(),
    breed: Joi.string().allow(null),
    color: Joi.string().allow(null),
    birthDate: Joi.date().required(),
    registeredDate: Joi.date().required(),
    purchaseDate: Joi.date().allow(null),
    acquisitionCost: Joi.number().allow(null),
    currentValuation: Joi.number().allow(null),
    location: Joi.string().required(),
    healthStatus: Joi.string()
      .valid("Healthy", "Sick", "Injured", "Quarantine")
      .required(),
    tag: Joi.string().allow(null),
    microchipId: Joi.string().allow(null),
    motherId: Joi.string().allow(null),
    fatherId: Joi.string().allow(null),
  });

  /**
   * KEW.AH-7: Care Record Schema
   */
  static careRecordSchema = Joi.object({
    livestockId: Joi.string().uuid().required(),
    dateOfCare: Joi.date().required(),
    careType: Joi.string()
      .valid(
        "Vaccination",
        "Deworming",
        "Treatment",
        "Feed",
        "Checkup",
        "Other",
      )
      .required(),
    description: Joi.string().required(),
    veterinarian: Joi.string().allow(null),
    contractRef: Joi.string().allow(null),
    cost: Joi.number().precision(2).allow(null),
    recordedBy: Joi.string().uuid().required(),
    notes: Joi.string().allow(null),
  });

  /**
   * KEW.AH-9: Incident Report Schema
   */
  static incidentSchema = Joi.object({
    livestockId: Joi.string().uuid().required(),
    incidentType: Joi.string()
      .valid("Illness", "Injury", "Death", "Missing", "Outbreak")
      .required(),
    dateIdentified: Joi.date().required(),
    description: Joi.string().required(),
    estimatedTreatmentCost: Joi.number().precision(2).allow(null),
    recommendation: Joi.string().allow(null),
    approvalStatus: Joi.string()
      .valid("Pending", "Approved", "Rejected")
      .default("Pending"),
    approverName: Joi.string().allow(null),
    approverPosition: Joi.string().allow(null),
  });

  /**
   * KEW.AH-14: Transfer Order Schema
   */
  static transferSchema = Joi.object({
    livestockId: Joi.string().uuid().required(),
    registrationNumber: Joi.string().required(),
    requesterName: Joi.string().required(),
    requesterPosition: Joi.string().required(),
    purpose: Joi.string().required(),
    fromLocation: Joi.string().required(),
    toLocation: Joi.string().required(),
    dateRequested: Joi.date().required(),
    dateExpectedReturn: Joi.date().allow(null),
    initiatedById: Joi.string().uuid().required(),
    status: Joi.string()
      .valid("pending", "approved", "completed")
      .default("pending"),
  });

  /**
   * KEW.AH-16/18/20: Disposal Report Schema
   */
  static disposalSchema = Joi.object({
    livestockId: Joi.string().uuid().required(),
    registrationNumber: Joi.string().allow(null),
    disposalMethod: Joi.string()
      .valid("Sale", "Handover", "Slaughter", "Destruction", "Release")
      .required(),
    disposalDate: Joi.date().required(),
    recipientName: Joi.string().allow(null),
    proceedsAmount: Joi.number().precision(2).allow(null),
    numberOfWitnesses: Joi.number().integer().min(0),
    witnessNames: Joi.array().items(Joi.string()).allow(null),
    remarks: Joi.string().allow(null),
    authorizedBy: Joi.string().uuid().required(),
    status: Joi.string()
      .valid("pending", "approved", "rejected")
      .default("pending"),
  });

  /**
   * KEW.PS-2: Inventory Rejection Schema
   */
  static inventoryRejectionSchema = Joi.object({
    itemCode: Joi.string().required(),
    description: Joi.string().required(),
    quantityOrdered: Joi.number().integer().min(1).required(),
    quantityReceived: Joi.number().integer().min(0).required(),
    quantityRejected: Joi.number().integer().min(1).required(),
    reason: Joi.string().required(),
    purchaseOrderNumber: Joi.string().allow(null),
    deliveryNoteNumber: Joi.string().allow(null),
    reportedBy: Joi.string().uuid().required(),
    reportedAt: Joi.date().default(() => new Date()),
  });

  /**
   * KEW.PS-20/22: Stock Disposal Schema
   */
  static inventoryDisposalSchema = Joi.object({
    inventoryId: Joi.string().uuid().allow(null),
    itemCode: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    disposalMethod: Joi.string()
      .valid("Sale", "Donation", "Destruction", "Damage", "Other")
      .required(),
    originalValue: Joi.number().precision(2).allow(null),
    currentValue: Joi.number().precision(2).allow(null),
    proceedsAmount: Joi.number().precision(2).allow(null),
    remarks: Joi.string().allow(null),
    disposedById: Joi.string().uuid().required(),
    disposalDate: Joi.date().default(() => new Date()),
  });

  /**
   * Validate livestock registration form data
   */
  static validateLivestockRegistration(data) {
    const { error, value } = this.livestockRegistrationSchema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      const details = error.details.map(
        (d) => `${d.path.join(".")}: ${d.message}`,
      );
      logger.warn(
        `Livestock registration validation failed: ${details.join(", ")}`,
      );
      return { valid: false, errors: details, data: null };
    }
    return { valid: true, errors: [], data: value };
  }

  /**
   * Validate care record form data
   */
  static validateCareRecord(data) {
    const { error, value } = this.careRecordSchema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      const details = error.details.map(
        (d) => `${d.path.join(".")}: ${d.message}`,
      );
      logger.warn(`Care record validation failed: ${details.join(", ")}`);
      return { valid: false, errors: details, data: null };
    }
    return { valid: true, errors: [], data: value };
  }

  /**
   * Validate incident report form data
   */
  static validateIncidentReport(data) {
    const { error, value } = this.incidentSchema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      const details = error.details.map(
        (d) => `${d.path.join(".")}: ${d.message}`,
      );
      logger.warn(`Incident report validation failed: ${details.join(", ")}`);
      return { valid: false, errors: details, data: null };
    }
    return { valid: true, errors: [], data: value };
  }

  /**
   * Validate transfer order form data
   */
  static validateTransferOrder(data) {
    const { error, value } = this.transferSchema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      const details = error.details.map(
        (d) => `${d.path.join(".")}: ${d.message}`,
      );
      logger.warn(`Transfer order validation failed: ${details.join(", ")}`);
      return { valid: false, errors: details, data: null };
    }
    return { valid: true, errors: [], data: value };
  }

  /**
   * Validate disposal report form data
   */
  static validateDisposalReport(data) {
    const { error, value } = this.disposalSchema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      const details = error.details.map(
        (d) => `${d.path.join(".")}: ${d.message}`,
      );
      logger.warn(`Disposal report validation failed: ${details.join(", ")}`);
      return { valid: false, errors: details, data: null };
    }
    return { valid: true, errors: [], data: value };
  }

  /**
   * Validate inventory rejection form data
   */
  static validateInventoryRejection(data) {
    const { error, value } = this.inventoryRejectionSchema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      const details = error.details.map(
        (d) => `${d.path.join(".")}: ${d.message}`,
      );
      logger.warn(
        `Inventory rejection validation failed: ${details.join(", ")}`,
      );
      return { valid: false, errors: details, data: null };
    }
    return { valid: true, errors: [], data: value };
  }

  /**
   * Validate stock disposal form data
   */
  static validateInventoryDisposal(data) {
    const { error, value } = this.inventoryDisposalSchema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      const details = error.details.map(
        (d) => `${d.path.join(".")}: ${d.message}`,
      );
      logger.warn(
        `Inventory disposal validation failed: ${details.join(", ")}`,
      );
      return { valid: false, errors: details, data: null };
    }
    return { valid: true, errors: [], data: value };
  }

  /**
   * Convert HTML form data to model object (generic converter)
   */
  static convertFormDataToModel(formData, modelType) {
    try {
      const converter = {
        livestock: (data) => ({
          registrationNumber: `LVS-${Date.now()}`,
          animalCode: data.animalCode,
          name: data.name,
          species: data.species,
          breed: data.breed,
          color: data.color,
          birthDate: new Date(data.birthDate),
          registeredDate: new Date(),
          purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
          acquisitionCost: parseFloat(data.acquisitionCost) || null,
          location: data.location,
          healthStatus: data.healthStatus || "Healthy",
        }),
        careRecord: (data) => ({
          livestockId: data.livestockId,
          dateOfCare: new Date(data.dateOfCare),
          careType: data.careType,
          description: data.description,
          veterinarian: data.veterinarian,
          contractRef: data.contractRef,
          cost: parseFloat(data.cost) || null,
        }),
        incident: (data) => ({
          livestockId: data.livestockId,
          incidentType: data.incidentType,
          dateIdentified: new Date(data.dateIdentified),
          description: data.description,
          estimatedTreatmentCost:
            parseFloat(data.estimatedTreatmentCost) || null,
          recommendation: data.recommendation,
        }),
        transfer: (data) => ({
          livestockId: data.livestockId,
          registrationNumber: data.registrationNumber,
          requesterName: data.requesterName,
          requesterPosition: data.requesterPosition,
          purpose: data.purpose,
          fromLocation: data.fromLocation,
          toLocation: data.toLocation,
          dateRequested: new Date(data.dateRequested),
          dateExpectedReturn: data.dateExpectedReturn
            ? new Date(data.dateExpectedReturn)
            : null,
        }),
        disposal: (data) => ({
          livestockId: data.livestockId,
          disposalMethod: data.disposalMethod,
          disposalDate: new Date(data.disposalDate),
          recipientName: data.recipientName,
          proceedsAmount: parseFloat(data.proceedsAmount) || null,
          numberOfWitnesses: parseInt(data.numberOfWitnesses) || 0,
          witnessNames: data.witnessNames
            ? data.witnessNames.split(",").map((w) => w.trim())
            : null,
          remarks: data.remarks,
        }),
      };

      const converted = converter[modelType]?.(formData);
      if (!converted) {
        throw new Error(`Unknown model type: ${modelType}`);
      }
      return { success: true, data: converted };
    } catch (error) {
      logger.error(`Form conversion error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

module.exports = KEWFormConverter;
