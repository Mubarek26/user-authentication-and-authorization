const express = require('express');
// const router = express.Router();
const reviewControllers = require('./../controllers/reviewControllers');
const { protect, restrictTo } = require('../controllers/authController');
const router=express.Router({mergeParams: true}); // Merge params to access tourId from parent route
router
  .route('/')
  .get(protect,reviewControllers.getAllReviews)
  .post(protect,reviewControllers.createReview); // Create a new review

// router
//   .route('/:id')
//   .get(reviewControllers.getReview) // Get a specific review by ID
//   .patch(reviewControllers.updateReview) // Update a review by ID
//   .delete(reviewControllers.deleteReview); // Delete a review by ID
module.exports = router;