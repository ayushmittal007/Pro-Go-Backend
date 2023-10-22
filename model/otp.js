const Mongoose = require("mongoose")
const OtpSchema = new Mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp : {
    type: Number,
    required: true,
    unique: true,
  },
})

const OTP = Mongoose.model("otp", OtpSchema)
module.exports = OTP
