import mongoose from 'mongoose';

const museumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    pictures: {
        type: [String], // An array of URLs or file paths
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    openingHours: {
        type: String,
        required: true,
    },
    foreignerPrice: {
        type: Number,
        required: true,
    },
    nativePrice: {
        type: Number,
        required: true,
    },
    studentPrice: {
        type: Number,
        required: true,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Governor',
        required: true,
    },
    tags: {
        type: [String],
    },
}, {
    timestamps: true 
});

const museumModel = mongoose.model("Museum", museumSchema);

export default museumModel;