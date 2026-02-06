// Livestock Validation Schemas
const Joi = require('joi');

const livestockSchemas = {
    create: Joi.object({
        animalCode: Joi.string().required().max(50),
        species: Joi.string().required().max(100),
        breed: Joi.string().required().max(100),
        name: Joi.string().allow('', null).max(100),
        gender: Joi.string().valid('Male', 'Female').required(),
        dateOfBirth: Joi.date().required(),
        weight: Joi.number().precision(2).min(0).allow(null),
        color: Joi.string().allow('', null).max(100),
        healthStatus: Joi.string().valid('Healthy', 'Sick', 'Under Treatment', 'Quarantine', 'Deceased').default('Healthy'),
        vaccinationStatus: Joi.string().valid('Up to Date', 'Pending', 'Overdue').default('Pending'),
        location: Joi.string().required().max(200),
        acquisitionDate: Joi.date().required(),
        acquisitionPrice: Joi.number().precision(2).min(0).allow(null),
        acquisitionSource: Joi.string().allow('', null).max(200),
        motherId: Joi.string().allow(null).max(36),
        fatherId: Joi.string().allow(null).max(36),
        microchipNumber: Joi.string().allow('', null).max(50),
        notes: Joi.string().allow('', null).max(1000)
    }),

    update: Joi.object({
        species: Joi.string().max(100),
        breed: Joi.string().max(100),
        name: Joi.string().allow('', null).max(100),
        gender: Joi.string().valid('Male', 'Female'),
        dateOfBirth: Joi.date(),
        weight: Joi.number().precision(2).min(0).allow(null),
        color: Joi.string().allow('', null).max(100),
        healthStatus: Joi.string().valid('Healthy', 'Sick', 'Under Treatment', 'Quarantine', 'Deceased'),
        vaccinationStatus: Joi.string().valid('Up to Date', 'Pending', 'Overdue'),
        location: Joi.string().max(200),
        acquisitionDate: Joi.date(),
        acquisitionPrice: Joi.number().precision(2).min(0).allow(null),
        acquisitionSource: Joi.string().allow('', null).max(200),
        motherId: Joi.string().allow(null).max(36),
        fatherId: Joi.string().allow(null).max(36),
        microchipNumber: Joi.string().allow('', null).max(50),
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
    livestockSchemas,
    validate
};
