# 🚀 G-VET SYSTEM - QUICK START GUIDE

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ MySQL 8.0+ installed and running
- ✅ Git installed (optional)

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Configure Environment
```powershell
# Copy environment template
Copy-Item .env.example .env

# Edit .env file with your database credentials
notepad .env
```

**Important:** Update these values in `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=gvet_system
JWT_SECRET=change-this-to-random-secret-key
```

### Step 3: Create Database
```powershell
# Open MySQL command line
mysql -u root -p

# In MySQL console:
CREATE DATABASE gvet_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 4: Run Database Migrations
```powershell
npm run migrate
```

### Step 5: Seed Demo Data
```powershell
npm run seed
```

### Step 6: Start the Server
```powershell
npm start
```

### Step 7: Open Dashboard
```
http://localhost:3000/dashboard
```

---

## 🔐 Default Login Credentials

### API Users (Real Backend)
After seeding, use these credentials:

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| admin | Admin@123 | admin | Full system access |
| manager | Manager@123 | manager | Department manager |
| staff | Staff@123 | staff | Regular staff |
| visitor | Visitor@123 | visitor | Read-only access |

### Demo Mode (Fallback)
If API is unavailable, demo accounts work:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | System Administrator |
| manager | manager123 | Department Manager |
| staff | staff123 | Asset Staff |
| visitor | visitor123 | Guest User |

---

## 📊 Verify System

After login, check:
1. **Dashboard Statistics** - Should show real numbers from database
2. **Real-time Updates** - WebSocket connected indicator
3. **Recent Activities** - Shows audit log entries
4. **System Verification** - Click "Verify System Status" button

---

## 🛠️ Available NPM Scripts

```powershell
# Development
npm start              # Start server (development mode)
npm run dev           # Start with nodemon (auto-restart)

# Database
npm run migrate       # Run database migrations
npm run seed          # Seed demo data
npm run reset-db      # Reset database (migrate + seed)

# Production
npm run build         # Prepare for production
npm run prod          # Start in production mode

# Docker
docker-compose up -d  # Start all services with Docker
docker-compose down   # Stop all services
```

---

## 🔍 Testing the Integration

### Test 1: API Authentication
```powershell
# Login via API
curl -X POST http://localhost:3000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"Admin@123"}'
```

### Test 2: Dashboard Statistics
1. Login to dashboard
2. Check if numbers are real (not 1247, 3456)
3. Verify WebSocket indicator shows "🟢 Operational"

### Test 3: Real-time Updates
1. Open dashboard in two browsers
2. Create a new asset in one browser
3. See notification appear in other browser

### Test 4: Audit Logs
1. Check "Recent Activities" section
2. Should show real user actions with timestamps
3. Not static demo activities

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Dashboard | http://localhost:3000/dashboard | Main dashboard |
| API Docs | http://localhost:3000/api/v1 | API endpoints |
| Health Check | http://localhost:3000/api/health | System status |
| Assets | http://localhost:3000/asset-registration | Asset management |
| Inventory | http://localhost:3000/inventory | KEW.PS store |
| Livestock | http://localhost:3000/livestock-register | KEW.AH animals |

---

## 🐛 Troubleshooting

### Issue: Database Connection Failed
```powershell
# Check MySQL is running
Get-Service mysql*

# Start MySQL if stopped
Start-Service mysql57  # or your MySQL service name

# Test connection
mysql -u root -p -e "SHOW DATABASES;"
```

### Issue: Port 3000 Already in Use
```powershell
# Change port in .env
PORT=3001

# Or find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

### Issue: Token/Authentication Errors
```powershell
# Clear browser localStorage
# In browser console (F12):
localStorage.clear();
# Then refresh and login again
```

### Issue: WebSocket Not Connecting
- Check firewall allows port 3000
- Verify Socket.io CDN loads (check browser console)
- Ensure server started successfully (check terminal)

### Issue: No Data Showing
```powershell
# Re-run seed script
npm run seed

# Check database has data
mysql -u root -p gvet_system -e "SELECT COUNT(*) FROM assets;"
```

---

## 🎨 Features Now Working

### ✅ Real-time Features
- Live dashboard statistics
- WebSocket push notifications
- Auto-updating activity feed
- Low stock alerts
- Health status alerts

### ✅ Authentication
- JWT token-based login
- Session persistence (auto-login)
- Secure logout with token cleanup
- Role-based access control

### ✅ Dashboard Integration
- Real API data (not demo)
- Actual audit log activities
- Live system health check
- Database-backed statistics

### ✅ User Experience
- Loading indicators
- Success/error notifications
- Dark mode (persisted)
- Smooth animations
- Keyboard shortcuts (Ctrl+K)

---

## 📈 What's Different Now?

### Before (Demo Mode):
```javascript
// Hardcoded data
animateCounter('total-assets', 1247);
const demoUsers = { admin: 'admin123' };
```

### After (Real System):
```javascript
// Real API calls
await fetch('/api/v1/reports/dashboard');
await fetch('/api/v1/auth/login', { body: JSON.stringify(...) });
socket.on('asset:created', handleAssetCreated);
```

---

## 🔐 Security Features

- ✅ JWT access tokens (24h expiry)
- ✅ Refresh tokens (7d expiry)
- ✅ bcrypt password hashing
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ XSS protection
- ✅ Audit logging (all actions)

---

## 📚 Next Steps

1. **Explore Modules** - Try all 24+ HTML pages
2. **Create Test Data** - Add assets, inventory, livestock
3. **Generate Reports** - Test PDF/Excel exports
4. **Upload Files** - Try image uploads for assets
5. **Check Audit Logs** - Review /admin page
6. **Test WebSocket** - Open two browsers, see live updates

---

## 🆘 Need Help?

1. Check logs: `logs/combined.log`
2. Enable debug mode in `.env`: `LOG_LEVEL=debug`
3. Check API health: http://localhost:3000/api/health
4. Review API docs: `API_DOCUMENTATION.md`
5. Check build docs: `BUILD_COMPLETE.md`

---

## 🏛️ System Information

- **System:** G-VET ASSET & iSTOR SYSTEM v2.0
- **Organization:** Jabatan Perkhidmatan Veterinar Negeri Perak
- **Framework:** Node.js + Express + MySQL + Socket.io
- **Frontend:** Vanilla JS + Tailwind CSS
- **Standards:** KEW.PA, KEW.PS, KEW.AH compliance
- **Deployment:** Docker-ready with Nginx

**Status:** ✅ Production Ready

Happy Managing! 🎉
