import mongoose from 'mongoose';
import validator from 'validator';

// Define the Tourist schema
const touristSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: (props) => `${props.value} is not a valid email!`
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
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
    nationality: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: Date,
        required: true
    },
    occupation: {
        type: String,
        trim: true
    },
    wallet: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String,
        trim: true
    },
    preferences: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PreferenceTag'
    }],
    currency: {
        type: String,
        required: true,
        trim: true,
        default: 'EGP'
    },
    booked: [{
        type: mongoose.Schema.Types.Mixed,
        refPath: 'bookedModel'
    }],
    bookedModel: {
        type: String,
        required: true,
        enum: ['Activity', 'Itinerary', 'Museum']
    },
    totalLoyaltyPoints: {
        type: Number,
        default: 0
    },
    currentLoyaltyPoints: {
        type: Number,
        default: 0
    },
    complaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint'
    }],
    purchasedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create the Tourist model
const Tourist = mongoose.model('Tourist', touristSchema);

// Export the Tourist model
export default Tourist;