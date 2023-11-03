const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
});

const profile_photo = new mongoose.model("Photo", photoSchema);
module.exports = profile_photo;