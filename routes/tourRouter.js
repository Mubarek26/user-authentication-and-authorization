const express = require('express');
const tourControllers = require('./../controllers/tourControllers');
const router = express.Router();
const authController= require('../controllers/authController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRouter'); // Import review router

const { getAllTours, getTour, createTours, updateTours, deleteTours,aliasTopTours,getTourStats,getMonthlyPlan } = tourControllers;
// router.param('id', tourControllers.checkID);
// router.use(tourControllers.checkBody); // Middleware to check body for POST requests

router.use('/:tourId/reviews', reviewRouter); // Use the review router for nested routes
router
    .route('/top-5-cheap').get(aliasTopTours, getAllTours); // Middleware to alias top tours
router
    .route('/monthly-plan/:year') // Route to get monthly plan for a specific year
    .get(getMonthlyPlan); // Controller to handle monthly plan requests

router
    .route('/') 
    .get(protect,getAllTours)
    .post(createTours); // Middleware to check body for POST requests
router
    .route('/tour-stats').get(getTourStats)
router
    .route('/:id')
    .get(getTour) 
    .patch(updateTours)
    .delete(protect, restrictTo('admin', 'lead-guide','user'), deleteTours);
    
// Nested route for reviews
// router
//     .route('/:tourId/reviews')
//     .post(authController.protect, authController.restrictTo('user'), reviewControllers.createReview); // Create a new review for a specific tour
   module.exports = router;  