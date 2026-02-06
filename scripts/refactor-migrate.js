#!/usr/bin/env node

/**
 * G-VET PROJECT RESTRUCTURE MIGRATION SCRIPT
 *
 * This script automates the migration from flat structure to domain-driven architecture.
 * It copies files to the new locations and updates import statements.
 *
 * Usage: node scripts/refactor-migrate.js [--dry-run] [--backup]
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration
const DRY_RUN = process.argv.includes("--dry-run");
const CREATE_BACKUP = process.argv.includes("--backup");
const ROOT_DIR = path.resolve(__dirname, "..");

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function copyFile(src, dest) {
  try {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    log(
      `✓ Copied: ${path.relative(ROOT_DIR, src)} → ${path.relative(ROOT_DIR, dest)}`,
      "green",
    );
  } catch (error) {
    log(`✗ Error copying ${src}: ${error.message}`, "red");
  }
}

function updateImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf-8");

    // Define import replacements based on file location
    const importMap = {
      // From controllers in modules
      "require('../models')": "require('../../database/models')",
      "require('../config/logger')": "require('../../config/logger')",
      "require('../services/": "require('../../shared/services/",
      "require('../middleware/": "require('../../shared/middleware/",
      "require('../validators/": "require('./../../validators/", // Adjust if needed

      // From routes in modules
      "require('../controllers/": "require('./controllers/",
      "require('../models')": "require('../../database/models')",

      // From models
      "const { sequelize } = require('')":
        "const sequelize = require('../../config/database')",
    };

    let updated = false;
    for (const [oldImport, newImport] of Object.entries(importMap)) {
      if (content.includes(oldImport)) {
        content = content.replace(
          new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
          newImport,
        );
        updated = true;
      }
    }

    if (updated) {
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, content, "utf-8");
      }
      log(`⚙ Updated imports: ${path.relative(ROOT_DIR, filePath)}`, "cyan");
    }
  } catch (error) {
    log(`✗ Error updating ${filePath}: ${error.message}`, "red");
  }
}

function createBackup() {
  const timestamp = new Date().toISOString().split("T")[0];
  const backupDir = path.join(ROOT_DIR, `backup-${timestamp}`);

  log(`\n📦 Creating backup in ${backupDir}...`, "blue");

  const dirsToBackup = [
    "controllers",
    "routes",
    "models",
    "middleware",
    "services",
    "validators",
  ];

  dirsToBackup.forEach((dir) => {
    const src = path.join(ROOT_DIR, dir);
    const dest = path.join(backupDir, dir);
    if (fs.existsSync(src)) {
      try {
        // Use cross-platform approach
        const isWindows = process.platform === "win32";
        if (isWindows) {
          // Use xcopy for Windows
          execSync(`xcopy "${src}" "${dest}" /E /I /Y`, { stdio: "inherit" });
        } else {
          // Use cp for Unix/Linux/macOS
          execSync(`cp -r ${src} ${dest}`, { stdio: "inherit" });
        }
        log(`✓ Backed up: ${dir}`, "green");
      } catch (error) {
        log(`⚠ Backup warning for ${dir} - continuing anyway`, "yellow");
      }
    }
  });
}

function migrateKEWPA() {
  log("\n[1/5] Migrating KEW.PA (Asset Management)...", "yellow");

  const files = [
    {
      src: "controllers/asset.controller.js",
      dest: "src/modules/kew-pa/controllers/asset.controller.js",
    },
    {
      src: "routes/asset.routes.js",
      dest: "src/modules/kew-pa/routes/asset.routes.js",
    },
    { src: "models/Asset.js", dest: "src/modules/kew-pa/models/Asset.js" },
    {
      src: "validators/asset.validator.js",
      dest: "src/modules/kew-pa/validators/asset.validator.js",
    },
  ];

  files.forEach((file) => {
    const src = path.join(ROOT_DIR, file.src);
    const dest = path.join(ROOT_DIR, file.dest);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
      updateImports(dest);
    }
  });
}

function migrateKEWPS() {
  log("\n[2/5] Migrating KEW.PS (Store & Inventory)...", "yellow");

  const files = [
    {
      src: "controllers/inventory.controller.js",
      dest: "src/modules/kew-ps/controllers/inventory.controller.js",
    },
    {
      src: "controllers/inventoryRejection.controller.js",
      dest: "src/modules/kew-ps/controllers/inventoryRejection.controller.js",
    },
    {
      src: "controllers/inventoryDisposal.controller.js",
      dest: "src/modules/kew-ps/controllers/inventoryDisposal.controller.js",
    },
    {
      src: "routes/inventory.routes.js",
      dest: "src/modules/kew-ps/routes/inventory.routes.js",
    },
    {
      src: "routes/inventoryRejection.routes.js",
      dest: "src/modules/kew-ps/routes/inventoryRejection.routes.js",
    },
    {
      src: "routes/inventoryDisposal.routes.js",
      dest: "src/modules/kew-ps/routes/inventoryDisposal.routes.js",
    },
    {
      src: "models/Inventory.js",
      dest: "src/modules/kew-ps/models/Inventory.js",
    },
    {
      src: "models/InventoryRejection.js",
      dest: "src/modules/kew-ps/models/InventoryRejection.js",
    },
    {
      src: "models/InventoryDisposal.js",
      dest: "src/modules/kew-ps/models/InventoryDisposal.js",
    },
    {
      src: "validators/inventory.validator.js",
      dest: "src/modules/kew-ps/validators/inventory.validator.js",
    },
  ];

  files.forEach((file) => {
    const src = path.join(ROOT_DIR, file.src);
    const dest = path.join(ROOT_DIR, file.dest);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
      updateImports(dest);
    }
  });
}

function migrateKEWAH() {
  log("\n[3/5] Migrating KEW.AH (Livestock Management)...", "yellow");

  const livestockControllers = [
    "livestock.controller.js",
    "livestockCareRecord.controller.js",
    "livestockIncident.controller.js",
    "livestockMovement.controller.js",
    "livestockTransfer.controller.js",
    "livestockDisposal.controller.js",
    "livestockInspection.controller.js",
    "livestockLoss.controller.js",
    "livestockCategoryB.controller.js",
    "animalRejection.controller.js",
  ];

  const livestockRoutes = [
    "livestock.routes.js",
    "livestockCareRecord.routes.js",
    "livestockIncident.routes.js",
    "livestockMovement.routes.js",
    "livestockTransfer.routes.js",
    "livestockDisposal.routes.js",
    "livestockInspection.routes.js",
    "livestockLoss.routes.js",
    "livestockCategoryB.routes.js",
    "animalRejection.routes.js",
  ];

  const livestockModels = [
    "Livestock.js",
    "LivestockCareRecord.js",
    "LivestockIncident.js",
    "LivestockMovement.js",
    "LivestockTransfer.js",
    "LivestockDisposal.js",
    "LivestockInspection.js",
    "LivestockLoss.js",
    "LivestockCategoryB.js",
    "AnimalRejection.js",
  ];

  // Migrate controllers
  livestockControllers.forEach((file) => {
    const src = path.join(ROOT_DIR, "controllers", file);
    const dest = path.join(ROOT_DIR, "src/modules/kew-ah/controllers", file);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
      updateImports(dest);
    }
  });

  // Migrate routes
  livestockRoutes.forEach((file) => {
    const src = path.join(ROOT_DIR, "routes", file);
    const dest = path.join(ROOT_DIR, "src/modules/kew-ah/routes", file);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
      updateImports(dest);
    }
  });

  // Migrate models
  livestockModels.forEach((file) => {
    const src = path.join(ROOT_DIR, "models", file);
    const dest = path.join(ROOT_DIR, "src/modules/kew-ah/models", file);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
      updateImports(dest);
    }
  });

  // Migrate validators
  const src = path.join(ROOT_DIR, "validators/livestock.validator.js");
  const dest = path.join(
    ROOT_DIR,
    "src/modules/kew-ah/validators/livestock.validator.js",
  );
  if (fs.existsSync(src)) {
    copyFile(src, dest);
    updateImports(dest);
  }
}

function migrateCore() {
  log("\n[4/5] Migrating Core Module (User, Audit, Report)...", "yellow");

  const files = [
    // Controllers
    {
      src: "controllers/user.controller.js",
      dest: "src/modules/core/controllers/user.controller.js",
    },
    {
      src: "controllers/audit.controller.js",
      dest: "src/modules/core/controllers/audit.controller.js",
    },
    {
      src: "controllers/report.controller.js",
      dest: "src/modules/core/controllers/report.controller.js",
    },
    // Routes
    {
      src: "routes/user.routes.js",
      dest: "src/modules/core/routes/user.routes.js",
    },
    {
      src: "routes/audit.routes.js",
      dest: "src/modules/core/routes/audit.routes.js",
    },
    {
      src: "routes/report.routes.js",
      dest: "src/modules/core/routes/report.routes.js",
    },
    // Models
    { src: "models/User.js", dest: "src/modules/core/models/User.js" },
    { src: "models/AuditLog.js", dest: "src/modules/core/models/AuditLog.js" },
    // Validators
    {
      src: "validators/user.validator.js",
      dest: "src/modules/core/validators/user.validator.js",
    },
  ];

  files.forEach((file) => {
    const src = path.join(ROOT_DIR, file.src);
    const dest = path.join(ROOT_DIR, file.dest);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
      updateImports(dest);
    }
  });
}

function migrateAuth() {
  log("\n[5/5] Migrating Auth Module...", "yellow");

  const files = [
    {
      src: "controllers/auth.controller.js",
      dest: "src/modules/auth/auth.controller.js",
    },
    { src: "routes/auth.routes.js", dest: "src/modules/auth/auth.routes.js" },
  ];

  files.forEach((file) => {
    const src = path.join(ROOT_DIR, file.src);
    const dest = path.join(ROOT_DIR, file.dest);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
      updateImports(dest);
    }
  });
}

function migrateSharedResources() {
  log("\n[Shared] Migrating Middleware & Services...", "yellow");

  const files = [
    // Middleware
    { src: "middleware/auth.js", dest: "src/shared/middleware/auth.js" },
    { src: "middleware/audit.js", dest: "src/shared/middleware/audit.js" },
    // Services
    {
      src: "services/pdf.service.js",
      dest: "src/shared/services/pdf.service.js",
    },
    {
      src: "services/email.service.js",
      dest: "src/shared/services/email.service.js",
    },
    {
      src: "services/upload.service.js",
      dest: "src/shared/services/upload.service.js",
    },
    {
      src: "services/backup.service.js",
      dest: "src/shared/services/backup.service.js",
    },
    {
      src: "services/kew-form.converter.js",
      dest: "src/shared/services/kew-form.converter.js",
    },
    // Config
    { src: "config/database.js", dest: "src/config/database.js" },
    { src: "config/logger.js", dest: "src/config/logger.js" },
    // Database
    { src: "database/migrate.js", dest: "src/database/migrate.js" },
    { src: "database/seed.js", dest: "src/database/seed.js" },
  ];

  files.forEach((file) => {
    const src = path.join(ROOT_DIR, file.src);
    const dest = path.join(ROOT_DIR, file.dest);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
      updateImports(dest);
    }
  });
}

function migrateFrontend() {
  log("\n[Frontend] Migrating HTML & Static Files...", "yellow");

  // KEW.PA modules
  const kewPaFiles = [
    "asset-registration.html",
    "asset-receipt.html",
    "asset-movement.html",
    "asset-inspection.html",
    "asset-maintenance.html",
    "asset-verification.html",
  ];

  kewPaFiles.forEach((file) => {
    const src = path.join(ROOT_DIR, file);
    const dest = path.join(ROOT_DIR, "public/modules/kew-pa", file);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
    }
  });

  // KEW.PS modules
  const kewPsFiles = [
    "inventory.html",
    "store-receipt.html",
    "store-issuance.html",
    "stock-control.html",
    "store-verification.html",
  ];

  kewPsFiles.forEach((file) => {
    const src = path.join(ROOT_DIR, file);
    const dest = path.join(ROOT_DIR, "public/modules/kew-ps", file);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
    }
  });

  // KEW.AH modules
  const kewAhFiles = ["livestock-register.html", "veterinary-care.html"];

  kewAhFiles.forEach((file) => {
    const src = path.join(ROOT_DIR, file);
    const dest = path.join(ROOT_DIR, "public/modules/kew-ah", file);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
    }
  });

  // Root HTML files
  const rootFiles = [
    "index.html",
    "dashboard.html",
    "admin.html",
    "reports.html",
  ];

  rootFiles.forEach((file) => {
    const src = path.join(ROOT_DIR, file);
    const dest = path.join(ROOT_DIR, "public", file);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
    }
  });
}

function createModuleIndexes() {
  log("\n[Indexes] Creating module index.js files...", "yellow");

  const modules = ["kew-pa", "kew-ps", "kew-ah", "core", "auth"];

  modules.forEach((module) => {
    const indexPath = path.join(ROOT_DIR, `src/modules/${module}/index.js`);
    const content = `// ${module.toUpperCase()} Module Export
module.exports = {
  routes: require('./routes'),
  controllers: require('./controllers'),
  models: require('./models'),
  validators: require('./validators')
};
`;
    if (!DRY_RUN) {
      fs.writeFileSync(indexPath, content, "utf-8");
      log(`✓ Created: ${path.relative(ROOT_DIR, indexPath)}`, "green");
    }
  });
}

function updateServerJS() {
  log("\n[server.js] Updating route imports...", "blue");

  const serverPath = path.join(ROOT_DIR, "server.js");

  if (fs.existsSync(serverPath)) {
    let content = fs.readFileSync(serverPath, "utf-8");

    // Update all route requires
    const replacements = [
      [
        "require('./routes/auth.routes')",
        "require('./src/modules/auth/auth.routes')",
      ],
      [
        "require('./routes/asset.routes')",
        "require('./src/modules/kew-pa/routes/asset.routes')",
      ],
      [
        "require('./routes/inventory.routes')",
        "require('./src/modules/kew-ps/routes/inventory.routes')",
      ],
      [
        "require('./routes/livestock.routes')",
        "require('./src/modules/kew-ah/routes/livestock.routes')",
      ],
      [
        "require('./routes/user.routes')",
        "require('./src/modules/core/routes/user.routes')",
      ],
      [
        "require('./routes/audit.routes')",
        "require('./src/modules/core/routes/audit.routes')",
      ],
      [
        "require('./routes/report.routes')",
        "require('./src/modules/core/routes/report.routes')",
      ],
      ["require('./config/logger')", "require('./src/config/logger')"],
      ["require('./models')", "require('./src/database/models')"],
    ];

    let updated = false;
    replacements.forEach(([oldPath, newPath]) => {
      if (content.includes(oldPath)) {
        content = content.replace(
          new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
          newPath,
        );
        updated = true;
      }
    });

    if (updated && !DRY_RUN) {
      fs.writeFileSync(serverPath, content, "utf-8");
      log(`✓ Updated: server.js`, "green");
    }
  }
}

// Main execution
async function main() {
  log(
    "\n╔════════════════════════════════════════════════════════════╗",
    "cyan",
  );
  log(
    "║    G-VET PROJECT RESTRUCTURE MIGRATION SCRIPT               ║",
    "cyan",
  );
  log("║    Domain-Driven Architecture Migration                    ║", "cyan");
  log("╚════════════════════════════════════════════════════════════╝", "cyan");

  if (DRY_RUN) {
    log("\n⚠️  DRY RUN MODE - No files will be modified\n", "yellow");
  }

  // Create backup if requested
  if (CREATE_BACKUP) {
    createBackup();
  }

  // Execute migrations
  migrateKEWPA();
  migrateKEWPS();
  migrateKEWAH();
  migrateCore();
  migrateAuth();
  migrateSharedResources();
  migrateFrontend();
  createModuleIndexes();
  updateServerJS();

  // Summary
  log(
    "\n╔════════════════════════════════════════════════════════════╗",
    "green",
  );
  log(
    "║                  MIGRATION COMPLETE                        ║",
    "green",
  );
  log(
    "╚════════════════════════════════════════════════════════════╝",
    "green",
  );

  log("\n📋 Next Steps:", "yellow");
  log("   1. Review the updated files for any import errors", "reset");
  log("   2. Test with: npm start", "reset");
  log("   3. Run tests: npm test", "reset");
  log(
    '   4. Commit: git add . && git commit -m "refactor: restructure with domain-driven architecture"',
    "reset",
  );
  log(
    "   5. Optional: Delete old directories (after confirming everything works)",
    "reset",
  );

  log("\n📚 Directories to verify:", "yellow");
  log("   ✓ src/modules/kew-pa/", "green");
  log("   ✓ src/modules/kew-ps/", "green");
  log("   ✓ src/modules/kew-ah/", "green");
  log("   ✓ src/modules/core/", "green");
  log("   ✓ src/modules/auth/", "green");
  log("   ✓ src/shared/middleware/", "green");
  log("   ✓ src/shared/services/", "green");
  log("   ✓ public/modules/", "green");
  log("   ✓ public/static/", "green");

  if (DRY_RUN) {
    log("\n💡 To execute the migration (not dry-run), use:", "yellow");
    log("   npm run refactor:migrate", "cyan");
  }
}

main().catch((error) => {
  log(`\n✗ Migration failed: ${error.message}`, "red");
  process.exit(1);
});
