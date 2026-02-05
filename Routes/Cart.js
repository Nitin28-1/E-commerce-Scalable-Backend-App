const express =require('express');
const router=express.Router();
const validate=require('../Middlewares/Validate');
const Auth=require('../Middlewares/AuthMiddleware')
const Validation=require('../Validations/index');
const CartController=require('../Controllers/CartController')

router.post('/add',Auth,validate(Validation.CartValidation.cartValidation),CartController.addToCart);
router.delete('/remove/:productId',Auth,CartController.removeFromCart);
router.put('/updateQuantity',Auth,validate(Validation.CartValidation.updateQuantityValidation),CartController.updateQuantity);
router.get('/get',Auth,CartController.getCart);


module.exports=router