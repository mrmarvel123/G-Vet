const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LivestockDisposal = sequelize.define(
  "LivestockDisposal",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    livestockId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    authorizedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Users", key: "id" },
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
    disposalReason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    disposalMethod: {
      type: DataTypes.ENUM(
        "SaleTender",
        "SaleAuction",
        "SaleDirect",
        "Handover",
        "Release",
        "Destruction",
        "Other",
      ),
      allowNull: false,
      defaultValue: "Other",
    },
    approvalRef: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    saleProceed: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    witnesses: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Array of witness objects {name, position}",
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
    indexes: [{ fields: ["disposalMethod"] }, { fields: ["approvalRef"] }],
  },
);

module.exports = LivestockDisposal;
