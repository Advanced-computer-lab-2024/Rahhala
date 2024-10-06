import touristModel from "../models/tourist.js";


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
    console.log("entered getTouristById");
    const { id } = req.params;
    console.log(id);

    try {
        const tourist = await touristModel.findById(id);
        console.log(tourist);
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
    const { email, mobileNumber, nationality, dob, occupation, wallet } = req.body;

    try {
        const tourist = await touristModel.findOne({ email });

        if (!tourist) {
        return res.status(404).json({ error: "Tourist not found" });
        }

        // Prevent updating the username and wallet
        if (wallet && wallet !== tourist.wallet) {
        return res.status(400).json({ error: "Wallet cannot be updated." });
        }

        // Update other profile fields
        tourist.mobileNumber = mobileNumber || tourist.mobileNumber;
        tourist.nationality = nationality || tourist.nationality;
        tourist.dob = dob || tourist.dob;
        tourist.occupation = occupation || tourist.occupation;

        await tourist.save();
        res.status(200).json({ message: "Tourist profile updated successfully", profile: tourist });
    } catch (error) {
        res.status(500).json({ error: "Error updating tourist profile." });
    }
};

const touristController = {
    updateTourist,
    getTourist,
    getTouristById
};

export default touristController;