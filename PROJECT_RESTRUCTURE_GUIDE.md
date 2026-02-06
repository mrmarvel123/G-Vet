# 📁 G-VET PROJECT RESTRUCTURE GUIDE

## Hybrid Domain-Driven Architecture

---

## ✅ NEW FOLDER STRUCTURE

```
G-Vet/
├── src/                           # Backend source code
│   ├── modules/                   # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validator.js
│   │   │
│   │   ├── kew-pa/               # Asset Management Module
│   │   │   ├── controllers/
│   │   │   │   └── asset.controller.js
│   │   │   ├── routes/
│   │   │   │   └── asset.routes.js
│   │   │   ├── models/
│   │   │   │   └── Asset.js
│   │   │   └── validators/
│   │   │       └── asset.validator.js
│   │   │
│   │   ├── kew-ps/               # Store & Inventory Module
│   │   │   ├── controllers/
│   │   │   │   ├── inventory.controller.js
│   │   │   │   ├── inventoryRejection.controller.js
│   │   │   │   └── inventoryDisposal.controller.js
│   │   │   ├── routes/
│   │   │   ├── models/
│   │   │   │   ├── Inventory.js
│   │   │   │   ├── InventoryRejection.js
│   │   │   │   └── InventoryDisposal.js
│   │   │   └── validators/
│   │   │
│   │   ├── kew-ah/               # Livestock Management Module
│   │   │   ├── controllers/
│   │   │   │   ├── livestock.controller.js
│   │   │   │   ├── livestockCareRecord.controller.js
│   │   │   │   ├── livestockIncident.controller.js
│   │   │   │   ├── livestockMovement.controller.js
│   │   │   │   ├── livestockTransfer.controller.js
│   │   │   │   ├── livestockDisposal.controller.js
│   │   │   │   ├── livestockInspection.controller.js
│   │   │   │   ├── livestockLoss.controller.js
│   │   │   │   ├── livestockCategoryB.controller.js
│   │   │   │   └── animalRejection.controller.js
│   │   │   ├── routes/
│   │   │   ├── models/
│   │   │   │   ├── Livestock.js
│   │   │   │   ├── LivestockCareRecord.js
│   │   │   │   ├── LivestockIncident.js
│   │   │   │   └── (other models...)
│   │   │   └── validators/
│   │   │
│   │   └── core/                 # Core features (shared across modules)
│   │       ├── controllers/
│   │       │   ├── user.controller.js
│   │       │   ├── audit.controller.js
│   │       │   └── report.controller.js
│   │       ├── routes/
│   │       ├── models/
│   │       │   ├── User.js
│   │       │   ├── AuditLog.js
│   │       │   └── index.js
│   │       └── validators/
│   │
│   ├── shared/                    # Shared utilities & middleware
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── audit.js
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── services/              # Business logic services
│   │   │   ├── pdf.service.js
│   │   │   ├── email.service.js
│   │   │   ├── upload.service.js
│   │   │   ├── backup.service.js
│   │   │   └── kew-form.converter.js
│   │   │
│   │   ├── utils/                 # Helper functions
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── generators.js
│   │   │
│   │   ├── constants/             # Application constants
│   │   │   ├── roles.js
│   │   │   ├── statuses.js
│   │   │   └── enums.js
│   │   │
│   │   ├── helpers/               # Helper modules
│   │   │   ├── errorHandler.js
│   │   │   ├── responseFormatter.js
│   │   │   └── logger.js
│   │   │
│   │   └── types/                 # TypeScript-like type definitions
│   │       ├── livestock.types.js
│   │       ├── asset.types.js
│   │       └── inventory.types.js
│   │
│   ├── config/                    # Configuration files
│   │   ├── database.js
│   │   ├── logger.js
│   │   └── environment.js
│   │
│   ├── database/                  # Database scripts
│   │   ├── models/
│   │   │   └── index.js           # Central model export
│   │   ├── migrate.js
│   │   ├── seed.js
│   │   └── associations.js
│   │
│   └── app.js                     # Express app initialization
│
├── public/                        # Frontend (static files & HTML)
│   ├── index.html
│   ├── dashboard.html
│   ├── static/
│   │   ├── css/
│   │   │   ├── styles.css
│   │   │   └── tailwind.css
│   │   ├── js/
│   │   │   ├── api-client.js      # API communication
│   │   │   ├── form-handler.js    # Form management
│   │   │   ├── data-table.js      # Table rendering
│   │   │   ├── components/
│   │   │   │   ├── navbar.js
│   │   │   │   ├── sidebar.js
│   │   │   │   └── modal.js
│   │   │   ├── pages/
│   │   │   │   ├── livestock.js
│   │   │   │   ├── dashboard.js
│   │   │   │   └── reports.js
│   │   │   └── utils/
│   │   │       ├── validators.js
│   │   │       ├── formatters.js
│   │   │       └── storage.js
│   │   └── images/
│   │
│   └── modules/                   # Module-specific HTML pages
│       ├── kew-pa/
│       │   ├── asset-registration.html
│       │   ├── asset-movement.html
│       │   └── asset-inspection.html
│       ├── kew-ps/
│       │   ├── inventory.html
│       │   ├── store-receipt.html
│       │   └── stock-control.html
│       └── kew-ah/
│           ├── livestock-register.html
│           ├── livestock-care.html
│           └── livestock-incidents.html
│
├── scripts/                       # Utility scripts
│   ├── migrate.js
│   ├── seed.js
│   ├── backup.js
│   ├── restore.js
│   ├── validate-env.js            # NEW: Environment validation
│   └── refactor-migrate.js         # NEW: Migration helper
│
├── logs/                          # Application logs
│   ├── app.log
│   ├── error.log
│   └── audit.log
│
├── uploads/                       # User uploads
│   ├── assets/
│   ├── documents/
│   ├── livestock/
│   ├── qrcodes/
│   └── barcodes/
│
├── backups/                       # Database backups
│   └── gvet_backup_*.sql
│
├── .env                          # Environment variables
├── .env.example                  # Example env file
├── .gitignore
├── server.js                     # Main server entry point (REFACTORED)
├── package.json                  # Dependencies
├── package-lock.json
├── README.md
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
└── (documentation files)
```

---

## 🔄 MIGRATION STEPS

### Step 1: Copy Configuration Files

```bash
# Copy config files to src/config/
cp config/database.js src/config/
cp config/logger.js src/config/

# Create environment config
cp .env.example src/config/.env.example
```

### Step 2: Organize Shared Resources

```bash
# Copy middleware
cp middleware/auth.js src/shared/middleware/
cp middleware/audit.js src/shared/middleware/

# Copy services
cp services/*.js src/shared/services/

# Create constants
mkdir -p src/shared/constants
```

### Step 3: Organize by Module

#### KEW.PA (Asset Management)

```bash
mkdir -p src/modules/kew-pa/{controllers,routes,models,validators}

# Move asset-related files
cp controllers/asset.controller.js src/modules/kew-pa/controllers/
cp routes/asset.routes.js src/modules/kew-pa/routes/
cp models/Asset.js src/modules/kew-pa/models/
cp validators/asset.validator.js src/modules/kew-pa/validators/
```

#### KEW.PS (Store & Inventory)

```bash
mkdir -p src/modules/kew-ps/{controllers,routes,models,validators}

# Move inventory-related files
cp controllers/inventory.controller.js src/modules/kew-ps/controllers/
cp controllers/inventoryRejection.controller.js src/modules/kew-ps/controllers/
cp controllers/inventoryDisposal.controller.js src/modules/kew-ps/controllers/
cp routes/inventory.routes.js src/modules/kew-ps/routes/
cp routes/inventoryRejection.routes.js src/modules/kew-ps/routes/
cp routes/inventoryDisposal.routes.js src/modules/kew-ps/routes/
cp models/Inventory.js src/modules/kew-ps/models/
cp models/InventoryRejection.js src/modules/kew-ps/models/
cp models/InventoryDisposal.js src/modules/kew-ps/models/
cp validators/inventory.validator.js src/modules/kew-ps/validators/
```

#### KEW.AH (Livestock Management)

```bash
mkdir -p src/modules/kew-ah/{controllers,routes,models,validators}

# Move livestock-related files (9 controllers)
cp controllers/livestock.controller.js src/modules/kew-ah/controllers/
cp controllers/livestockCareRecord.controller.js src/modules/kew-ah/controllers/
cp controllers/livestockIncident.controller.js src/modules/kew-ah/controllers/
cp controllers/livestockMovement.controller.js src/modules/kew-ah/controllers/
cp controllers/livestockTransfer.controller.js src/modules/kew-ah/controllers/
cp controllers/livestockDisposal.controller.js src/modules/kew-ah/controllers/
cp controllers/livestockInspection.controller.js src/modules/kew-ah/controllers/
cp controllers/livestockLoss.controller.js src/modules/kew-ah/controllers/
cp controllers/livestockCategoryB.controller.js src/modules/kew-ah/controllers/
cp controllers/animalRejection.controller.js src/modules/kew-ah/controllers/

# Move routes (similar structure)
cp routes/livestock*.routes.js src/modules/kew-ah/routes/
cp routes/animalRejection.routes.js src/modules/kew-ah/routes/

# Move models
cp models/Livestock.js src/modules/kew-ah/models/
cp models/LivestockCareRecord.js src/modules/kew-ah/models/
cp models/LivestockIncident.js src/modules/kew-ah/models/
# ... (other livestock models)

# Move validators
cp validators/livestock.validator.js src/modules/kew-ah/validators/
```

#### Core Module (User, Audit, Reports)

```bash
mkdir -p src/modules/core/{controllers,routes,models,validators}

cp controllers/user.controller.js src/modules/core/controllers/
cp controllers/audit.controller.js src/modules/core/controllers/
cp controllers/report.controller.js src/modules/core/controllers/
cp controllers/auth.controller.js src/modules/auth/
cp routes/user.routes.js src/modules/core/routes/
cp routes/audit.routes.js src/modules/core/routes/
cp routes/report.routes.js src/modules/core/routes/
cp routes/auth.routes.js src/modules/auth/
cp models/User.js src/modules/core/models/
cp models/AuditLog.js src/modules/core/models/
```

### Step 4: Organize Frontend

```bash
# Move existing HTML files to public/
cp index.html public/
cp dashboard.html public/
cp veterinary-care.html public/modules/kew-ah/
cp livestock-register.html public/modules/kew-ah/
cp asset-*.html public/modules/kew-pa/
cp inventory.html public/modules/kew-ps/
# ... (move all HTML files)

# Move static files
cp -r static/js/* public/static/js/
cp -r static/images/* public/static/images/
```

### Step 5: Update server.js

```javascript
// BEFORE (old structure)
const assetRoutes = require("./routes/asset.routes");
const livestockRoutes = require("./routes/livestock.routes");
app.use("/api/v1/assets", assetRoutes);

// AFTER (new structure)
const assetRoutes = require("./src/modules/kew-pa/routes/asset.routes");
const livestockRoutes = require("./src/modules/kew-ah/routes/livestock.routes");
app.use("/api/v1/assets", assetRoutes);
```

---

## 📋 MODULE ORGANIZATION DETAILS

### Auth Module (`src/modules/auth/`)

```
auth/
├── auth.controller.js    # Login, Register, Refresh, Logout
├── auth.routes.js        # Auth endpoints
└── auth.validator.js     # Authentication validation schemas
```

### KEW.PA Module (`src/modules/kew-pa/`)

```
kew-pa/
├── controllers/
│   └── asset.controller.js
├── routes/
│   └── asset.routes.js
├── models/
│   └── Asset.js
├── validators/
│   └── asset.validator.js
└── index.js              # Module export
```

### KEW.PS Module (`src/modules/kew-ps/`)

```
kew-ps/
├── controllers/
│   ├── inventory.controller.js
│   ├── inventoryRejection.controller.js
│   └── inventoryDisposal.controller.js
├── routes/
│   ├── inventory.routes.js
│   ├── inventoryRejection.routes.js
│   └── inventoryDisposal.routes.js
├── models/
│   ├── Inventory.js
│   ├── InventoryRejection.js
│   └── InventoryDisposal.js
├── validators/
│   └── inventory.validator.js
└── index.js
```

### KEW.AH Module (`src/modules/kew-ah/`)

```
kew-ah/
├── controllers/
│   ├── livestock.controller.js
│   ├── livestockCareRecord.controller.js
│   ├── livestockIncident.controller.js
│   ├── livestockMovement.controller.js
│   ├── livestockTransfer.controller.js
│   ├── livestockDisposal.controller.js
│   ├── livestockInspection.controller.js
│   ├── livestockLoss.controller.js
│   ├── livestockCategoryB.controller.js
│   └── animalRejection.controller.js
├── routes/
│   ├── livestock.routes.js
│   ├── livestockCareRecord.routes.js
│   ├── livestockIncident.routes.js
│   ├── livestockMovement.routes.js
│   ├── livestockTransfer.routes.js
│   ├── livestockDisposal.routes.js
│   ├── livestockInspection.routes.js
│   ├── livestockLoss.routes.js
│   ├── livestockCategoryB.routes.js
│   └── animalRejection.routes.js
├── models/
│   ├── Livestock.js
│   ├── LivestockCareRecord.js
│   ├── LivestockIncident.js
│   ├── LivestockMovement.js
│   ├── LivestockTransfer.js
│   ├── LivestockDisposal.js
│   ├── LivestockInspection.js
│   ├── LivestockLoss.js
│   ├── LivestockCategoryB.js
│   └── AnimalRejection.js
├── validators/
│   ├── livestock.validator.js
│   ├── livestockCareRecord.validator.js
│   └── (other validators)
└── index.js
```

### Core Module (`src/modules/core/`)

```
core/
├── controllers/
│   ├── user.controller.js
│   ├── audit.controller.js
│   └── report.controller.js
├── routes/
│   ├── user.routes.js
│   ├── audit.routes.js
│   └── report.routes.js
├── models/
│   ├── User.js
│   ├── AuditLog.js
│   └── index.js
├── validators/
│   └── user.validator.js
└── index.js
```

---

## 📝 REFACTORED FILE EXAMPLES

### Module Export (`src/modules/kew-pa/index.js`)

```javascript
// src/modules/kew-pa/index.js
module.exports = {
  routes: require("./routes"),
  controllers: require("./controllers"),
  models: require("./models"),
  validators: require("./validators"),
};
```

### Refactored server.js

```javascript
// server.js (REFACTORED)
const express = require("express");
const app = express();

// Import middleware
const { verifyToken, checkRole } = require("./src/shared/middleware/auth");
const { auditLog } = require("./src/shared/middleware/audit");

// Import modules
const authModule = require("./src/modules/auth");
const kewPAModule = require("./src/modules/kew-pa");
const kewPSModule = require("./src/modules/kew-ps");
const kewAHModule = require("./src/modules/kew-ah");
const coreModule = require("./src/modules/core");

// Register routes
app.use("/api/v1/auth", authModule.routes);
app.use("/api/v1/assets", kewPAModule.routes);
app.use("/api/v1/inventory", kewPSModule.routes);
app.use("/api/v1/livestock", kewAHModule.routes);
app.use("/api/v1/users", coreModule.routes);

// Serve public folder
app.use(express.static("public"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Refactored Controller (`src/modules/kew-ah/controllers/livestock.controller.js`)

```javascript
// src/modules/kew-ah/controllers/livestock.controller.js
const { Livestock } = require("./../../database/models");
const logger = require("./../../config/logger");
const { handleError } = require("./../../shared/helpers/errorHandler");

class LivestockController {
  async getAll(req, res) {
    try {
      // Controller logic
    } catch (error) {
      handleError(error, res, logger);
    }
  }
}

module.exports = new LivestockController();
```

### Shared Service (`src/shared/services`)

```javascript
// src/shared/services/pdf.service.js
const logger = require("./../../config/logger");

class PDFService {
  async generateReport(data) {
    // PDF generation logic
  }
}

module.exports = new PDFService();
```

---

## 🔐 Import Path Updates

### Old Imports

```javascript
const { Livestock } = require("../models");
const logger = require("../config/logger");
const pdfService = require("../services/pdf.service");
```

### New Imports

```javascript
// From KEW.AH controller
const { Livestock } = require("../../database/models");
const logger = require("../../config/logger");
const pdfService = require("../../shared/services/pdf.service");

// From KEW.PA controller
const { Asset } = require("../../database/models");
const logger = require("../../config/logger");

// From KEW.PS controller
const { Inventory } = require("../../database/models");
const logger = require("../../config/logger");
```

---

## ✅ MIGRATION CHECKLIST

- [ ] Create new directory structure
- [ ] Copy configuration files
- [ ] Organize middleware & services
- [ ] Move KEW.PA (Asset) files
- [ ] Move KEW.PS (Inventory) files
- [ ] Move KEW.AH (Livestock) files
- [ ] Move Core (User, Audit, Report) files
- [ ] Move Auth module files
- [ ] Create index.js exports for each module
- [ ] Update server.js imports
- [ ] Update all controller imports
- [ ] Update all route imports
- [ ] Update database model imports
- [ ] Move public/frontend files
- [ ] Test all endpoints
- [ ] Update documentation
- [ ] Delete old directories (keep backup)

---

## 🧪 VERIFICATION

After restructuring, verify:

```bash
# Test server starts
npm start

# Check endpoints (each should return data or 401)
curl http://localhost:3000/api/v1/auth/me
curl http://localhost:3000/api/v1/livestock
curl http://localhost:3000/api/v1/assets
curl http://localhost:3000/api/v1/inventory

# Check frontend loads
curl http://localhost:3000/dashboard.html
```

---

## 📚 BENEFITS OF THIS STRUCTURE

✅ **Clear Organization** - Easy to find code
✅ **Scalability** - Add new modules without affecting existing ones
✅ **Separation of Concerns** - Each module is self-contained
✅ **Reusability** - Shared utilities available to all modules
✅ **Maintainability** - Easier to understand and modify
✅ **Testing** - Test modules independently
✅ **Deployment** - Can deploy modules separately if needed
✅ **Team Collaboration** - Multiple developers can work on different modules

---

## 🚀 NEXT STEPS

1. Execute migration following steps above
2. Test all endpoints work correctly
3. Update CI/CD pipeline if needed
4. Commit to repository with message: "refactor: restructure project with domain-driven architecture"
5. Update team documentation
