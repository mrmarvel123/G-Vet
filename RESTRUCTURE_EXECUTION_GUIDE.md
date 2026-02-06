# 🚀 G-VET PROJECT RESTRUCTURE - EXECUTION GUIDE

## Overview

This guide walks you through restructuring the G-Vet project from a flat structure to a domain-driven architecture.

**Time Estimate:** 30-60 minutes (mostly automated)
**Risk Level:** Low (original files preserved)
**Rollback:** Easy (backup created automatically)

---

## Phase 1: Preparation (5 minutes)

### Step 1.1: Read the Architecture Guide

```bash
cat PROJECT_RESTRUCTURE_GUIDE.md
```

This shows the target structure and explains benefits.

### Step 1.2: Verify Current State

```bash
# Check you have all files
ls -la controllers/ | wc -l      # Should show 18 controller files
ls -la routes/ | wc -l            # Should show 18 route files
ls -la models/ | wc -l            # Should show 17 model files
ls -la services/ | wc -l          # Should show 5 service files
ls -la middleware/ | wc -l        # Should show 2 middleware files
```

### Step 1.3: Create a Git Branch (Optional but Recommended)

```bash
git checkout -b refactor/domain-driven-architecture
```

---

## Phase 2: Dry Run (10 minutes)

### Step 2.1: Test Migration Script

```bash
# Run migration in DRY RUN mode (no files modified)
npm run refactor:migrate:dry
```

**Expected Output:**

```
╔════════════════════════════════════════════════════════════╗
║    G-VET PROJECT RESTRUCTURE MIGRATION SCRIPT               ║
║    Domain-Driven Architecture Migration                    ║
╚════════════════════════════════════════════════════════════╝

⚠️  DRY RUN MODE - No files will be modified

[1/5] Migrating KEW.PA (Asset Management)...
✓ Copied: controllers/asset.controller.js → src/modules/kew-pa/controllers/asset.controller.js
⚙ Updated imports: src/modules/kew-pa/controllers/asset.controller.js
...
```

### Step 2.2: Review Output

- Check all files are being migrated correctly
- Note any errors or missing files
- If satisfied, proceed to live migration

### Step 2.3: Verify Target Directories Exist

```bash
# Confirm new directory structure was created
ls -la src/modules/
# Output: auth kew-ah kew-pa kew-ps core

ls -la src/shared/
# Output: middleware services utils constants helpers types

ls -la public/modules/
# Output: kew-ah kew-pa kew-ps
```

---

## Phase 3: Backup (5 minutes)

### Step 3.1: Create Backup with Migration

```bash
# This combines backup creation with actual migration
npm run refactor:migrate:backup
```

This will:

1. Create a backup directory: `backup-YYYY-MM-DD/`
2. Copy all old directories there
3. Perform the actual migration
4. Leave you with both old and new structures

### Step 3.2: Verify Backup

```bash
ls -la backup-*/
# Should see: controllers/ routes/ models/ middleware/ services/ validators/

# Backup is safe to delete after confirming everything works
```

---

## Phase 4: Execute Migration (5-10 minutes)

### Step 4.1: Run Migration Script

```bash
npm run refactor:migrate
```

**Expected Output:**

```
╔════════════════════════════════════════════════════════════╗
║    G-VET PROJECT RESTRUCTURE MIGRATION SCRIPT               ║
║    Domain-Driven Architecture Migration                    ║
╚════════════════════════════════════════════════════════════╝

[1/5] Migrating KEW.PA (Asset Management)...
✓ Copied: controllers/asset.controller.js → src/modules/kew-pa/controllers/asset.controller.js
✓ Copied: routes/asset.routes.js → src/modules/kew-pa/routes/asset.routes.js
✓ Copied: models/Asset.js → src/modules/kew-pa/models/Asset.js
✓ Copied: validators/asset.validator.js → src/modules/kew-pa/validators/asset.validator.js
⚙ Updated imports: src/modules/kew-pa/controllers/asset.controller.js

[2/5] Migrating KEW.PS (Store & Inventory)...
... (similar output)

[3/5] Migrating KEW.AH (Livestock Management)...
... (similar output)

[4/5] Migrating Core Module (User, Audit, Report)...
... (similar output)

[5/5] Migrating Auth Module...
... (similar output)

[Shared] Migrating Middleware & Services...
... (similar output)

[Frontend] Migrating HTML & Static Files...
... (similar output)

[Indexes] Creating module index.js files...
... (similar output)

[server.js] Updating route imports...
✓ Updated: server.js

╔════════════════════════════════════════════════════════════╗
║                  MIGRATION COMPLETE                        ║
╚════════════════════════════════════════════════════════════╝

📋 Next Steps:
   1. Review the updated files for any import errors
   2. Test with: npm start
   3. Run tests: npm test
   4. Commit: git add . && git commit -m "refactor: restructure with domain-driven architecture"
   5. Optional: Delete old directories (after confirming everything works)
```

### Step 4.2: Monitor Progress

The script will output progress as it processes each module. This should take 2-5 minutes.

---

## Phase 5: Verification (10-15 minutes)

### Step 5.1: Check Directory Structure

```bash
# Verify new structure is in place
tree -L 3 src/
tree -L 3 public/

# Or use ls with find
find src -type d | head -20
find public -type d | head -20
```

**Expected:**

```
src/
├── modules/
│   ├── auth/
│   ├── kew-pa/          ✓
│   ├── kew-ps/          ✓
│   ├── kew-ah/          ✓
│   └── core/            ✓
├── shared/
│   ├── middleware/      ✓
│   ├── services/        ✓
│   └── (other folders)
├── config/              ✓
└── database/            ✓

public/
├── modules/
│   ├── kew-pa/          ✓
│   ├── kew-ps/          ✓
│   └── kew-ah/          ✓
├── static/              ✓
└── (HTML files)
```

### Step 5.2: Test Server Start

```bash
# Install dependencies if needed
npm install

# Start server in development mode
npm run dev
```

**Expected Output:**

```
📦 G-Vet Management System
🚀 Server started on http://localhost:3000
📡 WebSocket server ready
📚 API Documentation: http://localhost:3000/api/v1
🏥 Health check: http://localhost:3000/api/health

Database connected
Models synchronized
Ready to accept requests
```

### Step 5.3: Test API Endpoints

In another terminal, run these health checks:

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test auth endpoint (should work without token)
curl http://localhost:3000/api/v1/auth/status

# You can't test other endpoints without a token, but the server should respond
# If you get "Cannot POST /api/v1/livestock" instead of a 404, everything is working
```

**Expected Health Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "environment": "development",
  "database": "connected"
}
```

### Step 5.4: Check Imports (Optional)

Review a few migrated files to ensure imports were updated correctly:

```bash
# Check a controller
head -20 src/modules/kew-ah/controllers/livestock.controller.js

# Check a route file
head -20 src/modules/kew-ah/routes/livestock.routes.js

# Check server.js
grep "require('./src/modules" server.js | head -10
```

---

## Phase 6: Cleanup (5-10 minutes)

### Step 6.1: Verify Old Files Can Be Deleted

```bash
# List old directories (safe to delete only after ✅ tests pass)
ls -d controllers/ routes/ models/ middleware/ services/ validators/
```

### Step 6.2: Delete Old Directories (Optional)

```bash
# ONLY after confirming server works perfectly!
rm -rf controllers/
rm -rf routes/
rm -rf models/
rm -rf middleware/
rm -rf services/
rm -rf validators/

# Verify they're gone
ls -la | grep -E "^d.*controllers|^d.*routes|^d.*models"
# Should return nothing if deleted successfully
```

### Step 6.3: Commit Changes

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "refactor: restructure project with domain-driven architecture

- Reorganize backend code into modules (auth, kew-pa, kew-ps, kew-ah, core)
- Separate shared utilities (middleware, services, helpers, types)
- Consolidate configuration and database files
- Reorganize frontend into module-specific directories
- Update all import paths to match new structure
- Create module index files for easier imports
- Add migration scripts for future refactoring"

# Push to remote
git push -u origin refactor/domain-driven-architecture
```

---

## Phase 7: Switch to New Structure (5 minutes)

### Step 7.1: Update package.json Scripts (if not auto-updated)

Ensure these scripts are in your `package.json`:

```json
{
  "scripts": {
    "refactor:migrate": "node scripts/refactor-migrate.js",
    "refactor:migrate:dry": "node scripts/refactor-migrate.js --dry-run",
    "refactor:migrate:backup": "node scripts/refactor-migrate.js --backup"
  }
}
```

### Step 7.2: Update Nodemon Config (Optional)

If watching source files, update `.nodemon.json` or `package.json`:

```json
{
  "nodemonConfig": {
    "watch": ["src", "server.js"],
    "ignore": ["uploads/*", "logs/*", "backups/*"]
  }
}
```

### Step 7.3: Update Documentation

```bash
# Update README with new structure
# Update CI/CD if applicable
# Update deployment docs
```

---

## Phase 8: Testing (10-20 minutes) - CRITICAL

### Step 8.1: Manual Testing

```bash
# 1. Start the server
npm run dev

# 2. In another terminal, test endpoints
# Health check
curl http://localhost:3000/api/health

# 3. Test HTML page loading
curl http://localhost:3000/dashboard.html

# 4. Open browser and navigate
# - http://localhost:3000/
# - http://localhost:3000/dashboard.html
# - Check browser console for any 404 errors on assets
```

### Step 8.2: Automated Testing (Optional)

```bash
# Run existing test suite
npm test

# Run specific test suites
npm run test:integration
```

### Step 8.3: Integration Testing

```bash
# Test main workflows
# 1. Can login (auth module)
# 2. Can view livestock (kew-ah module)
# 3. Can view inventory (kew-ps module)
# 4. Can view assets (kew-pa module)
# 5. Can access reports (core module)
```

---

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**

```bash
# Check that imports were updated correctly
# If they weren't, manually update:
# Old: require('../models')
# New: require('../../database/models')

# Or rerun migration
npm run refactor:migrate
```

### Issue: Server won't start

**Solution:**

```bash
# 1. Check logs
tail -f logs/error.log

# 2. Verify database connection
# Check .env file and database is running

# 3. Check node_modules are installed
npm install

# 4. Check for syntax errors
npm run lint
```

### Issue: Some files weren't migrated

**Solution:**

```bash
# Check if file exists in old location
ls controllers/yourfile.controller.js

# Manually move it
cp controllers/yourfile.controller.js src/modules/*/controllers/

# Update its imports
# Then restart server
```

### Issue: Frontend files not loading

**Solution:**

```bash
# Check that HTML files are in public folder
ls public/dashboard.html
ls public/modules/kew-ah/

# Check that static assets are being served
curl -v http://localhost:3000/static/js/

# If CSS/JS 404s, ensure paths in HTML are correct:
<!-- OLD: <script src="./static/js/app.js"> -->
<!-- NEW: <script src="/static/js/app.js"> -->
```

---

## Success Checklist

✅ All files migrated to new structure
✅ Server starts without errors
✅ Health endpoint returns 200
✅ Dashboard loads in browser
✅ No console errors for missing assets
✅ API endpoints accessible (require auth)
✅ WebSocket connections work
✅ Database models synchronized
✅ Old directories backed up
✅ Changes committed to git
✅ All tests passing

---

## Rollback Plan

If something goes wrong, you can easily rollback:

```bash
# Option 1: Restore from backup directory
cp -r backup-YYYY-MM-DD/controllers .
cp -r backup-YYYY-MM-DD/routes .
cp -r backup-YYYY-MM-DD/models .
# ... etc

# Option 2: Git rollback
git revert HEAD  # if committed already
git reset --hard  # if not committed yet

# Option 3: Delete src/ and public/ restructure, keep backup
rm -rf src/ public/
# Restart with old structure
npm start
```

---

## Performance Impact

The restructure should have **minimal performance impact**:

- ✅ Same dependencies
- ✅ Same database structure
- ✅ Same API endpoints
- ✅ Faster code organization (easier to find things)
- ✅ Better for scaling (can add new modules easily)

---

## Next Steps After Restructure

1. **Phase 1 Improvements** (8 hours) - Frontend Integration
   - Create frontend API client framework
   - Wire HTML forms to API endpoints
   - Add data tables and dynamic content

2. **Phase 2 Improvements** (6.5 hours) - Feature Enhancements
   - Add health tracking to livestock
   - Implement timeline views
   - Add analytics/reporting

3. **Phase 3 Improvements** (6.5 hours) - Advanced Features
   - Real-time updates with WebSocket
   - Scheduled backups
   - Two-factor authentication

4. **Deployment** - Docker/Cloud deployment
   - Update Docker files
   - Set up CI/CD pipeline
   - Configure production environment

---

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review PROJECT_RESTRUCTURE_GUIDE.md
3. Check logs: `npm run logs`
4. Check error log: `npm run logs:error`
5. Test server health: `npm run health`

---

**Happy Refactoring! 🎉**
