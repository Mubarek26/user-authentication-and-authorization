const mongoose = require('mongoose')
reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 4.5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    

})