import adminModel from "../models/admin.model.js";
import advertiserModel from "../models/advertiser.model.js";
import sellerModel from "../models/seller.model.js";
import tourGuideModel from "../models/tourGuide.model.js";
import governorModel from "../models/governor.model.js";
import touristModel from "../models/tourist.model.js";
import Sale from '../models/sale.model.js';

// Add Admin to the Database
export const addAdmin = async (req, res) => {
  console.log("entered addAdmin");

  const { username, password } = req.body;
  try {
    console.log("username", username);
    // Check if the username already exists
    const existingAdmin = await adminModel.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newAdmin = await adminModel.create({ username, password });

    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ message: "Error adding admin" });
  }
};

//Delete Admin from the Database
export const deleteEntity = async (req, res) => {
  let { entityType, id } = req.params;
  entityType = entityType.toLowerCase();
  console.log(
    "Delete request received for entity:",
    entityType,
    "with ID:",
    id
  );

  let Model;
  console.log("entityType", entityType);
  switch (entityType) {
    case "admin":
      Model = adminModel;
      break;
    case "governor":
      Model = governorModel;
      break;
    case "tourist":
      Model = touristModel;
      break;
    case "tourguide":
      Model = tourGuideModel;
      break;
    case "advertiser":
      Model = advertiserModel;
      break;
    case "seller":
      Model = sellerModel;
      break;
    default:
      return res.status(400).json({ message: "Invalid entity type" });
  }

  try {
    const entity = await Model.findByIdAndDelete(id);
    if (!entity) {
      return res.status(404).json({ message: `${entityType} not found` });
    }
    res.status(200).json({ message: `${entityType} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting ${entityType}:`, error);
    res.status(500).json({ message: `Error deleting ${entityType}` });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userID = req.user.id;
  console.log("Change password request received with ID:", userID);
  try {
    // Search for the admin using the email
    const admin = await adminModel.findById(userID);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    // Check if the old password matches
    if (oldPassword !== admin.password) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Check if the new password is the same as the old password
    if (newPassword === oldPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    // Update the password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password" });
  }
};

// View Pending Advertisers
export const viewPendingAdvertisers = async (req, res) => {
  console.log("entered viewPendingAdvertisers");
  try {
    const advertisers = await advertiserModel.find({
      status: "pending",
    });
    res.status(200).json({ advertisers });
  } catch (error) {
    console.error("Error viewing pending advertisers:", error);
    res.status(500).json({ message: "Error viewing pending advertisers" });
  }
};

//Accept Advertiser
export const acceptAdvertiser = async (req, res) => {
  console.log("entered acceptAdvertiser");
  const { _id } = req.params;
  try {
    const advertiser = await advertiserModel.findById(_id);
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    advertiser.status = "accepted";
    advertiser.idCardImage = "x";
    advertiser.taxationRegistryImage = "x";
    await advertiser.save();
    res.status(200).json({ message: "Advertiser accepted successfully" });
  } catch (error) {
    console.error("Error accepting advertiser:", error);
    res.status(500).json({ message: "Error accepting advertiser" });
  }
};

//Reject Advertiser
export const rejectAdvertiser = async (req, res) => {
  console.log("entered rejectAdvertiser");
  const { _id } = req.params;
  try {
    const advertiser = await advertiserModel.findById(_id);
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    advertiser.status = "rejected";
    await advertiser.save();
    res.status(200).json({ message: "Advertiser rejected successfully" });
  } catch (error) {
    console.error("Error rejecting advertiser:", error);
    res.status(500).json({ message: "Error rejecting advertiser" });
  }
};

// View Pending Sellers
export const viewPendingSellers = async (req, res) => {
  console.log("entered viewPendingSellers");
  try {
    const sellers = await sellerModel.find({
      status: "pending",
    });
    res.status(200).json({ sellers });
  } catch (error) {
    console.error("Error viewing pending sellers:", error);
    res.status(500).json({ message: "Error viewing pending sellers" });
  }
};

//Accept Seller
export const acceptSeller = async (req, res) => {
  console.log("entered acceptSeller");
  const { _id } = req.params;
  try {
    const seller = await sellerModel.findById(_id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    seller.status = "accepted";
    seller.taxationRegistryImage="x";
    seller.idCardImage="x";
    await seller.save();
    res.status(200).json({ message: "Seller accepted successfully" });
  } catch (error) {
    console.error("Error accepting seller:", error);
    res.status(500).json({ message: "Error accepting seller" });
  }
};

//Reject Seller
export const rejectSeller = async (req, res) => {
  console.log("entered rejectSeller");
  const { _id } = req.params;
  try {
    const seller = await sellerModel.findById(_id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    seller.status = "rejected";
    await seller.save();
    res.status(200).json({ message: "Seller rejected successfully" });
  } catch (error) {
    console.error("Error rejecting seller:", error);
    res.status(500).json({ message: "Error rejecting seller" });
  }
};

// View Pending Tour Guides
export const viewPendingTourGuides = async (req, res) => {
  console.log("entered viewPendingTourGuides");
  try {
    const tourGuides = await tourGuideModel.find({
      status: "pending",
    });
    res.status(200).json({ tourGuides });
  } catch (error) {
    console.error("Error viewing pending tour guides:", error);
    res.status(500).json({ message: "Error viewing pending tour guides" });
  }
};

//Accept Tour Guide
export const acceptTourGuide = async (req, res) => {
  console.log("entered acceptTourGuide");
  const { _id } = req.params;
  try {
    const tourGuide = await tourGuideModel.findById(_id);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour Guide not found" });
    }
    tourGuide.status = "accepted";
    tourGuide.certificationImages = [];
    tourGuide.idCardImage = "x";
    await tourGuide.save();
    res.status(200).json({ message: "Tour Guide accepted successfully" });
  } catch (error) {
    console.error("Error accepting tour guide:", error);
    res.status(500).json({ message: "Error accepting tour guide" });
  }
};

//Reject Tour Guide
export const rejectTourGuide = async (req, res) => {
  console.log("entered rejectTourGuide");
  const { _id } = req.params;
  try {
    const tourGuide = await tourGuideModel.findById(_id);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour Guide not found" });
    }
    tourGuide.status = "rejected";
    await tourGuide.save();
    res.status(200).json({ message: "Tour Guide rejected successfully" });
  } catch (error) {
    console.error("Error rejecting tour guide:", error);
    res.status(500).json({ message: "Error rejecting tour guide" });
  }
};

export const viewUsersInfo = async (req, res) => {
  console.log("entered viewUploadedDocuments");
  try {
    const tourGuideDocuments = await tourGuideModel.find({ status: 'pending' });
    const sellerDocuments = await sellerModel.find({ status: 'pending' });
    const advertiserDocuments = await advertiserModel.find({ status: 'pending' });

    res.status(200).json({
      tourGuideDocuments,
      sellerDocuments,
      advertiserDocuments
    });
  } catch (error) {
    console.error("Error viewing uploaded documents:", error);
    res.status(500).json({ message: "Error viewing uploaded documents" });
  }
};
