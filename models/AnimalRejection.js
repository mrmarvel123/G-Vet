const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const AnimalRejection = sequelize.define(
  "AnimalRejection",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rejectionRef: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "KEW AH-2 reference or local ref",
    },
    rejectedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Users", key: "id" },
    },
    supplierName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    supplierAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    purchaseOrderNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    deliveryNoteNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "Array of rejected items with codes, qty, reasons",
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    receivedBy: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    receivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resolved: {
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
      { fields: ["rejectionRef"] },
      { fields: ["purchaseOrderNumber"] },
    ],
  },
);

module.exports = AnimalRejection;
