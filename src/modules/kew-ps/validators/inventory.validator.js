// Inventory Validation Schemas
const Joi = require('joi');

const inventorySchemas = {
    create: Joi.object({
        itemCode: Joi.string().required().max(50),
        itemName: Joi.string().required().max(200),
        category: Joi.string().required().max(100),
        description: Joi.string().allow('', null).max(1000),
        currentStock: Joi.number().integer().min(0).required(),
        minimumStock: Joi.number().integer().min(0).required(),
        maximumStock: Joi.number().integer().min(0).allow(null),
        unitPrice: Joi.number().precision(2).min(0).required(),
        unit: Joi.string().required().max(50),
        location: Joi.string().required().max(200),
        shelf: Joi.string().allow('', null).max(50),
        supplier: Joi.string().allow('', null).max(200),
        lastRestockDate: Joi.date().allow(null),
        expiryDate: Joi.date().allow(null),
        status: Joi.string().valid('Active', 'Inactive', 'Discontinued').default('Active'),
        notes: Joi.string().allow('', null).max(1000)
    }),

    update: Joi.object({
        itemName: Joi.string().max(200),
        category: Joi.string().max(100),
        description: Joi.string().allow('', null).max(1000),
        currentStock: Joi.number().integer().min(0),
        minimumStock: Joi.number().integer().min(0),
        maximumStock: Joi.number().integer().min(0).allow(null),
        unitPrice: Joi.number().precision(2).min(0),
        unit: Joi.string().max(50),
        location: Joi.string().max(200),
        shelf: Joi.string().allow('', null).max(50),
        supplier: Joi.string().allow('', null).max(200),
        lastRestockDate: Joi.date().allow(null),
        expiryDate: Joi.date().allow(null),
        status: Joi.string().valid('Active', 'Inactive', 'Discontinued'),
        notes: Joi.string().allow('', null).max(1000)
    }).min(1),

    adjustStock: Joi.object({
        adjustment: Joi.number().integer().required(),
        reason: Joi.string().required().max(500)
    })
};

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            });
        }

        req.body = value;
        next();
    };
};

module.exports = {
    inventorySchemas,
    validate
};
