const mongoose = require('mongoose');
const express = require('express');
const slugify = require('slugify'); // Import slugify for creating slugs
const user = require('./userModel'); // Import User model for guide references
const tourSchema = new mongoose.Schema({ 
    name: {
        type: String,
        // required: [true, 'A tour must have a name'],
        unique: true
       // Exclude from query results by default

    },
    slug: {
        type: String,
       
    },
    duration: {
        type: Number,
        // required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        // required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        // required: [true, 'A tour must have a difficulty'],
       
    },
    ratingAverage: {
        type: Number,
        default: 4.5
    },
    ratingAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        // required: [true, 'A tour must have a price']
    },
    
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // This validation will only run on create and update operations
                return val < this.price; // Discount must be less than the price
            },
            message: 'Discount price ({VALUE}) should be less than regular price'
        }
    },   
    summary: {
        type: String,
        trim: true, 

        // required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true,
        // required: [true, 'A tour must have a description']
    },
    imageCover: {
        type: String,
        // required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date, 
        default: Date.now(),
        select: false // Exclude from query results by default

    },
    startDates: [Date],
    secretTour: { 
        type: Boolean,
        default: false
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'] // Only allow 'Point' as the type
        },
        coordinates: [Number], // [longitude, latitude]
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'] // Only allow 'Point' as the type
            },
            coordinates: [Number], // [longitude, latitude]
            address: String,
            description: String,
            day: Number // Day of the tour
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User' // Reference to the User model
        }
        
    ],

})


// tourSchema.pre('save', function(next) {
//     this.slug=slugify(this.name,{lower:true})
//     next();
// });
// tourSchema.pre('save', function (next) {
//     console.log('Will save document...');
//     next();
// })

// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// })
tourSchema.pre(/^find/, function (next) {
    this.populate({
    path: 'guides',
    select:'-__v -passwordChangedAt'
    }); // Populate the guides field with user data
    next();
})
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } }) // Exclude secret tours from all find queries
    next();
})


// tourSchema.pre('save',async function (next) {
//     const giudesPromises = this.guides.map(async (id) => await user.findById(id)); // Assuming guide is an ObjectId )
//     this.guides = await Promise.all(giudesPromises); // Resolve all promises to get the actual guide documents
//     next();
// })


const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;