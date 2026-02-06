G-VET System Desktop Application - Deployment Guide

## What We Built

✅ Electron Desktop Application Wrapper
✅ Windows Installer (NSIS) - `dist/G-VET System Setup 2.0.0.exe`
✅ Portable Executable - `dist/G-VET-System-2.0.0-portable.exe`
✅ Artifact ZIP - `dist/G-VET-System-2.0.0-artifacts.zip`
✅ GitHub Actions CI/CD Workflow
✅ Auto-Update Support (electron-updater)
✅ Code Signing Instructions

## Files Modified/Created

### Core Application Files

- `electron-main.js` - Electron main process with auto-update support
- `electron-preload.js` - IPC preload script
- `package.json` - Updated with Electron dependencies and scripts

### Documentation

- `ELECTRON_DESKTOP_BUILD.md` - Build and development guide
- `RELEASE_NOTES.md` - Release information
- `SIGNING_INSTRUCTIONS.md` - Code signing setup guide
- `.github/workflows/release.yml` - CI/CD workflow for automated builds

## Quick Start for End Users

### Option 1: Installer (Recommended for distribution)

```powershell
# Run the installer
.\dist\G-VET System Setup 2.0.0.exe
```

- Creates Start Menu shortcuts
- Installs to Program Files
- Auto-update capable

### Option 2: Portable (No installation)

```powershell
# Run portable directly
.\dist\G-VET-System-2.0.0-portable.exe
```

- Works standalone
- No installation required
- Can be run from USB drive

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL (local or Docker)

### Install & Build

```bash
# Install dependencies
npm install

# Set up database
npm run reset-db

# Run in development mode
npm run electron-dev

# Build for Windows
npm run electron-build-win

# Package artifacts into ZIP
npm run package-artifacts

# Create GitHub release (requires gh CLI auth)
npm run release:gh
```

## Publishing to GitHub

### Prerequisites

1. Install GitHub CLI if not already installed:

   ```powershell
   winget install --id GitHub.cli -e
   ```

2. Authenticate with GitHub:
   ```powershell
   gh auth login
   ```
   Follow the browser prompt to authorize.

### Create GitHub Release

```bash
npm run release:gh
```

This will:

- Create a new release tagged `v2.0.0`
- Upload both installer and portable EXE
- Use content from `RELEASE_NOTES.md` as release description

### Manual GitHub Release (Alternative)

```bash
gh release create v2.0.0 dist/* --title "G-VET System v2.0.0" --notes-file RELEASE_NOTES.md
```

## Auto-Update Configuration

The app now checks for updates on startup (production builds only). To enable auto-updates:

1. Publish releases to GitHub Releases (with the steps above)
2. The app automatically detects new versions when available
3. User is prompted to install update when downloaded

### Custom Update Feed (Advanced)

To use a custom update server, modify `electron-main.js`:

```javascript
autoUpdater.setFeedURL({
  provider: "custom",
  url: "https://your-server.com/updates",
});
```

## Code Signing (Windows)

For production releases, code sign the installer:

1. Obtain a code signing certificate (PFX format) from a trusted CA
2. Set environment variables:
   ```powershell
   $env:CSC_LINK = "C:\path\to\cert.pfx"
   $env:CSC_KEY_PASSWORD = "your-password"
   ```
3. Rebuild:
   ```bash
   npm run electron-build-win
   ```

Or configure in GitHub Actions secrets for automated signing.

## Distribution Options

### Option 1: GitHub Releases (Built-in)

- Upload both EXE files to GitHub Releases
- Users download from repository releases page
- Auto-update checks GitHub for new releases

### Option 2: File Server/S3

- Upload artifacts to S3 or internal file server
- Modify auto-update feed URL in `electron-main.js`
- Update `RELEASE_NOTES.md` with download links

### Option 3: Windows App Installer

- Use Microsoft Store / App Installer package format
- Requires code signing and MSIX packaging
- Extra complexity; only needed for enterprise/store distribution

### Recommended: GitHub Releases

- Free and reliable hosting
- Built-in support for auto-updates
- Easy to manage and audit
- No additional infrastructure

## System Requirements (Users)

- Windows 7 or later
- 2 GB RAM (minimum)
- 500 MB disk space
- Internet connection for initial database sync (optional)

## Troubleshooting

### App Won't Start

- Check Windows Event Viewer for Electron crash logs
- Verify `.env` configuration (DB host, credentials)
- Ensure MySQL/MariaDB is running and accessible

### Database Connection Failed

- Verify `DB_HOST`, `DB_PORT`, `DB_NAME` in `.env`
- Check MySQL credentials
- For Docker: ensure MySQL container is running (`docker-compose up -d`)

### Update Won't Install

- Check file permissions in `AppData\Local\Temp`
- Restart the app after download is complete
- Verify no antivirus blocking updates

## Support Links

- **Electron:** https://www.electronjs.org/docs
- **electron-builder:** https://www.electron.build/
- **electron-updater:** https://github.com/electron-userland/electron-updater
- **GitHub CLI:** https://cli.github.com/

---

**Version:** 2.0.0
**Last Updated:** February 7, 2026
**Maintained by:** G-VET Development Team
