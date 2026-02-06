// Asset Controller - KEW.PA Management
const { Asset, User } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

class AssetController {
    // Get all assets with filtering and pagination
    async getAll(req, res) {
        try {
            const { 
                page = 1, 
                limit = 20, 
                category, 
                status, 
                location, 
                department,
                search 
            } = req.query;
            
            const where = {};
            
            if (category) where.category = category;
            if (status) where.status = status;
            if (location) where.location = { [Op.like]: `%${location}%` };
            if (department) where.department = { [Op.like]: `%${department}%` };
            if (search) {
                where[Op.or] = [
                    { assetCode: { [Op.like]: `%${search}%` } },
                    { assetName: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ];
            }
            
            const offset = (page - 1) * limit;
            
            const { rows: assets, count } = await Asset.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']],
                include: [{ 
                    model: User, 
                    as: 'user', 
                    attributes: ['id', 'username', 'fullName'] 
                }]
            });
            
            res.json({
                assets,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            });
            
        } catch (error) {
            logger.error('Get assets error:', error);
            res.status(500).json({ 
                error: 'Failed to fetch assets', 
                details: error.message 
            });
        }
    }

    // Get single asset by ID
    async getById(req, res) {
        try {
            const asset = await Asset.findByPk(req.params.id, {
                include: [{ 
                    model: User, 
                    as: 'user', 
                    attributes: ['id', 'username', 'fullName'] 
                }]
            });
            
            if (!asset) {
                return res.status(404).json({ error: 'Asset not found' });
            }
            
            res.json({ asset });
            
        } catch (error) {
            logger.error('Get asset error:', error);
            res.status(500).json({ 
                error: 'Failed to fetch asset', 
                details: error.message 
            });
        }
    }

    // Create new asset
    async create(req, res) {
        try {
            const assetData = {
                ...req.body,
                userId: req.user.id
            };
            
            const asset = await Asset.create(assetData);
            
            // Emit WebSocket event
            if (req.app.get('socketio')) {
                req.app.get('socketio').emit('asset:created', asset);
            }
            
            logger.info(`Asset created: ${asset.assetCode} by ${req.user.username}`);
            
            res.status(201).json({
                message: 'Asset created successfully',
                asset
            });
            
        } catch (error) {
            logger.error('Create asset error:', error);
            res.status(500).json({ 
                error: 'Failed to create asset', 
                details: error.message 
            });
        }
    }

    // Update asset
    async update(req, res) {
        try {
            const asset = await Asset.findByPk(req.params.id);
            
            if (!asset) {
                return res.status(404).json({ error: 'Asset not found' });
            }
            
            await asset.update(req.body);
            
            // Emit WebSocket event
            if (req.app.get('socketio')) {
                req.app.get('socketio').emit('asset:updated', asset);
            }
            
            logger.info(`Asset updated: ${asset.assetCode} by ${req.user.username}`);
            
            res.json({
                message: 'Asset updated successfully',
                asset
            });
            
        } catch (error) {
            logger.error('Update asset error:', error);
            res.status(500).json({ 
                error: 'Failed to update asset', 
                details: error.message 
            });
        }
    }

    // Delete asset
    async delete(req, res) {
        try {
            const asset = await Asset.findByPk(req.params.id);
            
            if (!asset) {
                return res.status(404).json({ error: 'Asset not found' });
            }
            
            const assetCode = asset.assetCode;
            await asset.destroy();
            
            // Emit WebSocket event
            if (req.app.get('socketio')) {
                req.app.get('socketio').emit('asset:deleted', { id: req.params.id });
            }
            
            logger.info(`Asset deleted: ${assetCode} by ${req.user.username}`);
            
            res.json({ message: 'Asset deleted successfully' });
            
        } catch (error) {
            logger.error('Delete asset error:', error);
            res.status(500).json({ 
                error: 'Failed to delete asset', 
                details: error.message 
            });
        }
    }

    // Get asset statistics
    async getStatistics(req, res) {
        try {
            const totalAssets = await Asset.count();
            const activeAssets = await Asset.count({ where: { status: 'Active' } });
            const maintenanceAssets = await Asset.count({ where: { status: 'Under Maintenance' } });
            const disposedAssets = await Asset.count({ where: { status: 'Disposed' } });
            
            const byCategory = await Asset.findAll({
                attributes: [
                    'category',
                    [require('sequelize').fn('COUNT', '*'), 'count']
                ],
                group: ['category']
            });
            
            const totalValue = await Asset.sum('purchasePrice') || 0;
            
            res.json({
                totalAssets,
                activeAssets,
                maintenanceAssets,
                disposedAssets,
                byCategory,
                totalValue
            });
            
        } catch (error) {
            logger.error('Get asset statistics error:', error);
            res.status(500).json({ 
                error: 'Failed to fetch statistics', 
                details: error.message 
            });
        }
    }
}

module.exports = new AssetController();
