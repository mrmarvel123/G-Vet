// Inventory Model - KEW.PS
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');

const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    itemCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Stock item code (e.g., STK-001)'
    },
    itemName: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM(
            'Office Supplies',
            'Veterinary Supplies',
            'Medical Equipment',
            'Cleaning Supplies',
            'Stationery',
            'IT Consumables',
            'Other'
        ),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    unit: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Unit of measurement (pcs, box, kg, etc.)'
    },
    currentStock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    minimumStock: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        allowNull: false,
        comment: 'Reorder point'
    },
    maximumStock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Maximum stock level'
    },
    unitPrice: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        allowNull: false
    },
    totalValue: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        allowNull: false,
        comment: 'Calculated: currentStock * unitPrice'
    },
    location: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Storage location'
    },
    shelf: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    supplier: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    lastRestockDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    expiryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'For perishable items'
    },
    abcClassification: {
        type: DataTypes.ENUM('A', 'B', 'C'),
        allowNull: true,
        comment: 'ABC analysis classification'
    },
    status: {
        type: DataTypes.ENUM('Active', 'Low Stock', 'Out of Stock', 'Discontinued'),
        defaultValue: 'Active',
        allowNull: false
    },
    kewpsForm: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'KEW.PS form reference'
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    }
}, {
    hooks: {
        beforeSave: (inventory) => {
            // Calculate total value
            inventory.totalValue = inventory.currentStock * inventory.unitPrice;
            
            // Update status based on stock level
            if (inventory.currentStock === 0) {
                inventory.status = 'Out of Stock';
            } else if (inventory.currentStock <= inventory.minimumStock) {
                inventory.status = 'Low Stock';
            } else {
                inventory.status = 'Active';
            }
        }
    },
    indexes: [
        { fields: ['itemCode'] },
        { fields: ['category'] },
        { fields: ['status'] },
        { fields: ['location'] }
    ]
});

module.exports = Inventory;

