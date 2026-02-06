#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");

function fixImportsInFile(filePath, isController = false) {
  try {
    let content = fs.readFileSync(filePath, "utf-8");
    let updated = false;

    // Fix model imports
    if (
      content.includes('require("../models")') ||
      content.includes("require('../models')")
    ) {
      content = content.replace(
        /require\(['"`]\.\.\/models['"`]\)/g,
        'require("../../database/models")',
      );
      updated = true;
    }

    // Fix config imports
    if (content.includes('require("../config/')) {
      content = content.replace(
        /require\(['"`]\.\.\/config\/([^'"`]+)['"`]\)/g,
        'require("../../config/$1")',
      );
      updated = true;
    }

    // Fix services imports
    if (content.includes('require("../services/')) {
      content = content.replace(
        /require\(['"`]\.\.\/services\/([^'"`]+)['"`]\)/g,
        'require("../../shared/services/$1")',
      );
      updated = true;
    }

    // Fix middleware imports
    if (content.includes('require("../middleware/')) {
      content = content.replace(
        /require\(['"`]\.\.\/middleware\/([^'"`]+)['"`]\)/g,
        'require("../../shared/middleware/$1")',
      );
      updated = true;
    }

    // For routes files, fix controller imports
    if (!isController && content.includes('require("../controllers/')) {
      content = content.replace(
        /require\(['"`]\.\.\/controllers\/([^'"`]+)['"`]\)/g,
        'require("../controllers/$1")',
      );
      updated = true;
    }

    // Fix validator imports
    if (content.includes('require("../validators/')) {
      content = content.replace(
        /require\(['"`]\.\.\/validators\/([^'"`]+)['"`]\)/g,
        'require("../validators/$1")',
      );
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`✓ Fixed: ${path.relative(rootDir, filePath)}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
  }
}

// Fix all controllers
const controllerPattern = path.join(rootDir, "src/modules/**/*.controller.js");
const glob = require("glob");

glob(controllerPattern, (err, files) => {
  if (!err && files) {
    files.forEach((file) => fixImportsInFile(file, true));
  }

  // Fix all routes
  const routePattern = path.join(rootDir, "src/modules/**/*.routes.js");
  glob(routePattern, (err, files) => {
    if (!err && files) {
      files.forEach((file) => fixImportsInFile(file, false));
    }

    // Fix services and middleware
    const servicePattern = path.join(rootDir, "src/shared/services/*.js");
    const middlewarePattern = path.join(rootDir, "src/shared/middleware/*.js");

    glob(servicePattern, (err, files) => {
      if (!err && files) {
        files.forEach((file) => fixImportsInFile(file, false));
      }
    });

    glob(middlewarePattern, (err, files) => {
      if (!err && files) {
        files.forEach((file) => fixImportsInFile(file, false));
      }

      console.log("\n✅ Import fixes complete!");
    });
  });
});
