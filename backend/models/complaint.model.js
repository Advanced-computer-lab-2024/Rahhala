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
        required: true
    },
    status: {
        type: String,
        enum: ['resolved', 'pending'],
        default: 'pending',
        required: true
    },
    reply: {
        type: String,
        default: ''
    },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create the Complaint model
const Complaint = mongoose.model('Complaint', complaintSchema);

// Export the Complaint model
export default Complaint;