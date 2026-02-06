# G-VET System - Installation Guide

## Prerequisites

- Node.js 18.0.0 or higher
- MySQL 8.0 or higher
- npm 9.0.0 or higher
- Git (optional)

## Installation Steps

### 1. Install Node.js Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js (web framework)
- Sequelize (ORM)
- JWT (authentication)
- Multer (file uploads)
- And 20+ other dependencies

### 2. Database Setup

#### Create Database
```sql
mysql -u root -p
CREATE DATABASE gvet_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'gvet_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON gvet_system.* TO 'gvet_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Configure Environment
```bash
# Copy environment template
copy .env.example .env

# Edit .env file with your settings
notepad .env
```

**Required Environment Variables:**
- `DB_HOST` - Database host (localhost)
- `DB_NAME` - Database name (gvet_system)
- `DB_USER` - Database user (gvet_user)
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key (min 32 chars)
- `SMTP_*` - Email configuration

### 3. Run Database Migration

```bash
npm run migrate
```

This creates all necessary tables:
- Users
- Assets (KEW.PA)
- Inventory (KEW.PS)
- Livestock (KEW.AH)
- AuditLogs

### 4. Seed Demo Data (Optional)

```bash
npm run seed
```

Creates demo users:
- admin / admin123
- manager / manager123
- staff / staff123
- visitor / visitor123

### 5. Start the Server

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

### 6. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api/v1
- **Health Check**: http://localhost:3000/api/health

## Docker Installation (Alternative)

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

Docker Compose will automatically:
- Create MySQL database
- Run migrations
- Start the application
- Configure Nginx reverse proxy

## Post-Installation

### 1. Verify Installation

```bash
# Check server status
curl http://localhost:3000/api/health

# Should return:
# {"status":"OK","timestamp":"...","uptime":...}
```

### 2. Test Login

Visit http://localhost:3000 and login with:
- Username: admin
- Password: admin123

### 3. Configure Email (Optional)

Edit `.env` file:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

For Gmail, create an App Password:
1. Go to Google Account Settings
2. Security → 2-Step Verification
3. App passwords → Generate

### 4. Setup Backup Schedule

Backups run automatically at 2 AM daily.
To change schedule, edit `.env`:
```env
BACKUP_SCHEDULE=0 2 * * *  # Cron format
```

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Change port in .env
PORT=3001
```

### Database Connection Error
1. Verify MySQL is running
2. Check credentials in `.env`
3. Ensure database exists
4. Check firewall settings

### Cannot Upload Files
```bash
# Create upload directories
mkdir uploads\assets
mkdir uploads\livestock
mkdir uploads\documents
mkdir uploads\qrcodes
```

### Email Not Sending
1. Verify SMTP settings
2. Check firewall/antivirus
3. Enable "Less secure app access" (Gmail)
4. Use App Password instead of regular password

## System Requirements

### Minimum
- CPU: 2 cores
- RAM: 2GB
- Disk: 20GB
- OS: Windows 10/11, Linux, macOS

### Recommended
- CPU: 4 cores
- RAM: 4GB
- Disk: 50GB SSD
- OS: Ubuntu 20.04+ or Windows Server 2019+

## Security Checklist

- [ ] Change default passwords
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Configure HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Enable audit logging
- [ ] Configure backup schedule
- [ ] Restrict database access
- [ ] Keep dependencies updated

## Next Steps

1. Change default admin password
2. Create user accounts for your team
3. Configure email notifications
4. Set up SSL certificate
5. Configure automatic backups
6. Review audit logs regularly

## Getting Help

- Check logs: `logs/combined.log`
- View errors: `logs/error.log`
- API documentation: `/api/v1` endpoints
- Health status: `/api/health`

For production deployment, see `BUILD_COMPLETE.md`
