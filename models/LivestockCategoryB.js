const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LivestockCategoryB = sequelize.define(
  "LivestockCategoryB",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Users", key: "id" },
    },
    recordedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Users", key: "id" },
    },
    family: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    breed: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    unit: {
      type: DataTypes.ENUM("Individual", "Weight", "Colony", "Batch"),
      defaultValue: "Individual",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    acquisitionType: {
      type: DataTypes.ENUM(
        "Purchase",
        "Donation",
        "Transfer",
        "Birth",
        "Other",
      ),
      allowNull: false,
      defaultValue: "Purchase",
    },
    acquisitionRef: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    acquisitionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    originalValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    currentEstimatedValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [{ fields: ["family"] }, { fields: ["breed"] }],
  },
);

module.exports = LivestockCategoryB;
