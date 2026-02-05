const Joi = require("joi");

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

module.exports.cartValidation = Joi.object({

      productId: Joi.string()
          .pattern(objectIdPattern)
          .required()
          .messages({
            'string.pattern.base': 'Invalid productId',
            'any.required': 'productId is required'
          }),

        quantity: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            'number.base': 'quantity must be a number',
            'number.min': 'quantity must be at least 1',
            'any.required': 'quantity is required'
          })
});

module.exports.updateQuantityValidation = Joi.object({

      productId: Joi.string()
          .pattern(objectIdPattern)
          .required()
          .messages({
            'string.pattern.base': 'Invalid productId',
            'any.required': 'productId is required'
          }),

        quantity: Joi.number()
          .integer()
          .required()
          .messages({
            'number.base': 'quantity must be a number',
            'number.min': 'quantity must be at least 1',
            'any.required': 'quantity is required'
          })
});
