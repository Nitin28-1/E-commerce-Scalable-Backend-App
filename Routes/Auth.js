const express =require('express');
const router=express.Router();
const validate=require('../Middlewares/Validate');
const Auth=require('../Middlewares/AuthMiddleware')
const Validation=require('../Validations/index');
const AuthController=require('../Controllers/AuthController');

router.post('/register',validate(Validation.AuthValidation.registerSchema),AuthController.register);
router.post('/login',validate(Validation.AuthValidation.loginSchema),AuthController.login);
router.post('/verify-email/:token',validate(Validation.AuthValidation.verify_token),AuthController.verifyConfirm);
router.post('/forgot-password',validate(Validation.AuthValidation.forgotPasswordSchema),Auth,AuthController.forgotPassword);
router.post('/set-password',Auth,AuthController.setPassword);


module.exports=router