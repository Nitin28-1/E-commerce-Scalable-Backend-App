const express =require('express');
const router=express.Router();
const validate=require('../Middlewares/Validate');
const Auth=require('../Middlewares/AuthMiddleware')
const Validation=require('../Validations/index');
const ReveiwController=require('../Controllers/ReviewController')

router.post('/add/:productId',validate(Validation.ReviewValidation.reviewValidation),Auth,ReveiwController.giveReviewProduct);
router.get('/get/:productId',Auth,ReveiwController.getProductReview);


module.exports=router