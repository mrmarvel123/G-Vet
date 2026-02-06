// Report Generation Routes
const express = require('express');
const router = express.Router();
const { Asset, Inventory, Livestock, User, AuditLog } = require('../models');
const { verifyToken, checkRole } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { Op } = require('sequelize');

// Generate Asset Report
router.get('/assets', verifyToken, async (req, res) => {
    try {
        const { format = 'json', category, status, startDate, endDate } = req.query;
        
        const where = {};
        if (category) where.category = category;
        if (status) where.status = status;
        if (startDate || endDate) {
            where.purchaseDate = {};
            if (startDate) where.purchaseDate[Op.gte] = startDate;
            if (endDate) where.purchaseDate[Op.lte] = endDate;
        }
        
        const assets = await Asset.findAll({
            where,
            include: [{ model: User, as: 'user', attributes: ['username', 'fullName'] }],
            order: [['createdAt', 'DESC']]
        });
        
        if (format === 'pdf') {
            return generatePDFReport(res, 'Asset Report', assets, [
                'assetCode', 'assetName', 'category', 'status', 'location', 'purchasePrice'
            ]);
        } else if (format === 'excel') {
            return generateExcelReport(res, 'Asset Report', assets);
        }
        
        res.json({ assets, total: assets.length });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate report', details: error.message });
    }
});

// Generate Inventory Report
router.get('/inventory', verifyToken, async (req, res) => {
    try {
        const { format = 'json', category, status, lowStock } = req.query;
        
        const where = {};
        if (category) where.category = category;
        if (status) where.status = status;
        if (lowStock === 'true') {
            where.currentStock = { [Op.lte]: require('sequelize').col('minimumStock') };
        }
        
        const items = await Inventory.findAll({
            where,
            include: [{ model: User, as: 'user', attributes: ['username', 'fullName'] }],
            order: [['itemName', 'ASC']]
        });
        
        if (format === 'pdf') {
            return generatePDFReport(res, 'Inventory Report', items, [
                'itemCode', 'itemName', 'category', 'currentStock', 'minimumStock', 'unitPrice', 'totalValue'
            ]);
        } else if (format === 'excel') {
            return generateExcelReport(res, 'Inventory Report', items);
        }
        
        res.json({ items, total: items.length });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate report', details: error.message });
    }
});

// Generate Livestock Report
router.get('/livestock', verifyToken, async (req, res) => {
    try {
        const { format = 'json', species, healthStatus } = req.query;
        
        const where = {};
        if (species) where.species = species;
        if (healthStatus) where.healthStatus = healthStatus;
        
        const livestock = await Livestock.findAll({
            where,
            include: [{ model: User, as: 'user', attributes: ['username', 'fullName'] }],
            order: [['animalCode', 'ASC']]
        });
        
        if (format === 'pdf') {
            return generatePDFReport(res, 'Livestock Report', livestock, [
                'animalCode', 'species', 'breed', 'gender', 'healthStatus', 'location'
            ]);
        } else if (format === 'excel') {
            return generateExcelReport(res, 'Livestock Report', livestock);
        }
        
        res.json({ livestock, total: livestock.length });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate report', details: error.message });
    }
});

// Dashboard Statistics
router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        const assetStats = {
            total: await Asset.count(),
            active: await Asset.count({ where: { status: 'Active' } }),
            totalValue: await Asset.sum('purchasePrice') || 0
        };
        
        const inventoryStats = {
            total: await Inventory.count(),
            lowStock: await Inventory.count({
                where: { currentStock: { [Op.lte]: require('sequelize').col('minimumStock') } }
            }),
            totalValue: await Inventory.sum('totalValue') || 0
        };
        
        const livestockStats = {
            total: await Livestock.count(),
            healthy: await Livestock.count({ where: { healthStatus: 'Healthy' } }),
            totalValue: await Livestock.sum('acquisitionPrice') || 0
        };
        
        const userStats = {
            total: await User.count(),
            active: await User.count({ where: { isActive: true } }),
            byRole: await User.findAll({
                attributes: ['role', [require('sequelize').fn('COUNT', '*'), 'count']],
                group: ['role']
            })
        };
        
        res.json({
            assets: assetStats,
            inventory: inventoryStats,
            livestock: livestockStats,
            users: userStats
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats', details: error.message });
    }
});

// Helper function to generate PDF
function generatePDFReport(res, title, data, columns) {
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/ /g, '_')}.pdf"`);
    
    doc.pipe(res);
    
    // Header
    doc.fontSize(20).text(title, { align: 'center' });
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown();
    
    // Table
    const tableTop = 150;
    let y = tableTop;
    
    // Column headers
    columns.forEach((col, i) => {
        doc.fontSize(10).text(col, 50 + (i * 80), y, { width: 75 });
    });
    
    y += 20;
    
    // Data rows
    data.forEach((row, index) => {
        columns.forEach((col, i) => {
            const value = row[col] !== null && row[col] !== undefined ? row[col].toString() : '';
            doc.fontSize(8).text(value, 50 + (i * 80), y, { width: 75 });
        });
        y += 15;
        
        if (y > 700) {
            doc.addPage();
            y = 50;
        }
    });
    
    doc.end();
}

// Helper function to generate Excel
async function generateExcelReport(res, title, data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);
    
    // Add columns based on data keys
    if (data.length > 0) {
        const columns = Object.keys(data[0].toJSON ? data[0].toJSON() : data[0]);
        worksheet.columns = columns.map(key => ({ header: key, key: key, width: 15 }));
        
        // Add rows
        data.forEach(row => {
            worksheet.addRow(row.toJSON ? row.toJSON() : row);
        });
    }
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/ /g, '_')}.xlsx"`);
    
    await workbook.xlsx.write(res);
    res.end();
}

module.exports = router;
