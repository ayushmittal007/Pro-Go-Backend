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
})

const Otp = Mongoose.model("otp", OtpSchema)
module.exports = Otp
