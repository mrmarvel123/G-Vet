const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LivestockCareRecord = sequelize.define(
  "LivestockCareRecord",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    livestockId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "Reference to Livestock.id",
    },
    registrationNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dateOfCare: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    careType: {
      type: DataTypes.ENUM(
        "Vaccination",
        "Deworming",
        "Treatment",
        "Feed",
        "Checkup",
        "Other",
      ),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    veterinarian: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    contractRef: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    cost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    recordedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [{ fields: ["livestockId"] }, { fields: ["dateOfCare"] }],
  },
);

module.exports = LivestockCareRecord;
