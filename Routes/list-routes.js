const express = require("express");
const listRouter = express.Router();
const { listController } = require("../controllers")
const auth = require("../middlewares/auth")

listRouter.get("/:id" , auth , listController.getListById);
listRouter.post("/add" , auth , listController.addList);
listRouter.get("/:id/cards" , auth , listController.getCardsOfList);
listRouter.put("/:id/update" , auth , listController.updateList);
listRouter.delete("/:id/delete" , auth, listController.deleteList);
listRouter.post("/:id/move" , auth , listController.moveListById);

module.exports = listRouter;