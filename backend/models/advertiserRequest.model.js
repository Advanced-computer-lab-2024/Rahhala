import mongoose from 'mongoose';

const advertiserRequestSchema = new mongoose.Schema({
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
    isAccepted: {
      type: Boolean,
      default: false, // You can set this to true or false as needed
    },
  
});

const AdvertiserRequest = mongoose.model('AdvertiserRequest', advertiserRequestSchema);
export default AdvertiserRequest;
