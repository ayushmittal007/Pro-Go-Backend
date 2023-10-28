const Joi = require("joi");

const newSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().alphanum().required(),
});

module.exports = {
  newSchema
}