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

      let existing_User = await User.findOne({ email });

      if (existing_User) {
          return res.status(400).json({ "message" : "User with this email already exists" });
      }

      let existing_User2 = await User.findOne({ username });

      if (existing_User2) {
          return res.status(400).json({ "message" : "User with this username already exists" });
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
          console.log("created User") 
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

const emailVerification = async (req,res) => {
  try {
    const { email, otp } = req.body;

    let OTP = await Otp.findOne({ email });
    if (otp != OTP.otp) {
      return res.status(500).json({ "message": "Invalid otp" });
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
        return res.status(400).json({ "message": "Email is not verified" });
      }

      const token = jwt.sign({ id: user._id }, "passwordKey");
      res.json({ "success" : "true", "message" : "Login successful" ,"data" : { token , user} });
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
      if (!user.isVerified) {
        return res.status(400).json({ "message": "Email is not verified" });
      }
      const otp = Math.floor(1000 + Math.random() * 9000);
      let existingOtp = await Otp.findOne({ email });
      if (existingOtp) {
        existingOtp.deleteOne({ email });
      }
      Otp.create({ email: email, otp: otp }) 
      .then(result => { 
          console.log("created otp") 
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
        return res.status(400).json({ "message": "Invalid otp" });
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

const changePassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      let user = await User.findOne({ email });
      if (!user.isVerified) {
        return next(new ErrorHandler(403, "Please verify with otp first"));
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
    signIn,
    forgetPassword,
    verifyOtp,
    changePassword
}