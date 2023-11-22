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

const boardSchema = Joi.object({
  name : Joi.string().required().min(4).max(20),
  templateLink : Joi.string(),
  templateName : Joi.string(),
  color : Joi.string().max(20),
});

const updateBoardSchema = Joi.object({
  name : Joi.string().min(4).max(20),
  templateLink : Joi.string(),
  templateName : Joi.string(),
  color : Joi.string().max(20),
});

const listSchema = Joi.object({
  name : Joi.string().required().min(4).max(20),
  boardId: Joi.string().required(),
  color : Joi.string().max(20),
});

const  updateListSchema = Joi.object({
  name : Joi.string().min(4).max(20),
  color : Joi.string().max(20),
});

const cardSchema = Joi.object({
  name : Joi.string().required().min(4).max(20),
  boardId: Joi.string().required(),
  listId: Joi.string().required(),
  daysAlloted : Joi.number(),
  description : Joi.string(),
  color : Joi.string().max(20),
});

const updateCardSchema = Joi.object({
  name : Joi.string().min(4).max(20),
  daysAlloted : Joi.number(),
  description : Joi.string(),
  color : Joi.string().max(20),
});

const idSchema = Joi.object({
  id: Joi.string().required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

const nameSchema = Joi.object({
  name : Joi.string().required().min(4).max(20),
});

module.exports = {
  authSchema,
  newSchema,
  boardSchema,
  updateBoardSchema,
  listSchema,
  updateListSchema,
  cardSchema,
  updateCardSchema,
  idSchema,
  emailSchema,
  nameSchema,
}