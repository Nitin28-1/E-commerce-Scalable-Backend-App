const model = require('../Models/index');
const apiResponse=require('../Helpers/apiResponse');
const utility=require('../Helpers/utility');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const {sendRegisterEmail,resetPasswordEmail}=require('../Services/mailService')

module.exports.register=async (req,res,next)=>
{
    try {
        const {email,name,password,role} =req.body;

        const existingUser=await model.User.findOne({
            email:email
        })
     
        console.log(existingUser)

        if(existingUser){

            if(!existingUser.isConfirmed)
           {
               const verificationLink=`${process.env.Frontend_domain}/auth/verify_email?token=${existingUser.confirmationToken}`;
               await sendRegisterEmail(existingUser,verificationLink);
              return apiResponse.successResponse(res,'User Verification Email Sended Again.');
           }
           else 
           {
             return apiResponse.validationErrorWithData(res,
                'Account Already Exist for this Email.', {}
             );
           }
        }

        const confirmationToken=utility.randomString(10);
        const hash=await bcrypt.hash(password,10);

        const user=model.User({
            name:name,
            email:email,
            password:hash,
            confirmationToken:confirmationToken,
            role:role,
        });

         const verificationLink=`${process.env.Frontend_domain}/auth/verify_email?token=${confirmationToken}`;
         await sendRegisterEmail(user,verificationLink);

        await user.save();
        const userData={
            _id:user._id,
            name:user.name
        };

        return apiResponse.successResponseWithData(res,'Please Check Your Email and Verify your Account',userData);

    } catch (error) {
        console.log(error)
        return apiResponse.ErrorResponse(res,error);
    }
}

module.exports.verifyConfirm= async (req,res)=>
{
    try {
        const {token}=req.body;

        const user = await model.User.findOne({
            confirmationToken:token
        });

        if(user)
        {
          if(user.isConfirmed)
           {
            return apiResponse.unauthorizedResponse(res,'Your Account is Already Verified.'); 
           }

           user.isConfirmed=true;
           user.confirmationToken=' '
           await user.save();

           const userData={
               _id:user.id,
               name:user.name,
           }

           return apiResponse.successResponseWithData(res,'Account Verified Successfully',userData);
        }

        return apiResponse.unauthorizedResponse(res,'Invalid Token.')
    
    } catch (error) {
        console.log(error);
     return apiResponse.ErrorResponse(res,error);
    }
}

module.exports.login=async (req,res)=>
{
    try {
        
        const {email,password} =req.body;

        const user=await model.User.findOne({
            email:email
        });

        if(user.isBlocked)
        {
            return apiResponse.unauthorizedResponse(res,"Your Account is Blocked By Admin Please Contact Admin.")
        }

        if(user)
        {
            if(!user.isConfirmed)
            {
             return apiResponse.unauthorizedResponse(res,'Please First Verified Your Account.');
            }   

            const isPassword=await bcrypt.compare(password, user.password)

            if(!isPassword){
            return apiResponse.unauthorizedResponse(res,'User Password is Incorrect.');
            }

            const userData={
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }

            const token=jwt.sign(userData,process.env.JWT_SECRET);
            userData.token=token;

            return apiResponse.successResponseWithData(res,'User Login Successfully.',userData);
        }
        return apiResponse.unauthorizedResponse(res,'User not exist for this email.');

    } catch (error) {
        
        return apiResponse.ErrorResponse(res,"Failed To Login User");
    }
}

module.exports.forgotPassword=async (req,res)=>
{   
    try {
        const {email} = req.body;

        const user=await model.User.findOne({
            email:email
        });


        if(user)
        {
          const resetPasswordToken=utility.randomString(15);
          const resetPasswordLink=`${process.env.rontend_domain}/auth/verify-reset-password?token=${resetPasswordToken}`;
          const resetPasswordTokenExpiry=Date.now() +  10*60*1000  //5 Min ki Expiry 

          await resetPasswordEmail(user,resetPasswordLink);

           user.resetPasswordToken=resetPasswordToken
           user.resetPasswordExpiry=resetPasswordTokenExpiry;

           await user.save();

           return apiResponse.successResponse(res,"Forgot Password Email Sended.");
        }

        return apiResponse.unauthorizedResponse(res,"User Not Exist For This Email.");

    } catch (error) {
        console.log(error);
        return apiResponse.ErrorResponse(res,error);
    }
}

module.exports.setPassword=async (req,res)=>
{
    try {
        const {token,newPassword}=req.body;

        if(!token || !newPassword)
        {
            return apiResponse.ErrorResponse(res,"All Field are required.");
        }

        const user = await model.User.findOne({
            resetPasswordToken:token
        });


        if(!user)
        {
            return apiResponse.unauthorizedResponse(res,'Forgot Password Token is Invalid or Expiry.');
        }

        if(user.resetPasswordExpiry < Date.now())
        {
           const resetPasswordToken=utility.randomString(15);
          const resetPasswordLink=`${process.env.rontend_domain}/auth/verify-reset-password?token=${resetPasswordToken}`;
          const resetPasswordTokenExpiry=Date.now() +  10*60*1000  //10 Min ki Expiry 

          await resetPasswordEmail(user,resetPasswordLink);

           user.resetPasswordToken=resetPasswordToken
           user.resetPasswordExpiry=resetPasswordTokenExpiry;

           await user.save();

           return apiResponse.successResponse(res,"Your Forgot Password Token is Expiry. Please Verify with new one on email"); 
        }

        const isCompare=await bcrypt.compare(newPassword,user.password);

        if(isCompare)
        {
            return apiResponse.unauthorizedResponse(res,'You Can Not Use Old Password Again.');
        }

       

        const hashPassword=await bcrypt.hash(newPassword,10);

        user.password=hashPassword;
        user.resetPasswordToken='';
        user.resetPasswordExpiry='';

        user.save();

        return apiResponse.successResponse(res,"Your Password Change Successfully.");
           

    } catch (error) {

        return apiResponse.ErrorResponse(res,"Failed To Set Password.");
        
    }
}