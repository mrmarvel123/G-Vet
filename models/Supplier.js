// Supplier Model - for managing vendors and suppliers
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Supplier = sequelize.define(
  "Supplier",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    supplierCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Unique supplier code (e.g., SUP-001)",
    },
    supplierName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    contactPerson: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    faxNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    supplierType: {
      type: DataTypes.ENUM(
        "Equipment",
        "Medication",
        "Feed",
        "Office Supplies",
        "Veterinary Services",
        "Maintenance",
        "Other",
      ),
      allowNull: false,
    },
    taxId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Tax/VAT registration number",
    },
    bankName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    bankAccount: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bankCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    paymentTerms: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "e.g., Net 30, COD",
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "MYR",
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
      comment: "Rating from 0-5",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Soft delete timestamp",
    },
  },
  {
    indexes: [
      { fields: ["supplierCode"] },
      { fields: ["supplierType"] },
      { fields: ["isActive"] },
      { fields: ["deletedAt"] },
    ],
  },
);

module.exports = Supplier;
