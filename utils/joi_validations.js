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

const name_id_Schema = Joi.object({
  name : Joi.string().required(), 
  userId: Joi.string().required(),
});

const addCardSchema = Joi.object({
  name : Joi.string().required(),
  boardId: Joi.string().required(),
  listId: Joi.string().required(),
  order: Joi.string().required(),
});

module.exports = {
  authSchema,
  newSchema,
  idSchema,
  name_id_Schema,
  addCardSchema,
}