import touristModel from "../models/tourist.js";
import activityModel from "../models/activity.js";
import itineraryModel from "../models/itinerary.js";
import museumModel from "../models/museum.js";

const getTourist = async (req, res) => {
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

const getTouristById = async (req, res) => {
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

const updateTourist = async (req, res) => {
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
        res.status(200).json({ message: "Tourist profile updated successfully", profile: tourist });
    } catch (error) {
        res.status(500).json({ error: "Error updating tourist profile." });
    }
};

const getAll = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to the start of the day
        const activities = await activityModel.find({ date: { $gte: today } });

        const itineraries = await itineraryModel.find({availableDates: { $elemMatch: { $gte: today } }});
        const museums = await museumModel.find();
        res.status(200).json({"activities": activities, "itineraries":itineraries, "museums":museums });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}
const touristController = {
    updateTourist,
    getTourist,
    getAll,
    getTouristById
};

export default touristController;