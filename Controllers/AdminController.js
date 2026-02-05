const model=require('../Models/index');
const apiResponse=require('../Helpers/apiResponse');


module.exports.getAllUsers=async (req,res)=>
{
    try {
        
        const users= await model.User.find();

        if(!users)
        {
            return apiResponse.unauthorizedResponse(res,"Users Not Exist.");
        }

        return apiResponse.successResponseWithData(res,"User Data.",users);

    } catch (error) {
        
        return apiResponse.ErrorResponse(res,"Failed To Get All Users.");
    }
}

module.exports.blockUnblockUser=async (req,res)=>
{
    try {
        
        const {userId}=req.params;

        const user=await model.User.findOne({_id:userId});

         if(!user)
         {
            return apiResponse.unauthorizedResponse(res,"This User Not Exist.");
         }
        
         if(user.isBlocked)
         {
            user.isBlocked=false;
            await user.save();

            return apiResponse.successResponse(res,"User or Seller UnBlocked Successfully.");
         }
         else{
             
            user.isBlocked=true;
            await user.save();

            return apiResponse.successResponse(res,"User or Seller Blocked Successfully.");
         }
         

    } catch (error) {
        
        return apiResponse.ErrorResponse(res,"Failed To Block User.")
    }
}

module.exports.getAllProduct=async (req,res)=>
{
    try {
        
        const products=await model.Product.find();

        if(!products)
        {
            return apiResponse.unauthorizedResponse(res,"Products Not Exist.");
        }

        return apiResponse.successResponseWithData(res,"Product Data Got Successfully",products);

    } catch (error) {
        return apiResponse.ErrorResponse(res,"Failed To Get all Products.")
    }
}


module.exports.disableProduct=async (req,res)=>
{
    try {
        
        const {productId}=req.params;

        const product=await model.Product.findOne({_id:productId});

        if(!product)
        {
            return apiResponse.unauthorizedResponse(res,"Product Not Exist.");
        }

        if(product.isActive)
        {
            product.isActive=false;
            await product.save();

            return apiResponse.successResponse(res,"Product Disable Success.");
        }
        else
        {
            product.isActive=true;
            await product.save();

            return apiResponse.successResponse(res,"Product Enable Success.");
        }


    } catch (error) {
        console.log(error);
        return apiResponse.ErrorResponse(res,"Failed To Disable Product.");
    }
}

module.exports.getAllOrders=async (req,res)=>
{
    try {
        const orders=await model.Order.find();

        if(!orders)
        {
            return apiResponse.unauthorizedResponse(res,"Orders Not Exist.");
        }

        return apiResponse.successResponseWithData(res,"Order Data Get Success.",
            orders
        );

    } catch (error) {
        
        return apiResponse.ErrorResponse(res,"Failed To Get Order Data.");
    }
}

module.exports.dashboard=async (req,res)=>
{
    try {
        console.time('cg')
        const users=await model.User.countDocuments({role:"User"});
        const sellers=await model.User.countDocuments({role:"Seller"});
        const orders=await model.Order.countDocuments();

        const revenue=await model.Order.aggregate([
           {$match: {paymentStatus:"PAID"}},
           {$group: {_id:null, total:{$sum: "$totalAmount"}}} 
        ]);

        console.timeEnd('cg')

        return apiResponse.successResponseWithData(res,"Admin Dashboard Data.. ",{
            users,
            sellers,
            orders,
            revenue:revenue[0]?.total || 0
        });

    } catch (error) {

        console.log(error)
        
        return apiResponse.ErrorResponse(res,"Failed To Get Admin DashBoard Data.")
    }
}