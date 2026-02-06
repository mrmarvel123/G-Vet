const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LivestockMovement = sequelize.define(
  "LivestockMovement",
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
    movedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Users", key: "id" },
    },
    registrationNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    requesterName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    requesterPosition: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    purpose: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fromLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    toLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dateRequested: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateExpectedReturn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateActualReturn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "Requested",
        "Approved",
        "Rejected",
        "Returned",
        "Overdue",
      ),
      defaultValue: "Requested",
    },
    approverName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    approverPosition: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [{ fields: ["livestockId"] }, { fields: ["status"] }],
  },
);

module.exports = LivestockMovement;
