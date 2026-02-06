const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/database");

const LivestockInspection = sequelize.define(
  "LivestockInspection",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    registrationNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    livestockId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    inspectorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Users", key: "id" },
    },
    inspectionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    inspectors: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Array of inspector objects {name, position, dept}",
    },
    physicalCounts: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Counts by status: healthy, sick, injured, dead, missing",
    },
    discrepancies: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    findings: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    certificateIssued: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [
      { fields: ["inspectionDate"] },
      { fields: ["registrationNumber"] },
    ],
  },
);

module.exports = LivestockInspection;

