import advertiserModel from "../models/advertiser.model.js";
import path from 'path';
import multer from 'multer';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Add Advertiser
export const editAdvertiser = async (req, res) => {
  console.log("entered editAdvertiser");

  const { email, companyName, websiteLink, hotline, companyProfile, status, oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  try {
    const advertiser = await advertiserModel.findById(userId);

    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }

    // Update advertiser's profile details
    advertiser.email = email || advertiser.email;
    advertiser.companyName = companyName || advertiser.companyName;
    advertiser.websiteLink = websiteLink || advertiser.websiteLink;
    advertiser.hotline = hotline || advertiser.hotline;
    advertiser.companyProfile = companyProfile || advertiser.companyProfile;
    advertiser.profileCreated = true;
    advertiser.status = status || advertiser.status;

    // Handle password change
    if (oldPassword && newPassword) {
      if (oldPassword !== advertiser.password) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      if (newPassword === oldPassword) {
        return res.status(400).json({ message: "New password cannot be the same as the old password" });
      }
      advertiser.password = newPassword;
    }

    // Handle logo upload
    if (req.file) {
      const logoBase64 = req.file.buffer.toString('base64');
      advertiser.logo = logoBase64;
    }

    await advertiser.save();
    res.status(200).json({
      message: "Advertiser profile updated successfully",
      profile: advertiser,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating advertiser profile" });
  }
};


// Get Advertiser by ID
export const getAdvertiserByID = async (req, res) => {
  console.log("entered  getAdvertiserByID");

  const id = req.user.id;

  try {
    const advertiser = await advertiserModel.findById(id);

    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser profile not found" });
    }

    res.status(200).json({ profile: advertiser });
  } catch (error) {
    res.status(500).json({ error: "Error fetching advertiser profile" });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userID = req.user.id;
  console.log("Change password request received with ID:", userID);
  try {
    // Search for the advertiser using the email
    const advertiser = await advertiserModel.findById(userID);
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    // Check if the old password matches
    if (oldPassword !== advertiser.password) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Check if the new password is the same as the old password
    if (newPassword === oldPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    // Update the password
    advertiser.password = newPassword;
    await advertiser.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password" });
  }
};

export const submitDocuments = async (req, res) => {
  const { idCardImage, taxationRegistryImage } = req.body;
  const userID = req.user.id;

  try {
    const advertiser = await advertiserModel.findById(userID);

    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }
    if (!idCardImage || !taxationRegistryImage) {
      return res.status(400).json({
        error: "Both ID card image and taxation registry image are required",
      });
    }
    advertiser.idCardImage = idCardImage;
    advertiser.taxationRegistryImage = taxationRegistryImage;

    await advertiser.save();

    res.status(200).json({
      message: "Documents submitted successfully",
      profile: advertiser,
    });
  } catch (error) {
    res.status(500).json({ error: "Error submitting documents" });
  }
};
// Add this function to fetch documents
export const getDocuments = async (req, res) => {
  try {
    const documents = await advertiserRequestModel.find(
      {},
      "idCardImage taxationRegistryImage"
    );
    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
};

//Register Advertiser
export const registerAdvertiser = async (req, res) => {
  console.log("entered registerAdvertiser");

  const {
    username,
    idCardImage,
    taxationRegistryImage,
    email,
    password,
    websiteLink,
    hotline,
    companyProfile,
    logo,
  } = req.body;

  try {
    const advertiser = await advertiserModel.create({
      username,
      idCardImage,
      taxationRegistryImage,
      email,
      password,
      websiteLink,
      hotline,
      companyProfile,
      logo,
    });

    res.status(201).json({
      message: "Advertiser registered successfully",
      profile: advertiser,
    });
  } catch (error) {
    res.status(500).json({ error: "Error registering advertiser" });
  }
};

export const uploadMiddleware = upload.single('logo');