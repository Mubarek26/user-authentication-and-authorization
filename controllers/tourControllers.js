// const Tour = require('../models/toursmodel');
const Tour = require('../models/toursModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory'); // Import the handler factory
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'; // Limit to 5 tours
  req.query.sort = '-ratingAverage,price'; // Sort by ratingAverage and then by price
  req.query.fields = 'name,price,ratingAverage,summary,difficulty'; // Select specific fields
  next(); // Call the next middleware function
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$duration',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // Convert year to a number
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // Unwind the startDates array
    },

    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' }, // Collect tour names in an array
      },
    },
    {
      $addFields: {
        month: '$_id', // Add a new field for the month
      },
    },
    {
      $sort: {
        numTours: -1,
      },
    },
    {
      $limit: 2,
    },
  ]);
  console.log('Aggregation result:', plan.length);
  res.status(200).json({
    status: 'success',
    data: plan,
  });
});
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const {distance, latlng, unit} = req.params;
})

exports.getAllTours = factory.getAll(Tour); // Use the getAll factory function to get all tours
exports.getTour = factory.getOne(Tour, { path: 'reviews' }); // Use the getOne factory function to get a tour with populated reviews
exports.createTours = factory.createOne(Tour); // Use the createOne factory function to handle creation
exports.updateTours = factory.updateOne(Tour); // Use the updateOne factory function to handle updates
exports.deleteTours = factory.deleteOne(Tour); // Use the deleteOne factory function to handle deletion


