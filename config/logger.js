// Logging Configuration
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logDir = process.env.LOG_DIR || './logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
    })
);

// Create logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'g-vet-system' },
    transports: [
        // Write all logs to combined.log
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: parseInt(process.env.LOG_MAX_SIZE) || 10485760, // 10MB
            maxFiles: parseInt(process.env.LOG_MAX_FILES) || 14
        }),
        // Write errors to error.log
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 10485760,
            maxFiles: 14
        }),
        // Write audit logs to audit.log
        new winston.transports.File({
            filename: path.join(logDir, 'audit.log'),
            level: 'info',
            maxsize: 10485760,
            maxFiles: parseInt(process.env.AUDIT_LOG_RETENTION_DAYS) || 365
        })
    ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

// Create a stream object for Morgan
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

module.exports = logger;
