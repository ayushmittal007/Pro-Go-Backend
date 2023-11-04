const express = require("express");
const userRouter = express.Router();
const {uploadProfilePhoto} = require("../controllers/user_controller");
const {uploadPhoto} = require("../middlewares/uploadPhoto");

userRouter.post("/upload-photo",uploadPhoto,uploadProfilePhoto);

module.exports = userRouter