const model=require('../Models/index');
const apiResponse=require('../Helpers/apiResponse');

module.exports.addToCart=async (req,res)=>
{
    try {
        
        const {productId,quantity}=req.body;
        const userId=req.user._id;

        const cart=await model.Cart.findOne({
            userId:userId
        })

        if(!cart)
        {
            const newCart=await model.Cart.create({
                userId:userId,
                items:[{productId,quantity}]
            });

            return apiResponse.successResponseWithData(res,"User Cart Created Success.",newCart);
        }
        
        const productIndex=cart.items.findIndex(
            index => index.productId.toString() === productId
        )

        if(productIndex > -1)
        {
            cart.items[productIndex].quantity+=quantity;
        }
        else
        {
            cart.items.push({productId,quantity});
        }

        await cart.save();

        return apiResponse.successResponseWithData(res,"Product Added in Cart Success",
            cart
        )

    } catch (error) {
        return apiResponse.ErrorResponse(res,"Failed To Add in Cart");
    }
}

module.exports.removeFromCart=async (req,res)=>
{
    try {
        const {productId}=req.params;
        const userId=req.user._id;

        const cart=await model.Cart.findOne({
            userId:userId
        });

        if(!cart)
        {
            return apiResponse.unauthorizedResponse(res,"User Cart Not Exist.");
        }

        cart.items=cart.items.filter(item=>{
            return  item.productId.toString() !== productId
        });

        await cart.save();

        return apiResponse.successResponseWithData(res,"Product Removed From Cart.",cart);

    } catch (error) {
        return apiResponse.ErrorResponse(res,"Failed To Remove Product From Cart.")
    }
}

module.exports.updateQuantity=async (req,res)=>
{
    try {
       const {productId,quantity}=req.body;
       const userId=req.user._id;
       let cart={};

       if(quantity <= 0)
       {
        cart= await model.Cart.findOneAndUpdate(
            {userId:userId},
            {$pull :{items: {productId}}},
            {new:true}
         );
       }
       else {
        cart= await model.Cart.findOneAndUpdate(
            {userId:userId,"items.productId":productId},
            {$set :{"items.$.quantity":quantity}},
            {new:true}
         )
       }

       return apiResponse.successResponseWithData(res,"Cart Updated Successfully",cart);
        

    } catch (error) {
        return apiResponse.ErrorResponse(res,"Cart Not Found");
    }
}

module.exports.getCart=async (req,res)=>
{
    try {
        const userId=req.user._id;

        const cart=await model.Cart.findOne({
            userId:userId
        }).populate("items.productId","title price image");

        if(!cart)
        {
            return apiResponse.unauthorizedResponse(res,"User Not Have any Product in Cart.");
        }

        return apiResponse.successResponseWithData(res,"User Cart Fetched Success",cart);

    } catch (error) {
        return apiResponse.ErrorResponse(res,"Failed To Get User Cart");
    }
}