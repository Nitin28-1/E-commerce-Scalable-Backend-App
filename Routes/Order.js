const express=require('express');
const router=express.Router();
const Auth =require('../Middlewares/AuthMiddleware');
const validate=require('../Middlewares/Validate');
const validation=require('../Validations/index')
const OrderController=require('../Controllers/OrderController');

router.post('/place',Auth,validate(validation.OrderValidation.orderValidation),OrderController.placeOrder);
router.put('/cancel/:orderId',Auth,OrderController.cancelOrder);
router.get('/get',Auth,OrderController.getMyOrder);
router.post('/verify-payment',OrderController.verifyPayment);


module.exports= router;