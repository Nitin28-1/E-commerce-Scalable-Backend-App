const mongoose =require('mongoose');

const OrderSchema = new mongoose.Schema({
    user:{type:String,required:true},
    items:[
        {
            productId:{
                type:mongoose.Types.ObjectId,
                ref:"Product",
                required:true
            },
            quantity:{type:Number,required:true},
            price:{type:Number}
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    },
    paymentStatus:{
        type:String,
        enum:["PENDING","PAID","FAILED"],
        default:"PENDING"
    },
    orderStatus:{
        type:String,
        enum:["PENDING","SHIPPED","DELIVERED","CANCELED"],
        default:"PENDING"
    },
    razorpayOrderId:{
        type:String
    },
    razorpayPaymentId:{
        type:String
    }
},
    {timestamps:true});


module.exports =mongoose.model('Order',OrderSchema);