// Livestock Controller - KEW.AH Management
const { Livestock, User } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

class LivestockController {
    // Get all livestock
    async getAll(req, res) {
        try {
            const { 
                page = 1, 
                limit = 20, 
                species, 
                healthStatus, 
                location,
                search 
            } = req.query;
            
            const where = {};
            
            if (species) where.species = species;
            if (healthStatus) where.healthStatus = healthStatus;
            if (location) where.location = { [Op.like]: `%${location}%` };
            if (search) {
                where[Op.or] = [
                    { animalCode: { [Op.like]: `%${search}%` } },
                    { name: { [Op.like]: `%${search}%` } },
                    { breed: { [Op.like]: `%${search}%` } }
                ];
            }
            
            const offset = (page - 1) * limit;
            
            const { rows: livestock, count } = await Livestock.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']],
                include: [
                    { model: User, as: 'user', attributes: ['id', 'username', 'fullName'] },
                    { model: Livestock, as: 'mother', attributes: ['id', 'animalCode', 'name'] },
                    { model: Livestock, as: 'father', attributes: ['id', 'animalCode', 'name'] }
                ]
            });
            
            res.json({
                livestock,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            });
            
        } catch (error) {
            logger.error('Get livestock error:', error);
            res.status(500).json({ 
                error: 'Failed to fetch livestock', 
                details: error.message 
            });
        }
    }

    // Get single livestock
    async getById(req, res) {
        try {
            const animal = await Livestock.findByPk(req.params.id, {
                include: [
                    { model: User, as: 'user', attributes: ['id', 'username', 'fullName'] },
                    { model: Livestock, as: 'mother', attributes: ['id', 'animalCode', 'name'] },
                    { model: Livestock, as: 'father', attributes: ['id', 'animalCode', 'name'] }
                ]
            });
            
            if (!animal) {
                return res.status(404).json({ error: 'Livestock not found' });
            }
            
            res.json({ animal });
            
        } catch (error) {
            logger.error('Get livestock error:', error);
            res.status(500).json({ 
                error: 'Failed to fetch livestock', 
                details: error.message 
            });
        }
    }

    // Create new livestock
    async create(req, res) {
        try {
            const animalData = {
                ...req.body,
                userId: req.user.id
            };
            
            const animal = await Livestock.create(animalData);
            
            // Emit WebSocket event
            if (req.app.get('socketio')) {
                req.app.get('socketio').emit('livestock:created', animal);
            }
            
            logger.info(`Livestock created: ${animal.animalCode} by ${req.user.username}`);
            
            res.status(201).json({
                message: 'Livestock created successfully',
                animal
            });
            
        } catch (error) {
            logger.error('Create livestock error:', error);
            res.status(500).json({ 
                error: 'Failed to create livestock', 
                details: error.message 
            });
        }
    }

    // Update livestock
    async update(req, res) {
        try {
            const animal = await Livestock.findByPk(req.params.id);
            
            if (!animal) {
                return res.status(404).json({ error: 'Livestock not found' });
            }
            
            await animal.update(req.body);
            
            // Emit WebSocket event
            if (req.app.get('socketio')) {
                req.app.get('socketio').emit('livestock:updated', animal);
                
                // Check for health alerts
                if (animal.healthStatus === 'Sick' || animal.healthStatus === 'Under Treatment') {
                    req.app.get('socketio').emit('livestock:healthAlert', animal);
                }
            }
            
            logger.info(`Livestock updated: ${animal.animalCode} by ${req.user.username}`);
            
            res.json({
                message: 'Livestock updated successfully',
                animal
            });
            
        } catch (error) {
            logger.error('Update livestock error:', error);
            res.status(500).json({ 
                error: 'Failed to update livestock', 
                details: error.message 
            });
        }
    }

    // Delete livestock
    async delete(req, res) {
        try {
            const animal = await Livestock.findByPk(req.params.id);
            
            if (!animal) {
                return res.status(404).json({ error: 'Livestock not found' });
            }
            
            const animalCode = animal.animalCode;
            await animal.destroy();
            
            // Emit WebSocket event
            if (req.app.get('socketio')) {
                req.app.get('socketio').emit('livestock:deleted', { id: req.params.id });
            }
            
            logger.info(`Livestock deleted: ${animalCode} by ${req.user.username}`);
            
            res.json({ message: 'Livestock deleted successfully' });
            
        } catch (error) {
            logger.error('Delete livestock error:', error);
            res.status(500).json({ 
                error: 'Failed to delete livestock', 
                details: error.message 
            });
        }
    }

    // Get livestock statistics
    async getStatistics(req, res) {
        try {
            const totalLivestock = await Livestock.count();
            const healthyLivestock = await Livestock.count({ where: { healthStatus: 'Healthy' } });
            const sickLivestock = await Livestock.count({ 
                where: { 
                    healthStatus: { [Op.in]: ['Sick', 'Under Treatment', 'Quarantine'] }
                }
            });
            const deceasedLivestock = await Livestock.count({ where: { healthStatus: 'Deceased' } });
            
            const bySpecies = await Livestock.findAll({
                attributes: [
                    'species',
                    [require('sequelize').fn('COUNT', '*'), 'count']
                ],
                group: ['species']
            });
            
            const totalValue = await Livestock.sum('acquisitionPrice') || 0;
            
            res.json({
                totalLivestock,
                healthyLivestock,
                sickLivestock,
                deceasedLivestock,
                bySpecies,
                totalValue
            });
            
        } catch (error) {
            logger.error('Get livestock statistics error:', error);
            res.status(500).json({ 
                error: 'Failed to fetch statistics', 
                details: error.message 
            });
        }
    }
}

module.exports = new LivestockController();
