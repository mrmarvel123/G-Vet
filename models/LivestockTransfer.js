const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LivestockTransfer = sequelize.define(
  "LivestockTransfer",
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
    initiatedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Users", key: "id" },
    },
    registrationNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fromDepartment: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    toDepartment: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    quantityRequested: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    quantityApproved: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected", "Completed"),
      defaultValue: "Pending",
    },
    requestingOfficerName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    approvingOfficerName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    dateRequested: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateApproved: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateTransferred: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [{ fields: ["fromDepartment"] }, { fields: ["toDepartment"] }],
  },
);

module.exports = LivestockTransfer;
