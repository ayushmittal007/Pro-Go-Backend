const user = require("../model/user");
const { emailSchema } = require("../utils/joi_validations");

const uploadProfilePhoto = async (req, res, next) => {
    try {
      const input = await emailSchema.validateAsync(req.body);
      const email = req.body.email;
      const existing = await user.findOne({email : email});
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
      const input = await emailSchema.validateAsync(req.body);
      const email = req.body.email;
      const existing = await user.findOne({email : email});
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

  const getUserDetails = async (req, res, next) => {
    try {
      const input = await emailSchema.validateAsync(req.body);
      const email = req.body.email;
      const existing = await user.findOne({email : email});
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

module.exports = {
  uploadProfilePhoto,
  getPhotoUrl,
  getUserDetails 
}