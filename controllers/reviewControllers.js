// const tour = require('../models/toursModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory'); // Import the handler factory
const AppError = require('../utils/indexError');
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId }; // Filter reviews by tour ID if provided
  const reviews = await Review.find(filter);
  res.status(200).json({
    results: reviews.length,
    status: 'success',
    reviews: reviews,
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    review: review,
  });
});
const setToUserId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id; // Set user ID from authenticated user
  if (!req.body.tour) req.body.tour = req.params.tourId; // Set tour ID from URL parameter
  next();
};

// exports.createReview = catchAsync(async (req, res, next) => {
//   // const reviews = await Review.create(req.body)
//   const reviews = await Review.create({
//     review: req.body.review,
//     rating: req.body.rating,
//     tour: req.body.tour,
//     user: req.body.user,
//   });
//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: reviews,
//     },
//   });
// });

// exports.updateReview = catchAsync(async (req, res, next) => {
//     const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
//         new: true, // Return the updated document
//         runValidators: true, // Validate the update against the schema
//     });
//     if (!review) {
//         return next(new AppError('No review found with that ID', 404));
//     }
//     res.status(200).json({
//         status: 'success',
//         review: review,
//     });
// })
exports.createReview = factory.createOne(Review); // Use the createOne factory function to create a review
exports.updateReview = factory.updateOne(Review); // Use the updateOne factory function to update a review
exports.deleteReview = factory.deleteOne(Review); // Use the deleteOne factory function to delete a review
