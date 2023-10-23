const express = require("express");
const authRouter = express.Router();
const {authController} = require("../controllers")
authRouter.post("/sign-up", authController.signUp);
authRouter.post("/email-verification",authController.emailVerification);
authRouter.post("/sign-in", authController.signIn);
authRouter.post("/forget-password", authController.forgetPassword);
authRouter.post("/change-password", authController.changePassword);
module.exports = authRouter;