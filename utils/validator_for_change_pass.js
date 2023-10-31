const Joi = require("joi");

const newSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  newPassword: Joi.string().min(6)
  .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])(?=.*[0-9]).{6,}$"))
  .required(),
});

module.exports = {
  newSchema
}