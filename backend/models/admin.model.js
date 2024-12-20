import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures username is unique
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, //  Add timestamps for createdAt and updatedAt
});

const adminModel = mongoose.model('Admin', adminSchema);
export default adminModel; 