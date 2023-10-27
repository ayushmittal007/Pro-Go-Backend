const Mongoose = require("mongoose")
const OtpSchema = new Mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp : {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 100,
  },
})

const Otp = Mongoose.model("otp", OtpSchema)
module.exports = Otp