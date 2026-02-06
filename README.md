# G-VET ASSET & iSTOR SYSTEM v2.0

## Malaysian Government Official System

### Jabatan Perkhidmatan Veterinar Negeri Perak

[![Status](https://img.shields.io/badge/status-production%20ready-green)](https://github.com)
[![Version](https://img.shields.io/badge/version-2.5.0-blue)](https://github.com)
[![Health](https://img.shields.io/badge/health-95%25%20EXCELLENT-success)](https://github.com)
[![License](https://img.shields.io/badge/license-Government-red)](https://github.com)
[![Completion](https://img.shields.io/badge/completion-95%25-brightgreen)](https://github.com)

---

## 🆕 What's New in v2.5 (Dec 2025)

- ✅ **7 Controllers** - Complete MVC architecture
- ✅ **4 Validators** - Joi schema validation for all endpoints
- ✅ **3 Backup Scripts** - Automated backup/restore/cleanup
- ✅ **Security Enhanced** - Input validation, SQL injection protection
- ✅ **Data Protection** - Automated backup system with 30-day retention
- ✅ **System Analysis** - Complete health audit (95% score) ⭐ NEW
- 📖 **Documentation** - [ANALYSIS_COMPLETE.md](ANALYSIS_COMPLETE.md) | [SYSTEM_HEALTH_REPORT.md](SYSTEM_HEALTH_REPORT.md)

---

## 🚀 Quick Start

**Get the system running in 5 minutes!**

```powershell
# 1. Install dependencies
npm install

# 2. Configure environment (edit .env)
Copy-Item .env.example .env

# 3. Create database
mysql -u root -p -e "CREATE DATABASE gvet_system;"

# 4. Run migrations and seed data
npm run migrate
npm run seed

# 5. Start the server
npm start

# 6. Open browser
# http://localhost:3000/dashboard
```

**Login:** admin / Admin@123 (or admin123 for demo mode)

📖 **Detailed guide:** [START_SYSTEM.md](START_SYSTEM.md)

---

## 📋 System Overview

The G-VET ASSET & iSTOR SYSTEM is a **full-stack production-ready** asset and inventory management platform for Malaysian Government veterinary services.

### Integrated Frameworks

- **KEW.PA** - Asset Management Framework (36 forms)
- **KEW.PS** - Store Management Framework (36 forms)
- **KEW.AH** - Live Asset (Livestock) Management (8 forms)

### Technology Stack

- **Backend:** Node.js 18+, Express.js 4.18, Socket.io 4.7
- **Database:** MySQL 8.0, Sequelize ORM 6.35
- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript
- **Authentication:** JWT tokens, bcrypt hashing
- **Real-time:** WebSocket connections
- **Deployment:** Docker-ready, Nginx reverse proxy

---

## 🏗️ System Architecture

### Complete Module Structure

```directory
G-VET SYSTEM/
│
├── 📊 DASHBOARD (dashboard.html)
│   └── Central control panel with real-time statistics
│
├── 🖥️ KEW.PA ASSET MANAGEMENT
│   ├── kewpa.html - Main dashboard
│   ├── asset-registration.html - KEW.PA-3/4
│   ├── asset-receipt.html - KEW.PA-1/2
│   ├── asset-movement.html - KEW.PA-9/10
│   ├── asset-inspection.html - KEW.PA-11/12
│   ├── asset-maintenance.html - KEW.PA-13/16
│   └── asset-verification.html - KEW.PA-5/8
│
├── 📦 KEW.PS STORE MANAGEMENT
│   ├── kewps.html - Main dashboard
│   ├── store-receipt.html - KEW.PS-1/2
│   ├── stock-control.html - KEW.PS-3/4
│   ├── store-issuance.html - KEW.PS-7/9
│   ├── store-verification.html - KEW.PS-10/12
│   └── inventory.html - Complete inventory system
│
├── 🐾 KEW.AH LIVE ASSETS
│   ├── kewah.html - Main dashboard
│   ├── livestock-register.html - KEW.AH-2
│   └── veterinary-care.html - KEW.AH-3/4
│
├── 📈 ANALYTICS & REPORTS
│   ├── reports.html - Comprehensive reporting
│   └── advanced-search.html - Multi-module search
│
├── 🛠️ TOOLS & INTEGRATION
│   ├── qr-scanner.html - QR code scanning
│   ├── forms.html - Government forms library
│   ├── procurement.html - Purchase management
│   └── suppliers.html - Vendor database
│
└── ⚙️ ADMINISTRATION
    ├── admin.html - User & access management
    └── it-admin.html - System administration
```

---

## 🎯 Key Features

### ✅ Complete Backend API

- 40+ RESTful endpoints
- JWT authentication with refresh tokens
- Role-based access control (admin, manager, staff, visitor)
- Comprehensive audit logging
- Rate limiting and security headers

### ✅ Real-time Updates

- WebSocket integration for live notifications
- Instant dashboard statistics
- Low stock alerts
- Health status notifications
- Asset creation/update events

### ✅ Advanced Reporting

- PDF report generation
- Excel/CSV exports
- Custom date ranges
- Category filtering
- Dashboard analytics

### ✅ File Management

- Image uploads (assets, livestock)
- Document attachments
- QR code generation and scanning
- File validation and security

### ✅ Production Ready

- Docker deployment
- Nginx reverse proxy
- Automated backups (30-day retention)
- Email notifications
- Comprehensive logging

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))
- Git (optional)

### Step-by-Step Installation

```powershell
# 1. Navigate to project directory
cd C:\Users\Atlas\Desktop\G-Vet

# 2. Install Node.js dependencies
npm install

# 3. Configure environment variables
Copy-Item .env.example .env
notepad .env  # Edit with your MySQL credentials

# 4. Create MySQL database
mysql -u root -p
# In MySQL console:
CREATE DATABASE gvet_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 5. Run database migrations
npm run migrate

# 6. Seed demo data
npm run seed

# 7. Start the server
npm start

# 8. Access the system
# Dashboard: http://localhost:3000/dashboard
# API: http://localhost:3000/api/v1
# Health: http://localhost:3000/api/health
```

### Login Credentials

**API Users (Real Backend):**

| Username | Password    | Role    | Access Level          |
| -------- | ----------- | ------- | --------------------- |
| admin    | Admin@123   | admin   | Full system access    |
| manager  | Manager@123 | manager | Department management |
| staff    | Staff@123   | staff   | Daily operations      |
| visitor  | Visitor@123 | visitor | Read-only access      |

**Demo Mode (Fallback):**

- admin / admin123
- manager / manager123
- staff / staff123
- visitor / visitor123

### Docker Deployment

```powershell
# Start all services (MySQL + App + Nginx)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## 📚 Documentation

| Document                                                   | Description                                      |
| ---------------------------------------------------------- | ------------------------------------------------ |
| [START_SYSTEM.md](START_SYSTEM.md)                         | **Quick start guide** - Get running in 5 minutes |
| [NEW_MODULES_COMPLETE.md](NEW_MODULES_COMPLETE.md)         | ✅ **NEW** - v2.5 modules documentation          |
| [MISSING_MODULES_ANALYSIS.md](MISSING_MODULES_ANALYSIS.md) | Complete system analysis report                  |
| [INSTALLATION.md](INSTALLATION.md)                         | Detailed installation instructions               |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md)               | Complete API reference with examples             |
| [BUILD_COMPLETE.md](BUILD_COMPLETE.md)                     | Build documentation and architecture             |
| [FORMS_GUIDE.md](FORMS_GUIDE.md)                           | Government forms instruction manual              |
| [QUICK_START.md](QUICK_START.md)                           | Original setup guide                             |

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:3000/api/v1`

### Authentication

```http
POST /auth/login          # Login with credentials
POST /auth/logout         # Logout (clear tokens)
POST /auth/refresh        # Refresh access token
GET  /auth/me             # Get current user profile
```

### Assets (KEW.PA)

```http
GET    /assets            # List all assets
POST   /assets            # Create new asset
GET    /assets/:id        # Get single asset
PUT    /assets/:id        # Update asset
DELETE /assets/:id        # Delete asset
GET    /assets/stats/summary  # Asset statistics
```

### Inventory (KEW.PS)

````http
GET    /inventory         # List all items
POST   /inventory         # Create new item
POS🧪 Testing the System

### Verify Installation
```powershell
# 1. Check server is running
curl http://localhost:3000/api/health

# 2. Test login
curl -X POST http://localhost:3000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"Admin@123"}'

# 3. Open dashboard in browser
start http://localhost:3000/dashboard
````

### Check Integration

1. **Login** - Use admin / Admin@123
2. **Dashboard Stats** - Should show real numbers (not 1247, 3456)
3. **WebSocket** - Check "🟢 Operational" indicator
4. **Recent Activities** - Shows real audit logs with timestamps
5. **Create Asset** - Should trigger notification in real-time
6. **System Verification** - Click "Verify System Status" button

---

## 🐛 Troubleshooting

### Database Connection Failed

```powershell
# Check MySQL is running
Get-Service mysql*

# Start MySQL
Start-Service mysql57

# Test connection
mysql -u root -p -e "SHOW DATABASES;"
```

### Port Already in Use

```powershell
# Find process using port 3000
netstat -ano | findstr :3000
� Security & Compliance

### Security Features
- ✅ JWT access tokens (24h expiry)
- ✅ Refresh tokens (7d expiry)
- ✅ bcrypt password hashing (10 rounds)
- ✅ Rate limiting (100 requests/15 minutes)
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ XSS protection
- ✅ Comprehensive audit logging

### Automated Systems
- ✅ Daily database backups (2 AM)
- ✅ 30-day backup retention
- ✅ Winston logging with rotation
- ✅ Email notifications (optional)
- ✅ Health monitoring

---

## 📁 Project Structure

```

G-VET/
├── server.js # Main Express server
├── package.json # Dependencies and scripts
├── .env.example # Environment template
├── docker-compose.yml # Docker configuration
├── Dockerfile # Container image
├── nginx.conf # Reverse proxy config
│
├── config/
│ ├── database.js # Database connection
│ └── logger.js # Winston logger setup
│
├── models/
│ ├── index.js # Model registry
│ ├── User.js # User model
│ ├── Asset.js # Asset model (KEW.PA)
│ ├── Inventory.js # Inventory model (KEW.PS)
│ ├── Livestock.js # Livestock model (KEW.AH)
│ └── AuditLog.js # Audit logging model
│
├── routes/
│ ├── auth.routes.js # Authentication endpoints
│ ├── asset.routes.js # Asset CRUD operations
│ ├── inventory.routes.js # Inventory management
│ ├── livestock.routes.js # Livestock tracking
│ ├── report.routes.js # Report generation
│ ├── user.routes.js # User management
│ └── audit.routes.js # Audit logs
│
├── controllers/ ✅ NEW in v2.5
│ ├── auth.controller.js # Authentication logic
│ ├── asset.controller.js # Asset business logic
│ ├── inventory.controller.js # Inventory logic
│ ├── livestock.controller.js # Livestock logic
│ ├── user.controller.js # User management logic
│ ├── report.controller.js # Report generation logic
│ └── audit.controller.js # Audit logic
│
├── validators/ ✅ NEW in v2.5
│ ├── user.validator.js # User data validation (Joi)
│ ├── asset.validator.js # Asset validation schemas
│ ├── inventory.validator.js # Inventory validation
│ └── livestock.validator.js # Livestock validation
│
├── middleware/
│ ├── auth.js # JWT verification
│ └── audit.js # Activity logging
│
├── scripts/ ✅ NEW in v2.5
│ ├── backup.js # Automated database backup
│ ├── restore.js # Interactive restore
│ └── cleanup-backups.js # Remove old backups
│
├── services/
│ ├── upload.service.js # File upload & QR codes
│ ├── email.service.js # Email notifications
│ └── backup.service.js # Database backups
│
├── database/
│ ├── migrate.js # Database migrations
│ └── seed.js # Demo data seeding
│
├── static/
│ └── js/
│ └── premium.js # Frontend utilities
│
├── uploads/ # User uploaded files
├── logs/ # Application logs
├── backups/ # Database backups
│
└── [24 HTML Pages] # Frontend interfaces
├── dashboard.html # Main dashboard
├── kewpa.html # Asset management
├── kewps.html # Store management
├── kewah.html # Livestock management
└── ...

```sql

---

## 📊 Database Schema

### Users Table
- id (UUID), username, email, password (hashed)
- fullName, role, department, position
- isActive, lastLogin, refreshToken
- timestamps

### Assets Table (KEW.PA)
- id (UUID), assetCode, assetName, category
- purchasePrice, purchaseDate, supplier
- location, department, custodian, status
- userId (foreign key)

### Inventory Table (KEW.PS)
- id (UUID), itemCode, itemName, category
- currentStock, minimumStock, maximumStock
- unitPrice, location, shelf
- userId (foreign key)

### Livestock Table (KEW.AH)
- id (UUID), animalCode, species, breed
- name, gender, dateOfBirth, weight
- healthStatus, vaccinationStatus
- motherId, fatherId (self-referencing)
- userId (foreign key)

### AuditLog Table
- id (UUID), userId, username
- action, module, recordId
- ipAddress, userAgent, status, message
- timestamp

---

## 🌟 What's New in v2.0

### Major Changes from v1.0
| Feature | v1.0 (Demo) | v2.0 (Production) |
|---------|-------------|-------------------|
| Authentication | Client-side only | JWT + Database |
| Data Storage | LocalStorage/Static | MySQL Database |
| API | None | 40+ REST endpoints |
| Real-time | None | WebSocket integration |
| Backend | None | Node.js + Express |
| Security | B5.0 (December 2025) - Current ✅ NEW
**Major Enhancement Release**
- ✅ **7 Controllers** - Complete MVC architecture
- ✅ **4 Validators** - Joi schema validation
- ✅ **3 Backup Scripts** - Automated data protection
- ✅ Enhanced security with input validation
- ✅ SQL injection & XSS protection
- ✅ Separated business logic from routes
- ✅ Standardized error handling
- ✅ Comprehensive logging system
- 📖 See [NEW_MODULES_COMPLETE.md](NEW_MODULES_COMPLETE.md)

### Version 2.0.0 (December 2025)
| Deployment | Static files | Docker + Nginx |
| Audit Logs | None | Comprehensive tracking |
| Reports | Frontend only | PDF/Excel generation |
| File Upload | None | Full support + QR codes |

### New Capabilities
- ✅ Multi-user concurrent access
- ✅ Role-based permissions
- ✅ Real-time notifications
- ✅ Automated backups
- ✅ Email alerts
- ✅ API-first architecture
- ✅ Production deployment ready
- ✅ Scalable infrastructure

---

## 📅 Version History

### Version 2.0.0 (December 2025) - Current
**Production Release**
- ✅ Complete backend API infrastructure
- ✅ JWT authentication system
- ✅ MySQL database integration
- ✅ WebSocket real-time updates
- ✅ PDF/Excel report generation
- ✅ File upload with QR codes
- ✅ Email notification system
- ✅ Automated backup system
- ✅ Docker deployment ready
- ✅ Complete API documentation
- ✅ Frontend-backend integration
- ✅ Session persistence
- ✅ Audit logging system

### Version 1.0.0 (Previous)
- Frontend-only demo system
- Static HTML/CSS/JavaScript
- Client-side validation
- Demo user authentication
- Basic UI/UX implementatio:
localStorage.clear();
// Then refresh and login again
```

### No Data Showing

```powershell
# Re-run migrations and seed
npm run reset-db

# Verify data exists
mysql -u root -p gvet_system -e "SELECT COUNT(*) FROM assets;"
```

**More troubleshooting:** [START_SYSTEM.md](START_SYSTEM.md#-troubleshooting)

## API Endpoints

### Reports

GET /reports/assets # Asset report
GET /reports/inventory # Inventory report
GET /reports/livestock # Livestock report

```http`

### Audit Logs

```http
GET /audit                # Get audit logs (admin/manager)
GET /audit/stats/summary  # Audit statistics
```

**Full API Documenta # Start server (production mode)
npm run dev # Start with nodemon (development)
npm run migrate # Run database migrations
npm run seed # Seed demo data
npm run reset-db # Reset database (migrate + seed)
npm run backup # ✅ NEW - Create database backup
npm run restore # ✅ NEW - Restore from backup
npm run cleanup-backups # ✅ NEW - Remove old backups
npm run build # Prepare for production
npm run prod URL | Description |
|---------|-----|-------------|
| **Dashboard** | <http://localhost:3000/dashboard> | Main control panel |
| **KEW.PA** | <http://localhost:3000/kewpa> | Asset management |
| **KEW.PS** | <http://localhost:3000/kewps> | Store management |
| **KEW.AH** | <http://localhost:3000/kewah> | Livestock management |
| **API** | <http://localhost:3000/api/v1> | REST API |
|**Health Check\*\* | <http://localhost:3000/api/health> | System status |

---

## 💻 NPM Scripts

```powershell
npm start           # Start server (production mode)
npm run dev         # Start with nodemon (development)
npm run migrate     # Run database migrations
npm run seed        # Seed demo data
npm run reset-db    # Reset database (migrate + seed)
npm run build       # Prepare for production
npm run prod        # Start in production mode
```

---

## 📚 Module Documentation

### KEW.PA Asset Management

Fixed asset registration and control for government property including:

- Computer equipment
- Furniture and fittings
- Vehicles
- Machinery
- General equipment

**Key Features:**

- Complete asset lifecycle tracking
- Maintenance scheduling
- Movement and transfer management
- Annual verification and inspection
- Disposal procedures

### KEW.PS Store Management

Inventory control and store management for consumables:

- Office supplies
- Veterinary supplies
- Medical equipment
- Cleaning supplies

**Key Features:**

- Real-time stock levels
- Automatic reorder points
- ABC analysis
- Receipt and issuance tracking
- Stock verification

### KEW.AH Live Assets

Livestock and animal management for veterinary services:

- Cattle, goats, sheep
- Horses and buffaloes
- Poultry

**Key Features:**

- Individual animal tracking
- Health and treatment records
- Breeding management
- Mortality reporting
- Vaccination schedules

---

## 🔐 Security Features

### Government Compliance

- **Akta Rahsia Rasmi 1972** compliance
- **Peraturan Perbendaharaan Malaysia** adherence
- **Garis Panduan Keselamatan ICT** implementation

### Access Control

- Role-based access management
- Multi-level user permissions
- Activity logging and audit trails
- Session management
- Secure authentication

---

## 💻 Technical Specifications

### Frontend Technologies

- **HTML5** - Modern semantic markup
- **Tailwind CSS** - Responsive design framework
- **Font Awesome 6.0** - Icon library
- **Chart.js** - Data visualization
- **JavaScript ES6+** - Modern interactive features

### Features

- **Responsive Design** - Works on all devices
- **Dark Mode** - Eye-friendly interface
- **Real-time Updates** - Live data synchronization
- **Export Functions** - PDF, Excel, CSV
- **QR Code Integration** - Asset tracking
- **Search Engine** - Multi-module search

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📊 System Statistics

### Total Forms Available

- KEW.PA Forms: **36**
- KEW.PS Forms: **36**
- KEW.AH Forms: **8**
- **Total: 80 Government Forms**

### Module Count

- **24+ Active Modules**
- **100% System Integration**
- **Real-time Synchronization**

---

## 🎨 User Interface Features

### Dashboard Highlights

- Real-time statistics cards
- Quick action buttons
- Recent activity feed
- System status indicators
- Multi-module navigation

### Color Coding

- 🔵 **Blue** - KEW.PA Asset Management
- 🟢 **Green** - KEW.PS Store Management
- 🟠 **Orange** - KEW.AH Live Assets
- 🟣 **Purple** - Analytics & Reports
- 🔴 **Red** - Administration

---

## 📱 Mobile Responsiveness

The system is fully responsive and optimized for:

- Desktop computers (1920x1080+)
- Laptops (1366x768+)
- Tablets (768x1024+)
- Mobile phones (375x667+)

---

## 🔧 Installation & Setup

### For Development

```bash
# No installation required - pure HTML/CSS/JS
# Simply open dashboard.html in a browser
```

### For Production Deployment

```bash
# 1. Upload all files to web server
# 2. Configure database connection
# 3. Set up SSL certificate
# 4. Configure backup systems
# 5. Test all modules
```

---

## 📖 User Roles & Permissions

| Role                      | Assets | Inventory | Livestock | Reports | Admin   |
| ------------------------- | ------ | --------- | --------- | ------- | ------- |
| **IT Admin**              | Full   | Full      | Full      | Full    | Full    |
| **Manager (All by Unit)** | Edit   | Edit      | Edit      | View    | Limited |
| **Admin (All by Unit)**   | Edit   | Edit      | View      | View    | Limited |
| **Supervisor (by Unit)**  | View   | Edit      | Edit      | View    | Limited |
| **Staff (by Unit)**       | No     | No        | Edit      | View    | No      |
| **Visitor**               | View   | View      | View      | View    | No      |

**Permission Levels:**

- **Full** - Create, Read, Update, Delete, Export
- **Edit** - Create, Read, Update, Export
- **View** - Read only, Export
- **Limited** - View own unit/department only
- **No** - No access

**Access Scope:**

- **All by Unit** - Access to all records within assigned organizational unit
- **by Unit** - Access limited to own unit/department records only

**Organizational Units:**

- **Unit Stor** - Store & Inventory Management
- **Unit Kambing** - Goat Operations
- **Unit Ostrich** - Ostrich Farming
- **Unit Puyuh** - Quail Operations
- **Unit Lembu** - Cattle Operations
- **Unit Rusa** - Deer Farming
- **Unit RnD** - Research & Development
- **Unit Agro** - Agricultural Operations
- **Unit Arnab** - Rabbit Farming
- **Unit Latihan** - Training & Education
- **Unit Pentadbiran** - Administration
- **Unit Kesihatan** - Animal Health Services

---

## 🆘 Support & Documentation

### Government Contact

- **Department**: Jabatan Perkhidmatan Veterinar Negeri Perak
- **System**: G-VET ASSET & iSTOR SYSTEM
- **Framework**: KEW.PA, KEW.PS, KEW.AH

### Technical Support

- Check browser console for error messages
- Review activity logs in admin panel
- Contact IT department for system issues

---

## 📅 Version History

### Version 2.0 (Current)

- ✅ Complete KEW.PA module (36 forms)
- ✅ Complete KEW.PS module (36 forms)
- ✅ Complete KEW.AH module (8 forms)
- ✅ Advanced analytics & reporting
- ✅ QR code integration
- ✅ Dark mode support
- ✅ Real-time updates
- ✅ Mobile responsive design

---

## ⚖️ Legal Compliance

This system complies with:

- Akta Rahsia Rasmi 1972
- Peraturan Perbendaharaan Malaysia
- Garis Panduan Keselamatan ICT Sektor Awam
- Malaysian Government IT Standards

**⚠️ OFFICIAL GOVERNMENT SYSTEM**
Unauthorized access is prohibited and subject to legal action.

---

## 🏛️ Credits

**Developed for:**
Jabatan Perkhidmatan Veterinar Negeri Perak

**System Name:**
G-VET ASSET & iSTOR SYSTEM

**Frameworks:**
KEW.PA • KEW.PS • KEW.AH

## **Start Date:** October 2024

## 📞 Quick Links

- 🏠 [Dashboard](dashboard.html)
- 🖥️ [KEW.PA Assets](kewpa.html)
- 📦 [KEW.PS Store](kewps.html)
- 🐾 [KEW.AH Livestock](kewah.html)
- 📊 [Reports](reports.html)
- ⚙️ [Admin Panel](admin.html)

---

## 🇲🇾 SISTEM RASMI KERAJAAN MALAYSIA

_This is an official government system. All activities are monitored and logged for security purposes._

## 📞 Support

For government department support:

Team Developer

- **Full Stack Developer**: En. Alan
- **Advisor**: Pn. Shasha
- **QA**: En. Aieman
- **Helper**: En. Zul
- **Observer 1**: En. Andy

## 📄 License

Government Internal Use Only - Malaysian Government License

---

**🏛️ Sistem Rasmi Kerajaan Malaysia**
**G-VET ASSET & iSTOR MANAGEMENT SYSTEM (KEW.PA, KEW.PS & KEW.AH)**
# G-Vet
