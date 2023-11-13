const express = require("express");
const userRouter = express.Router();
const {uploadProfilePhoto , getPhotoUrl , getUserDetails, addUserDetails , updateUserDetails , inviteOthers} = require("../controllers/user_controller");
const {uploadPhoto} = require("../middlewares/uploadPhoto");
const auth = require("../middlewares/auth")

userRouter.post("/upload-photo", auth , uploadPhoto, uploadProfilePhoto);
userRouter.post("/invite-others", auth , inviteOthers);
userRouter.get("/get-photo", auth , getPhotoUrl);
userRouter.get("/get-user-details", auth , getUserDetails);
userRouter.post("/add-user-details", auth , addUserDetails);
userRouter.put("/update-user-details", auth , updateUserDetails);

module.exports = userRouter