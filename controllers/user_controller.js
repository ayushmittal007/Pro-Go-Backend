const { Board, List, Card , user } = require('../model');
const { ErrorHandler } = require('../middlewares/errorHandling');
const { emailSchema , recentlyViewedSchema , recentlyWorkedSchema } = require("../utils/joi_validations");

const uploadProfilePhoto = async (req, res, next) => {
    try {
      const existing = await user.findOne({email : req.user.email});
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
    const existing = await user.findOne({email : req.user.email});
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
    const existing = await user.findOne({email : req.user.email});
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
    const existing = await user.findOne({email : req.user.email});
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
    const existing = await user.findOne({email : req.body.email});
    if(existing == null){
      return next (new ErrorHandler(400 , "No user found"));
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

module.exports = {
  uploadProfilePhoto,
  getPhotoUrl,
  addUserDetails,
  getUserDetails,
  addWorkSpaceMember,
  getAllWorkSpaceMember,
  addRecentlyViewed,
  addRecentlyWorked,
  search,
  progress
}