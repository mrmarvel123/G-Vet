const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LivestockLoss = sequelize.define(
  "LivestockLoss",
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    originalValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    currentValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    reportedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reportedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    lossMethod: {
      type: DataTypes.ENUM("Theft", "Fraud", "Negligence", "Unknown"),
      defaultValue: "Unknown",
    },
    policeReportNumber: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    investigationCommittee: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Array of committee members",
    },
    investigationStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    investigationEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    investigationFindings: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recommendSurcharge: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    writeOffApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    writeOffDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    certificateNumber: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [{ fields: ["reportedDate"] }, { fields: ["policeReportNumber"] }],
  },
);

module.exports = LivestockLoss;
