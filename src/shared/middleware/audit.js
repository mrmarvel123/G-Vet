// Audit Log Middleware
const { AuditLog } = require('../../database/models');
const logger = require('../../config/logger');

const auditLog = (action, module) => {
    return async (req, res, next) => {
        // Store original send function
        const originalSend = res.send;
        
        // Override send function
        res.send = function(data) {
            // Create audit log entry
            const logEntry = {
                userId: req.user?.id || null,
                username: req.user?.username || 'Anonymous',
                action: action,
                module: module,
                recordId: req.params.id || req.body?.id || null,
                recordType: module,
                newValue: req.method === 'POST' || req.method === 'PUT' ? req.body : null,
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                status: res.statusCode < 400 ? 'success' : 'failure',
                message: `${action} ${module}`
            };
            
            // Save audit log asynchronously
            AuditLog.create(logEntry).catch(err => {
                logger.error('Failed to create audit log:', err);
            });
            
            // Call original send
            originalSend.call(this, data);
        };
        
        next();
    };
};

module.exports = auditLog;
