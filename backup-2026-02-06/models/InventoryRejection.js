const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const InventoryRejection = sequelize.define(
  "InventoryRejection",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    itemCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    quantityOrdered: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantityReceived: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantityRejected: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    purchaseOrderNumber: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    deliveryNoteNumber: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    reportedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reportedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [{ fields: ["itemCode"] }, { fields: ["purchaseOrderNumber"] }],
  },
);

module.exports = InventoryRejection;
