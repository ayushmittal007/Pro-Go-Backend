const nodemailer = require('nodemailer');

const subscribeMail = async (email) => {
  try{
    const msg = {
        from: 'process.env.MAIL_ID',
        to: email,
        subject: "Subscribed to Pro-Go",
        html: 
        ` <p style="margin-bottom: 30px;"> You have successfully subscribed to the Pro-Go community.
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
    console.log(err);
  }
}

module.exports = {subscribeMail};