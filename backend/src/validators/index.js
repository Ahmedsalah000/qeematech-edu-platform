import Joi from 'joi';

// ========== AUTH SCHEMAS ==========

export const registerStudentSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name must be at most 100 characters',
            'any.required': 'Name is required'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(6)
        .max(50)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),

    phone: Joi.string()
        .pattern(/^[\d\s\+\-\(\)]+$/)
        .allow('', null)
        .messages({
            'string.pattern.base': 'Please provide a valid phone number'
        }),

    class: Joi.string()
        .max(50)
        .allow('', null),

    academicYear: Joi.string()
        .max(20)
        .allow('', null),

    schoolId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Please select a school',
            'any.required': 'School is required'
        })
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

// ========== STUDENT SCHEMAS ==========

export const createStudentSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'any.required': 'Name is required'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),

    phone: Joi.string()
        .pattern(/^[\d\s\+\-\(\)]+$/)
        .allow('', null),

    class: Joi.string()
        .max(50)
        .allow('', null),

    academicYear: Joi.string()
        .max(20)
        .allow('', null)
});

export const updateStudentSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100),

    phone: Joi.string()
        .pattern(/^[\d\s\+\-\(\)]+$/)
        .allow('', null),

    class: Joi.string()
        .max(50)
        .allow('', null),

    academicYear: Joi.string()
        .max(20)
        .allow('', null)
});

// ========== LESSON SCHEMAS ==========

export const createLessonSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(200)
        .required()
        .messages({
            'string.min': 'Lesson name must be at least 2 characters',
            'any.required': 'Lesson name is required'
        }),

    description: Joi.string()
        .max(5000)
        .allow('', null),

    rating: Joi.number()
        .min(0)
        .max(5)
        .default(0)
        .messages({
            'number.min': 'Rating must be between 0 and 5',
            'number.max': 'Rating must be between 0 and 5'
        })
});

export const updateLessonSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(200),

    description: Joi.string()
        .max(5000)
        .allow('', null),

    rating: Joi.number()
        .min(0)
        .max(5)
});

// ========== PROFILE SCHEMAS ==========

export const updateStudentProfileSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100),

    phone: Joi.string()
        .pattern(/^[\d\s\+\-\(\)]+$/)
        .allow('', null),

    class: Joi.string()
        .max(50)
        .allow('', null),

    academicYear: Joi.string()
        .max(20)
        .allow('', null)
});

export const updateSchoolProfileSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(200),

    phone: Joi.string()
        .pattern(/^[\d\s\+\-\(\)]+$/)
        .allow('', null),

    address: Joi.string()
        .max(500)
        .allow('', null)
});

// ========== VALIDATION MIDDLEWARE ==========

/**
 * Create validation middleware for a given schema
 */
export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,  // Return all errors, not just the first
            stripUnknown: true  // Remove unknown fields
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            console.error('Validation Error details:', JSON.stringify(errors, null, 2));

            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            });
        }

        // Replace body with validated and sanitized data
        req.body = value;
        next();
    };
};
