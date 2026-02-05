const Joi = require("joi");
const mongoose=require('mongoose')

module.exports.addCategorySchema=Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .required()
    .messages({
      "string.empty": "Category name is required",
      "string.min": "Category name must be at least 2 characters"
    }),
  parentCategory: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid parentCategory id");
      }
      return value;
    })
    .allow(null)
    .optional()
})