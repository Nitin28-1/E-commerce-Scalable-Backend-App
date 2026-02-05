const model=require('../Models/index');
const apiResponse=require("../Helpers/apiResponse")

module.exports.addProductToWishlist=async (req,res)=>
{
    try {
        const {productId}=req.params;
        const {userId}=req.user._id;

        const user=await model.User.findOne({
            userId:userId
        });

        const productExist=user.wishlist.includes(productId);

        if(productExist)
        {
            const result=await model.User.findOneAndUpdate(userId,
                {$pull: {wishlist:productId}},
                {new:true}
            ).populate('wishlist','title price');

            return apiResponse.successResponseWithData(res,"Product Removed From Wishlist",result);
        }
        else
        {
            const result=await model.User.findOneAndUpdate(
                userId,
                {$addToSet:{wishlist:productId}},
                      {new:true}
            ).populate('wishlist','title price');
            
            return apiResponse.successResponseWithData(res,"Product Added to Wishlist",result);
        }

    } catch (error) {
        
        return apiResponse.ErrorResponse(res,"Failed To Add Product in Wishlist");
    }
}

module.exports.getAllWishlist=async (req,res)=>
{
    try {
        const result=await model.User.findOne({
            _id:req.user._id
        }).populate('wishlist','title price quantity');

        return apiResponse.successResponseWithData(res,"Successfully get all wishlist",result);

    } catch (error) {
        return apiResponse.ErrorResponse(res,"Failed To get Wishlist");
        
    }
}