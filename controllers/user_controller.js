const profile_photo = require("../model/profile_photo");

const uploadProfilePhoto = async (req, res, next) => {
    try {
      const email = req.body.email;
      let photo = new profile_photo({
        email : email,
        photoUrl : "public/profile_image" + "/" + req.file.filename,
      });
      photo = await photo.save();
      res.json({
        success: true,
        message: "Photo uploaded successfully",
      });
    } catch (e) {
      next(e);
    }
  }

module.exports = {uploadProfilePhoto}