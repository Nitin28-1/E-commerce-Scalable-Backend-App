const Joi = require("joi");

module.exports.orderValidation = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string()
          .length(24)
          .hex()
          .required()
          .messages({
            "string.length": "Invalid productId",
            "any.required": "productId is required"
          }),

        quantity: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            "number.base": "Quantity must be a number",
            "number.min": "Quantity must be at least 1",
            "any.required": "Quantity is required"
          }),

        price: Joi.number()
          .positive()
          .optional()
          .messages({
            "number.base": "Price must be a number"
          })
      }).unknown(true)   // 🔥 item ke andar extra fields allow
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one item is required",
      "any.required": "Items are required"
    })
})
.unknown(true); // 🔥 root level pe bhi extra fields allow