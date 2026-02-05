const Joi = require('joi');

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

module.exports.addProductSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 3 characters",
    }),

  price: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
    }),

  description: Joi.string()
    .min(10)
    .required()
    .messages({
      "string.min": "Description must be at least 10 characters",
    }),

  categoryId: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      "string.pattern.base": "Category must be a valid MongoDB ObjectId",
      "any.required": "Category is required",
    }),

  quantity: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "Quantity must be a number",
      "number.min": "Quantity cannot be negative",
    }),

  image: Joi.string()
    .uri()
    .required()
    .messages({
      "string.uri": "Image must be a valid URL",
    }),
});
