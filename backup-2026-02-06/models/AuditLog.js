// Audit Log Model
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Action performed (create, update, delete, login, etc.)'
    },
    module: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Module name (asset, inventory, livestock, etc.)'
    },
    recordId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'ID of the affected record'
    },
    recordType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Type of record affected'
    },
    oldValue: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Previous state of the record'
    },
    newValue: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'New state of the record'
    },
    ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('success', 'failure', 'warning'),
        defaultValue: 'success'
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    indexes: [
        { fields: ['userId'] },
        { fields: ['action'] },
        { fields: ['module'] },
        { fields: ['createdAt'] }
    ]
});

module.exports = AuditLog;
