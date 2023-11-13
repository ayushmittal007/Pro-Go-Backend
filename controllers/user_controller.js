const user = require("../model/user");
const { emailSchema } = require("../utils/joi_validations");
const {inviteMail} = require("../utils/invite_mail");

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
      if(existing == null){
        res.json({
          success: true,
          message : "No user found"
        });
      }else {
        existing.fullName = req.body.fullName;
        existing.jobTitle = req.body.jobTitle;
        existing.department = req.body.department;
        existing.organisation = req.body.organisation;
        existing.basedIn = req.body.basedIn;
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

  const inviteOthers = async (req, res, next) => {
    try{
      const sender = await user.findOne({_id : req.user.id});
      inviteMail(email,req.user.email);
      res.json({
        success : true,
        message : "Invitation sent successfully"
      });
    }
    catch(e){
      next(e);
    }
  }

module.exports = {
  uploadProfilePhoto,
  getPhotoUrl,
  addUserDetails,
  getUserDetails,
  inviteOthers 
}