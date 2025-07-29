// const Tour = require('../models/toursmodel');
const Tour = require('../models/toursModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/indexError');

const mongoose = require('mongoose');
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'; // Limit to 5 tours
  req.query.sort = '-ratingAverage,price'; // Sort by ratingAverage and then by price
  req.query.fields = 'name,price,ratingAverage,summary,difficulty'; // Select specific fields
  next(); // Call the next middleware function
};
exports.getAllTours = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(); // Create an instance of APIFeatures with the Tour model and query string
  const tours = await features.query; // Execute the query
  // console.log(`This is the api features ${JSON.stringify(features.queryString)}`)
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime, // Assuming you
    //  set this in middleware
    results: tours.length,
    data: {
      tours,
    },
  });
});

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

exports.getTours = catchAsync(async (req, res, next) => {
  // console.log(req.params)
  const id = req.params.id;
  //  if (!mongoose.Types.ObjectId.isValid(id)) {
  //     return next(new AppError('Invalid ID format', 400));
  // }
  const tour = await Tour.findById(id).populate('reviews'); // Populate the reviews field
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404)); // If no tour is found, return a 404 error
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTours = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  console.log('Request body:', req.body); // ✅ Also works
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTours = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const id = req.params.id;
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Validate the update against the schema
  });
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404)); // If no tour is found, return a 404 error
  }
});

exports.deleteTours = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid ID format', 400));
  }
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404)); // If no tour is found, return a 404 error
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
