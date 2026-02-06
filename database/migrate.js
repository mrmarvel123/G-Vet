// Database Migration Script
const { sequelize } = require("../config/database");
const models = require("../models");
const logger = require("../config/logger");

async function migrate() {
  try {
    logger.info("🔄 Starting database migration...");

    // Test connection
    await sequelize.authenticate();
    logger.info("✅ Database connection established");

    // Sync all models with database
    await sequelize.sync({ alter: true });
    logger.info("✅ Database schema synchronized");

    // List all synced models
    const modelNames = Object.keys(models).filter(
      (key) => models[key].tableName,
    );
    logger.info(
      `✅ Synced ${modelNames.length} models: ${modelNames.join(", ")}`,
    );

    logger.info("✅ Migration completed successfully");
    console.log("\n✨ Database is ready! Run: npm run seed");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Migration failed:", error.message);
    console.error("Error details:", error);
    process.exit(1);
  }
}

// Run migration
migrate().catch((error) => {
  logger.error("Unexpected error:", error);
  process.exit(1);
});
