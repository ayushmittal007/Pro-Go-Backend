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
  isPremium : {
    type: Boolean,
    default: false,
  },
  subscriptionType : {
    type: String,
    default: null,
  },
  shortId: {
    type: String,
    default: shortId.generate,
  },
  photoUrl: {
    type: String,
    default: "public/profile_image/default.png",
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
  region : {
    type : String , 
    default : null,
  },
  boardsOwned : [ {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "board",
      },
   ],
  usersWorkSpcaeMember : [ {
  type: Mongoose.Schema.Types.ObjectId,
  ref: "user",   
  }],
})

const User = Mongoose.model("user", UserSchema)
module.exports = User
