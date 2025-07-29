// const tour = require('../models/toursModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/indexError');
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const filter = {}
  
  const reviews = await Review.find();
  res.status(200).json({
    results: reviews.length,
    status: 'success',
    reviews: reviews,
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
  
  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    review: review,
  });
})

exports.createReview = catchAsync(async (req, res, next) => {
  // const reviews = await Review.create(req.body)
  if (!req.body.tour) req.body.tour = req.params.tourId; // Set tour ID if not provided
  if (!req.body.user) req.body.user = req.user.id; // Set user ID from authenticated user
    const reviews= await Review.create({
      review: req.body.review,
      rating: req.body.rating,
      tour: req.body.tour,
      user: req.body.user
    });
    res.status(201).json({
        status: 'success',
        data: {
            review: reviews
        }
    });
})



exports.updateReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Return the updated document
        runValidators: true, // Validate the update against the schema
    });
    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        review: review,
    });

})
exports.deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });

})