const mongoose =require('mongoose');


const  ReviewSchema = new mongoose.Schema({

    product:{
        type:mongoose.Types.ObjectId,
        ref:"Product"
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String
    }
});

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });


module.exports =mongoose.model('Review',ReviewSchema);