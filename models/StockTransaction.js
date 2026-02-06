// StockTransaction Model - for tracking inventory movements and transactions
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const StockTransaction = sequelize.define(
  "StockTransaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transactionCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Unique transaction code (e.g., TXN-2024-001)",
    },
    inventoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Inventory",
        key: "id",
      },
    },
    transactionType: {
      type: DataTypes.ENUM(
        "Receipt",
        "Issue",
        "Adjustment",
        "Return",
        "Disposal",
        "Damage",
        "Theft Report",
        "Stock Count",
        "Transfer",
        "Damage Adjustment",
        "Other",
      ),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Quantity transacted",
    },
    direction: {
      type: DataTypes.ENUM("In", "Out", "Adjustment"),
      allowNull: false,
      comment: "Direction of stock movement",
    },
    unitPrice: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      allowNull: false,
    },
    totalValue: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
      allowNull: false,
      comment: "Quantity x Unit Price",
    },
    referenceNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "e.g., PO Number, Invoice Number",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Transaction details/notes",
    },
    transactionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    transactionTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    fromLocation: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "Source location (for transfers)",
    },
    toLocation: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "Destination location",
    },
    supplier: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "Supplier name (for receipts)",
    },
    supplierId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Supplier",
        key: "id",
      },
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Department receiving the item",
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Department",
        key: "id",
      },
    },
    receiptNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "GRN number for receipt",
    },
    issueNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Issue slip number",
    },
    approvedByUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
    },
    recordedByUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    batchNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Product batch/lot number",
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "Item expiry date",
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Reason for transaction (damage, expiry, returns)",
    },
    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Approved",
        "Processed",
        "Rejected",
        "Cancelled",
      ),
      defaultValue: "Pending",
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
      { fields: ["transactionCode"] },
      { fields: ["inventoryId"] },
      { fields: ["transactionType"] },
      { fields: ["transactionDate"] },
      { fields: ["direction"] },
      { fields: ["status"] },
      { fields: ["supplierId"] },
      { fields: ["departmentId"] },
      { fields: ["deletedAt"] },
    ],
  },
);

module.exports = StockTransaction;
