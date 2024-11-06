import mongoose from 'mongoose';


const sellerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    idCardImage: {
        type: String,
        required: true
    },
    taxationRegistryImage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    logo: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const sellerModel = mongoose.model('Seller', sellerSchema);

export default sellerModel;