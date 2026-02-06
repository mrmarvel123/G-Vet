// Model Index - Defines all relationships
// Models are loaded from their respective module directories
const { sequelize } = require("../../config/database");

// Import all models from their module directories
const User = require("../../modules/core/models/User");
const Asset = require("../../modules/kew-pa/models/Asset");
const Inventory = require("../../modules/kew-ps/models/Inventory");
const Livestock = require("../../modules/kew-ah/models/Livestock");
const AuditLog = require("../../modules/core/models/AuditLog");
const AnimalRejection = require("../../modules/kew-ah/models/AnimalRejection");
const LivestockCategoryB = require("../../modules/kew-ah/models/LivestockCategoryB");
const LivestockCareRecord = require("../../modules/kew-ah/models/LivestockCareRecord");
const LivestockMovement = require("../../modules/kew-ah/models/LivestockMovement");
const LivestockIncident = require("../../modules/kew-ah/models/LivestockIncident");
const LivestockInspection = require("../../modules/kew-ah/models/LivestockInspection");
const LivestockTransfer = require("../../modules/kew-ah/models/LivestockTransfer");
const LivestockDisposal = require("../../modules/kew-ah/models/LivestockDisposal");
const LivestockLoss = require("../../modules/kew-ah/models/LivestockLoss");
const InventoryRejection = require("../../modules/kew-ps/models/InventoryRejection");
const InventoryDisposal = require("../../modules/kew-ps/models/InventoryDisposal");

// Define relationships

// User -> Asset (One to Many)
User.hasMany(Asset, { foreignKey: "userId", as: "assets" });
Asset.belongsTo(User, { foreignKey: "userId", as: "user" });

// User -> Inventory (One to Many)
User.hasMany(Inventory, { foreignKey: "userId", as: "inventoryItems" });
Inventory.belongsTo(User, { foreignKey: "userId", as: "user" });

// User -> Livestock (One to Many)
User.hasMany(Livestock, { foreignKey: "userId", as: "livestock" });
Livestock.belongsTo(User, { foreignKey: "userId", as: "user" });

// User -> AuditLog (One to Many)
User.hasMany(AuditLog, { foreignKey: "userId", as: "auditLogs" });
AuditLog.belongsTo(User, { foreignKey: "userId", as: "user" });

// Livestock -> Livestock (Self-referencing for parent relationships)
Livestock.belongsTo(Livestock, { as: "mother", foreignKey: "motherId" });
Livestock.belongsTo(Livestock, { as: "father", foreignKey: "fatherId" });

// Associations: Livestock related records
Livestock.hasMany(LivestockCareRecord, {
  foreignKey: "livestockId",
  as: "careRecords",
});
LivestockCareRecord.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

// Livestock -> Movement (One to Many)
Livestock.hasMany(LivestockMovement, {
  foreignKey: "livestockId",
  as: "movements",
});
LivestockMovement.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

// Livestock -> Incident (One to Many)
Livestock.hasMany(LivestockIncident, {
  foreignKey: "livestockId",
  as: "incidents",
});
LivestockIncident.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

// Livestock -> Inspection (One to Many)
Livestock.hasMany(LivestockInspection, {
  foreignKey: "livestockId",
  as: "inspections",
});
LivestockInspection.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

// Livestock -> Transfer (One to Many)
Livestock.hasMany(LivestockTransfer, {
  foreignKey: "livestockId",
  as: "transfers",
});
LivestockTransfer.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

// Livestock -> Disposal (One to Many)
Livestock.hasMany(LivestockDisposal, {
  foreignKey: "livestockId",
  as: "disposals",
});
LivestockDisposal.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

// Livestock -> Loss (One to Many)
Livestock.hasMany(LivestockLoss, {
  foreignKey: "livestockId",
  as: "losses",
});
LivestockLoss.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

// Livestock -> AnimalRejection (One to Many)
Livestock.hasMany(AnimalRejection, {
  foreignKey: "livestockId",
  as: "rejections",
});
AnimalRejection.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

// Livestock -> CategoryB (One to Many)
Livestock.hasMany(LivestockCategoryB, {
  foreignKey: "livestockId",
  as: "categoryB",
});
LivestockCategoryB.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

// Inventory -> InventoryRejection (One to Many)
Inventory.hasMany(InventoryRejection, {
  foreignKey: "inventoryId",
  as: "rejections",
});
InventoryRejection.belongsTo(Inventory, {
  foreignKey: "inventoryId",
  as: "inventory",
});

// Inventory -> InventoryDisposal (One to Many)
Inventory.hasMany(InventoryDisposal, {
  foreignKey: "inventoryId",
  as: "disposals",
});
InventoryDisposal.belongsTo(Inventory, {
  foreignKey: "inventoryId",
  as: "inventory",
});

module.exports = {
  sequelize,
  User,
  Asset,
  Inventory,
  Livestock,
  AuditLog,
  AnimalRejection,
  LivestockCategoryB,
  LivestockCareRecord,
  LivestockMovement,
  LivestockIncident,
  LivestockInspection,
  LivestockTransfer,
  LivestockDisposal,
  LivestockLoss,
  InventoryRejection,
  InventoryDisposal,
};
