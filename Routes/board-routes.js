const express = require("express");
const boardRouter = express.Router();
const { boardController } = require("../controllers")
const auth = require("../middlewares/auth")

boardRouter.get("/", auth , boardController.getAll);
boardRouter.post("/add", boardController.addBoard);
boardRouter.get("/:id", auth , boardController.getBoardById);
boardRouter.get("/:id/lists", auth , boardController.getLists);
boardRouter.get("/:id/cards", auth , boardController.getCards);
boardRouter.delete("/:id/delete", auth , boardController.deleteBoard);

module.exports = boardRouter;