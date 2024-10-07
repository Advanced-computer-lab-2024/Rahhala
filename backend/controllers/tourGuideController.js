import tourGuideModel from "../models/tourGuide.js";
// Tour Guide profile routes
const updateTourGuide = async (req, res) =>{
    const { email, mobileNumber, yearsOfExperience, previousWork } = req.body;
    const id = req.user.id;
  
    try {
      const user = await tourGuideModel.findById(id);
  
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
  };
  
  const getTourGuideById = async (req, res) =>{
    const id  = req.user.id;
    console.log("entered");

  
    try {
      const user = await tourGuideModel.findById(id);
      console.log(user);
  
      if (!user) {
        return res.status(404).json({ error: "Tour guide profile not found" });
      }
  
      res.status(200).json({ profile: user });
    } catch (error) {
      res.status(500).json({ error: "Error fetching tour guide profile" });
    }
  };

const tourGuideController = {
    updateTourGuide,
    getTourGuideById
};

export default tourGuideController;