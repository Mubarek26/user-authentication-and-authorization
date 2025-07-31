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

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.use(authController.protect); // Protect all routes after this middleware

router.route('/updatePassword').patch( authController.updatePassword);
router.route('/me').get(userControllers.getMe,userControllers.getUser); // Route to create a new user
router.route('/updateMe').patch( userControllers.updateMe); // Route to update user profile
router.route('/deleteMe').delete(userControllers.deleteMe); // Route to delete user profile

// Restrict all routes after this middleware to admin users
router.use(authController.restrictTo('admin')); // Restrict all routes after this middleware to admin users

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .patch(updateUsers)
    .delete(deleteUsers);
module.exports = router;
    
