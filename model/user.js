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
  subscriptionTime : {
    type : Number,
    default: 14,
  },
  shortId: {
    type: String,
    default: shortId.generate,
  },
  photoUrl: {
    type: String,
    default: "public/profile_image/profile_default.jpg",
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
  usersWorkSpcaeMember : {
    type : Array,
    default : []
  },
  recentlyViewed : {
    type: Array,
    default: [],
  },
  recentlyWorked : {
    type: Array,
    default: [],
  },
  isSubscribed : {
    type: Boolean,
    default: false,
  },
  rating : {
    type: Number,
    default: 3,
  },
  review : {
    type: String,
    default: null,
  },
},
{
  timestamps : true
})

const User = Mongoose.model("user", UserSchema)
module.exports = User
