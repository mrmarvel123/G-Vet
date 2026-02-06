// Medication Model - for managing veterinary medications and drugs
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Medication = sequelize.define(
  "Medication",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    medicationCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Unique medication code (e.g., MED-001)",
    },
    medicationName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    genericName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "Generic drug name",
    },
    medicationType: {
      type: DataTypes.ENUM(
        "Antibiotic",
        "Antifungal",
        "Anti-inflammatory",
        "Antiparasitic",
        "Vaccine",
        "Supplement",
        "Other",
      ),
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    supplierId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Supplier",
        key: "id",
      },
    },
    activeIngredient: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "Main active ingredient",
    },
    strength: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "e.g., 500mg, 10IU",
    },
    dosageForm: {
      type: DataTypes.ENUM(
        "Tablet",
        "Capsule",
        "Injection",
        "Liquid",
        "Powder",
        "Paste",
        "Other",
      ),
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "Unit (vial, bottle, box, etc.)",
    },
    currentStock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    minimumStock: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    batchNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    storageConditions: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "e.g., Room temperature, Refrigerated",
    },
    possibleSideEffects: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contraindications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    animalTypes: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Applicable animal types: ["Cattle", "Goat", ...]',
    },
    registrationNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Veterinary drug registration number",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Soft delete timestamp",
    },
  },
  {
    indexes: [
      { fields: ["medicationCode"] },
      { fields: ["medicationType"] },
      { fields: ["supplierId"] },
      { fields: ["expiryDate"] },
      { fields: ["isActive"] },
      { fields: ["deletedAt"] },
    ],
  },
);

module.exports = Medication;
