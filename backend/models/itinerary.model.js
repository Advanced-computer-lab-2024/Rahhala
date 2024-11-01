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
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: true,
      },
    ],
    location: { type: [[Number]], default: [] }, // Array of arrays of numbers
    activityDetails: [
      {
        activityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Activity",
        },
        name: {
          type: String, // Derived from the activity's name
        },
        duration: {
          type: String, // Duration in hours or minutes
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
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to derive locations, activity names, and durations from activities
itinerarySchema.pre("save", async function (next) {
  const itinerary = this;

  if (itinerary.activities && itinerary.activities.length > 0) {
    const activityDetails = await activityModel
      .find({
        _id: { $in: itinerary.activities },
      })
      .select("name location duration");

    console.log("Activity Details:", activityDetails);

    // Use a Set to store unique locations
    const uniqueLocations = new Set();

    activityDetails.forEach((activity) => {
      console.log("Activity Location:", activity.location); // Log each activity's location
      // Add the location to the set directly
      if (activity.location) {
        uniqueLocations.add(activity.location.toString());
      }
    });

    // Populate activity details
    itinerary.activityDetails = activityDetails.map((activity) => ({
      activityId: activity._id,
      name: activity.name,
      duration: activity.duration || "Not specified", // Default duration if not provided
    }));

    // Convert the Set to an array of arrays of numbers
    itinerary.location = Array.from(uniqueLocations).map((loc) =>
      loc.split(",").map(Number)
    ); // Split and convert to numbers
    console.log("Unique Locations:", itinerary.location);
  }
  next();
});

const itineraryModel = mongoose.model("Itinerary", itinerarySchema);

export default itineraryModel;
