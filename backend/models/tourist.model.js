import mongoose from 'mongoose';
import validator from 'validator';

// Define the Tourist schema
const touristSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: (props) => `${props.value} is not a valid email!`
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true
    },
    nationality: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: Date,
        required: true
    },
    occupation: {
        type: String,
        trim: true
    },
    wallet: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String,
        trim: true
    },
    preferences: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PreferenceTag'
    }],
    currency: {
        type: String,
        required: true,
        trim: true,
        default: 'EGP'
    },
    bookedActivities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }],
    bookedItineraries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary'
    }],
    totalLoyaltyPoints: {
        type: Number,
        default: 0
    },
    currentLoyaltyPoints: {
        type: Number,
        default: 0
    },
    complaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint'
    }],
    purchasedProducts: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    deliveryAddresses: [
        {
            type: String,
            required: false,
        },
    ],
    paymentMethod: {
        type: String,
        enum: ['wallet', 'creditCard', 'cashOnDelivery'],
    },
    stripePaymentToken: {
        type: String,
        required: false,
    },
    orders: [
        {
            status: { 
                type: String, 
                default: 'pending' 
            },
            paymentStatus: { 
                type: String, 
                enum: ['pending', 'completed', 'failed'], 
                default: 'pending' 
            },
            totalAmount: { 
                type: Number, 
                required: true 
            },
            paymentMethod: { 
                type: String, 
                enum: ['wallet', 'creditCard', 'cashOnDelivery'], 
                required: true 
            },
            orderDate: { 
                type: Date, 
                default: Date.now 
            },
            items: [
                {
                    productId: { 
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'Product', 
                        required: true 
                    },
                    quantity: { 
                        type: Number, 
                        required: true 
                    },
                    price: { 
                        type: Number, 
                        required: true 
                    },
                },
            ],
            deliveryAddress: { 
                type: String, 
                required: false 
            },
        },
    ],

    resetPasswordOTP: {
        type: String,
      },
        resetPasswordExpires: {
        type: Date,
      },
    
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create the Tourist model
const Tourist = mongoose.model('Tourist', touristSchema);

// Export the Tourist model
export default Tourist;