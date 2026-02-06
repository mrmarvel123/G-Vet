// Database Restore Script
require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const logger = require('../config/logger');

const BACKUP_DIR = process.env.BACKUP_DIR || './backups';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '3306';
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

function listBackupFiles() {
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

function performRestore(backupPath) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(backupPath)) {
            reject(new Error('Backup file not found'));
            return;
        }
        
        // mysql command to restore
        const command = `mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < "${backupPath}"`;
        
        logger.info(`Starting database restore from: ${backupPath}`);
        console.log('⚠️  Warning: This will overwrite the current database!');
        console.log('Restoring database...\n');
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                logger.error('Restore failed:', error);
                reject(error);
                return;
            }
            
            if (stderr && !stderr.includes('Warning')) {
                logger.error('Restore stderr:', stderr);
            }
            
            logger.info('Database restored successfully');
            resolve();
        });
    });
}

function promptUser(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function main() {
    try {
        console.log('=== G-VET Database Restore ===\n');
        
        // List available backups
        const backups = await listBackupFiles();
        
        if (backups.length === 0) {
            console.log('❌ No backup files found in:', BACKUP_DIR);
            process.exit(1);
        }
        
        console.log('Available backups:\n');
        backups.forEach((backup, index) => {
            console.log(`${index + 1}. ${backup.filename}`);
            console.log(`   Size: ${(backup.size / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Date: ${backup.created.toLocaleString()}\n`);
        });
        
        // Get user selection
        const selection = await promptUser('Enter backup number to restore (or 0 to cancel): ');
        const selectedIndex = parseInt(selection) - 1;
        
        if (selectedIndex === -1) {
            console.log('Restore cancelled by user');
            process.exit(0);
        }
        
        if (selectedIndex < 0 || selectedIndex >= backups.length) {
            console.log('❌ Invalid selection');
            process.exit(1);
        }
        
        const selectedBackup = backups[selectedIndex];
        
        // Confirm restore
        const confirm = await promptUser(`\n⚠️  This will restore database from:\n   ${selectedBackup.filename}\n   Created: ${selectedBackup.created.toLocaleString()}\n\nAre you sure? (yes/no): `);
        
        if (confirm.toLowerCase() !== 'yes') {
            console.log('Restore cancelled by user');
            process.exit(0);
        }
        
        // Perform restore
        await performRestore(selectedBackup.filepath);
        
        console.log('\n✅ Database restored successfully!');
        console.log(`   From: ${selectedBackup.filename}`);
        console.log('\n⚠️  Please restart the application for changes to take effect.');
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ Restore process failed:', error.message);
        logger.error('Restore process failed:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = {
    performRestore,
    listBackupFiles
};
