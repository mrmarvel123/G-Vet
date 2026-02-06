// JWT Authentication Middleware
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../config/logger');

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
};

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access token required' });
        }
        
        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findByPk(decoded.id);
        
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'User not found or inactive' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        logger.error('Token verification error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Check Role Middleware
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Forbidden',
                message: `Required role: ${allowedRoles.join(' or ')}`
            });
        }
        
        next();
    };
};

// Optional Auth (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id);
            
            if (user && user.isActive) {
                req.user = user;
            }
        }
    } catch (error) {
        // Silently continue without user
    }
    
    next();
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    checkRole,
    optionalAuth
};
