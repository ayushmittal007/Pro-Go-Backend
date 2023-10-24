const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User,Otp} = require("../model");
const mailer = require("../utils/send_mail");
const validateEmail = require("../utils/validateEmail");
const {ErrorHandler} = require("../middlewares/errorHandling");
const app = express();
app.use(express.json());

const signUp = async (req, res,next) => {
    try {
      const { username, password, email } = req.body;
      if (!username || !password || !email) {
        return next(new ErrorHandler(400, "fill all entries"));
      }
      
      if(!validateEmail(email)){
        return next(new ErrorHandler(400, "Incorrect email format"));
      }

      const existing_User = await User.findOne({ email });

      if (existing_User) {
        if (!existing_User.isVerified) {
          await User.deleteOne({ email });
        } else {
          return next(new ErrorHandler(400, "User with the same email already exists"));
        }
      }

      const otp = Math.floor(1000 + Math.random() * 9000);
      Otp.create({ email: email, otp: otp }) 
      .then(result => { 
          console.log("created otp") 
      })

      mailer.sendmail(email, otp);

      const hashedPassword = await bcryptjs.hash(password, 6);
      User.create({ username : username , password : hashedPassword, email: email}) 
      .then(result => { 
          console.log("created user") 
      })

      res.status(201).json(
        {
          "success" : "true" , 
          "message" : "Sign up successful! Please verify your account , using otp send to your mail" ,
          "data" :  { username, password, email } 
        });
    } catch (err) {
       res.status(500).json({"success" : "false", error: err});
    }
}

const emailVerification = async (req,res,next) => {
  try {
    const { email, otp } = req.body;

    let OTP = await Otp.findOne({ email });
    if (otp != OTP.otp) {
      return next(new ErrorHandler(400, "Invalid otp"));
    }  
    await User.findOneAndUpdate(
      { email },
      {
        isVerified: true,
      }
    );
    Otp.deleteOne({ email });
    res.json({"success" : "true", "message": "Email Verified" });
  } catch (err) {
    res.status(500).json({"success" : "false", error: err});
  }
}

const signIn =  async (req, res,next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(new ErrorHandler(400, "No user exists with this email "));
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return next(new ErrorHandler(400, "Invalid Password"));
      }

      if (!user.isVerified) {
        return next(new ErrorHandler(400, "Email is not verified"));
      }

      const token = jwt.sign({ id: user._id }, "passwordKey");
      res.json({ "success" : "true", "message" : "Login successful" ,"data" : { token , user} });
    } catch (err) {
      res.status(500).json({"success" : "false", error: err});
    }
  };

const forgetPassword = async (req, res,next) => {
    try {
      const { email } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
          return next(new ErrorHandler(400, "This email is not registered"));
      }
      if (!user.isVerified) {
        return next(new ErrorHandler(400, "Email is not verified yet"));
      }
      const otp = Math.floor(1000 + Math.random() * 9000);
      let existingOtp = await Otp.findOne({ email });
      if (existingOtp) {
        existingOtp.deleteOne({ email });
      }
      Otp.create({ email: email, otp: otp }) 
      .then(result => { 
          console.log(result) 
      })
      
      mailer.sendmail(email, otp);
      res.json({"success" : "true", "message": "Otp is send to your registered email" });
    } catch (err) {
      res.status(500).json({ "success" : "false" , error: err });
    }
  }

const verifyOtp = async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      let OTP = await Otp.findOne({ email });
      if (otp != OTP.otp) {
        return next(new ErrorHandler(401, "Invalid otp"));
      }
       Otp.deleteOne({ email });
       User.findOneAndUpdate(
        {
          email,
        },
        { isVerified: true },
      );
      res.json({ "success": "true", "message": "otp is validated" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
  }

const changePassword = async (req, res,next) => {
    try {
      const { email, newPassword } = req.body;
      let user = await User.findOne({ email });
      if (!user.isVerified) {
        return next(new ErrorHandler(400, "Please first verify with the otp send "));
      }    
      const hashedPassword = await bcryptjs.hash(newPassword, 6);
      User.findOneAndUpdate(
        { email },
        {
          password: hashedPassword,
        }
      );
      res.json({ "success" : "true" , "message" : "password changed" , "data" : user});
    } catch (err) {
      return res.status(500).json({ "success" : "false", error: err });
    }
  }
  
module.exports = {
    signUp,
    emailVerification,
    signIn,
    forgetPassword,
    verifyOtp,
    changePassword
}