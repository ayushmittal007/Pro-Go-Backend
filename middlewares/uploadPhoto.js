const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/profile_image");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null,  Date.now() + path.extname(file.originalname));
  },
});

const uploadPhoto = multer({
  storage: storage,
}).single("photo");

module.exports = {uploadPhoto};