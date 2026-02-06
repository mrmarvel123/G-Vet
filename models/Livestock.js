// Livestock Model - KEW.AH
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Livestock = sequelize.define(
  "Livestock",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    animalCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Animal ID (e.g., C2024-045)",
    },
    species: {
      type: DataTypes.ENUM(
        "Cattle",
        "Buffalo",
        "Goat",
        "Sheep",
        "Horse",
        "Poultry",
        "Other",
      ),
      allowNull: false,
    },
    breed: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Unknown"),
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    age: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "Age in years/months",
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    markings: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Distinctive markings or features",
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Weight in kg",
    },
    acquisitionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    acquisitionType: {
      type: DataTypes.ENUM("Purchase", "Birth", "Donation", "Transfer"),
      allowNull: false,
    },
    acquisitionPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "Current location/farm",
    },
    pen: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Pen or enclosure number",
    },
    healthStatus: {
      type: DataTypes.ENUM(
        "Healthy",
        "Sick",
        "Under Treatment",
        "Quarantine",
        "Deceased",
      ),
      defaultValue: "Healthy",
      allowNull: false,
    },
    vaccinationStatus: {
      type: DataTypes.ENUM("Up to Date", "Due", "Overdue", "Not Required"),
      defaultValue: "Not Required",
      allowNull: false,
    },
    lastVaccinationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    nextVaccinationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    reproductiveStatus: {
      type: DataTypes.ENUM(
        "Not Applicable",
        "Breeding",
        "Pregnant",
        "Lactating",
        "Castrated",
        "Retired",
      ),
      defaultValue: "Not Applicable",
      allowNull: true,
    },
    motherId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "Reference to mother animal",
    },
    fatherId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "Reference to father animal",
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    qrCode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    kewahForm: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "KEW.AH form reference",
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
    microchipNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "RFID/Microchip identification",
    },
    earTagNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Ear tag number",
    },
    pedigree: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Pedigree information",
    },
    productivityScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Productivity rating",
    },
    breedingPotential: {
      type: DataTypes.ENUM("Excellent", "Good", "Fair", "Poor", "Not Assessed"),
      allowNull: true,
    },
    lastHealthCheckDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    nextHealthCheckDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    numberOfOffspring: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastOffspringDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    diseasesHistory: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Previous diseases/illnesses",
    },
    geneticMarkers: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Genetic information",
    },
    feedType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Current feed type/diet",
    },
    dailyFeedQuantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Daily feed amount in kg",
    },
    waterRequirement: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Daily water requirement in liters",
    },
    status: {
      type: DataTypes.ENUM(
        "Active",
        "Inactive",
        "For Sale",
        "Quarantined",
        "Breeding",
        "Retired",
      ),
      defaultValue: "Active",
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Soft delete timestamp",
    },
  },
  {
    indexes: [
      { fields: ["animalCode"] },
      { fields: ["species"] },
      { fields: ["healthStatus"] },
      { fields: ["location"] },
      { fields: ["locationZoneId"] },
      { fields: ["status"] },
      { fields: ["deletedAt"] },
    ],
  },
);

module.exports = Livestock;
