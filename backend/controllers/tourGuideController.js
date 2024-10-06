import tourGuideModel from "../models/tourGuide.js";
// Tour Guide profile routes
const updateTourGuide = async (req, res) =>{
    const { email, mobileNumber, yearsOfExperience, previousWork } = req.body;
  
    try {
      const user = await tourGuideModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: "Tour guide not found" });
      }
  
      // Update the tour guide's profile details
      user.mobileNumber = mobileNumber || user.mobileNumber;
      user.yearsOfExperience = yearsOfExperience || user.yearsOfExperience;
      if (previousWork) {
        user.previousWork = previousWork; // Replace with new data
      }
      user.profileCreated = true;
  
      await user.save();
      res.status(200).json({ message: "Tour guide profile updated successfully", profile: user });
    } catch (error) {
      res.status(500).json({ error: "Error updating tour guide profile" });
    }
  });
  
  const getTourGuideById = async (req, res) =>{
    const { email } = req.params;
  
    try {
      const user = await tourGuideModel.findOne({ email });
  
      if (!user || !user.profileCreated) {
        return res.status(404).json({ error: "Tour guide profile not found or not created yet" });
      }
  
      res.status(200).json({ profile: user });
    } catch (error) {
      res.status(500).json({ error: "Error fetching tour guide profile" });
    }
  });

const tourGuideController = {
    updateTourGuide,
    getTourGuideById
};

export default tourGuideController;