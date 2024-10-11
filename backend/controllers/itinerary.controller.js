import itineraryModel from "../models/itinerary.model.js";

// Add Itinerary to the Database
export const addItinerary = async (req, res) => {
  console.log("entered  addItinerary");

  try {
    const {
      name,
      activities,
      timeline,
      language,
      price,
      availableDates,
      accessibility,
      pickupLocation,
      dropoffLocation,
      tags,
    } = req.body;
    const userId = req.user.id; // Assuming `req.user` is set by JWT middleware
    console.log(userId);
    const itinerary = new itineraryModel({
      name,
      activities,
      timeline,
      language,
      price,
      availableDates,
      accessibility,
      pickupLocation,
      dropoffLocation,
      tags,
      userId: userId,
    });

    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Itineraries from the Database
export const getItineraries = async (req, res) => {
  console.log("entered  getItineraries");

  try {
    const itineraries = await itineraryModel
      .find()
      .populate("activities", "name location duration");
    // .populate('tags', 'name');

    res.status(200).json(itineraries);
  } catch (err) {
    console.error("Error fetching itineraries:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Itinerary by ID
export const getItineraryByID = async (req, res) => {
  console.log("entered  getItineraryByID");

  try {
    const { id } = req.params;
    const itinerary = await itineraryModel
      .findById(id)
      .populate("activities", "name location duration")
      .populate("tags", "name");

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
  console.log("entered  deleteItinerary");

  try {
    const { id } = req.params;
    const deletedItinerary = await itineraryModel.findByIdAndDelete(id);

    if (!deletedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
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
