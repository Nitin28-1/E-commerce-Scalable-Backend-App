const nodemailer=require('nodemailer');
const emailTemplate=require('../EmailTemplate/emailTemplate');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_SECRET 
  }
});

const sendEmail=async(to,subject,html)=>
{
    try {
        await transporter.sendMail({
            from:process.env.EMAIL,
            to:to,
            subject:subject,
            html:html
        });

        console.log("Email Sended To ", to);


    } catch (error) {
        throw new Error('There is Error Coming While Sending Email' + error);
    }
}

const sendRegisterEmail=async (user,verificationURL)=>
{
    try {
        console.log("registration email ja rhi hai ....");
        const html=emailTemplate.registerEmail(user,verificationURL)
        await sendEmail(user.email,
            "User Registration Verification Email.",
            html
        );

    } catch (error) {
        console.log("There is Error Occuring While Sending Email",error)
    }
}

const resetPasswordEmail=async (user,verificationURL)=>
{
    try {
        const html=emailTemplate.resetPasswordEmail(user,verificationURL)
        await sendEmail(user.email,
            "Forgot Password Verification Email.",
            html
        );

    } catch (error) {
        console.log("There is Error Occuring While Sending Email",error)
    }
}


module.exports={sendRegisterEmail,resetPasswordEmail}