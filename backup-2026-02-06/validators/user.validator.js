// Validation Schemas using Joi
const Joi = require('joi');

// User validation schemas
const userSchemas = {
    register: Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
        fullName: Joi.string().min(3).max(100).required(),
        role: Joi.string().valid('admin', 'manager', 'staff', 'visitor').default('staff'),
        department: Joi.string().max(100).allow('', null),
        position: Joi.string().max(100).allow('', null),
        phoneNumber: Joi.string().pattern(/^[0-9+\-\s()]+$/).allow('', null)
    }),

    login: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    }),

    update: Joi.object({
        email: Joi.string().email(),
        fullName: Joi.string().min(3).max(100),
        role: Joi.string().valid('admin', 'manager', 'staff', 'visitor'),
        department: Joi.string().max(100).allow('', null),
        position: Joi.string().max(100).allow('', null),
        phoneNumber: Joi.string().pattern(/^[0-9+\-\s()]+$/).allow('', null),
        isActive: Joi.boolean()
    }),

    changePassword: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).max(100).required()
    }),

    resetPassword: Joi.object({
        newPassword: Joi.string().min(6).max(100).required()
    })
};

// Validation middleware
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
    userSchemas,
    validate
};
