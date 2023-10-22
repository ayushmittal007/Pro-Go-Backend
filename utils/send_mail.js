const nodemailer = require('nodemailer');

const sendmail = async (email,otp) => {
  try{
    const msg = {
        from: 'process.env.MAIL_ID',
        to: email,
        subject: "Verification code",
        html: `
          <p style="margin-bottom: 30px;">Please enter this OTP to proceed further</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center; color:green;">${otp}</h1>
        `,
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
    });

    transporter.sendMail(msg,err=>{
        if(err){ 
          console.log(err);
          return false;
        } 
        else {
          console.log("mail sent");
          return true;
        }
    });
  }catch(err){
    return next(err);
  }
}

module.exports = {sendmail};