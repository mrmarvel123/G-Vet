const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/database");

const InventoryDisposal = sequelize.define(
  "InventoryDisposal",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    inventoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    disposedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Users", key: "id" },
    },
    itemCode: {
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
        "Tender",
        "Auction",
        "DirectSale",
        "Scrap",
        "Handover",
        "EWaste",
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
    proceeds: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    witnesses: {
      type: DataTypes.JSON,
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
    indexes: [{ fields: ["itemCode"] }, { fields: ["disposalMethod"] }],
  },
);

module.exports = InventoryDisposal;

