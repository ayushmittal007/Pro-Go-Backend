const express = require("express");
const authRouter = express.Router();
const auth = require("../controllers/auth")
authRouter.post("/sign-up", auth.signUp);
authRouter.post("/sign-in", auth.signIn);
authRouter.post("/forget-password", auth.forgetPassword);
authRouter.post("/change-password", auth.changePassword);
module.exports = authRouter;