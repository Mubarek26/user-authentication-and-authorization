// const tour = require('../models/toursModel');
const Review = require('../models/reviewModel');
const factory = require('./handlerFactory'); // Import the handler factory

exports.setToUserId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id; // Set user ID from authenticated user
  if (!req.body.tour) req.body.tour = req.params.tourId; // Set tour ID from URL parameter
  next();
};

exports.getAllReviews = factory.getAll(Review); // Use the getAll factory function to get all reviews
exports.getReview = factory.getOne(Review); // Use the getOne factory function to get
exports.createReview = factory.createOne(Review); // Use the createOne factory function to create a review
exports.updateReview = factory.updateOne(Review); // Use the updateOne factory function to update a review
exports.deleteReview = factory.deleteOne(Review); // Use the deleteOne factory function to delete a review
