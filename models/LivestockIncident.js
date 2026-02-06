const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LivestockIncident = sequelize.define(
  "LivestockIncident",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    livestockId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    registrationNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    incidentType: {
      type: DataTypes.ENUM("Illness", "Injury", "Death", "Missing", "Outbreak"),
      allowNull: false,
    },
    dateIdentified: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estimatedTreatmentCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    recommendation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approvalStatus: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
    },
    approverName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    approverPosition: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    outcomeNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [{ fields: ["livestockId"] }, { fields: ["incidentType"] }],
  },
);

module.exports = LivestockIncident;
