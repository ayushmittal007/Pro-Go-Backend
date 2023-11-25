const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/profile_image");
  },
  filename: (req, file, cb) => {
    const allowedExtensions = ['.jpeg', '.jpg', '.png' , '.svg'];

    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      const error = new Error('Only JPEG, JPG, and PNG files are allowed!');
      error.code = 'EXTENSION_NOT_ALLOWED';
      return cb(error, null);
    }

    cb(null, Date.now() + fileExtension);
  },
});

const uploadPhoto = multer({
  storage: storage,
}).single("photo");

module.exports = { uploadPhoto };