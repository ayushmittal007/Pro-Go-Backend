const user = require("../model/user");
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
        res.json({
          success: true,
          message : "No photo found"
        });
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
        res.json({
          success: true,
          message : "No user found"
        });
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
        res.json({
          success: true,
          message : "No user found"
        });
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
        res.json({
          success: true,
          message : "No user found"
        });
      }
      else {
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

module.exports = {
  uploadProfilePhoto,
  getPhotoUrl,
  addUserDetails,
  getUserDetails,
  addWorkSpaceMember,
  getAllWorkSpaceMember,
  addRecentlyViewed,
  addRecentlyWorked
}