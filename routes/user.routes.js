// User Management Routes
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { verifyToken, checkRole } = require('../middleware/auth');
const auditLog = require('../middleware/audit');
const { Op } = require('sequelize');

// Get all users (Admin only)
router.get('/', verifyToken, checkRole('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 20, role, isActive, search } = req.query;
        
        const where = {};
        
        if (role) where.role = role;
        if (isActive !== undefined) where.isActive = isActive === 'true';
        if (search) {
            where[Op.or] = [
                { username: { [Op.like]: `%${search}%` } },
                { fullName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }
        
        const offset = (page - 1) * limit;
        
        const { rows: users, count } = await User.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });
        
        res.json({
            users,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
});

// Get single user
router.get('/:id', verifyToken, checkRole('admin', 'manager'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ user: user.toJSON() });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user', details: error.message });
    }
});

// Update user
router.put('/:id', verifyToken, checkRole('admin'), auditLog('update', 'user'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        await user.update(req.body);
        
        res.json({
            message: 'User updated successfully',
            user: user.toJSON()
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
});

// Delete user
router.delete('/:id', verifyToken, checkRole('admin'), auditLog('delete', 'user'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        if (user.id === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }
        
        await user.destroy();
        
        res.json({ message: 'User deleted successfully' });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
});

// Toggle user active status
router.patch('/:id/toggle-active', verifyToken, checkRole('admin'), auditLog('toggle_active', 'user'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        await user.update({ isActive: !user.isActive });
        
        res.json({
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            user: user.toJSON()
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle user status', details: error.message });
    }
});

module.exports = router;
