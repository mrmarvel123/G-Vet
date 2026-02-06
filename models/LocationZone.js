// LocationZone Model - for managing facility zones/sections
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LocationZone = sequelize.define(
  "LocationZone",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    zoneCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Unique zone code (e.g., ZONE-A1)",
    },
    zoneName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    zoneType: {
      type: DataTypes.ENUM(
        "Livestock Pen",
        "Storage Area",
        "Quarantine Area",
        "Treatment Room",
        "Feed Store",
        "Office",
        "Equipment Storage",
        "Other",
      ),
      allowNull: false,
    },
    building: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Building or facility name",
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Floor level",
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Maximum capacity (animals/units)",
    },
    currentOccupancy: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Current number of animals/items",
    },
    dimensions: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "e.g., 20m x 15m",
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Area in square meters",
    },
    temperature: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Optimal temperature in Celsius",
    },
    humidity: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Optimal humidity percentage",
    },
    ventilation: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Ventilation system type",
    },
    lastMaintenanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    maintenanceSchedule: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "e.g., Monthly, Quarterly",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Soft delete timestamp",
    },
  },
  {
    indexes: [
      { fields: ["zoneCode"] },
      { fields: ["zoneType"] },
      { fields: ["building"] },
      { fields: ["isActive"] },
      { fields: ["deletedAt"] },
    ],
  },
);

module.exports = LocationZone;
