const Joi = require("joi");
const mongoose = require("mongoose");

// Custom ObjectId validator
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};
module.exports.reviewValidation = Joi.object({
  rating: Joi.number()
    .min(1)
    .max(5)
    .required()
    .messages({
      "number.base": "Rating must be a number",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating cannot be more than 5",
      "any.required": "Rating is required"
    }),

  comment: Joi.string()
    .trim()
    .max(500)
    .optional()
}).options({ abortEarly: false });