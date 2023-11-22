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

const commentSchema = Joi.object({
  text : Joi.string().required().min(4).max(200),
  cardId: Joi.string().required(),
});

const updateCommentSchema = Joi.object({
  text : Joi.string().min(4).max(200),
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

const createPlannerSchema = Joi.object({
  date : Joi.string().required(),
  taskList : Joi.array().items(Joi.string()),
  goals : Joi.array().items(Joi.string()),
  note : Joi.string(),
});

const updatePlannerSchema = Joi.object({
  taskList : Joi.array().items(Joi.string()),
  goals : Joi.string(),
  note : Joi.string(),
});

const recentlyViewedSchema = Joi.object({
  name : Joi.string().required().min(4).max(20),
  link: Joi.string().required(),
  color : Joi.string().max(20),
});

const recentlyWorkedSchema = Joi.object({
  name : Joi.string().required().min(4).max(20),
  link: Joi.string().required(),
  color : Joi.string().max(20),
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
  commentSchema,
  updateCommentSchema,
  idSchema,
  emailSchema,
  nameSchema,
  createPlannerSchema,
  updatePlannerSchema,
  recentlyViewedSchema,
  recentlyWorkedSchema, 
}