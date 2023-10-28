const Joi = require("joi");

const authSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(6).required(),
});

module.exports = {
  authSchema
}