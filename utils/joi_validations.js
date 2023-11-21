const Joi = require("joi");

const authSchema = Joi.object({
  username: Joi.string().min(4).trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(6)
  .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])(?=.*[0-9]).{6,}$"))
  .required(),
});

const newSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  newPassword: Joi.string().min(6)
  .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])(?=.*[0-9]).{6,}$"))
  .required(),
});

const idSchema = Joi.object({
  id: Joi.string().required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

const nameSchema = Joi.object({
  name : Joi.string().required(),
});

const name_id_Schema = Joi.object({
  name : Joi.string().required(),
  boardId: Joi.string().required(),
  color : Joi.string(),
});

module.exports = {
  authSchema,
  newSchema,
  idSchema,
  emailSchema,
  nameSchema,
  name_id_Schema,
}
