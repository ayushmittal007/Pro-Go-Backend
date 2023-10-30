const Mongoose = require("mongoose");
const shortId = require("shortid");
const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim : true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isVerified : {
    type: Boolean,
    default: false,
  },
  shortId: {
    type: String,
    default: shortId.generate,
  }
})

const User = Mongoose.model("user", UserSchema)
module.exports = User
