import mongoose from 'mongoose';
import activityModel from './activity.js'; // Assuming activityModel is the Activity model

const itinerarySchema = new mongoose.Schema({
    
    userId: { // New field to track the creator
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true,
    }],
    location: { type: [[Number]], default: [] }, // Ensure this field is defined as an array of arrays of numbers
    activityDetails: [{
        activityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity',
        },
        name: {
            type: String, // Derived from the activity's name
        },
        duration: {
            type: String, // Duration in hours or minutes
        }
    }],
    timeline: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    availableDates: [{
        type: Date,
        required: true,
    }],
    accessibility: { type: [String], default: [] }, // Ensure this field is defined

    pickupLocation: {
        type: String,
        required: true,
    },
    tags: {
    type: [String], // Array of tags (e.g., "outdoor", "family-friendly")
     },
    dropoffLocation: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Pre-save hook to derive locations, activity names, and durations from activities
itinerarySchema.pre('save', async function (next) {
    const itinerary = this;

    if (itinerary.activities && itinerary.activities.length > 0) {
        const activityDetails = await activityModel.find({
            _id: { $in: itinerary.activities }
        }).select('name location duration');
        
        // Derive locations
        itinerary.location = activityDetails.map(activity => activity.location);

        // Populate activity details with name and duration
        itinerary.activityDetails = activityDetails.map(activity => ({
            activityId: activity._id,
            name: activity.name,
            duration: activity.duration || "Not specified" // Set default duration to 0 if not provided
        }));
    }
    next();
});

const itineraryModel = mongoose.model('Itinerary', itinerarySchema);

export default itineraryModel;