const Joi = require("joi");

const authSchema = Joi.object({
  username: Joi.string().min(4).trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(6)
  .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])(?=.*[0-9]).{6,}$"))
  .required(),
});

module.exports = {
  authSchema
}