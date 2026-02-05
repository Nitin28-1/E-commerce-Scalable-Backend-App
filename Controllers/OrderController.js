const { default: mongoose } = require("mongoose")
const model=require('../Models/index')
const apiResponse=require('../Helpers/apiResponse')
const razorpay=require("../Config/razorpay")
const crypto=require('crypto');

module.exports.placeOrder=async (req,res)=>
{  
    const session=await mongoose.startSession();
    session.startTransaction();

    try {
        const {items}=req.body;

        let totalAmount=0;
        let OrderItems=[];

        for(let item of items)
        {
         const product=await model.Product.findOneAndUpdate(
            {
                _id:item._id,
                quantity:{$gte:item.quantity}
            },
            {
                $inc:{quantity:-item.quantity}
            }, 
            {new:true, session}
          )
        
        if(!product)
        {
          throw new Error("Out Of Stock")
        }

        OrderItems.push({
            productId:item._id,
            price: item.price,
            quantity: item.quantity
        });
       
        totalAmount+= product.price * item.quantity
      }

      //creating Razorpay Order
      
      const razorpayOrder=await razorpay.orders.create({
        amount:totalAmount*100,
        currency:"INR",
        receipt:`order_${Date.now()}`
      });

    const order=await model.Order.create([{
        user:req.user._id,
        items:OrderItems,
        totalAmount:totalAmount,
        paymentStatus:"PENDING",
        razorpayOrderId:razorpayOrder.id
    }] ,{session});


    await session.commitTransaction();
    session.endSession();

    return apiResponse.successResponseWithData(res,"Order Placed Successfully",
       { order,
        razorpayOrder}
    );

    } catch (error) {
      
        await session.abortTransaction();
        session.endSession();

        console.log(error)

        return apiResponse.ErrorResponse(res,error.message);
    }
}

module.exports.cancelOrder=async (req,res)=>
{
    const session=await mongoose.startSession();
    session.startTransaction();

     try {
        const {orderId}=req.params;

        const order=await model.Order.findById(orderId).session(session);

        if(!order || order.orderStatus !== "PENDING" )
        {
            throw new Error(`Order Can't be Canceled.`);
        }

        for(let item of order.items)
        {
            await model.Product.findByIdAndUpdate(
                item.productId,
                {$inc:{quantity:item.quantity}},
                {session}
            )
        }

        order.orderStatus="CANCELED";
        await order.save({session});

        await session.commitTransaction();
        session.endSession();

        return apiResponse.successResponse(res,"Order Canceled Success");

     } catch (error) {
        
        await session.abortTransaction();
        session.endSession();

        return apiResponse.ErrorResponse(res,error.message);
     }
}

module.exports.verifyPayment=async (req,res)=>
{
    const session = await mongoose.startSession();
  session.startTransaction();

    try {
        
        const {razorpay_payment_id,razorpay_order_id,razorpay_signature}=req.body;

        const body= razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");
        const order=await model.Order.findOne({razorpayOrderId: razorpay_order_id}).session(session);

        if(!order)
        {
            throw new Error("Order Not Found.")
        }

        //agar signature match nhi hoga matalb payment success nhi hui hai 
        if(expectedSignature !== razorpay_signature)
        {
          

            for(let item of order.items)
            {
                await model.Product.findOneAndUpdate(
                    item.productId,
                    {
                        $inc:{quantity:item.quantity}
                    },
                      { session}
                );
            }

            order.orderStatus="CANCELED";
            order.paymentStatus="FAILED"
            await order.save({session});

          await session.commitTransaction();
         session.endSession();

            return apiResponse.unauthorizedResponse(res,"Your Payment Failed To Verified. Try Again");
        }
        
        //payment
          order.paymentStatus="PAID";
          order.razorpayPaymentId=razorpay_payment_id;
          await order.save({session});
        
        await session.commitTransaction();
        session.endSession();

        return apiResponse.successResponse(res,"Payment Verified Successfully.")

    } catch (error) {
         await session.abortTransaction();
        session.endSession();
        console.log(error)
        return apiResponse.ErrorResponse(res,"Payment Verification Failed.");
    }
}

module.exports.getMyOrder=async (req,res)=>
{
    try {
        const orders=await model.Order.find({
            user:req.user._id
        });

        return apiResponse.successResponseWithData(res,"Order got Successfully.",orders);

    } catch (error) {
        return apiResponse.ErrorResponse(res,"Failed To Fetch Orders");
    }
}