const express = require('express');
const router = express.Router();
const authController=require('../controllers/authController')
// const fs = require('fs');
const userControllers = require('./../controllers/userControllers');
const catchAsync = require('../utils/catchAsync');
const { createUser, getAllUsers, getUser, updateUsers, deleteUsers } = userControllers;
const { signup,login } = authController;
// const app = express();
router
    .route('/signup')
    .post(signup); // Route for user signup
router
    .route('/login').post(login)

router.route('/forgotPassword').post(authController.protect,authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router.route('/updatePassword').patch(authController.protect, authController.updatePassword);
router.route('/updateMe').patch(authController.protect, userControllers.updateMe); // Route to update user profile
router.route('/deleteMe').delete(authController.protect, userControllers.deleteMe); // Route to delete user profile

router
    .route('/')
    .get(authController.protect,getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .patch(updateUsers)
    .delete(deleteUsers);
module.exports = router;
    
