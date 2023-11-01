const nodemailer = require('nodemailer');

const sendmail = async (email,otp) => {
  try{
    const msg = {
        from: 'process.env.MAIL_ID',
        to: email,
        subject: "Verification code",
        html: 
        ` <p style="margin-bottom: 30px;"> We are thrilled to have you on the Pro-Go community! To verify your email
        address and complete the registration process, please use the following
        One-Time Password (OTP) code:
          </p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center; color:green;">${otp}</h1>
          <p>
          If you didn't request this OTP or have any concerns about your Pro-Go
          account, please ignore this email.
        </p>
        <p>
          Thank you for choosing Pro-Go, and we look forward to helping you stay
          organized and productive!
        </p>`
      ,
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PASS
      },
      port: 456,
      host: "smtp.gmail.com"
    });

    transporter.sendMail(msg,err=>{
        if(err){ 
          console.log(err);
          return false;
        } 
        else {
          return true;
        }
    });
  }catch(err){
    return next(err);
  }
}

module.exports = {sendmail};