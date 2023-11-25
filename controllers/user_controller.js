const { Board, List, Card , User } = require('../model');
const { ErrorHandler } = require('../middlewares/errorHandling');
const { emailSchema , recentlyViewedSchema , recentlyWorkedSchema } = require("../utils/joi_validations");
const { subscribeMail } = require("../utils/subscribe_mail");

const uploadProfilePhoto = async (req, res, next) => {
    try {
      const existing = await User.findOne({email : req.user.email});
      if(existing.photoUrl != null){
        existing.photoUrl = "public/profile_image" + "/" + req.file.filename;
        await existing.save();
        res.json({
          success: true,
          message: "Photo updated successfully",
        });
      }
      else {
        existing.photoUrl = "public/profile_image" + "/" + req.file.filename;
        await existing.save();
        res.json({
          success: true,
          message: "Photo uploaded successfully",
        });
      }
    } catch (e) {
      next(e);
    }
  }

const getPhotoUrl = async (req, res, next) => {
  try {
    const existing = await User.findOne({email : req.user.email});
    if(existing.photoUrl == null){
      return next (new ErrorHandler(400 , "No photo found"));
    }
    else {
      res.json({
        success: true,
        photoUrl : existing.photoUrl
      });
    }
  } catch (e) {
    next(e);
  }
}

const addUserDetails = async (req, res, next) => {
  try{
    const existing = await User.findOne({email : req.user.email});
    console.log(existing);
    if(existing == null){
      return next (new ErrorHandler(400 , "No user found"));
    }else {
      if(req.body.fullName != null){
        existing.fullName = req.body.fullName;
      }
      if(req.body.jobTitle != null){
        existing.jobTitle = req.body.jobTitle;
      }
      if(req.body.department != null){
        existing.department = req.body.department;
      }
      if(req.body.organisation != null){
        existing.organisation = req.body.organisation;
      }
      if(req.body.basedIn != null){
        existing.basedIn = req.body.basedIn;
      }
      if(req.body.region != null){
        existing.region = req.body.region;
      }
      await existing.save();
      res.json({
        success: true,
        message : "User details added successfully"
      });
    }
  }catch(e){
    next(e);
  }   
}

const getUserDetails = async (req, res, next) => {
  try {
    const existing = await User.findOne({email : req.user.email});
    if(existing == null){
      return next (new ErrorHandler(400 , "No user found"));
    }
    else {
      res.json({
        success: true,
        user : existing
      });
    }
  } catch (e) {
    next(e);
  }
}

const addWorkSpaceMember = async (req, res, next) => {
  try{
    const User = req.user;
    const existing = await User.findOne({email : req.body.email});
    if(existing == null){
      return next (new ErrorHandler(400 , "User do not exist"));
    }
    else {
      if(User.usersWorkSpcaeMember.includes(req.body.email)){
        return next (new ErrorHandler(400 , "User already added"));
      }
      User.usersWorkSpcaeMember.push(req.body.email);
      await User.save();
      res.json({
        success: true,
        message : "User added successfully"
      });
    }
  }catch(err){
    next(err);
  }
}

const getAllWorkSpaceMember = async (req, res, next) => {
  try{
    const User = req.user;
    if(!User.usersWorkSpcaeMember){
      return next (new ErrorHandler(400 , "No user found"));
    }
    res.json({
      success: true,
      usersWorkSpcaeMember : User.usersWorkSpcaeMember
    });
  }catch(err){
    next(err);
  }
}

const addRecentlyViewed = async (req, res, next) => { 
  try{
    const User = req.user;
    const input = await recentlyViewedSchema.validateAsync(req.body);
    User.recentlyViewed.push(input);
    await User.save();
    res.json({
      success: true,
      message : "Added successfully"
    });
  }catch(err){
    next(err);
  }
}

const getRecentlyViewed = async (req, res, next) => {
  try{
    const User = req.user;
    if(!User.recentlyViewed){
      return next (new ErrorHandler(400 , "No user found"));
    }
    res.json({
      success: true,
      recentlyViewed : User.recentlyViewed
    });
  }catch(err){
    next(err);
  }
}

const addRecentlyWorked = async (req, res, next) => { 
  try{
    const User = req.user;
    const input = await recentlyWorkedSchema.validateAsync(req.body);
    User.recentlyWorked.push(input);
    await User.save();
    res.json({
      success: true,
      message : "Added successfully"
    });
  }catch(err){
    next(err);
  }
}

const getRecentlyWorked = async (req, res, next) => {
  try{
    const User = req.user;
    if(!User.recentlyWorked){
      return next (new ErrorHandler(400 , "No user found"));
    }
    res.json({
      success: true,
      recentlyWorked : User.recentlyWorked
    });
  }catch(err){
    next(err);
  }
}

const search = async (req, res,next) => {
  const query = req.query.q;
  try {
      const boards = await Board
          .aggregate([
              {
                  $search: {
                      "index": "name",
                      "text": {
                        "path": "name",
                        "query": query,
                        "fuzzy": {}
                      }
                  }
              }
          ])
          .exec();
      const lists = await List
          .aggregate([
              {
                  $search: {
                      "index": "name",
                      "text": {
                        "path": "name",
                        "query": query,
                        "fuzzy": {}
                      }
                  }
              },
              
          ])
          .exec();

      const cards = await Card
          .aggregate([
              {
                  $search: {
                      "index": "name",
                      "text": {
                        "path": "name",
                        "query": query,
                        "fuzzy": {}
                      }
                  }
              },
          ])
          .exec();
      res.json({
        success : true,
        data: {
          boards, lists, cards
        }
      });
  } catch (error) {
      next(error);
  }
};

const progress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const doneCards = await Card.find({userId : userId , done : true});
    const totalCards = await Card.find({ userId : userId });
    const completed = doneCards.length;
    const total = totalCards.length;
    res.json({
      success: true,
      progress : (completed/total)*100
    });
  } catch (e) {
    next(e);
  }
}

const subscribe = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.user.email });
    console.log(existing);
    if (!existing) {
      return next(new ErrorHandler(400, "User not found"));
    }
    if (existing.isSubscribed) {
      return next(new ErrorHandler(400, "User already subscribed"));
    }
    subscribeMail(req.user.email);
    await User.findOneAndUpdate({ email: req.user.email }, { isSubscribed: true });
    res.json({
      success: true,
      message: "Subscribed successfully"
    });
  } catch (err) {
    next(err);
  }
}

const rateProGo = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.user.email });
    if (!existing) {
      return next(new ErrorHandler(400, "User not found"));
    }
    await User.findOneAndUpdate({ email: req.user.email }, { rating: req.body.rating });
    res.json({
      success: true,
      message: "Rated successfully"
    });
  } catch (err) {
    next(err);
  }
}

const getRating = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.user.email });
    if (!existing) {
      return next(new ErrorHandler(400, "User not found"));
    }
    res.json({
      success: true,
      rating: existing.rating
    });
  } catch (err) {
    next(err);
  }
}

const writeReview = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.user.email });
    if (!existing) {
      return next(new ErrorHandler(400, "User not found"));
    }
    await User.findOneAndUpdate({ email: req.user.email }, { review : req.body.review });
    res.json({
      success: true,
      message: "Review added successfully"
    });
  } catch (err) {
    next(err);
  }
}

const getReview = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.user.email });
    if (!existing) {
      return next(new ErrorHandler(400, "User not found"));
    }
    res.json({
      success: true,
      review : existing.review
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadProfilePhoto,
  getPhotoUrl,
  addUserDetails,
  getUserDetails,
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
  writeReview,
  getRating,
  getReview
}