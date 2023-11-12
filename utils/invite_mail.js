const nodemailer = require('nodemailer');

const inviteMail = async (email,senderEmail) => {
  try{
    const msg = {
        from: process.env.MAIL_ID,
        to: email,
        html: 
        `<p style="margin-bottom: 30px;"> We are thrilled to tell you that you have been invited to collaborate on a project by ${senderEmail} 
        </p>
        <p style="font-size: 10px;">If you did not want to collaborate, please ignore this email. Thank you.
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

    transporter.sendMail( msg ,err=>{
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
    return false;
  }
}

module.exports = {inviteMail};