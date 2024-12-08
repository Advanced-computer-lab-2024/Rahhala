import mongoose from 'mongoose';

const advertiserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    idCardImage: {
        type: String,
        required: true
    },
    taxationRegistryImage: {
        type: String,
        required: true
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
    websiteLink: {
        type: String,
        required: true
    },
    hotline: {
        type: String,
        required: true
    },
    logo: {
        type: String // This field will store the base64 string
    }
    
}, { timestamps: true });

const Advertiser = mongoose.model('Advertiser', advertiserSchema);

export default Advertiser;