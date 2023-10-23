const Mongoose = require("mongoose")
const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified : {
    type: Boolean,
    default: false,
  }
})

const User = Mongoose.model("user", UserSchema)
module.exports = User
