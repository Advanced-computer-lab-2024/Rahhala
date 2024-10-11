import touristModel from "../models/tourist.model.js";
import activityModel from "../models/activity.model.js";
import itineraryModel from "../models/itinerary.model.js";
import museumModel from "../models/museum.model.js";

// Get Tourist profile by email
export const getTouristByEmail = async (req, res) => {
  console.log("entered getTouristByEmail");

  const { email } = req.params;

  try {
    const tourist = await touristModel.findOne({ email });

    if (!tourist) {
      return res.status(404).json({ error: "Tourist profile not found" });
    }

    res.status(200).json({ profile: tourist });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tourist profile." });
  }
};

// Get Tourist profile by ID
export const getTouristByID = async (req, res) => {
  console.log("entered getTouristByID");
  const id = req.user.id; // Get the user ID from the verified JWT payload

  try {
    const tourist = await touristModel.findById(id);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist profile not found" });
    }

    res.status(200).json({ profile: tourist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching tourist profile." });
  }
};

// Edit Tourist Information
export const editTourist = async (req, res) => {
  console.log("entered editTourist");
  const id = req.user.id; // Get the user ID from the verified JWT payload
  const { email, mobileNumber, nationality, dob, occupation } = req.body;

  try {
    const tourist = await touristModel.findById(id);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Update other profile fields
    tourist.mobileNumber = mobileNumber || tourist.mobileNumber;
    tourist.nationality = nationality || tourist.nationality;
    tourist.dob = dob || tourist.dob;
    tourist.occupation = occupation || tourist.occupation;
    tourist.email = email || tourist.email;

    await tourist.save();
    res.status(200).json({
      message: "Tourist profile updated successfully",
      profile: tourist,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating tourist profile." });
  }
};

// Get Tourists from the Database
export const getTourists = async (req, res) => {
  console.log("entered getTourists");
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the start of the day
    const activities = await activityModel.find({ date: { $gte: today } });

    const itineraries = await itineraryModel.find({
      availableDates: { $elemMatch: { $gte: today } },
    });
    const museums = await museumModel.find();
    res.status(200).json({
      activities: activities,
      itineraries: itineraries,
      museums: museums,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
