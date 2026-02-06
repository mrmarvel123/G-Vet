// Asset Routes - KEW.PA Management
const express = require('express');
const router = express.Router();
const { Asset } = require('../models');
const { verifyToken, checkRole } = require('../middleware/auth');
const auditLog = require('../middleware/audit');
const { Op } = require('sequelize');

const assetController = require('../controllers/asset.controller');
const { assetSchemas, validate: validateAsset } = require('../validators/asset.validator');

// Get all assets with filtering
router.get('/', verifyToken, (req, res) => assetController.getAll(req, res));

// Get single asset
router.get('/:id', verifyToken, (req, res) => assetController.getById(req, res));

// Create new asset
router.post('/', verifyToken, checkRole('admin', 'manager', 'staff'), validateAsset(assetSchemas.create), auditLog('create', 'asset'), (req, res) => assetController.create(req, res));

// Update asset
router.put('/:id', verifyToken, checkRole('admin', 'manager', 'staff'), validateAsset(assetSchemas.update), auditLog('update', 'asset'), (req, res) => assetController.update(req, res));

// Delete asset
router.delete('/:id', verifyToken, checkRole('admin', 'manager'), auditLog('delete', 'asset'), (req, res) => assetController.delete(req, res));

// Get asset statistics
router.get('/stats/summary', verifyToken, (req, res) => assetController.getStatistics(req, res));

module.exports = router;
