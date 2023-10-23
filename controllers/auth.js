const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp = require("../model/otp");
const User = require("../model/user");
const mailer = require("../utils/send_mail");
const app = express();
app.use(express.json());

const signUp = async (req, res) => {
    try {
      const { username, password, email } = req.body;
      if (!username || !password || !email) {
        return res.status(400).json({ error: "fill all entries" });
      }
      const existingUser = await User.findOne({ email });

      if (existingUser) {
          return res.status(400).json({ msg: "User with the same username already exists" });
      }
      const hashedPassword = await bcryptjs.hash(password, 6);
      const otp = Math.floor(100000 + Math.random() * 899999);
      let OTP = new Otp({
        email,
        otp,
      });
      mailer.sendmail(email, otp);

      let user = new User({
        username,
        password: hashedPassword,
        email,
      });

      user = await user.save();
      OTP = await OTP.save();
      res.status(201).json({"status" : "sign-up successful" , user });
    } catch (e) {
      res.status(500).json({ error: e});
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

      const token = jwt.sign({ id: user._id }, "passwordKey");
      res.json({ token, ...user.toObject() });
    } catch (err) {
      res.status(500).json({ error:err});
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
      res.json({ msg: "Otp is send to your registered email" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

const changePassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      let OTP = await Otp.findOne({ email });
      if (otp != OTP.otp) {
        return res.status(500).json({ msg: "Invalid otp" });
      }      
      const hashedPassword = await bcryptjs.hash(newPassword, 8);
      let user = await User.findOneAndUpdate(
        { email },
        {
          password: hashedPassword,
        },
        { new: true }
      );

      res.json({ "status" : "password changed" , user});
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
module.exports = {
    signUp,
    signIn,
    forgetPassword,
    changePassword
}