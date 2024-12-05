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
    
}, {
    timestamps: true
});

const sellerModel = mongoose.model('Seller', sellerSchema);

export default sellerModel;