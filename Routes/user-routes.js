const express = require("express");
const userRouter = express.Router();
const {
  uploadProfilePhoto,
  getPhotoUrl,
  getUserDetails,
  addUserDetails,
  addWorkSpaceMember,
  getAllWorkSpaceMember,
  addRecentlyViewed,
  getRecentlyViewed,
  addRecentlyWorked,
  getRecentlyWorked,
  search,
  progress,
  subscribe,
  rateProGo,
  getRating,
  writeReview,
  getReview,
} = require("../controllers/user_controller");

const { uploadPhoto } = require("../middlewares/uploadPhoto");
const auth = require("../middlewares/auth");

userRouter.post("/upload-photo", auth, uploadPhoto, uploadProfilePhoto);
userRouter.get("/get-photo", auth, getPhotoUrl);
userRouter.get("/get-user-details", auth, getUserDetails);
userRouter.post("/add-user-details", auth, addUserDetails);
userRouter.post("/add-member", auth, addWorkSpaceMember);
userRouter.get("/get-all-member", auth, getAllWorkSpaceMember);
userRouter.post("/add-recently-viewed", auth, addRecentlyViewed);
userRouter.get("/get-recently-viewed", auth, getRecentlyViewed);
userRouter.post("/add-recently-worked", auth, addRecentlyWorked);
userRouter.get("/get-recently-worked", auth, getRecentlyWorked);
userRouter.get("/search", auth, search);
userRouter.get("/progress", auth, progress);
userRouter.post("/subscribe", auth, subscribe);
userRouter.post("/add-rating", auth, rateProGo);
userRouter.get("/get-rating", auth, getRating);
userRouter.post("/add-review", auth, writeReview);
userRouter.get("/get-review", auth, getReview);

module.exports = userRouter;