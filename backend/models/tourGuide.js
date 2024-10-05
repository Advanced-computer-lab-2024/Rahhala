const mongoose = require('mongoose');

// Define the subdocument schema for previous work experience
const previousWorkSchema = new mongoose.Schema({
    work: {
        type: String,
        required: true,
        trim: true
    },
    yearsOfExperience: {
        type: Number,
        required: true
    }
});


// Define the TourGuide schema
const tourGuideSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true
    },
    yearsOfExperience: {
        type: Number,
        required: true
    },
    previousWork: {
        type: String,
        default: null,
        trim: true
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create the TourGuide model
const tourGuideModel = mongoose.model('TourGuide', tourGuideSchema);

// Export the TourGuide model
module.exports = tourGuideModel;