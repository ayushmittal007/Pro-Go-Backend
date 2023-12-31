const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User,Otp} = require("../model");
const mailer = require("../utils/send_mail");
const {ErrorHandler} = require("../middlewares/errorHandling");
const {authSchema , newSchema} = require("../utils/joi_validations");
const shortid = require("shortid");
const app = express();
app.use(express.json());
require("dotenv").config();

const signUp = async (req, res, next) => {
    try {
      const input = await authSchema.validateAsync(req.body);
      const username = input.username;
      const email = input.email;
      const password = input.password;

      const hashedPassword = await bcryptjs.hash(password, 6);

      let existingEmail = await User.findOne({ email });
      if (existingEmail) {
        if (!existingEmail.isVerified) {
          existingEmail.updateOne({
            username: username,
            email: email,
            password: hashedPassword,
          });
        } else {
          return next(
            new ErrorHandler(400, "User with this email already exists")
          );
        }
      } else {
        let exsitingUsername = await User.findOne({ username });
        if (exsitingUsername) {
          return next(new ErrorHandler(400, "This username already exists"));
        }
        User.create({ username : username , password : hashedPassword, email: email}) 
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      let oldOTP = await Otp.findOne({ email });
      if (oldOTP) {
        oldOTP.updateOne({  $set: { otp , createdAt : Date.now()}});
      }
      else {
        await Otp.create({ email: email, otp: otp , createdAt : Date.now()}) 
      }
      
      mailer.sendmail(email, otp , "Email Verification");
    
      res.status(201).json(
        {
          success : true , 
          message : "Sign up successful! Please verify your account , using otp send to your mail" ,
          data :  { username, hashedPassword, email } 
        });
    } catch (err) {
      if(err.isJoi) err.status = 422
      console.log(err)
      next(err)
    }
}

const emailVerification = async (req,res,next) => {
  try {
    const { email, otp } = req.body;

    let OTP = await Otp.findOne({ email });
    if (otp != OTP?.otp) {
      return next(new ErrorHandler(400, "Invalid otp"));
    }  
    await User.findOneAndUpdate(
      { email },
      {
        isVerified: true,
      },
      { new : true ,}
    );
    Otp.deleteOne({ email });
    res.json({success : true, message: "Email Verified" });
  } catch (err) {
    next(err);
  }
}

const signIn =  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(new ErrorHandler(400, "No user exist with this email"));
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return next(new ErrorHandler(400, "Invalid Credentials!"));
      }

      if (!user.isVerified) {
        return next(new ErrorHandler(400, "Email is not verified"));
      } 
      const shortId = user.shortId
      const payload = {
        id: user._id, // id generated by mongodb
        unique_identifier: shortId,
      };

      const token = jwt.sign(payload, process.env.USER_KEY, {
        expiresIn: "2d",
      });
      res.json({ success : true, message : "Login successful" ,data : {
          token,
          username: user.username,
          email,
          isVerified : user.isVerified,
      }});
    } catch (err) {
      next(err)
    }
  };

const forgetPassword = async (req, res , next) => {
    try {
      const { email } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return next(new ErrorHandler(400, "No user exists with this email"));
      }
      if (!user.isVerified) {
        return next(new ErrorHandler(400, "Email is not verified"));
      }
      const otp = Math.floor(100000 + Math.random() * 900000);
      let existingOtp = await Otp.findOne({ email });
      if (existingOtp) {
        await existingOtp.updateOne({  $set: { otp : otp, createdAt : Date.now()}});
      }
      else {
        Otp.create({ email: email, otp: otp , createdAt : Date.now()}) 
      }
      
      mailer.sendmail(email, otp);
      res.json({success : true, message: "Otp is send to your registered email" });
    } catch (err) {
      next(err);
    }
  }

  const resendOtp =  async (req, res, next) => {
    try {
      const { email } = req.body;
      let user = await User.findOne({ email });

      if (!user) {
        return next(new ErrorHandler(400, "No user exists with this email"));
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      const existingOtp = await Otp.findOne({ email });

      if (existingOtp) {
        if( Date.now() - existingOtp.createdAt >= 60000){
          await existingOtp.updateOne({  $set: { otp : otp, createdAt : Date.now()}});
        }else {
          return next(new ErrorHandler(400, "60 seconds not completed"));
        }
      } else {
        await Otp.create({ email: email, otp: otp , createdAt : Date.now()}) 
      }

      mailer.sendmail(email, otp , "Reset Password");

      res.json({
        success : true,
        message: "New OTP has been sent to your registered email",
      });
    } catch (err) {
      next(err)
    }
  }

const verifyOtp = async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      let OTP = await Otp.findOne({ email });
      if (otp != OTP?.otp) {
        return next(new ErrorHandler(400, "Invalid otp"));
      }
       Otp.deleteOne({ email });
       User.findOneAndUpdate(
        {
          email,
        },
        { isVerified: true },
      );
      let user = await User.findOne({ email });
      const token = jwt.sign({ id: user._id }, process.env.RESET_KEY, {
        expiresIn: 300,
      });

      res.json({ success : true , message: "otp is validated",data : { token } });
    } catch (err) {
      next(err);
    }
  }

const changePassword = async (req, res , next) => {
    try {
      const input = await newSchema.validateAsync(req.body);
      const email = input.email;
      const newPassword = input.newPassword;
      let user = await User.findOne({ email });
      const isMatch = await bcryptjs.compare(newPassword, user.password);
      if(isMatch) {
        return next(new ErrorHandler(400, "Please Change The Password!"));
      }

      const token = req.header("verify-token");
      const verified = jwt.verify(token, process.env.RESET_KEY);
      if (!verified) {
        return next(new ErrorHandler(400, "Please verify otp first"));
      }
      // console.log(verified);
      const hashedPassword = await bcryptjs.hash(newPassword, 6);
      const shortId = shortid.generate();
      await User.findByIdAndUpdate(verified.id, {
        shortId: shortId,
        password: hashedPassword,
      });
      
      res.json({ success : true , message : "password changed" , data : user});
    } catch (err) {
      next(err);
    }
  }

module.exports = {
    signUp,
    emailVerification,
    signIn,
    forgetPassword,
    verifyOtp,
    resendOtp,
    changePassword
}