import touristModel from "../models/tourist.model.js";
import activityModel from "../models/activity.model.js";
import itineraryModel from "../models/itinerary.model.js";
import museumModel from "../models/museum.model.js";
import Complaint from '../models/complaint.model.js';
import AccountDeletionRequest from '../models/accountDeletionRequest.model.js'; 

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

// File a Complaint
export const fileComplaint = async (req, res) => {
  console.log("Filing a complaint");
  const { title, body } = req.body; // Get title and body from the request body
  const touristId = req.user.id; // Get the user ID from the verified JWT payload

  try {
    // Create a new complaint
    const complaint = new Complaint({
      title,
      body,
      touristId,
    });

    await complaint.save(); // Save the complaint to the database
    res.status(201).json({ message: "Complaint filed successfully.", complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error filing complaint." });
  }
};




// Request Account Deletion
export const requestAccountDeletion = async (req, res) => {
  console.log("Requesting Account to be deleted");
  const touristId = req.user.id; // Get the user ID from the verified JWT payload

  try {
    const tourist = await touristModel.findById(touristId);
    
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Check for upcoming paid activities
    const today = new Date();
    const upcomingActivities = await activityModel.find({
      userId: touristId,
      date: { $gte: today },
      bookingOpen: true // Assuming only open bookings count
    });

    // Check for upcoming itineraries
    const upcomingItineraries = await itineraryModel.find({
      userId: touristId,
      availableDates: { $elemMatch: { $gte: today } }
    });

    // If there are any upcoming activities or itineraries, do not allow deletion
    if (upcomingActivities.length > 0 || upcomingItineraries.length > 0) {
      return res.status(400).json({ error: "Account cannot be deleted while there are upcoming paid bookings." });
    }

    // Create a new account deletion request
    const deletionRequest = new AccountDeletionRequest({
      touristId: touristId,
    });

    await deletionRequest.save(); // Save the request to the database

    console.log(`Account deletion requested for user: ${tourist.email}`);
    res.status(200).json({ message: "Account deletion request sent to admin." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing account deletion request." });
  }
};

export const getComplaints = async (req, res) => {
  console.log("Viewing Filed Complaints");
  const touristId = req.user.id; // Get the user ID from the verified JWT payload

  try {
    const complaints = await Complaint.find({ touristId }).populate('touristId', 'email'); // Adjust the populated fields as necessary

    res.status(200).json({ complaints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching complaints." });
  }
};

export const bookItinerary = async (req, res) => {
    console.log("Booking an itinerary");
    const touristId = req.user.id; // Get the user ID from the verified JWT payload
    const { itineraryId } = req.body; // Get the itinerary ID from the request body
    try {
        const tourist = await touristModel.findById(touristId);
        const itinerary = await itineraryModel.findById(itineraryId);

        if (!tourist) {
            return res.status(404).json({ error: "Tourist not found" });
        }

        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }

        if (tourist.wallet < itinerary.price) {
            return res.status(400).json({ error: "Insufficient funds in wallet" });
        }

        // Deduct the price from the tourist's wallet
        tourist.wallet -= itinerary.price;

        // Add the itinerary to the tourist's bookedItineraries
        tourist.bookedItineraries.push(itineraryId);

        await tourist.save();

        res.status(200).json({ message: "Itinerary booked successfully", itinerary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error booking itinerary." });
    }
        
};
