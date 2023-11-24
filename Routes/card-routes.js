const express = require("express");
const cardRouter = express.Router();
const { cardController } = require("../controllers")
const auth = require("../middlewares/auth")

cardRouter.get("/:id" , auth , cardController.getCardById);
cardRouter.post("/add" , auth , cardController.addCard);
cardRouter.delete("/:id/delete" , auth, cardController.deleteCard);
cardRouter.get("/:id/checkDueDate" , auth, cardController.checkDueDate);
cardRouter.put("/:id/update" , auth , cardController.updateCard);
cardRouter.post("/:id/addData" , auth , cardController.addDataToCard);
cardRouter.post("/:id/addColor" , auth , cardController.addColorToCard);
cardRouter.post("/:id/changeStatus" , auth , cardController.changeCurrentStatusOfCard);

module.exports = cardRouter;