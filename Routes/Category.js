const express =require('express');
const router=express.Router();
const validate=require('../Middlewares/Validate');
const Auth=require('../Middlewares/AuthMiddleware')
const Role=require('../Middlewares/RoleMiddleware')
const Validation=require('../Validations/index');
const CategoryController=require('../Controllers/CategoryController')

router.post('/add',Auth,Role('Admin'),validate(Validation.CategoryValidation.addCategorySchema),CategoryController.addCategory);
router.get('/getAll',Auth,CategoryController.getAllCategory);

module.exports=router