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
    ticketPrices: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true 
});

const museumModel = mongoose.model("Museum", museumSchema);

export default museumModel;