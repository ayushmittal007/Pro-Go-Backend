const express = require("express");
const userRouter = express.Router();
const {uploadProfilePhoto , getProfilePhoto} = require("../controllers/user_controller");
const {uploadPhoto} = require("../middlewares/uploadPhoto");
const auth = require("../middlewares/auth")

userRouter.post("/upload-photo",uploadPhoto,uploadProfilePhoto);
userRouter.get("/get-photo",auth,getProfilePhoto);

module.exports = userRouter