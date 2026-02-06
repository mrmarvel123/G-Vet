## G-VET System Desktop v2.0.0 - Manual GitHub Release Instructions

Since GitHub CLI requires interactive browser authentication, here's how to create the release manually via GitHub web interface:

### Step 1: Open GitHub Release Page

Navigate to: https://github.com/AtlasTheDev123/G-Vet/releases/new

### Step 2: Fill in Release Details

- **Tag version:** `v2.0.0`
- **Release title:** `G-VET System v2.0.0 - Desktop Application`
- **Description:** Copy from [RELEASE_NOTES.md](./RELEASE_NOTES.md)

### Step 3: Upload Assets

Drag and drop or select these files from `dist/`:

1. `G-VET System Setup 2.0.0.exe` (Installer - 85.3 MB)
2. `G-VET-System-2.0.0-portable.exe` (Portable - 85.1 MB)
3. `G-VET-System-2.0.0-artifacts.zip` (All artifacts - 277 MB)

### Step 4: Publish

- ☐ Mark as **Pre-release** if not production-ready
- ☐ Mark as **Latest release** for auto-updates
- Click **Publish release**

---

### Auto-Update Configuration

After release is published, auto-updates will work automatically. Users running the desktop app will be notified when v2.0.0 or newer is available.

### Verification

After release is created:

```powershell
# Verify release exists
gh release list --repo AtlasTheDev123/G-Vet

# Download asset (example)
# gh release download v2.0.0 --repo AtlasTheDev123/G-Vet
```

---

**Estimated file sizes:**

- Installer: 85.3 MB
- Portable: 85.1 MB
- ZIP archive: 277 MB

**Total release package: ~448 MB**

All files are ready in: `dist/`
