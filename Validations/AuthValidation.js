const Joi = require("joi");

module.exports.registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match"
    }),
    role: Joi.string()
    .valid('User','Admin','Seller')
    .default('User')
});

module.exports.loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),
});


module.exports.verify_token = Joi.object({
  token: Joi.string()
    .required(),
});

module.exports.forgotPasswordSchema = Joi.object({
    email: Joi.string()
    .email()
    .required(),
});

