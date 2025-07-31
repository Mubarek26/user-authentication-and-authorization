const mongoose = require('mongoose');

// const tour = require('./toursModel') // Import the Tour model
reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: 
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
  

  user: 
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true }); // Ensure a user can only review a tour once

reviewSchema.pre(/^find/, function (next) {
  this.populate('user', 'name photo -_id'); // Populate the user field with name and photo, excluding _id
  this.populate('tour', 'name -_id'); // Populate the tour field with name, excluding _id
  next();
});


reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats= await this.aggregate([
    {
    $match:{ tour: tourId  } // Match reviews for the specific tour
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, // Count the number of ratings
        avgRating: { $avg: '$rating' }, // Calculate the average rating
      }
    }
  ])
  console.log(stats)
  // Update the tour's average rating and number of ratings
  const Tour = require('./toursModel');
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingAverage: 4.5, // Default value if no ratings
    });
  }
}



reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour); // Call the static method to calculate average ratings
})
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne(); // Store the current review document
  next();
})
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour); // Recalculate average ratings after updating or deleting a review
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
