const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/files");
  },
  filename: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.ppt', '.jpeg', '.jpg', '.png', '.doc', '.docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      const error = new Error('Only PDF, PPT, JPEG, PNG, Word (doc/docx), and PPTX files are allowed!');
      error.code = 'EXTENSION_NOT_ALLOWED';
      return cb(error, null);
    }

    cb(null, Date.now() + fileExtension);
  },
});

const uploadFile = multer({
  storage: storage,
}).single("file");

module.exports = { uploadFile };