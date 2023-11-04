const express = require("express");
const listRouter = express.Router();
const { listController } = require("../controllers")
const auth = require("../middlewares/auth")

listRouter.get("/:id" , auth , listController.getListById);
listRouter.post("/add" , auth , listController.addList);
listRouter.get("/:id/cards" , auth , listController.getCardsOfList);
listRouter.delete("/:id/delete" , auth, listController.deleteList);

module.exports = listRouter;