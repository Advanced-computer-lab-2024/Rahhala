import itineraryModel from "../models/itinerary.model.js";
import tourGuideModel from "../models/tourGuide.model.js";
import touristModel from "../models/tourist.model.js";
import reviewModel from "../models/review.model.js";
// Add Itinerary to the Database
export const addItinerary = async (req, res) => {
  console.log("Received request body:", req.body);

  const requiredFields = ['name', 'activityDetails', 'timeline', 'language', 'price', 
    'availableDates', 'pickupLocation', 'dropoffLocation'];

  // Check for missing required fields
  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }


  try {
    const {
      name,
      activityDetails,
      timeline,
      language,
      price,
      availableDates,
      pickupLocation,
      dropoffLocation,
      accessibility,
      tags
    } = req.body;

// Parse and validate activityDetails
const formattedActivityDetails = activityDetails.map(activity => {
  // Parse location string into array of numbers
  let locationArray;
  try {
    // Handle string format by removing any extra brackets and splitting
    if (typeof activity.location === 'string') {
      // Remove all brackets and split by comma
      locationArray = activity.location
        .replace(/[\[\]'"\s]/g, '') // Remove brackets, quotes, and whitespace
        .split(',')
        .map(num => Number(num));
    } else if (Array.isArray(activity.location)) {
      locationArray = activity.location.map(num => Number(num));
    } else {
      throw new Error('Invalid location format');
    }

    // Validate location array
    if (!Array.isArray(locationArray) || 
        locationArray.length !== 2 || 
        locationArray.some(coord => isNaN(coord))) {
      throw new Error('Location must be exactly 2 numbers');
    }
  } catch (error) {
    throw new Error(`Invalid location format for activity "${activity.name}". Expected [latitude, longitude]. ${error.message}`);
  }

  return {
    name: activity.name,
    location: locationArray,
    duration: activity.duration,
    time: activity.time
  };
});

// Convert availableDates to an array of Date objects
const formattedAvailableDates = availableDates.map(date => new Date(date));

// Ensure price is a number
const formattedPrice = Number(price);
if (isNaN(formattedPrice)) {
  return res.status(400).json({
    error: 'Price must be a valid number'
  });
}

    // Log the formatted data
    console.log("Formatted data:", {
      name,
      activityDetails: formattedActivityDetails,
      timeline,
      language,
      price: formattedPrice,
      availableDates: formattedAvailableDates,
      pickupLocation,
      dropoffLocation,
      accessibility,
      tags
    });

    const userId = req.user.id; // Assuming `req.user` is set by JWT middleware
    console.log("User ID:", userId);

    const itinerary = new itineraryModel({
      name,
      activityDetails: formattedActivityDetails,
      timeline,
      language,
      price: formattedPrice,
      availableDates: formattedAvailableDates,
      pickupLocation,
      dropoffLocation,
      accessibility,
      tags,
      userId
    });

    // Save the itinerary to the database
    await itinerary.save();

    // Send a response back to the client
    res.status(201).json(itinerary);
  } catch (error) {
    console.error("Error creating itinerary:", error);
    res.status(500).json({ error: 'Failed to create itinerary' });
  }
};
// Get Itineraries from the Database
export const getItineraries = async (req, res) => {
  console.log("entered getItineraries");

  try {
    const itineraries = await itineraryModel
      .find()
      .populate("reviews", "rating title body"); // Populate reviews if needed

    res.status(200).json(itineraries);
  } catch (err) {
    console.error("Error fetching itineraries:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Itinerary by ID
export const getItineraryByID = async (req, res) => {
  console.log("entered getItineraryByID");

  try {
    const { id } = req.params;
    const itinerary = await itineraryModel
      .findById(id)
      .populate("reviews", "rating title body"); // Populate reviews if needed

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    res.status(200).json(itinerary);
  } catch (err) {
    console.error("Error fetching itinerary:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Itineraries by User ID
export const getItinerariesByUserID = async (req, res) => {
  console.log("entered  getItinerariesByUserID");

  const id = req.user.id;
  if (!id) return res.status(400).json({ message: "Missing ID" });
  try {
    const query = { userId: id };
    const itinerary = await itineraryModel.find(query);
    if (!activity)
      return res.status(404).json({ message: "itinerary not found" });
    return res.status(200).json(itinerary);
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Edit Itinerary Information
export const editItinerary = async (req, res) => {
  console.log("entered  editItinerary");

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedItinerary = await itineraryModel
      .findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      })
      .populate("activities", "name location duration");
    //.populate('tags', 'name');

    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json(updatedItinerary);
  } catch (err) {
    console.error("Error updating itinerary:", err);
    res.status(400).json({ error: err.message });
  }
};

// Edit Itinerary by Itinerary Name
export const editItineraryByName = async (req, res) => {
  console.log("entered  editItineraryByName");

  try {
    const { name } = req.params; // Get the name from the request parameters
    console.log("name is ", name);
    const updates = req.body; // Get the updates from the request body

    const updatedItinerary = await itineraryModel
      .findOneAndUpdate(
        { name }, // Find itinerary by name
        updates,
        {
          new: true,
        }
      )
      .populate("activities", "name location duration");

    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json(updatedItinerary);
  } catch (err) {
    console.error("Error updating itinerary by name:", err);
    res.status(400).json({ error: err.message });
  }
};

// Delete Itinerary from the Database
export const deleteItinerary = async (req, res) => {
  console.log("entered deleteItinerary");

  try {
    const { id } = req.params;
    const deletedItinerary = await itineraryModel.findByIdAndDelete(id);

    if (!deletedItinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (err) {
    console.error("Error deleting itinerary:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Itinerary by Itinerary Name from Database
export const deleteItineraryByName = async (req, res) => {
  console.log("entered  deleteItineraryByName");

  try {
    const { name } = req.params; // Get the name from the request parameters
    console.log(name);
    const deletedItinerary = await itineraryModel.findOneAndDelete({ name }); // Find and delete itinerary by name

    if (!deletedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (err) {
    console.error("Error deleting itinerary by name:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deactivateItinerary = async (req, res) => {
  console.log("entered deactivateItinerary");

  try {
    const { id } = req.params; // Get the itinerary ID from the route parameters

    // Find the itinerary by ID and set isActive to false
    const updatedItinerary = await itineraryModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json({
      message: "Itinerary deactivated successfully",
      itinerary: updatedItinerary,
    });
  } catch (err) {
    console.error("Error deactivating itinerary:", err);
    res.status(500).json({ message: "An error occurred while deactivating the itinerary" });
  }
};


export const activateItinerary = async (req, res) => {
  console.log("entered activateItinerary");

  try {
    const { id } = req.params; // Get the itinerary ID from the route parameters
    console.log(id);
    // Find the itinerary by ID and set isActive to true
    const updatedItinerary = await itineraryModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json({
      message: "Itinerary activated successfully",
      itinerary: updatedItinerary,
    });
  } catch (err) {
    console.error("Error activating itinerary:", err);
    res.status(500).json({ message: "An error occurred while activating the itinerary" });
  }
};

export const addReview = async (req, res) => {
    console.log("entered addReview");
    
    try {
        const userId = req.user.id;
        const { id } = req.params; // Get the itinerary ID from the route parameters
        const { title, body, rating } = req.body; // Get the review from the request body
    
        // Find the itinerary by ID
        const itinerary = await itineraryModel.findById(id);
        const tourist = await touristModel.findById(userId);

        if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
        }

        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found" });
        }

        // Create a new review
        const review = new reviewModel({
        tourist: userId,
        title,
        body,
        rating,
        });

        // Save the review to the database
        await review.save();
    
        // Add the review to the itinerary
        itinerary.reviews.push(review);
    
        // Save the updated itinerary
        await itinerary.save();
    
        res.status(200).json({
        message: "Review added successfully",
        itinerary,
        });
    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({ message: "An error occurred while adding the review" });
    }
    }

export const updateItinerary = async (req, res) => {
  console.log("entered updateItinerary");

  try {
    const { id } = req.params;
    const updatedItinerary = await itineraryModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    res.status(200).json(updatedItinerary);
  } catch (err) {
    console.error("Error updating itinerary:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};