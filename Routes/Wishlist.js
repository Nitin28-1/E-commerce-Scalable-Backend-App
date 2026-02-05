const express =require('express');
const router=express.Router();
const validate=require('../Middlewares/Validate');
const Auth=require('../Middlewares/AuthMiddleware')
const Role=require('../Middlewares/RoleMiddleware')
const Validation=require('../Validations/index');
const WishlistController=require('../Controllers/WishlistController')

router.post('/add/:productId',Auth,WishlistController.addProductToWishlist);
router.get('/get',Auth,WishlistController.getAllWishlist);

module.exports=router