const profile_photo = require("../model/profile_photo");

const uploadProfilePhoto = async (req, res, next) => {
    try {
      const email = req.body.email;
      const existing = await profile_photo.findOne({email : email});
      if(existing){
        existing.photoUrl = "public/profile_image" + "/" + req.file.filename;
        await existing.save();
        res.json({
          success: true,
          message: "Photo updated successfully",
        });
      }
      else {
        let photo = new profile_photo({
          email : email,
          photoUrl : "public/profile_image" + "/" + req.file.filename,
        });
        photo = await photo.save();
        res.json({
          success: true,
          message: "Photo uploaded successfully",
        });
      }
    } catch (e) {
      next(e);
    }
  }

  const getProfilePhoto = async (req, res, next) => {
    try {
      const email = req.body.email;
      const photoModel = await profile_photo.findOne({email : email});
      res.json({
        success: true,
        photoUrl : photoModel.photoUrl
      });
    } catch (e) {
      next(e);
    }
  }

module.exports = {
  uploadProfilePhoto,
  getProfilePhoto 
}