const express = require("express");
const commentRouter = express.Router();
const { commentController } = require("../controllers")
const auth = require("../middlewares/auth")

commentRouter.get("/:id", auth , commentController.getAllComments);
commentRouter.post("/add", auth, commentController.addCommentToACard);
commentRouter.put("/:id/update", auth , commentController.updateComment);
commentRouter.delete("/:id/delete", auth , commentController.deleteComment);

module.exports = commentRouter;