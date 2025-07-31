const express = require('express');
// const router = express.Router();
const reviewControllers = require('./../controllers/reviewControllers');
const { protect, restrictTo } = require('../controllers/authController');
const router = express.Router({ mergeParams: true }); // Merge params to access tourId from parent route
// protect all routes after this middleware
router.use(protect); // Protect all routes after this middleware
router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(restrictTo('user'), reviewControllers.setToUserId, reviewControllers.createReview); // Create a new review

  
router
  .route('/:id')
  .get(reviewControllers.getReview) // Get a specific review by ID
  .patch(restrictTo('user','admin'), reviewControllers.updateReview) // Update a review by ID
  .delete(restrictTo('admin'), reviewControllers.deleteReview); // Delete a review by ID
module.exports = router;