# 📚 G-VET SYSTEM - MODULE-BY-MODULE IMPROVEMENT REFERENCE

## 🎯 HOW TO USE THIS GUIDE

Each module has:

- **Current Status** - What's working now
- **Recommended Improvements** - What to add
- **Implementation Code** - Ready-to-use snippets
- **Testing Checklist** - How to verify
- **Time Estimate** - How long it takes

---

# 🎮 CONTROLLERS (18 Files)

## `controllers/auth.controller.js`

### Current Status

✅ Login/Register/Logout working
✅ JWT token generation
✅ Password hashing with bcrypt

### Recommended Improvements

#### Improvement 1: Account Lockout After Failed Attempts

```javascript
// ADD to loginAttempts object at top
const loginAttempts = new Map(); // username -> { count, lastAttempt }

async login(req, res) {
  const { username, password } = req.body;

  // Check if account is locked
  if (loginAttempts.has(username)) {
    const attempt = loginAttempts.get(username);
    if (attempt.count >= 5) {
      const minutesSinceLast = (Date.now() - attempt.lastAttempt) / (1000*60);
      if (minutesSinceLast < 15) {
        return res.status(429).json({
          error: 'Account locked. Try again in 15 minutes',
          minutesRemaining: Math.ceil(15 - minutesSinceLast)
        });
      }
    }
  }

  // ... rest of login code

  // Reset count on successful login
  loginAttempts.delete(username);
}

// On failed login:
if (loginAttempts.has(username)) {
  const attempt = loginAttempts.get(username);
  attempt.count++;
  attempt.lastAttempt = Date.now();
} else {
  loginAttempts.set(username, { count: 1, lastAttempt: Date.now() });
}
```

**Time:** 15 min | **Impact:** ⭐⭐⭐⭐

#### Improvement 2: Multi-factor Authentication Ready

```javascript
// ADD method for 2FA setup
async setupTwoFactorAuth(req, res) {
  try {
    const speakeasy = require('speakeasy');
    const QRCode = require('qrcode');

    const secret = speakeasy.generateSecret({
      name: `G-VET (${req.user.username})`,
      issuer: 'G-VET System'
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      qrCode: qrCode,
      message: 'Scan with Google Authenticator'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
}

async verifyTwoFactorAuth(req, res) {
  try {
    const { token, secret } = req.body;
    const speakeasy = require('speakeasy');

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Mark 2FA as enabled for user
    await User.update({ twoFactorEnabled: true }, {
      where: { id: req.user.id }
    });

    res.json({ message: '2FA enabled' });
  } catch (error) {
    res.status(500).json({ error: '2FA verification failed' });
  }
}
```

**Time:** 30 min | **Impact:** ⭐⭐⭐⭐⭐ (Security)

---

## `controllers/asset.controller.js`

### Current Status

✅ CRUD operations
✅ Filtering by category/status/location
✅ Pagination support

### Recommended Improvements

#### Improvement 1: Add Depreciation Calculator

```javascript
async calculateDepreciation(req, res) {
  try {
    const { assetId, method = 'straight-line', lifeYears = 5 } = req.query;
    const asset = await Asset.findByPk(assetId);

    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    const yearsOwned = (Date.now() - asset.acquisitionDate) / (1000*60*60*24*365);

    let depreciation = 0;
    if (method === 'straight-line') {
      depreciation = (asset.purchasePrice / lifeYears) * yearsOwned;
    } else if (method === 'double-declining') {
      const rate = 2 / lifeYears;
      depreciation = asset.purchasePrice * (1 - Math.pow(1 - rate, yearsOwned));
    } else if (method === 'sum-of-years') {
      const sumYears = (lifeYears * (lifeYears + 1)) / 2;
      const yearDepreciation = (asset.purchasePrice / sumYears) * (lifeYears - Math.floor(yearsOwned) + 1);
      depreciation = yearDepreciation * yearsOwned;
    }

    const bookValue = asset.purchasePrice - depreciation;

    res.json({
      assetId,
      assetCode: asset.assetCode,
      originalPrice: asset.purchasePrice,
      yearsOwned: yearsOwned.toFixed(2),
      depreciationMethod: method,
      totalDepreciation: depreciation.toFixed(2),
      bookValue: Math.max(0, bookValue).toFixed(2),
      deprecationRate: ((depreciation / asset.purchasePrice) * 100).toFixed(2) + '%'
    });
  } catch (error) {
    res.status(500).json({ error: 'Calculation failed' });
  }
}
```

**Time:** 20 min | **Impact:** ⭐⭐⭐⭐ (Finance tracking)

#### Improvement 2: Bulk Import/Export

```javascript
async exportAssets(req, res) {
  try {
    const { format = 'csv' } = req.query;
    const assets = await Asset.findAll();

    if (format === 'excel') {
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Assets');

      sheet.columns = [
        { header: 'Asset Code', key: 'assetCode' },
        { header: 'Name', key: 'assetName' },
        { header: 'Category', key: 'category' },
        { header: 'Location', key: 'location' },
        { header: 'Status', key: 'status' },
        { header: 'Purchase Price', key: 'purchasePrice' },
        { header: 'Current Value', key: 'currentValue' }
      ];

      assets.forEach(asset => sheet.addRow(asset));

      res.setHeader('Content-Type', 'application/xlsx');
      res.setHeader('Content-Disposition', 'attachment; filename=assets.xlsx');
      await workbook.xlsx.write(res);
    } else if (format === 'csv') {
      const csv = [
        'Asset Code,Name,Category,Location,Status,Purchase Price,Current Value',
        ...assets.map(a =>
          `${a.assetCode},"${a.assetName}",${a.category},${a.location},${a.status},${a.purchasePrice},${a.currentValue}`
        )
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=assets.csv');
      res.send(csv);
    }
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
}
```

**Time:** 25 min | **Impact:** ⭐⭐⭐⭐

---

## `controllers/livestock.controller.js`

### Current Status

✅ CRUD operations
✅ Pagination
✅ Basic filtering

### Recommended Improvements

#### Improvement 1: Health Dashboard

```javascript
async getHealthDashboard(req, res) {
  try {
    const totalAnimals = await Livestock.count();

    const healthStatus = await Livestock.findAll({
      attributes: [
        'healthStatus',
        [sequelize.fn('COUNT', sequelize.col('*')), 'count']
      ],
      group: ['healthStatus'],
      raw: true
    });

    const animalsNeedingVaccines = await Livestock.findAll({
      where: {
        [Op.or]: [
          { lastVaccinationDate: null },
          { lastVaccinationDate: { [Op.lt]: new Date(Date.now() - 365*24*60*60*1000) } }
        ]
      },
      attributes: ['id', 'animalCode', 'name', 'lastVaccinationDate']
    });

    const recentIncidents = await LivestockIncident.findAll({
      order: [['dateOfIncident', 'DESC']],
      limit: 10,
      attributes: ['id', 'livestockId', 'incidentType', 'severity', 'dateOfIncident']
    });

    res.json({
      summary: {
        totalAnimals,
        byHealthStatus: healthStatus
      },
      alerts: {
        needingVaccines: animalsNeedingVaccines.length,
        animals: animalsNeedingVaccines
      },
      recentIncidents
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
}
```

**Time:** 25 min | **Impact:** ⭐⭐⭐⭐⭐

---

## `controllers/livestockCareRecord.controller.js`

### Current Status

✅ CRUD operations
✅ Form validation
✅ PDF generation

### Recommended Improvements

#### Improvement 1: Health Timeline & Trend Analysis

```javascript
async getHealthTimeline(req, res) {
  try {
    const { livestockId, months = 6 } = req.params;
    const dateFrom = new Date(Date.now() - months*30*24*60*60*1000);

    // Get all care records
    const careRecords = await LivestockCareRecord.findAll({
      where: {
        livestockId,
        dateOfCare: { [Op.gte]: dateFrom }
      },
      order: [['dateOfCare', 'ASC']]
    });

    // Get incidents
    const incidents = await LivestockIncident.findAll({
      where: {
        livestockId,
        dateOfIncident: { [Op.gte]: dateFrom }
      },
      order: [['dateOfIncident', 'ASC']]
    });

    // Merge into timeline
    const timeline = [
      ...careRecords.map(r => ({
        date: r.dateOfCare,
        type: 'CARE',
        careType: r.careType,
        description: r.description
      })),
      ...incidents.map(i => ({
        date: i.dateOfIncident,
        type: 'INCIDENT',
        severity: i.severity,
        description: i.description
      }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({ timeline });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
}

async getHealthTrends(req, res) {
  try {
    const { livestockId, months = 12 } = req.query;
    const dateFrom = new Date(Date.now() - months*30*24*60*60*1000);

    // Count care records by type per month
    const trends = await LivestockCareRecord.findAll({
      where: {
        livestockId,
        dateOfCare: { [Op.gte]: dateFrom }
      },
      attributes: [
        'careType',
        [sequelize.fn('MONTH', sequelize.col('dateOfCare')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('*')), 'count']
      ],
      group: ['careType', sequelize.fn('MONTH', sequelize.col('dateOfCare'))],
      raw: true
    });

    res.json({ trends });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
}
```

**Time:** 30 min | **Impact:** ⭐⭐⭐⭐⭐

---

# 🛣️ ROUTES (18 Files)

## `routes/livestock.routes.js`

### Current Status

✅ GET all
✅ GET by ID
✅ POST create
✅ PUT update
✅ DELETE

### Recommended Improvements

#### Improvement 1: Advanced Filtering Routes

```javascript
// ADD these filter routes BEFORE the catch-all router

router.get("/filter/species/:species", verifyToken, (req, res) =>
  livestockController.getAllBySpecies(req, res),
);

router.get("/filter/health-status/:status", verifyToken, (req, res) =>
  livestockController.getByHealthStatus(req, res),
);

router.get("/filter/location/:location", verifyToken, (req, res) =>
  livestockController.getByLocation(req, res),
);

router.get(
  "/filter/date-range",
  verifyToken,
  (req, res) => livestockController.getByDateRange(req, res),
  // ?from=2024-01-01&to=2024-12-31
);
```

**Time:** 10 min per filter | **Impact:** ⭐⭐⭐⭐

#### Improvement 2: Export Routes

```javascript
router.get(
  "/export/csv",
  verifyToken,
  checkRole("admin", "manager"),
  (req, res) => livestockController.exportAsCSV(req, res),
);

router.get(
  "/export/excel",
  verifyToken,
  checkRole("admin", "manager"),
  (req, res) => livestockController.exportAsExcel(req, res),
);

router.post(
  "/import/csv",
  verifyToken,
  checkRole("admin", "manager"),
  upload.single("file"),
  (req, res) => livestockController.importFromCSV(req, res),
);
```

**Time:** 15 min | **Impact:** ⭐⭐⭐⭐

---

# 📦 MODELS (17 Files)

## `models/Livestock.js`

### Current Status

✅ Basic fields
✅ Relationships
✅ Data types

### Recommended Improvements

#### Improvement 1: Add Health Tracking Fields

```javascript
// ADD these fields to the model definition

const Livestock = sequelize.define("Livestock", {
  // ... existing fields ...

  // HEALTH TRACKING
  healthStatus: {
    type: DataTypes.ENUM(
      "Healthy",
      "Sick",
      "Injured",
      "Quarantine",
      "Recovered",
      "Deceased",
    ),
    defaultValue: "Healthy",
    index: true,
    comment: "Current health condition",
  },
  lastHealthCheckDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: "Date of last health inspection",
  },
  lastVaccinationDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: "Date of last vaccination",
  },
  vaccinationRecord: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: "Array of {vaccine, date, veterinarian}",
  },

  // REPRODUCTION
  isReproductiveAge: {
    type: DataTypes.VIRTUAL,
    get() {
      const ageDays =
        (Date.now() - new Date(this.dateOfBirth)) / (1000 * 60 * 60 * 24);
      const ageYears = ageDays / 365;
      return this.gender === "Female" ? ageYears >= 2 : ageYears >= 3;
    },
  },
  lastBreedingDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: "Last breeding/mating date",
  },
  breedingRecords: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: "Array of {date, partnerId, outcome}",
  },
  pregnancyStatus: {
    type: DataTypes.ENUM("Not Pregnant", "Pregnant", "Lactating"),
    defaultValue: "Not Pregnant",
    comment: "Current pregnancy status",
  },
  expectedDeliveryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },

  // ID & TRACKING
  microchipId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true,
    comment: "Electronic ID",
  },
  earTagNumber: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true,
    comment: "Physical ear tag",
  },
  qrCodePath: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: "Path to generated QR code image",
  },
});
```

**Time:** 20 min | **Impact:** ⭐⭐⭐⭐⭐

#### Improvement 2: Add Validation Hooks

```javascript
// ADD these hooks to model

Livestock.addHook("beforeCreate", async (livestock) => {
  // Generate animal code if not provided
  if (!livestock.animalCode) {
    const count = await Livestock.count();
    livestock.animalCode = `C${new Date().getFullYear()}-${(count + 1).toString().padStart(3, "0")}`;
  }

  // Validate dates
  if (livestock.dateOfBirth > new Date()) {
    throw new Error("Date of birth cannot be in future");
  }

  if (livestock.acquisitionDate < livestock.dateOfBirth) {
    throw new Error("Acquisition date must be after birth date");
  }
});

Livestock.addHook("beforeUpdate", (livestock) => {
  // Validate health status changes
  if (livestock.healthStatus === "Deceased" && !livestock.dateOfDeath) {
    throw new Error("Date of death required");
  }
});
```

**Time:** 15 min | **Impact:** ⭐⭐⭐⭐

---

## `models/Inventory.js`

### Current Status

✅ Basic fields
✅ Quantity tracking

### Recommended Improvements

#### Improvement 1: Add Stock Management Fields

```javascript
// ADD to Inventory model

const Inventory = sequelize.define("Inventory", {
  // ... existing fields ...

  // STOCK LEVELS
  quantityOnHand: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    index: true,
    comment: "Current quantity available",
  },
  minimumStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Reorder point - alert when below this",
  },
  maximumStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Storage capacity limit",
  },
  reorderQuantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Suggested quantity to order",
  },

  // PRICING
  unitPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: "Unit selling price",
  },
  unitCost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: "Unit acquisition cost",
  },
  lastPriceUpdate: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  // EXPIRY & BATCH
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    index: true,
    comment: "Product expiration date",
  },
  batchNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    index: true,
    comment: "Batch/Lot number",
  },
  manufacturerName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  // TRACKING
  lastCountDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Last physical count/verification date",
  },
  countDiscrepancy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Difference between recorded & physical count",
  },

  // VIRTUAL STATUS
  stockStatus: {
    type: DataTypes.VIRTUAL,
    get() {
      if (this.expiryDate && new Date(this.expiryDate) < new Date()) {
        return "EXPIRED";
      }
      if (this.quantityOnHand >= this.maximumStockLevel) {
        return "OVERSTOCKED";
      }
      if (this.quantityOnHand <= this.minimumStockLevel) {
        return "LOW";
      }
      return "NORMAL";
    },
  },
});
```

**Time:** 25 min | **Impact:** ⭐⭐⭐⭐⭐

---

# 🔧 SERVICES (5 Files)

## `services/backup.service.js`

### Current Status

✅ Manual backup creation
✅ Restore functionality
✅ Cleanup script

### Recommended Improvements

#### Improvement 1: Scheduled Automatic Backups

```javascript
// ADD at top of backup.service.js
const schedule = require("node-schedule");

class BackupService {
  static initScheduledBackups() {
    // Daily backup at 2 AM
    this.dailyJob = schedule.scheduleJob("0 2 * * *", async () => {
      try {
        const backup = await this.createBackup();
        logger.info(`✅ Scheduled daily backup created: ${backup}`);
      } catch (error) {
        logger.error("❌ Scheduled daily backup failed:", error);
      }
    });

    // Weekly full backup at Sunday 3 AM
    this.weeklyJob = schedule.scheduleJob("0 3 * * 0", async () => {
      try {
        const backup = await this.createFullBackup();
        logger.info(`✅ Scheduled weekly backup created: ${backup}`);
      } catch (error) {
        logger.error("❌ Scheduled weekly backup failed:", error);
      }
    });

    logger.info("✅ Backup scheduler initialized");
  }

  static stopScheduledBackups() {
    if (this.dailyJob) this.dailyJob.cancel();
    if (this.weeklyJob) this.weeklyJob.cancel();
  }

  static async createFullBackup() {
    // Create backup including stored procedures, views, etc
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `gvet_full_backup_${timestamp}.sql`;
    return this.createBackup(filename, "--all-databases --routines");
  }

  static async verifyBackupIntegrity(backupFile) {
    // Test if backup can be restored
    try {
      const tempDb = "gvet_test_restore";
      await this.restoreToDatabase(backupFile, tempDb);
      // Drop test database
      await sequelize.query(`DROP DATABASE ${tempDb}`);
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

// Initialize on server start
BackupService.initScheduledBackups();
```

**Time:** 30 min | **Impact:** ⭐⭐⭐⭐⭐ (Critical for data safety)

---

## `services/pdf.service.js`

### Current Status

✅ Care record PDF
✅ Incident PDF
✅ Disposal PDF

### Recommended Improvements

#### Improvement 1: QR Code Labels

```javascript
// ADD to pdf.service.js
const QRCode = require('qrcode');

async generateQRCodeLabel(livestockId, animalData) {
  try {
    const filepath = path.join(__dirname, '../uploads/qrcodes', `${livestockId}.png`);

    const qrData = JSON.stringify({
      id: livestockId,
      code: animalData.animalCode,
      name: animalData.name,
      species: animalData.species,
      generated: new Date().toISOString()
    });

    await QRCode.toFile(filepath, qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    logger.info(`QR code generated: ${filepath}`);
    return filepath;
  } catch (error) {
    logger.error('QR code generation failed:', error);
    throw error;
  }
}

async generateBarcodeLabel(animalCode) {
  try {
    const bwipjs = require('bwip-js');
    const filepath = path.join(__dirname, '../uploads/barcodes', `${animalCode}.png`);

    const png = await bwipjs.toBuffer({
      bcid: 'code128',
      text: animalCode,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center'
    });

    fs.writeFileSync(filepath, png);
    return filepath;
  } catch (error) {
    logger.error('Barcode generation failed:', error);
    throw error;
  }
}
```

**Time:** 25 min | **Impact:** ⭐⭐⭐⭐

---

# 🎨 FRONTEND (29 HTML Files)

## Template: How to Update Every HTML File

### Step 1: Add Script Imports (at bottom of </body>)

```html
<script src="/static/js/api-client.js"></script>
<script src="/static/js/form-handler.js"></script>
<script src="/static/js/data-table.js"></script>
```

### Step 2: Initialize Form Handler

```html
<script>
  document.addEventListener("DOMContentLoaded", () => {
    // For pages with forms
    const formHandler = new FormHandler(
      "#livestock-form", // Form selector
      "/livestock", // API endpoint
      "POST", // HTTP method
    );
  });
</script>
```

### Step 3: Initialize Data Table

```html
<script>
  document.addEventListener("DOMContentLoaded", () => {
    // For pages with lists
    const table = new DataTable(
      "#data-table", // Container selector
      [
        // Columns
        { label: "Code", key: "animalCode" },
        { label: "Species", key: "species" },
        { label: "Status", key: "healthStatus" },
      ],
      "/livestock", // API endpoint
    );
  });
</script>
```

### Example: `livestock-register.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- existing head content -->
  </head>
  <body>
    <!-- existing body content -->

    <form id="livestock-form" class="space-y-4">
      <input type="text" name="animalCode" placeholder="Animal Code" required />
      <select name="species" required>
        <option value="">Select Species</option>
        <option value="Cattle">Cattle</option>
      </select>
      <!-- more fields -->
      <button type="submit" class="btn btn-primary">Register</button>
    </form>

    <!-- Scripts -->
    <script src="/static/js/api-client.js"></script>
    <script src="/static/js/form-handler.js"></script>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        new FormHandler("#livestock-form", "/livestock", "POST");
      });
    </script>
  </body>
</html>
```

**Time per file:** 2 minutes · **Total for 29 files:** 2 hours

---

# 🗄️ DATABASE

## `database/migrate.js`

### Current Status

✅ Creates tables
✅ Sets up associations

### Recommended Improvements

#### Improvement 1: Add Indexes & Verification

```javascript
// REPLACE startDatabaseMigration function

async function startDatabaseMigration() {
  try {
    logger.info("🔄 Starting database migration...");

    // Test connection
    await sequelize.authenticate();
    logger.info("✅ Database connection successful");

    // Sync models
    await sequelize.sync({ alter: true });

    // Create indexes
    logger.info("📑 Creating performance indexes...");
    await createIndexes();

    // Verify schema
    logger.info("🔍 Verifying schema integrity...");
    const issues = await verifySchema();
    if (issues.length > 0) {
      logger.warn("⚠️ Schema issues detected:", issues);
    }

    // Log completion
    const modelCount = Object.keys(sequelize.models).length;
    logger.info(`✅ Migration complete - ${modelCount} models`);

    return true;
  } catch (error) {
    logger.error("❌ Migration failed:", error);
    throw error;
  }
}

async function createIndexes() {
  const queries = [
    "ALTER TABLE Livestock ADD INDEX idx_animalCode (animalCode)",
    "ALTER TABLE Livestock ADD INDEX idx_healthStatus (healthStatus)",
    "ALTER TABLE Livestock ADD INDEX idx_species (species)",
    "ALTER TABLE Livestock ADD INDEX idx_location (location)",
    "ALTER TABLE Asset ADD INDEX idx_assetCode (assetCode)",
    "ALTER TABLE Asset ADD INDEX idx_status (status)",
    "ALTER TABLE Inventory ADD INDEX idx_itemCode (itemCode)",
    "ALTER TABLE Inventory ADD INDEX idx_batchNumber (batchNumber)",
    "ALTER TABLE AuditLog ADD INDEX idx_userId (userId)",
    "ALTER TABLE AuditLog ADD INDEX idx_createdAt (createdAt)",
  ];

  for (const query of queries) {
    try {
      await sequelize.query(query);
    } catch (err) {
      // Index already exists - not an error
      if (!err.message.includes("Duplicate key")) {
        logger.warn(`Index creation warning: ${err.message}`);
      }
    }
  }
}

async function verifySchema() {
  const issues = [];

  // Add validation checks here
  const livestockColumns = await sequelize.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='Livestock'",
    { raw: true },
  );

  const requiredColumns = ["animalCode", "species", "healthStatus"];
  requiredColumns.forEach((col) => {
    if (!livestockColumns.some((c) => c.COLUMN_NAME === col)) {
      issues.push(`Livestock.${col} missing`);
    }
  });

  return issues;
}
```

**Time:** 20 min | **Impact:** ⭐⭐⭐⭐

---

# ✅ QUICK REFERENCE TABLE

| Module               | Improvements                           | Time      | Priority | Files Affected |
| -------------------- | -------------------------------------- | --------- | -------- | -------------- |
| **Controllers** (18) | Health tracking, Analytics, Reporting  | 6 hours   | CRITICAL | All 18         |
| **Routes** (18)      | Validation, Filtering, Rate limit      | 2 hours   | HIGH     | All 18         |
| **Models** (17)      | Indexes, Scopes, Health fields         | 2 hours   | HIGH     | 5-7 main       |
| **Services** (5)     | Backup scheduling, QR codes, Templates | 2 hours   | MEDIUM   | All 5          |
| **Frontend** (29)    | API integration, Forms, Tables         | 5 hours   | CRITICAL | All 29         |
| **Config**           | Logging, Caching, Validation           | 1.5 hours | HIGH     | 3 files        |
| **Database**         | Indexes, Verification                  | 1 hour    | MEDIUM   | 2 files        |

**TOTAL: ~20 hours for comprehensive improvements**

---

# 🚀 START HERE

1. **30 MIN:** Read this document
2. **2 MIN:** Choose a module above
3. **COPY:** Implementation code from section
4. **PASTE:** Into your file
5. **TEST:** Using testing checklist
6. **NEXT:** Move to next improvement

Pick ANY improvement and start coding! 🎉
