const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User,Otp} = require("../model");
const mailer = require("../utils/send_mail");
const {ErrorHandler} = require("../middlewares/errorHandling");
const {authSchema} = require("../utils/joi_validations");
const app = express();
app.use(express.json());

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
        await User.create({ username : username , password : hashedPassword, email: email}) 
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      let oldOTP = await Otp.findOne({ email });
      if (oldOTP) {
        oldOTP.updateOne({otp,});
      }
      else {
        await Otp.create({ email: email, otp: otp }) 
      }
      
      mailer.sendmail(email, otp);
    
      res.status(201).json(
        {
          "success" : "true" , 
          "message" : "Sign up successful! Please verify your account , using otp send to your mail" ,
          "data" :  { username, hashedPassword, email } 
        });
    } catch (err) {
      if(err.isJoi) err.status = 422
      next(err)
    }
}

// const phoneVerification = async(req,res,next) => {

// }

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
      },
      { new : true ,}
    );
    Otp.deleteOne({ email });
    res.json({"success" : "true", "message": "Email Verified" });
  } catch (err) {
    res.status(500).json({"success" : "false", error: err});
  }
}

const signIn =  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(new ErrorHandler(400, "No user exist with this email "));
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return next(new ErrorHandler(400, "Invalid Password!"));
      }

      if (!user.isVerified) {
        return next(new ErrorHandler(400, "Email is not verified"));
      }
      const token = jwt.sign({ id: user._id }, "secret");
      const hashedPassword = await bcryptjs.hash(password, 6);
      res.json({ "success" : "true", "message" : "Login successful" ,"data" : { token , user } });
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
        existingOtp.deleteOne({ email });
      }
      await Otp.create({ email: email, otp: otp }) 
      
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
        return next(new ErrorHandler(400, "Invalid otp"));
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
        await existingOtp.updateOne({ otp });
      } else {
        await Otp.create({ email: email, otp: otp }) 
      }

      mailer.sendmail(email, otp);

      res.json({
        success: "true",
        message: "New OTP has been sent to your registered email",
      });
    } catch (e) {
        res.status(500).json({ error: err });
    }
  }

const changePassword = async (req, res , next) => {
    try {
      const { email, newPassword } = req.body;
      let user = await User.findOne({ email });
      if (!user.isVerified) {
        return next(new ErrorHandler(400, "User with this email is not verified"));
      }    
      const hashedPassword = await bcryptjs.hash(newPassword, 6);
      User.findOneAndUpdate(
        { email },
        {
          password: hashedPassword,
        },
        {new : true}
      );
      res.json({ "success" : "true" , "message" : "password changed" , "data" : user});
    } catch (err) {
      return res.status(500).json({ "success" : "false", error: err });
    }
  }

module.exports = {
    signUp,
    emailVerification,
    // phoneVerification,
    signIn,
    forgetPassword,
    verifyOtp,
    resendOtp,
    changePassword
}