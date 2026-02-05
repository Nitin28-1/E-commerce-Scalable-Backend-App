const mongoose =require('mongoose');


const ProductSchema = new mongoose.Schema({
    title:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    quantity:{type:Number,required:true},
    image:{type:String,required:true},
    sellerId:{type:mongoose.Types.ObjectId,ref:'User',required:true},
    categoryId:{type:mongoose.Types.ObjectId,ref:'Category',required:true},
       averageRating:{
        type:Number,
        default:0
    },
    totalReview:{
        type:Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:true
    }
}
    ,
    {timestamps:true}
);


module.exports =mongoose.model('Product',ProductSchema);