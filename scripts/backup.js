// Database Backup Script
require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

const BACKUP_DIR = process.env.BACKUP_DIR || './backups';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '3306';
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function generateBackupFilename() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `gvet_backup_${timestamp}.sql`;
}

function performBackup() {
    return new Promise((resolve, reject) => {
        const filename = generateBackupFilename();
        const filepath = path.join(BACKUP_DIR, filename);
        
        // mysqldump command
        const command = `mysqldump -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > "${filepath}"`;
        
        logger.info(`Starting database backup: ${filename}`);
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                logger.error('Backup failed:', error);
                reject(error);
                return;
            }
            
            if (stderr && !stderr.includes('Warning')) {
                logger.error('Backup stderr:', stderr);
            }
            
            // Verify backup file exists and has content
            if (fs.existsSync(filepath)) {
                const stats = fs.statSync(filepath);
                if (stats.size > 0) {
                    logger.info(`Backup completed successfully: ${filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
                    resolve({ filename, filepath, size: stats.size });
                } else {
                    logger.error('Backup file is empty');
                    reject(new Error('Backup file is empty'));
                }
            } else {
                logger.error('Backup file not created');
                reject(new Error('Backup file not created'));
            }
        });
    });
}

function cleanOldBackups() {
    return new Promise((resolve, reject) => {
        fs.readdir(BACKUP_DIR, (err, files) => {
            if (err) {
                logger.error('Error reading backup directory:', err);
                reject(err);
                return;
            }
            
            const now = Date.now();
            const retentionMs = RETENTION_DAYS * 24 * 60 * 60 * 1000;
            let deletedCount = 0;
            
            files.forEach(file => {
                if (file.endsWith('.sql')) {
                    const filepath = path.join(BACKUP_DIR, file);
                    const stats = fs.statSync(filepath);
                    const age = now - stats.mtimeMs;
                    
                    if (age > retentionMs) {
                        fs.unlinkSync(filepath);
                        deletedCount++;
                        logger.info(`Deleted old backup: ${file}`);
                    }
                }
            });
            
            logger.info(`Cleanup completed: ${deletedCount} old backup(s) deleted`);
            resolve(deletedCount);
        });
    });
}

function listBackups() {
    return new Promise((resolve, reject) => {
        fs.readdir(BACKUP_DIR, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            
            const backups = files
                .filter(file => file.endsWith('.sql'))
                .map(file => {
                    const filepath = path.join(BACKUP_DIR, file);
                    const stats = fs.statSync(filepath);
                    return {
                        filename: file,
                        filepath,
                        size: stats.size,
                        created: stats.mtime
                    };
                })
                .sort((a, b) => b.created - a.created);
            
            resolve(backups);
        });
    });
}

// Main execution
async function main() {
    try {
        console.log('=== G-VET Database Backup ===\n');
        
        // Perform backup
        const backup = await performBackup();
        console.log(`✅ Backup created: ${backup.filename}`);
        console.log(`   Size: ${(backup.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Location: ${backup.filepath}\n`);
        
        // Clean old backups
        const deletedCount = await cleanOldBackups();
        console.log(`🧹 Cleaned ${deletedCount} old backup(s)\n`);
        
        // List all backups
        const backups = await listBackups();
        console.log(`📁 Total backups: ${backups.length}`);
        console.log('Recent backups:');
        backups.slice(0, 5).forEach(b => {
            console.log(`   - ${b.filename} (${(b.size / 1024 / 1024).toFixed(2)} MB) - ${b.created.toLocaleString()}`);
        });
        
        console.log('\n✅ Backup process completed successfully');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Backup process failed:', error.message);
        logger.error('Backup process failed:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = {
    performBackup,
    cleanOldBackups,
    listBackups
};
