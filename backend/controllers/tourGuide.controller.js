import tourGuideModel from "../models/tourGuide.model.js";

// Edit Tour Guide Information
export const editTourGuide = async (req, res) => {
  console.log("entered editTourGuide");
  const {
    work,
    yearsOfExperience,
    certificationImages,
    email,
    mobileNumber,
    profilePhoto,
    status,
  } = req.body;
  const id = req.user.id;

  try {
    const user = await tourGuideModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Tour guide not found" });
    }

    // Update the tour guide's profile details
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.email = email || user.email;
    user.profilePhoto = profilePhoto || user.profilePhoto;
    user.status = status || user.status;

    if (work && yearsOfExperience) {
      user.previousWork.push({ work, yearsOfExperience });
    }

    if (certificationImages && certificationImages.length > 0) {
      user.certificationImages = certificationImages;
    }

    await user.save();

    res.status(200).json({ message: "Tour guide profile updated successfully", profile: user });
  } catch (error) {
    console.error("Error updating tour guide profile:", error);
    res.status(500).json({ error: "Error updating tour guide profile" });
  }
};

// Get Tour Guide by ID
export const getTourGuideByID = async (req, res) => {

  const id = req.user.id;


  try {
    const user = await tourGuideModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Tour guide profile not found" });
    }
    res.status(200).json({ profile: user });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tour guide profile" });
  }
};

export const changePassword = async (req, res) => {
  console.log("entered changePassword");
  const { oldPassword, newPassword } = req.body;
  const userID = req.user.id;
  console.log("Change password request received with ID:", userID);
  try {
    // Search for the tourGuide using the email
    const tourGuide = await tourGuideModel.findById(userID);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour Guide not found" });
    }
    // Check if the old password matches
    if (oldPassword !== tourGuide.password) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Check if the new password is the same as the old password
    if (newPassword === oldPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    // Update the password
    tourGuide.password = newPassword;
    await tourGuide.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password" });
  }
};

// Submit Documents
export const submitDocuments = async (req, res) => {
  const { idCardImage, certificationImages } = req.body;
  const id = req.user.id;

  try {
    const user = await tourGuideModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Tour guide not found" });
    }
    if (!idCardImage || !certificationImages) {
      return res.status(400).json({
        error: "Both ID card image and certification images are required",
      });
    }
    // Update the tour guide's documents
    user.idCardImage = idCardImage;
    user.certificationImages =
      user.certificationImages.concat(certificationImages);

    await user.save();
    res.status(200).json({
      message: "Documents submitted successfully",
      profile: user,
    });
  } catch (error) {
    res.status(500).json({ error: "Error submitting documents" });
  }
};
// Add this function to fetch documents
export const getDocuments = async (req, res) => {
  try {
    const documents = await tourGuideRequestmodel.find(
      {},
      "idCardImage certificationImages"
    );
    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
};

//Register Tour Guide
export const registerTourGuide = async (req, res) => {
  console.log("entered registerTourGuide");
  const {
    username,
    idCardImage,
    certificationImages,
    email,
    password,
    mobileNumber,
    previousWork,
  } = req.body;

  try {
    const user = await tourGuideModel.create({
      username,
      idCardImage,
      certificationImages,
      email,
      password,
      mobileNumber,
      previousWork,
    });

    res
      .status(201)
      .json({ message: "Tour guide created successfully", profile: user });
  } catch (error) {
    res.status(500).json({ error: "Error creating tour guide" });
  }
};
