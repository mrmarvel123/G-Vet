// Email Notification Service
const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Create transporter
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        logger.error('Email transporter error:', error);
    } else {
        logger.info('✅ Email service ready');
    }
});

// Send email
async function sendEmail(to, subject, html, attachments = []) {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || 'G-VET System <noreply@gvet.gov.my>',
            to: to,
            subject: subject,
            html: html,
            attachments: attachments
        };
        
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error('Email send error:', error);
        throw error;
    }
}

// Email templates
const templates = {
    welcome: (user) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #667eea;">Welcome to G-VET System</h2>
            <p>Hello ${user.fullName},</p>
            <p>Your account has been created successfully.</p>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p>Please login to access the system.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
                ${process.env.ORGANIZATION}<br>
                ${process.env.SYSTEM_NAME}
            </p>
        </div>
    `,
    
    lowStockAlert: (item) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f59e0b;">Low Stock Alert</h2>
            <p>The following item is running low on stock:</p>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Item Code:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${item.itemCode}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Item Name:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${item.itemName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Current Stock:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${item.currentStock}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Minimum Stock:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${item.minimumStock}</td>
                </tr>
            </table>
            <p>Please restock this item as soon as possible.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
                ${process.env.ORGANIZATION}<br>
                ${process.env.SYSTEM_NAME}
            </p>
        </div>
    `,
    
    livestockHealthAlert: (animal) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ef4444;">Livestock Health Alert</h2>
            <p>A livestock animal requires attention:</p>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Animal Code:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${animal.animalCode}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Species:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${animal.species}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Health Status:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${animal.healthStatus}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Location:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${animal.location}</td>
                </tr>
            </table>
            <p>Please check on this animal immediately.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
                ${process.env.ORGANIZATION}<br>
                ${process.env.SYSTEM_NAME}
            </p>
        </div>
    `,
    
    maintenanceReminder: (asset) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Asset Maintenance Reminder</h2>
            <p>The following asset requires maintenance:</p>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Asset Code:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${asset.assetCode}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Asset Name:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${asset.assetName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Location:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${asset.location}</td>
                </tr>
            </table>
            <p>Please schedule maintenance for this asset.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
                ${process.env.ORGANIZATION}<br>
                ${process.env.SYSTEM_NAME}
            </p>
        </div>
    `
};

// Send welcome email
async function sendWelcomeEmail(user) {
    return await sendEmail(
        user.email,
        'Welcome to G-VET System',
        templates.welcome(user)
    );
}

// Send low stock alert
async function sendLowStockAlert(item, recipients) {
    return await sendEmail(
        recipients,
        `Low Stock Alert: ${item.itemName}`,
        templates.lowStockAlert(item)
    );
}

// Send livestock health alert
async function sendLivestockHealthAlert(animal, recipients) {
    return await sendEmail(
        recipients,
        `Livestock Health Alert: ${animal.animalCode}`,
        templates.livestockHealthAlert(animal)
    );
}

// Send maintenance reminder
async function sendMaintenanceReminder(asset, recipients) {
    return await sendEmail(
        recipients,
        `Maintenance Reminder: ${asset.assetName}`,
        templates.maintenanceReminder(asset)
    );
}

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendLowStockAlert,
    sendLivestockHealthAlert,
    sendMaintenanceReminder
};
