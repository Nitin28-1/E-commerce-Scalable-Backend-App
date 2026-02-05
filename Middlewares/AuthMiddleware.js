const jwt=require('jsonwebtoken');
const model=require('../Models/index');
const apiResponse=require('../Helpers/apiResponse')

const Auth=async (req,res,next)=>
{
    try {
        
    const token = req.headers.authorization?.split(" ")[1];

    if(!token)
    {
        return apiResponse.unauthorizedResponse(res,"Please Provide Token.");
    }

    const decode =jwt.verify(token,process.env.JWT_SECRET);

    const user=await model.User.findById({
        _id:decode._id
    });

    if(!user)
    {
        return apiResponse.unauthorizedResponse(res,"Token is Invalid Free Give Correct Token.");
    }

    req.user=user;

    next();

    } catch (error) {
     
        return apiResponse.unauthorizedResponse(res,"Invalid Or Expire Token.");
    }
}

module.exports = Auth;