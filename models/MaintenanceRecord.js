// MaintenanceRecord Model - for tracking asset maintenance and repairs
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const MaintenanceRecord = sequelize.define(
  "MaintenanceRecord",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    assetId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Asset",
        key: "id",
      },
    },
    maintenanceCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Unique maintenance record code",
    },
    maintenanceType: {
      type: DataTypes.ENUM(
        "Preventive",
        "Corrective",
        "Emergency",
        "Inspection",
        "Cleaning",
        "Calibration",
        "Other",
      ),
      allowNull: false,
    },
    scheduleDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Scheduled maintenance date",
    },
    completionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "Actual completion date",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Work to be performed",
    },
    workPerformed: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Details of work actually performed",
    },
    technician: {
      type: DataTypes.STRING(150),
      allowNull: true,
      comment: "Name of maintenance technician",
    },
    technicianId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
    },
    partsCost: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: "Cost of replacement parts",
    },
    laborCost: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: "Cost of labor",
    },
    totalCost: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: "Total maintenance cost",
    },
    hoursSpent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Hours spent on maintenance",
    },
    partsReplaced: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "List of replaced parts",
    },
    supplier: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "Supplier of parts/services",
    },
    supplierId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Supplier",
        key: "id",
      },
    },
    nextMaintenanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "Suggested next maintenance date",
    },
    conditionBeforeMaintenance: {
      type: DataTypes.ENUM(
        "Excellent",
        "Good",
        "Fair",
        "Poor",
        "Non-functional",
      ),
      allowNull: true,
    },
    conditionAfterMaintenance: {
      type: DataTypes.ENUM(
        "Excellent",
        "Good",
        "Fair",
        "Poor",
        "Non-functional",
      ),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "Scheduled",
        "In Progress",
        "Completed",
        "Cancelled",
        "On Hold",
      ),
      defaultValue: "Scheduled",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recordedBy: {
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
      { fields: ["assetId"] },
      { fields: ["maintenanceCode"] },
      { fields: ["scheduleDate"] },
      { fields: ["completionDate"] },
      { fields: ["maintenanceType"] },
      { fields: ["status"] },
      { fields: ["deletedAt"] },
    ],
  },
);

module.exports = MaintenanceRecord;
