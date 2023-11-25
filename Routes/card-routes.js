const express = require("express");
const cardRouter = express.Router();
const { cardController } = require("../controllers")
const auth = require("../middlewares/auth")
const {uploadFile} = require("../middlewares/uploadFiles")

cardRouter.get("/:id" , auth , cardController.getCardById);
cardRouter.post("/add" , auth , cardController.addCard);
cardRouter.delete("/:id/delete" , auth, cardController.deleteCard);
cardRouter.get("/:id/checkDueDate" , auth, cardController.checkDueDate);
cardRouter.put("/:id/update" , auth , cardController.updateCard);
cardRouter.post("/:id/addData" , auth , cardController.addDataToCard);
cardRouter.post("/:id/addColor" , auth , cardController.addColorToCard);
cardRouter.post("/:id/changeStatus" , auth , cardController.changeCurrentStatusOfCard);
cardRouter.post("/:id/addFile" , auth , uploadFile , cardController.addFile);
cardRouter.get("/:id/getFiles" , auth , cardController.getFiles);

module.exports = cardRouter;