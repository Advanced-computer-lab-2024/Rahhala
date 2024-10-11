import mongoose from 'mongoose';
// Define the Tourist schema
const touristSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
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
        enum: ['job', 'student'],
        required: true
    },
    wallet: {
        type: Number,
        default: 0
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create the Tourist model
const touristModel = mongoose.model('Tourist', touristSchema);

// Export the Tourist model
export default touristModel;