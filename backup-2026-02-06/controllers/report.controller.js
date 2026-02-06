// Report Controller
const { Asset, Inventory, Livestock } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

class ReportController {
    // Generate asset report
    async getAssetReport(req, res) {
        try {
            const { startDate, endDate, category, status, department } = req.query;
            
            const where = {};
            
            if (startDate && endDate) {
                where.createdAt = {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                };
            }
            if (category) where.category = category;
            if (status) where.status = status;
            if (department) where.department = department;
            
            const assets = await Asset.findAll({
                where,
                order: [['createdAt', 'DESC']]
            });
            
            const totalValue = assets.reduce((sum, asset) => sum + (parseFloat(asset.purchasePrice) || 0), 0);
            
            res.json({
                report: 'Asset Report',
                period: { startDate, endDate },
                filters: { category, status, department },
                totalAssets: assets.length,
                totalValue,
                assets
            });
            
        } catch (error) {
            logger.error('Generate asset report error:', error);
            res.status(500).json({ 
                error: 'Failed to generate report', 
                details: error.message 
            });
        }
    }

    // Generate inventory report
    async getInventoryReport(req, res) {
        try {
            const { startDate, endDate, category, lowStock } = req.query;
            
            const where = {};
            
            if (startDate && endDate) {
                where.createdAt = {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                };
            }
            if (category) where.category = category;
            if (lowStock === 'true') {
                where.currentStock = { [Op.lte]: require('sequelize').col('minimumStock') };
            }
            
            const items = await Inventory.findAll({
                where,
                order: [['createdAt', 'DESC']]
            });
            
            const totalValue = items.reduce((sum, item) => sum + (parseFloat(item.totalValue) || 0), 0);
            const lowStockCount = items.filter(item => item.currentStock <= item.minimumStock).length;
            
            res.json({
                report: 'Inventory Report',
                period: { startDate, endDate },
                filters: { category, lowStock },
                totalItems: items.length,
                totalValue,
                lowStockCount,
                items
            });
            
        } catch (error) {
            logger.error('Generate inventory report error:', error);
            res.status(500).json({ 
                error: 'Failed to generate report', 
                details: error.message 
            });
        }
    }

    // Generate livestock report
    async getLivestockReport(req, res) {
        try {
            const { startDate, endDate, species, healthStatus } = req.query;
            
            const where = {};
            
            if (startDate && endDate) {
                where.createdAt = {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                };
            }
            if (species) where.species = species;
            if (healthStatus) where.healthStatus = healthStatus;
            
            const livestock = await Livestock.findAll({
                where,
                order: [['createdAt', 'DESC']]
            });
            
            const totalValue = livestock.reduce((sum, animal) => sum + (parseFloat(animal.acquisitionPrice) || 0), 0);
            const healthyCount = livestock.filter(animal => animal.healthStatus === 'Healthy').length;
            
            res.json({
                report: 'Livestock Report',
                period: { startDate, endDate },
                filters: { species, healthStatus },
                totalLivestock: livestock.length,
                totalValue,
                healthyCount,
                livestock
            });
            
        } catch (error) {
            logger.error('Generate livestock report error:', error);
            res.status(500).json({ 
                error: 'Failed to generate report', 
                details: error.message 
            });
        }
    }

    // Generate dashboard report
    async getDashboardReport(req, res) {
        try {
            // Asset statistics
            const totalAssets = await Asset.count();
            const activeAssets = await Asset.count({ where: { status: 'Active' } });
            const assetValue = await Asset.sum('purchasePrice') || 0;
            
            // Inventory statistics
            const totalInventory = await Inventory.count();
            const lowStockItems = await Inventory.count({
                where: {
                    currentStock: { [Op.lte]: require('sequelize').col('minimumStock') }
                }
            });
            const inventoryValue = await Inventory.sum('totalValue') || 0;
            
            // Livestock statistics
            const totalLivestock = await Livestock.count();
            const healthyLivestock = await Livestock.count({ where: { healthStatus: 'Healthy' } });
            const livestockValue = await Livestock.sum('acquisitionPrice') || 0;
            
            res.json({
                assets: {
                    total: totalAssets,
                    active: activeAssets,
                    value: assetValue
                },
                inventory: {
                    total: totalInventory,
                    lowStock: lowStockItems,
                    value: inventoryValue
                },
                livestock: {
                    total: totalLivestock,
                    healthy: healthyLivestock,
                    value: livestockValue
                },
                totalSystemValue: assetValue + inventoryValue + livestockValue
            });
            
        } catch (error) {
            logger.error('Generate dashboard report error:', error);
            res.status(500).json({ 
                error: 'Failed to generate report', 
                details: error.message 
            });
        }
    }
}

module.exports = new ReportController();
