// Cleanup Old Backups Script
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

const BACKUP_DIR = process.env.BACKUP_DIR || './backups';
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;

function cleanupOldBackups() {
    return new Promise((resolve, reject) => {
        console.log('=== G-VET Backup Cleanup ===\n');
        console.log(`Backup Directory: ${BACKUP_DIR}`);
        console.log(`Retention Period: ${RETENTION_DAYS} days\n`);
        
        fs.readdir(BACKUP_DIR, (err, files) => {
            if (err) {
                logger.error('Error reading backup directory:', err);
                reject(err);
                return;
            }
            
            const now = Date.now();
            const retentionMs = RETENTION_DAYS * 24 * 60 * 60 * 1000;
            let deletedFiles = [];
            let keptFiles = [];
            
            files.forEach(file => {
                if (file.endsWith('.sql')) {
                    const filepath = path.join(BACKUP_DIR, file);
                    const stats = fs.statSync(filepath);
                    const age = now - stats.mtimeMs;
                    const ageInDays = Math.floor(age / (24 * 60 * 60 * 1000));
                    
                    if (age > retentionMs) {
                        try {
                            fs.unlinkSync(filepath);
                            deletedFiles.push({
                                filename: file,
                                size: stats.size,
                                age: ageInDays
                            });
                            logger.info(`Deleted old backup: ${file} (${ageInDays} days old)`);
                        } catch (error) {
                            logger.error(`Failed to delete ${file}:`, error);
                        }
                    } else {
                        keptFiles.push({
                            filename: file,
                            size: stats.size,
                            age: ageInDays
                        });
                    }
                }
            });
            
            // Display results
            console.log('Cleanup Results:\n');
            
            if (deletedFiles.length > 0) {
                console.log(`🗑️  Deleted ${deletedFiles.length} old backup(s):`);
                deletedFiles.forEach(file => {
                    console.log(`   - ${file.filename} (${(file.size / 1024 / 1024).toFixed(2)} MB, ${file.age} days old)`);
                });
            } else {
                console.log('✅ No old backups to delete');
            }
            
            if (keptFiles.length > 0) {
                console.log(`\n📁 Kept ${keptFiles.length} backup(s):`);
                keptFiles.slice(0, 10).forEach(file => {
                    console.log(`   - ${file.filename} (${(file.size / 1024 / 1024).toFixed(2)} MB, ${file.age} days old)`);
                });
                if (keptFiles.length > 10) {
                    console.log(`   ... and ${keptFiles.length - 10} more`);
                }
            }
            
            // Calculate total size
            const totalSize = keptFiles.reduce((sum, file) => sum + file.size, 0);
            console.log(`\n💾 Total backup storage: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
            
            logger.info(`Cleanup completed: ${deletedFiles.length} deleted, ${keptFiles.length} kept`);
            resolve({ deleted: deletedFiles.length, kept: keptFiles.length });
        });
    });
}

// Main execution
async function main() {
    try {
        const result = await cleanupOldBackups();
        console.log('\n✅ Cleanup process completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Cleanup process failed:', error.message);
        logger.error('Cleanup process failed:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = {
    cleanupOldBackups
};
