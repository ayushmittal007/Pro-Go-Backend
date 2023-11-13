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
  },
  photoUrl: {
    type: String,
    default: null,
  },
  fullName : {
    type: String,
    default: null,
  },  
  jobTitle:{
    type: String,
    default: null,
  },  
  department:{
    type: String,
    default: null,
  },  
  organisation:{
    type: String,
    default: null,
  },  
  basedIn : {
    type: String,
    default: null,
  },  

})

const User = Mongoose.model("user", UserSchema)
module.exports = User
