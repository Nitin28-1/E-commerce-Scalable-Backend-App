const express=require('express');
const router=express.Router();
const Auth=require('../Middlewares/AuthMiddleware');
const Role=require('../Middlewares/RoleMiddleware');
const AdminController=require('../Controllers/AdminController');

router.get('/getAllUsers',Auth,Role("Admin"),AdminController.getAllUsers);
router.put('/blockUnBlockUser/:userId',Auth,Role("Admin"),AdminController.blockUnblockUser);
// router.get('/getAllProducts',Auth,Role("Admin"),AdminController.getAllProduct);
router.get('/getAllProducts',AdminController.getAllProduct);
router.put('/disableEnableProduct/:productId',Auth,Role("Admin"),AdminController.disableProduct);
router.get('/getAllOrders',Auth,Role("Admin"),AdminController.getAllOrders);
router.get('/getDashboard',Auth,Role("Admin"),AdminController.dashboard);


module.exports=router;