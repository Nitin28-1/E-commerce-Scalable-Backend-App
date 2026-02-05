const { required } = require('joi');
const mongoose =require('mongoose');


const UserSchema = new mongoose.Schema({
    name:{type:String,required:false},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    isConfirmed:{type:Boolean,required:false,default:false},
    confirmationToken:{type:String,required:false},
    resetPasswordToken:{type:String,required:false},
    isPassword:{type:Boolean,required:false},
    role:{type:String,enum:[
        'User','Seller','Admin'
    ]},
    resetPasswordExpiry:{type:Date,required:false},
    wishlist:[{
        type:mongoose.Types.ObjectId,
        ref:"Product"
    }],
    isBlocked:{
        type:Boolean,
        default:false
    }
});



module.exports =mongoose.model('User',UserSchema);