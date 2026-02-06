// Audit Controller
const { AuditLog, User } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

class AuditController {
    // Get all audit logs
    async getAll(req, res) {
        try {
            const { 
                page = 1, 
                limit = 50, 
                action, 
                module,
                userId,
                startDate,
                endDate,
                search 
            } = req.query;
            
            const where = {};
            
            if (action) where.action = action;
            if (module) where.module = module;
            if (userId) where.userId = userId;
            if (search) {
                where[Op.or] = [
                    { username: { [Op.like]: `%${search}%` } },
                    { action: { [Op.like]: `%${search}%` } },
                    { module: { [Op.like]: `%${search}%` } },
                    { message: { [Op.like]: `%${search}%` } }
                ];
            }
            if (startDate && endDate) {
                where.createdAt = {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                };
            }
            
            const offset = (page - 1) * limit;
            
            const { rows: logs, count } = await AuditLog.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']],
                include: [{ 
                    model: User, 
                    as: 'user', 
                    attributes: ['id', 'username', 'fullName', 'role'] 
                }]
            });
            
            res.json({
                logs,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            });
            
        } catch (error) {
            logger.error('Get audit logs error:', error);
            res.status(500).json({ 
                error: 'Failed to fetch audit logs', 
                details: error.message 
            });
        }
    }

    // Get audit statistics
    async getStatistics(req, res) {
        try {
            const totalLogs = await AuditLog.count();
            
            const byAction = await AuditLog.findAll({
                attributes: [
                    'action',
                    [require('sequelize').fn('COUNT', '*'), 'count']
                ],
                group: ['action']
            });
            
            const byModule = await AuditLog.findAll({
                attributes: [
                    'module',
                    [require('sequelize').fn('COUNT', '*'), 'count']
                ],
                group: ['module']
            });
            
            const topUsers = await AuditLog.findAll({
                attributes: [
                    'userId',
                    'username',
                    [require('sequelize').fn('COUNT', '*'), 'count']
                ],
                group: ['userId', 'username'],
                order: [[require('sequelize').literal('count'), 'DESC']],
                limit: 10
            });
            
            // Recent activity (last 24 hours)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            const recentActivity = await AuditLog.count({
                where: {
                    createdAt: { [Op.gte]: yesterday }
                }
            });
            
            res.json({
                totalLogs,
                recentActivity,
                byAction,
                byModule,
                topUsers
            });
            
        } catch (error) {
            logger.error('Get audit statistics error:', error);
            res.status(500).json({ 
                error: 'Failed to fetch statistics', 
                details: error.message 
            });
        }
    }

    // Get user activity
    async getUserActivity(req, res) {
        try {
            const { userId } = req.params;
            const { limit = 20 } = req.query;
            
            const logs = await AuditLog.findAll({
                where: { userId },
                limit: parseInt(limit),
                order: [['createdAt', 'DESC']]
            });
            
            res.json({ logs });
            
        } catch (error) {
            logger.error('Get user activity error:', error);
            res.status(500).json({ 
                error: 'Failed to fetch user activity', 
                details: error.message 
            });
        }
    }
}

module.exports = new AuditController();
