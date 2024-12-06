import mongoose from "mongoose";
import activityModel from "./activity.model.js"; // Assuming activityModel is the Activity model

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      // New field to track the creator
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    activityDetails: [
  {
    name: {
      type: String
    },
    location: {
      type: [Number]
    },
    duration: {
      type: String
    },
    time: {
      type: String
    },
  },
],

    timeline: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableDates: [
      {
        type: Date,
        required: true,
      },
    ],
    accessibility: { type: [String], default: [] }, // Ensure this field is defined

    pickupLocation: {
      type: String,
      required: true,
    },
    tags: {
      type: [String], // Array of tags (e.g., "outdoor", "family-friendly")
    },
    dropoffLocation: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // You can set this to true or false as needed
    },    
    flagged: {
      type: Boolean,
      default: false,
  },
  flaggedReason: {
      type: String,
  },
  flaggedDate: {
      type: Date,
  },
  },
  {
    timestamps: true,
  }
);

const itineraryModel = mongoose.model("Itinerary", itinerarySchema);

export default itineraryModel;
