# G-VET System v2.0.0 - User Installation & Deployment Guide

**Version:** 2.0.0
**Release Date:** February 7, 2026
**Status:** Ready for Distribution

---

## 📥 Installation Options

### Option 1: Windows Installer (Recommended for Standard Users)

**File:** `G-VET System Setup 2.0.0.exe` (81.3 MB)

**Installation Steps:**

1. **Download** the installer from GitHub Releases
   - https://github.com/AtlasTheDev123/G-Vet/releases/tag/v2.0.0

2. **Run the installer**

   ```
   Double-click: G-VET System Setup 2.0.0.exe
   ```

3. **Follow the wizard:**
   - Accept license (PROPRIETARY)
   - Choose installation directory (default: Program Files)
   - Select: "Create start menu shortcut"
   - Select: "Create desktop shortcut"
   - Click "Install"

4. **Wait for extraction** (~2 minutes)

5. **Launch the application:**
   - Click "Run G-VET System" at end
   - OR use Start Menu shortcut
   - OR double-click Desktop shortcut

6. **First launch:**
   - App will load at `localhost:3000`
   - Server starts automatically
   - Bundled Node.js runs in background

**Uninstall:**

- Control Panel → Programs → G-VET System → Uninstall
- OR: Settings → Apps → G-VET System → Uninstall

**File Locations (Post-Install):**

- Installation: `C:\Program Files\G-VET System\`
- Start Menu: `C:\Users\[YourName]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\G-VET System\`
- Data: `C:\Users\[YourName]\AppData\Local\G-VET System\`

---

### Option 2: Portable EXE (USB/No Installation)

**File:** `G-VET-System-2.0.0-portable.exe` (81.1 MB)

**Deployment Steps:**

1. **Download** the portable executable from GitHub Releases

2. **Choose storage location:**
   - USB drive (external drive preferred)
   - Network drive
   - Local folder
   - Cloud sync service (OneDrive, Dropbox)

3. **Launch directly:**

   ```
   Double-click: G-VET-System-2.0.0-portable.exe
   ```

4. **First launch:**
   - App extracts to temporary directory
   - Server starts automatically
   - Interface loads in ~3-5 seconds
   - No installation dialogs

**Advantages:**

- ✅ No admin rights needed
- ✅ No installation files left behind
- ✅ Can run from USB
- ✅ Can run from cloud sync
- ✅ Multiple locations for redundancy

**Disadvantages:**

- ⚠️ No Start Menu shortcuts
- ⚠️ No desktop shortcuts
- ⚠️ Slower startup (temporary extraction)

---

### Option 3: ZIP Archive (Manual Deployment)

**File:** `G-VET-System-2.0.0-artifacts.zip` (277.7 MB)

**For IT Administrators:**

1. **Extract ZIP** to deployment location

   ```
   C:\Applications\G-VET\
   ```

2. **Create shortcuts** (optional):
   - Create shortcut to `electron-main.js` wrapper
   - Place on network share
   - Distribute to users

3. **Deploy via Group Policy** (Active Directory):
   - Add to software deployment
   - Auto-install across organization
   - Centralized update management

---

## 🔧 Configuration

### Database Connection

**Located:** `.env` file in installation directory

**Default settings:**

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gvet
DB_USER=root
DB_PASSWORD=password
```

**To modify:**

1. Locate `.env` file
2. Edit with Notepad or text editor
3. Update connection parameters
4. Save and restart app

**For remote database:**

```
DB_HOST=192.168.1.100     # or server hostname
DB_PORT=3306
DB_NAME=gvet
DB_USER=admin_user
DB_PASSWORD=secure_password
```

---

## 🔄 Auto-Update Feature

**Automatic Updates Enabled** ✅

### How It Works

1. **App checks GitHub** on startup
   - Looks for new releases
   - Compares version numbers
   - Checks for update availability

2. **User notification:**
   - Alert dialog appears
   - Shows new version available
   - User can install now or later

3. **Update installation:**
   - Downloads latest version
   - Verifies file integrity
   - Installs on app restart

### Update Interval

- Checks: Every app startup
- Frequency: Once every 24 hours
- Manual check: Restart app

### Disable Auto-Update (If Needed)

Edit `electron-main.js`:

```javascript
// Comment out or remove:
// autoUpdater.checkForUpdatesAndNotify();
```

---

## 🖥️ System Requirements

### Minimum Requirements

- **OS:** Windows 7 SP1 or later
- **RAM:** 2 GB
- **Disk Space:** 500 MB
- **Internet:** For database sync (optional)

### Recommended Requirements

- **OS:** Windows 10 or Windows 11
- **RAM:** 4 GB or more
- **Disk Space:** 1 GB
- **Connection:** Stable network (for remote DB)

### Database Requirements

- **MySQL/MariaDB 5.7+** or later
- **Local or Remote** connection
- **Port:** 3306 (default)

---

## 🚀 First-Time Setup

### Step 1: Install Application

Follow Option 1 (Installer) or Option 2 (Portable)

### Step 2: Configure Database

1. Edit `.env` file with correct database credentials
2. Ensure MySQL is running (local or remote)
3. Run migrations: `npm run migrate` (if needed)

### Step 3: Initialize Data

1. Seed database with sample data: `npm run seed`
2. Or import existing database

### Step 4: Launch Application

1. Double-click desktop/start menu shortcut
2. App loads in ~3-5 seconds
3. Interface appears at `http://localhost:3000`

### Step 5: Login

- Default credentials (if seeded)
- Or set up new admin user as prompted

---

## 🐛 Troubleshooting

### "Database Connection Failed"

**Symptom:** Error message on startup

**Solutions:**

1. Verify MySQL is running

   ```
   Windows Services → MySQL80 → Start
   ```

2. Check `.env` credentials
   - Correct hostname
   - Correct port (usually 3306)
   - Correct username & password

3. Test connection:

   ```powershell
   telnet localhost 3306
   ```

4. Check firewall:
   - Allow port 3306 through Windows Firewall
   - Check database server firewall

### "Port 3000 Already in Use"

**Symptom:** Error about port 3000

**Solution:**

1. Close other apps using port 3000

   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID [ProcessID] /F
   ```

2. Or change port in `electron-main.js`
   ```javascript
   const server = app.listen(3001); // Use 3001 instead
   ```

### "Antivirus Blocks Update"

**Symptom:** Update fails to install

**Solution:**

1. Add app to antivirus whitelist
2. Temporarily disable antivirus (test only)
3. Or disable auto-update (see section above)

### "App Won't Start"

**Symptom:** Window appears then closes

**Solutions:**

1. Check Windows Event Viewer for errors

   ```
   Event Viewer → Windows Logs → Application
   ```

2. Check app logs

   ```
   C:\Users\[YourName]\AppData\Local\G-VET System\logs\
   ```

3. Try portable version (no installation variables)

4. Reinstall fresh:
   - Uninstall via Control Panel
   - Restart computer
   - Run installer again

---

## 📊 Managing Multiple Installations

### Organization Deployment

**For small teams (1-10 users):**

- Distribute portable EXE via email
- Users run standalone
- Each gets independent data

**For departments (10-100 users):**

- Use Windows Installer
- Deploy via Group Policy (AD environment)
- Point all to central database

**For enterprise (100+ users):**

- Deploy ZIP archive to network share
- Create centralized shortcuts
- Use remote MySQL database
- Deploy updates via WSUS

---

## 🔐 Security Recommendations

### For Administrators

1. **Secure Database:**
   - Use strong passwords in `.env`
   - Enable database encryption
   - Regular backups

2. **Update Management:**
   - Test updates before wide deployment
   - Monitor GitHub releases
   - Disable auto-update if needed (controlled rollout)

3. **Code Signing:**
   - Next release could be signed
   - Removes Windows SmartScreen warnings
   - Increases user trust

4. **Access Control:**
   - Restrict `.env` file permissions
   - Audit user access to app
   - Monitor database connections

---

## 📞 Support & Documentation

### Built-in Help

- **In-app Help:** ? icon in navigation
- **Admin Dashboard:** Settings → Documentation
- **API Docs:** Available in repo

### External Resources

- **Electron:** https://www.electronjs.org/docs
- **Node.js:** https://nodejs.org/docs/
- **GitHub:** https://github.com/AtlasTheDev123/G-Vet

### Reporting Issues

- **GitHub Issues:** https://github.com/AtlasTheDev123/G-Vet/issues
- **Email:** Support contact in documentation

---

## 📋 Upgrade Path (Version Updates)

### From v2.0.0 to Future Versions

1. **Auto-Update (Easiest):**
   - Restart app
   - See update notification
   - Click "Install"
   - App restarts

2. **Manual Update:**
   - Download new installer from GitHub Releases
   - Run installer (old version auto-uninstalls)
   - Data preserved automatically

3. **Database Migrations:**
   - App runs migrations automatically
   - Data migrated on startup
   - No manual action needed

---

## ✅ Deployment Checklist

- [ ] Download installer or portable EXE
- [ ] Run installation/extraction
- [ ] Configure `.env` with database details
- [ ] Test database connection
- [ ] Seed or import data
- [ ] Launch application
- [ ] Create admin user (if needed)
- [ ] Test functionality
- [ ] Configure auto-update preferences
- [ ] Create user shortcuts/documentation
- [ ] Test on multiple computers (if deploying)

---

**Version 2.0.0 is ready for production deployment.**

For questions or issues, refer to:

- DEPLOYMENT_GUIDE.md (Admin & Dev)
- FINAL_STATUS_REPORT.md (Technical Overview)
- GitHub Issues (Bug Reports)

---

**Release Date:** February 7, 2026
**Status:** ✅ Production Ready
