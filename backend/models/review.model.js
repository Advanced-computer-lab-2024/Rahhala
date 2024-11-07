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
    },
    reviewedEntity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'reviewedEntityType'
    },
    reviewedEntityType: {
        type: String,
        required: true,
        enum: ['Product', 'Itinerary', 'TourGuide', 'Activity']
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create the Review model
const Review = mongoose.model('Review', reviewSchema);

// Export the Review model
export default Review;