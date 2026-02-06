# Building G-VET System as Desktop Application

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Windows 7 or later (for building Windows executable)

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
npm run reset-db
```

### 3. Development Mode (Electron)

Run in development mode with hot reload:

```bash
npm run electron-dev
```

This will:

- Start the Node.js server on port 3000
- Open the G-VET desktop application window
- Show developer tools for debugging

### 4. Build Executable

#### Build for Windows (NSIS Installer + Portable)

```bash
npm run electron-build-win
```

This creates:

- `G-VET-System-Setup-x.x.x.exe` - Full installer
- `G-VET-System-x.x.x-portable.exe` - Standalone portable executable

Output will be in the `dist` folder.

#### Build All Platforms (if you have the tools)

```bash
npm run electron-build-all
```

## Distribution

### For End Users

1. **Portable Version**: Share the `G-VET-System-portable.exe` file directly
   - No installation required
   - Works on any Windows machine with the executable

2. **Installer Version**: Share the `G-VET-System-Setup.exe` file
   - Creates Start Menu shortcuts
   - Installs to Program Files by default
   - More professional for distribution

### System Requirements

- Windows 7 or later
- ~500MB disk space
- 2GB RAM recommended
- Database (MySQL) connection configured via .env

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=3000
DB_NAME=g_vet_system
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Email (optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

1. Kill the process using the port:

   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Or change the port in `electron-main.js` and `server.js`

### Server Won't Start

1. Check database connection in `.env`
2. Ensure MySQL is running
3. Check logs in the `logs` folder
4. Run database migration: `npm run reset-db`

### Blank Application Window

1. Check server logs: `npm run logs`
2. Open DevTools in development mode to see errors
3. Verify server started on port 3000

## Features in Desktop Application

- Full access to all G-VET modules (KEWAH, KEWPA, KEWPS)
- Real-time updates via WebSockets
- Offline-capable design
- Desktop notifications
- System tray integration (can be added)
- Auto-updates (can be configured in electron-main.js)

## Performance Tips

1. **Reduce Initial Load**: Database queries optimized
2. **Memory**: Ensure MySQL server has adequate resources
3. **CPU**: Single-threaded Node.js; consider process manager for production
4. **Network**: Works best on LAN; internet connection not required

## Building on CI/CD

For automated builds, use GitHub Actions or similar CI/CD tools:

```yaml
- name: Build Windows EXE
  run: npm run electron-build-win
```

## Support

For issues or improvements, check:

- `electron-main.js` - Application startup and window management
- `server.js` - Backend server configuration
- `.env` - Environment variables

---

**Last Updated**: February 2026
**Version**: 2.0.0
