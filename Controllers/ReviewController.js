const model=require('../Models/index');
const apiResponse=require('../Helpers/apiResponse');
const { default: mongoose } = require('mongoose');

module.exports.giveReviewProduct=async (req,res)=>
{
    try {
        const {productId}=req.params;

        const{rating,comment}=req.body;

        const review=await model.Review.create({
            user:req.user._id,
            product:productId,
            rating:rating,
            comment:comment
        });

       const stats=await model.Review.aggregate([
        {
            $match: {product:new mongoose.Types.ObjectId(productId)}
        },
        {
            $group:{
                _id:"$product",
                averageRating:{$avg: "$rating"},
                totalReview:{$sum: 1}
            }
        }
       ])

       await model.Product.findByIdAndUpdate(productId,{
        averageRating: stats[0]?.averageRating || 0,
        totalReview: stats[0]?.totalReview || 0
       })

     return apiResponse.successResponse(res,"Review Create Success");

    } catch (error) {
        if (error.code === 11000) {
        return apiResponse.ErrorResponse(
        res,
        "You have already reviewed this product"
        );
        }
        return apiResponse.ErrorResponse(res,"Failed To Give Review To Product.");
    }
}

module.exports.getProductReview=async (req,res)=>
{
    try {
        const {productId}=req.params;
        
        const productReview=await model.Review.find({
            product:productId
        });

        if(!productReview)
        {
            return apiResponse.unauthorizedResponse(res,"Product Not exist");
        }

        return apiResponse.successResponseWithData(res,"Product Reviews Fetched Success.",productReview);
        
    } catch (error) {
        return apiResponse.ErrorResponse(res,"Failed To Get Product Reviews.");
    }
}