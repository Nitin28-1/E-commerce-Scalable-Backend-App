const express=require('express');
const router=express.Router();
const ProductController=require('../Controllers/ProductController');
const Auth =require('../Middlewares/AuthMiddleware');
const Role=require('../Middlewares/RoleMiddleware')
const validate=require('../Middlewares/Validate');
const validation=require('../Validations/index')

router.post('/add',Auth,Role('Seller'),validate(validation.ProductValidation.addProductSchema),ProductController.addProduct);
router.get('/getAll',ProductController.getAllProducts);
router.get('/get/:productId',ProductController.getSingleProduct);
router.put('/update/:productId',Auth,Role('Seller'),ProductController.updateProduct);
router.delete('/delete/:productId',Auth,Role('Seller'),ProductController.deleteProduct);

module.exports= router;