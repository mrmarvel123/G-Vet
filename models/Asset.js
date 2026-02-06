// Asset Model - KEW.PA
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Asset = sequelize.define(
  "Asset",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    assetCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Asset ID (e.g., A2024-001)",
    },
    assetName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(
        "Computer & IT",
        "Furniture",
        "Vehicle",
        "Machinery",
        "Equipment",
        "Other",
      ),
      allowNull: false,
    },
    subCategory: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    purchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    purchasePrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    supplier: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    warrantyExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    custodian: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "Active",
        "Under Maintenance",
        "Disposed",
        "Lost",
        "Damaged",
        "Reserved",
      ),
      defaultValue: "Active",
      allowNull: false,
    },
    condition: {
      type: DataTypes.ENUM("Excellent", "Good", "Fair", "Poor"),
      defaultValue: "Good",
      allowNull: false,
    },
    qrCode: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "QR code data URL",
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Asset image path",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    kewpaForm: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "KEW.PA form reference",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    locationZoneId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "LocationZone",
        key: "id",
      },
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Department",
        key: "id",
      },
    },
    suppressionValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: "Current depreciated value",
    },
    depreciationMethod: {
      type: DataTypes.ENUM(
        "Straight Line",
        "Declining Balance",
        "Units of Production",
        "No Depreciation",
      ),
      allowNull: true,
    },
    depreciationRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Annual depreciation rate %",
    },
    usefulLife: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Useful life in years",
    },
    salvageValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: "Expected salvage value",
    },
    lastDepreciationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    lastMaintenanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    nextScheduledMaintenance: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    maintenanceFrequency: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "e.g., Monthly, Quarterly",
    },
    maintenanceCost: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: "Total maintenance cost",
    },
    totalMaintenanceHours: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    insurancePolicyNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    insuranceProvider: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    insuranceExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    insuranceValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    usageHours: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Total usage hours",
    },
    usagePercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Capacity utilization %",
    },
    commissionedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    decommissionedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    barcode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    assetStatus: {
      type: DataTypes.ENUM(
        "New",
        "Working",
        "Maintenance",
        "Spare",
        "Faulty",
        "Under Repair",
        "Decommissioned",
      ),
      defaultValue: "New",
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Soft delete timestamp",
    },
  },
  {
    indexes: [
      { fields: ["assetCode"] },
      { fields: ["category"] },
      { fields: ["status"] },
      { fields: ["location"] },
      { fields: ["department"] },
      { fields: ["locationZoneId"] },
      { fields: ["departmentId"] },
      { fields: ["assetStatus"] },
      { fields: ["deletedAt"] },
    ],
  },
);

module.exports = Asset;
