// Model Index - Defines all relationships
const { sequelize } = require("../config/database");
const User = require("./User");
const Asset = require("./Asset");
const Inventory = require("./Inventory");
const Livestock = require("./Livestock");
const AuditLog = require("./AuditLog");
const AnimalRejection = require("./AnimalRejection");
const LivestockCategoryB = require("./LivestockCategoryB");
const LivestockCareRecord = require("./LivestockCareRecord");
const LivestockMovement = require("./LivestockMovement");
const LivestockIncident = require("./LivestockIncident");
const LivestockInspection = require("./LivestockInspection");
const LivestockTransfer = require("./LivestockTransfer");
const LivestockDisposal = require("./LivestockDisposal");
const LivestockLoss = require("./LivestockLoss");
const InventoryRejection = require("./InventoryRejection");
const InventoryDisposal = require("./InventoryDisposal");

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

Livestock.hasMany(LivestockMovement, {
  foreignKey: "livestockId",
  as: "movements",
});
LivestockMovement.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

Livestock.hasMany(LivestockIncident, {
  foreignKey: "livestockId",
  as: "incidents",
});
LivestockIncident.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

Livestock.hasMany(LivestockInspection, {
  foreignKey: "livestockId",
  as: "inspections",
});
LivestockInspection.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

Livestock.hasMany(LivestockTransfer, {
  foreignKey: "livestockId",
  as: "transfers",
});
LivestockTransfer.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

Livestock.hasMany(LivestockDisposal, {
  foreignKey: "livestockId",
  as: "disposals",
});
LivestockDisposal.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

Livestock.hasMany(LivestockLoss, { foreignKey: "livestockId", as: "losses" });
LivestockLoss.belongsTo(Livestock, {
  foreignKey: "livestockId",
  as: "livestock",
});

// Category B items grouped by location/entry
LivestockCategoryB.belongsTo(User, { foreignKey: "userId", as: "owner" });

// Inventory associations
// InventoryDisposal.belongsTo(Inventory, {
//   foreignKey: "inventoryId",
//   as: "inventory",
// });

// User associations for rejection/disposal
User.hasMany(InventoryDisposal, {
  foreignKey: "disposedById",
  as: "inventoryDisposals",
});
InventoryDisposal.belongsTo(User, {
  foreignKey: "disposedById",
  as: "disposedBy",
});

// User associations for livestock tracking
User.hasMany(LivestockMovement, {
  foreignKey: "movedById",
  as: "movedLivestock",
});
LivestockMovement.belongsTo(User, { foreignKey: "movedById", as: "movedBy" });

User.hasMany(LivestockInspection, {
  foreignKey: "inspectorId",
  as: "inspections",
});
LivestockInspection.belongsTo(User, {
  foreignKey: "inspectorId",
  as: "inspector",
});

User.hasMany(LivestockTransfer, {
  foreignKey: "initiatedById",
  as: "initiatedTransfers",
});
LivestockTransfer.belongsTo(User, {
  foreignKey: "initiatedById",
  as: "initiatedBy",
});

User.hasMany(LivestockDisposal, {
  foreignKey: "authorizedBy",
  as: "authorizedDisposals",
});
LivestockDisposal.belongsTo(User, {
  foreignKey: "authorizedBy",
  as: "authorizer",
});

User.hasMany(LivestockLoss, { foreignKey: "reportedBy", as: "reportedLosses" });
LivestockLoss.belongsTo(User, { foreignKey: "reportedBy", as: "reporter" });

User.hasMany(AnimalRejection, {
  foreignKey: "rejectedById",
  as: "animalRejections",
});
AnimalRejection.belongsTo(User, {
  foreignKey: "rejectedById",
  as: "rejectedBy",
});

User.hasMany(LivestockCategoryB, {
  foreignKey: "recordedById",
  as: "categoryBAnimals",
});
LivestockCategoryB.belongsTo(User, {
  foreignKey: "recordedById",
  as: "recordedBy",
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
