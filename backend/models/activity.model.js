import mongoose from "mongoose";

// Define the schema for "Activity"
const activitySchema = new mongoose.Schema({

    name: {
        type: String, // Name of the activity
        required: true,
        },
    date: {
        type: Date,
        required: true, // Date of the activity yyyy/mm/dd
    },
    time: {
        type: String, // Time of the activity in HH:MM format or a time range if needed
        required: true,
    },
    location: {
        type: [Number],
        required: true,
    },
    price: {
        type: String, // Price or a price range (example: "$50" or "$50 - $100")
        required: true,
    },
    category: {
        type: String, // Category of the activity (e.g., "Sports", "Entertainment")
        required: true,
    },
    tags: {
        type: [String], // Array of tags (e.g., "outdoor", "family-friendly")
    },
    specialDiscounts: {
        type: String, // Details of special discounts, if any (optional field)
    },
    bookingOpen: {
        type: Boolean, // If booking for the activity is open or closed
        default: true, // Default is open unless otherwise specified
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'advertiser',
        required: true,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create the model based on the schema
const activityModel = mongoose.model('Activity', activitySchema);

export default activityModel;