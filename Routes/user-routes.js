const express = require("express");
const userRouter = express.Router();
const {uploadProfilePhoto , getPhotoUrl , getUserDetails , inviteOthers} = require("../controllers/user_controller");
const {uploadPhoto} = require("../middlewares/uploadPhoto");
const auth = require("../middlewares/auth")

userRouter.post("/upload-photo",uploadPhoto,uploadProfilePhoto);
userRouter.post("/invite-others",auth,inviteOthers);
userRouter.get("/get-photo", auth ,getPhotoUrl);
userRouter.get("/get-user-details", auth , getUserDetails);

module.exports = userRouter