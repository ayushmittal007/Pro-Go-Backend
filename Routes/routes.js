const express = require("express");
const authRouter = express.Router();
const { auth } = require("../controllers/auth")

authRouter.post("/notes/sign-up", auth.signUp);
authRouter.post("/notes/sign-in", auth.signIn);
authRouter.post("/notes/forget-password", auth.forgetPassword);
authRouter.post("/notes/change-password", auth.changePassword);

module.exports = authRouter;