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

reviewSchema.pre(/^find/, function (next) {
  this.populate('user', 'name photo -_id'); // Populate the user field with name and photo, excluding _id
  this.populate('tour', 'name -_id'); // Populate the tour field with name, excluding _id
  next();
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
