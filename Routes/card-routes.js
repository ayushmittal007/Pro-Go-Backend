const express = require("express");
const cardRouter = express.Router();
const { cardController } = require("../controllers")
const auth = require("../middlewares/auth")

cardRouter.get("/:id" , auth , cardController.getCardById);
cardRouter.post("/add" , auth , cardController.addCard);
cardRouter.delete("/:id/delete" , auth, cardController.deleteCard);
cardRouter.get("/:id/checkDueDate" , auth, cardController.checkDueDate);

module.exports = cardRouter;