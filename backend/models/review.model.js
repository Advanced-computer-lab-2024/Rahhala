import mongoose from 'mongoose';

// Define the Review schema
const reviewSchema = new mongoose.Schema({
    tourist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    title: {
        type: String,
    },
    body: {
        type: String,
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create the Review model
const Review = mongoose.model('Review', reviewSchema);

// Export the Review model
export default Review;