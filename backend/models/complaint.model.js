import mongoose from 'mongoose';

// Define the Complaint schema
const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['resolved', 'pending'],
        default: 'pending',
    },
    reply: {
        type: String,
        default: ''
    },
    userType: {
        type: String,
        enum: ['Tourist', 'Tour Guide', 'Advertiser', 'Governor', 'Seller'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userType',
        required: true
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create the Complaint model
const Complaint = mongoose.model('Complaint', complaintSchema);

// Export the Complaint model
export default Complaint;