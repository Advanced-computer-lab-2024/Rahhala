import mongoose from 'mongoose';

const tourGuideRequestSchema = new mongoose.Schema({
  
  username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    idCardImage: {
        type: String,
        required: true
    },
    certificationImages: {
        type: [String],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
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
    previousWork: [
        {
            yearsOfExperience: {
                type: Number,
                required: true
            },
            work: {
                type: String,
                required: true
            }
        }
    ],
    isAccepted: {
      type: Boolean,
      default: false, // You can set this to true or false as needed
    },
}
  // Add any other tour guide-specific fields here
);

const TourGuideRequest = mongoose.model('TourGuideRequest', tourGuideRequestSchema);
export default TourGuideRequest;
