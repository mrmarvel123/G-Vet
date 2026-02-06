// Vaccination Model - for tracking vaccination records and schedules
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Vaccination = sequelize.define(
  "Vaccination",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    livestockId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Livestock",
        key: "id",
      },
    },
    vaccinationCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Unique vaccination record code",
    },
    vaccineName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "Name of vaccine administered",
    },
    vaccineType: {
      type: DataTypes.ENUM(
        "Bacterial",
        "Viral",
        "Combination",
        "Live Attenuated",
        "Inactivated",
        "Other",
      ),
      allowNull: false,
    },
    administrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    nextDueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "Date for next booster dose",
    },
    dosage: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Amount administered",
    },
    route: {
      type: DataTypes.ENUM(
        "Intramuscular",
        "Subcutaneous",
        "Oral",
        "Intranasal",
        "Intravenous",
        "Other",
      ),
      defaultValue: "Intramuscular",
    },
    manufacturer: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    batchNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "Expiry date of vaccine vial",
    },
    veterinarian: {
      type: DataTypes.STRING(150),
      allowNull: true,
      comment: "Name of veterinarian who administered",
    },
    veterinarianId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
    },
    site: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Site of injection (left neck, right ear, etc.)",
    },
    reactionObserved: {
      type: DataTypes.ENUM(
        "None",
        "Mild Swelling",
        "Mild Fever",
        "Listlessness",
        "Allergic Reaction",
        "Other",
      ),
      defaultValue: "None",
    },
    reactionDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Detailed description of any reactions",
    },
    certificateNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Official vaccination certificate number",
    },
    cost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "Completed",
        "Scheduled",
        "Overdue",
        "Cancelled",
        "Pending",
      ),
      defaultValue: "Completed",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recordedBy: {
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
      { fields: ["livestock"] },
      { fields: ["vaccinationCode"] },
      { fields: ["administrationDate"] },
      { fields: ["nextDueDate"] },
      { fields: ["status"] },
      { fields: ["deletedAt"] },
    ],
  },
);

module.exports = Vaccination;
  },
);

module.exports = Vaccination;
