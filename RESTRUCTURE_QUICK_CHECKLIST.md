# 📋 G-VET RESTRUCTURE - QUICK REFERENCE CHECKLIST

## Pre-Migration ✓

- [ ] Read `PROJECT_RESTRUCTURE_GUIDE.md` (understand target structure)
- [ ] Verify all files exist in current structure
- [ ] Create git branch: `git checkout -b refactor/domain-driven`
- [ ] Verify current directory count:
  - [ ] 18 controllers
  - [ ] 18 routes
  - [ ] 17 models
  - [ ] 5 services
  - [ ] 2 middleware

## Dry Run ✓

- [ ] Run dry migration: `npm run refactor:migrate:dry`
- [ ] Review output for errors
- [ ] Confirm all files will be migrated
- [ ] Verify new directory structure exists

## Backup ✓

- [ ] Create backup: `npm run refactor:migrate:backup`
  - Creates `backup-YYYY-MM-DD/` directory
  - Safe to delete after verification

## Migration ✓

- [ ] Execute migration: `npm run refactor:migrate`
- [ ] Wait for completion (2-5 minutes)
- [ ] No files should report errors

## Directory Verification ✓

- [ ] `src/modules/` exists with 5 subdirectories
  - [ ] `auth/`
  - [ ] `kew-pa/`
  - [ ] `kew-ps/`
  - [ ] `kew-ah/`
  - [ ] `core/`
- [ ] `src/shared/` exists with utilities
  - [ ] `middleware/`
  - [ ] `services/`
  - [ ] `utils/`
  - [ ] `constants/`
  - [ ] `helpers/`
  - [ ] `types/`
- [ ] `src/config/` has config files
- [ ] `src/database/` has database files
- [ ] `public/` has static files and modules

## File Count Check ✓

```bash
find src/modules -name "*.controller.js" | wc -l    # Should be ~18
find src/modules -name "*.routes.js" | wc -l        # Should be ~18
find src -name "*.js" -path "*/models/*" | wc -l    # Should be ~17
find src/shared/services -name "*.js" | wc -l       # Should be ~5
find public/modules -name "*.html" | wc -l          # Should be ~16+
```

## Import Verification ✓

- [ ] Check a few controller files for updated imports
- [ ] Check routes files for updated imports
- [ ] Verify server.js has updated require paths
- [ ] Run linter: `npm run lint` (optional)

## Server Testing ✓

- [ ] `npm install` (update dependencies if needed)
- [ ] `npm run dev` (start development server)
- [ ] Server should start without errors
- [ ] Should see logs about:
  - [ ] Database connection
  - [ ] Models synchronized
  - [ ] Server running on port 3000
- [ ] Keep server running for next checks

## Health Checks ✓ (in another terminal)

- [ ] Health endpoint: `curl http://localhost:3000/api/health`
- [ ] Should return JSON with status="ok"
- [ ] Check dashboard: `curl http://localhost:3000/dashboard.html`
- [ ] Should return HTML (no 404)

## Browser Testing ✓

- [ ] Open http://localhost:3000/ in browser
- [ ] Check console for any 404 errors
- [ ] Navigate to http://localhost:3000/dashboard.html
- [ ] Check that page loads correctly
- [ ] Check that static assets load (no red errors in console)

## Logging ✓

- [ ] Check app logs: `npm run logs`
- [ ] Check error logs: `npm run logs:error`
- [ ] No unexpected errors should appear

## Optional: Delete Old Directories ✓

Only after confirming everything works perfectly:

```bash
rm -rf controllers/
rm -rf routes/
rm -rf models/
rm -rf middleware/
rm -rf services/
rm -rf validators/
```

- [ ] Verify old directories deleted
- [ ] Confirm server still works after deletion
- [ ] Test API endpoints again

## Git Commit ✓

```bash
git add .
git commit -m "refactor: restructure project with domain-driven architecture"
git push -u origin refactor/domain-driven
```

- [ ] All changes staged
- [ ] Commit message descriptive
- [ ] Pushed to remote repository

## Post-Migration Cleanup ✓

- [ ] Delete backup directory (if everything works): `rm -rf backup-YYYY-MM-DD/`
- [ ] Update team documentation if needed
- [ ] Update CI/CD pipeline if applicable
- [ ] Update deployment configuration if needed

## Quick Test Commands

```bash
# Copy & paste these after migration to test quickly:

# 1. Check structure
echo "=== NEW STRUCTURE ===" && \
find src/modules -maxdepth 1 -type d && \
echo "" && \
echo "=== KEW.PA ===" && \
ls src/modules/kew-pa/ && \
echo "" && \
echo "=== SHARED ===" && \
ls src/shared/

# 2. Start server
npm run dev &

# 3. Wait 3 seconds then test health
sleep 3 && \
curl -s http://localhost:3000/api/health | jq .

# 4. Check HTML loads
curl -s http://localhost:3000/dashboard.html | head -20

# 5. Kill server
kill %1
```

## Post-Restructure Next Steps

After this migration is complete, the following improvements are recommended:

**Phase 1: Frontend Integration** (8 hours)

- [ ] Create `/src/shared/services/api-client.js` for API calls
- [ ] Wire all 29 HTML pages to backend API
- [ ] Add form submission handlers
- [ ] Add data table rendering

**Phase 2: Feature Enhancement** (6.5 hours)

- [ ] Add health tracking system
- [ ] Implement timeline views
- [ ] Add analytics/reporting

**Phase 3: Advanced Features** (6.5 hours)

- Real-time WebSocket updates
- Scheduled backups
- Two-Factor Authentication

---

## Emergency Rollback

If something goes very wrong:

```bash
# Stop the server
Ctrl+C

# Restore from backup
cp -r backup-YYYY-MM-DD/controllers .
cp -r backup-YYYY-MM-DD/routes .
cp -r backup-YYYY-MM-DD/models .

# Or git rollback
git reset --hard HEAD~1

# Restart
npm start
```

---

## Success Indicator

✅ Migration is **SUCCESSFUL** when:

1. Server starts without errors
2. Health endpoint returns 200
3. Dashboard loads in browser
4. No 404 errors in browser console
5. All commits pushed to git
6. Old directories deleted (optional)

---

**Total Time: ~30-60 minutes**

Good luck! 🚀
