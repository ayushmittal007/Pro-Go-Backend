const express = require("express");
const userRouter = express.Router();
const { uploadProfilePhoto , getPhotoUrl , getUserDetails, addUserDetails , addWorkSpaceMember , 
    getAllWorkSpaceMember , addRecentlyViewed , addRecentlyWorked } = require("../controllers/user_controller");
const { uploadPhoto } = require("../middlewares/uploadPhoto"); 
const auth = require("../middlewares/auth")

userRouter.post("/upload-photo", auth , uploadPhoto, uploadProfilePhoto);
userRouter.get("/get-photo", auth , getPhotoUrl);
userRouter.get("/get-user-details", auth , getUserDetails);
userRouter.post("/add-user-details", auth , addUserDetails);
userRouter.post("/add-member", auth , addWorkSpaceMember);
userRouter.get("/get-all-member", auth , getAllWorkSpaceMember);
userRouter.post("/add-recently-viewed", auth , addRecentlyViewed);
userRouter.post("/add-recently-worked", auth , addRecentlyWorked);

module.exports = userRouter