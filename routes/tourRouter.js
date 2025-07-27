const express = require('express');
const tourControllers = require('./../controllers/tourControllers');
const router = express.Router();
const { protect,restrictTo } = require('../controllers/authController');
const { getAllTours, getTours, createTours, updateTours, deleteTours,aliasTopTours,getTourStats,getMonthlyPlan } = tourControllers;
// router.param('id', tourControllers.checkID);
// router.use(tourControllers.checkBody); // Middleware to check body for POST requests
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
    .get(getTours) 
    .patch(updateTours)
    .delete(protect,restrictTo('admin','lead-guide'),deleteTours);
   module.exports = router;