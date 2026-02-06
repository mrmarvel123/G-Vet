// Asset Validation Schemas
const Joi = require('joi');

const assetSchemas = {
    create: Joi.object({
        assetCode: Joi.string().required().max(50),
        assetName: Joi.string().required().max(200),
        category: Joi.string().required().max(100),
        description: Joi.string().allow('', null).max(1000),
        purchasePrice: Joi.number().precision(2).min(0).required(),
        purchaseDate: Joi.date().required(),
        supplier: Joi.string().required().max(200),
        location: Joi.string().required().max(200),
        department: Joi.string().required().max(100),
        custodian: Joi.string().allow('', null).max(200),
        status: Joi.string().valid('Active', 'Under Maintenance', 'Disposed', 'Lost').default('Active'),
        warrantyExpiry: Joi.date().allow(null),
        serialNumber: Joi.string().allow('', null).max(100),
        model: Joi.string().allow('', null).max(100),
        condition: Joi.string().valid('Excellent', 'Good', 'Fair', 'Poor').allow('', null),
        notes: Joi.string().allow('', null).max(1000)
    }),

    update: Joi.object({
        assetName: Joi.string().max(200),
        category: Joi.string().max(100),
        description: Joi.string().allow('', null).max(1000),
        purchasePrice: Joi.number().precision(2).min(0),
        purchaseDate: Joi.date(),
        supplier: Joi.string().max(200),
        location: Joi.string().max(200),
        department: Joi.string().max(100),
        custodian: Joi.string().allow('', null).max(200),
        status: Joi.string().valid('Active', 'Under Maintenance', 'Disposed', 'Lost'),
        warrantyExpiry: Joi.date().allow(null),
        serialNumber: Joi.string().allow('', null).max(100),
        model: Joi.string().allow('', null).max(100),
        condition: Joi.string().valid('Excellent', 'Good', 'Fair', 'Poor').allow('', null),
        notes: Joi.string().allow('', null).max(1000)
    }).min(1)
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
    assetSchemas,
    validate
};
