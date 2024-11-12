import mongoose from 'mongoose';

// Define the TourGuide schema
const tourGuideSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    idCardImage: {
        type: String,
        required: true
    },
    certificationImages: {
        type: [String],
        required: true
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
    previousWork: [
        {
            yearsOfExperience: {
                type: Number,
                required: true
            },
            work: {
                type: String,
                required: true
            }
        }
    ],
    profilePhoto: {
        type: String,
    },
    acceptedTermsAndConditions: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Create the TourGuide model
const tourGuideModel = mongoose.model('TourGuide', tourGuideSchema);

// Export the TourGuide model
export default tourGuideModel;