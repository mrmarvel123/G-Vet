// Department Model - for managing organizational departments
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Department = sequelize.define(
  "Department",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    departmentCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Unique department code (e.g., DEPT-001)",
    },
    departmentName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    headOfDepartment: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Name of department head",
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
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "Physical location/office",
    },
    budget: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      comment: "Annual budget allocation",
    },
    budgetYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
      { fields: ["departmentCode"] },
      { fields: ["isActive"] },
      { fields: ["deletedAt"] },
    ],
  },
);

module.exports = Department;
