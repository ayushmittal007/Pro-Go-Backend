const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User,Otp} = require("../model");
const mailer = require("../utils/send_mail");
const validateEmail = require("../utils/validateEmail");
const app = express();
app.use(express.json());

const signUp = async (req, res) => {
    try {
      const { username, password, email } = req.body;
      if (!username || !password || !email) {
        return res.status(400).json({ error: "fill all entries" });
      }
      
      if(!validateEmail(email)){
        return res.status(400).json({ "message": "Incorrect email format" })
      }

      const existing_User = await User.findOne({ email });

      if (existing_User) {
        if (!existing_User.isVerified) {
          await User.deleteOne({ email });
        } else {
          return res.status(400).json({ "message" : "User with this email already exists" });
        }
      }

      const otp = Math.floor(1000 + Math.random() * 9000);
      let OTP = new Otp({
        email,
        otp,
      });
      console.log(OTP);
      mailer.sendmail(email, otp);
      OTP = await OTP.save();

      const hashedPassword = await bcryptjs.hash(password, 6);
      let user = new User({
        username,
        password: hashedPassword,
        email,
      });

      user = await user.save();
      res.status(201).json(
        {
          "success" : "true" , 
          "message" : "Sign up successful! Please verify your account , using otp send to your mail" ,
          "data" : user
        });
    } catch (err) {
      res.status(500).json({"success" : "false", error: err});
    }
}

const emailVerification = async (req,res) => {
  try {
    const { email, otp } = req.body;

    let OTP = await Otp.findOne({ email });
    console.log(OTP);
    if (otp != OTP.otp) {
      return res.status(500).json({ "message": "Invalid otp" });
    }  
    await User.findOneAndUpdate(
      { email },
      {
        isVerified: true,
      },
      { new: true }
    );
    await Otp.deleteOne({ email });
    res.json({"success" : "true", "message": "Email Verified" ,"status" : "sign-up successful" });
  } catch (err) {
    res.status(500).json({"success" : "false", error: err});
  }
}

const signIn =  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "No user exist with this username " });
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Password!" });
      }

      if (!user.isVerified) {
        return res.status(401).json({ "message": "Email is not verified" });
      }

      const token = jwt.sign({ id: user._id }, "passwordKey");
      res.json({ "success" : "true", "message" : "Login successful" ,"data" : { token , ...user.toObject()} });
    } catch (err) {
      res.status(500).json({"success" : "false", error: err});
    }
  };

const forgetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "No user exists with this email" });
      }
      const otp = Math.floor(1000 + Math.random() * 9000);
      let existingOtp = await Otp.findOne({ email });
      if (existingOtp) {
        await existingOtp.deleteOne({ email });
      }
      let OTP = new Otp({
        email,
        otp,
      });
      OTP = await OTP.save();
      mailer.sendmail(email, otp);
      res.json({"success" : "true", "message": "Otp is send to your registered email" });
    } catch (err) {
      res.status(500).json({ "success" : "false" , error: err });
    }
  }

const changePassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      let OTP = await Otp.findOne({ email });
      if (otp != OTP.otp) {
        return res.status(500).json({ msg: "Invalid otp" });
      }      
      const hashedPassword = await bcryptjs.hash(newPassword, 6);
      let user = await User.findOneAndUpdate(
        { email },
        {
          password: hashedPassword,
        },
        { new: true }
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
    changePassword
}