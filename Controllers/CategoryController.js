const model=require("../Models/index")
const apiResponse=require('../Helpers/apiResponse');

module.exports.addCategory=async (req,res)=>{

    try {
        const {name,parentCategory}=req.body;

        const isCategory=await model.Category.findOne({
            name:name,
            parentCategory:parentCategory
        });

        if(isCategory)
        {
            return apiResponse.unauthorizedResponse(res,"Category Already Exist.");
        }

        const category=await model.Category({
            name:name,
            parentCategory:parentCategory
        });

        await category.save();

        return apiResponse.successResponse(res,"Category Created Success");

    } catch (error) {
        console.log(error)
        return apiResponse.ErrorResponse(res,"Failed To Add Category.")
    }

}

module.exports.getAllCategory=async (req,res)=>
{
    try {
        
        const category=await model.Category.find()
        .populate('parentCategory','name');

        if(!category)
        {
            return apiResponse.unauthorizedResponse(res,"There is no category exist.");
        }

        return apiResponse.successResponseWithData(res,"All Category Got Successfully",category);

    } catch (error) {
        
        return apiResponse.successResponse(res,error.message);
    }
}