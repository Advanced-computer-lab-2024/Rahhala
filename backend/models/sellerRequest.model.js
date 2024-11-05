import mongoose from 'mongoose';

const sellerRequestSchema = new mongoose.Schema({
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
    isAccepted: {
      type: Boolean,
      default: false, // You can set this to true or false as needed
    },
  // Add any other seller-specific fields here
});

const SellerRequest = mongoose.model('SellerRequest', sellerRequestSchema);
export default SellerRequest;
