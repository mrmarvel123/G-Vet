// Database Backup Service
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const logger = require('../../config/logger');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Ensure backup directory exists
const backupDir = process.env.BACKUP_DIR || './backups';
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// Create database backup
async function createBackup() {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `gvet_backup_${timestamp}.sql`;
        const filepath = path.join(backupDir, filename);
        
        const dbHost = process.env.DB_HOST || 'localhost';
        const dbUser = process.env.DB_USER || 'root';
        const dbPassword = process.env.DB_PASSWORD || '';
        const dbName = process.env.DB_NAME || 'gvet_system';
        
        // MySQL dump command
        const command = `mysqldump -h ${dbHost} -u ${dbUser} -p${dbPassword} ${dbName} > "${filepath}"`;
        
        await execAsync(command);
        
        logger.info(`✅ Database backup created: ${filename}`);
        
        // Clean old backups
        await cleanOldBackups();
        
        return { success: true, filename, filepath };
        
    } catch (error) {
        logger.error('❌ Database backup failed:', error);
        return { success: false, error: error.message };
    }
}

// Restore database from backup
async function restoreBackup(filename) {
    try {
        const filepath = path.join(backupDir, filename);
        
        if (!fs.existsSync(filepath)) {
            throw new Error('Backup file not found');
        }
        
        const dbHost = process.env.DB_HOST || 'localhost';
        const dbUser = process.env.DB_USER || 'root';
        const dbPassword = process.env.DB_PASSWORD || '';
        const dbName = process.env.DB_NAME || 'gvet_system';
        
        // MySQL restore command
        const command = `mysql -h ${dbHost} -u ${dbUser} -p${dbPassword} ${dbName} < "${filepath}"`;
        
        await execAsync(command);
        
        logger.info(`✅ Database restored from: ${filename}`);
        
        return { success: true, filename };
        
    } catch (error) {
        logger.error('❌ Database restore failed:', error);
        return { success: false, error: error.message };
    }
}

// Clean old backups
async function cleanOldBackups() {
    try {
        const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
        
        const files = fs.readdirSync(backupDir);
        let deletedCount = 0;
        
        files.forEach(file => {
            const filepath = path.join(backupDir, file);
            const stats = fs.statSync(filepath);
            
            if (stats.mtime < cutoffDate) {
                fs.unlinkSync(filepath);
                deletedCount++;
                logger.info(`🗑️ Deleted old backup: ${file}`);
            }
        });
        
        if (deletedCount > 0) {
            logger.info(`✅ Cleaned ${deletedCount} old backup(s)`);
        }
        
    } catch (error) {
        logger.error('❌ Backup cleanup failed:', error);
    }
}

// List all backups
function listBackups() {
    try {
        const files = fs.readdirSync(backupDir);
        
        const backups = files
            .filter(file => file.endsWith('.sql'))
            .map(file => {
                const filepath = path.join(backupDir, file);
                const stats = fs.statSync(filepath);
                
                return {
                    filename: file,
                    size: stats.size,
                    created: stats.mtime,
                    age: Math.floor((Date.now() - stats.mtime) / (1000 * 60 * 60 * 24)) // days
                };
            })
            .sort((a, b) => b.created - a.created);
        
        return backups;
        
    } catch (error) {
        logger.error('❌ List backups failed:', error);
        return [];
    }
}

// Schedule automatic backups
function scheduleBackups() {
    const cron = require('node-cron');
    const schedule = process.env.BACKUP_SCHEDULE || '0 2 * * *'; // 2 AM daily
    
    cron.schedule(schedule, async () => {
        logger.info('🔄 Starting scheduled backup...');
        await createBackup();
    });
    
    logger.info(`✅ Backup scheduler started: ${schedule}`);
}

module.exports = {
    createBackup,
    restoreBackup,
    cleanOldBackups,
    listBackups,
    scheduleBackups
};
