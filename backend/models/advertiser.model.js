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
    companyProfile: {
        type: String,
        required: true
    },
    logo: {
        type: String, // Store the logo as a Base64 string
        required: true
    },
    acceptedTermsAndConditions: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    },
    resetPasswordOTP: {
        type: String,
      },
        resetPasswordExpires: {
        type: Date,
      },
    
});

const advertiserModel = mongoose.model('Advertiser', advertiserSchema);

export default advertiserModel;