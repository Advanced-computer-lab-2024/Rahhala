import adminModel from "../models/admin.model.js";
import models from "../models/index.model.js";

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
  const { entityType, id } = req.params;
  console.log(
    "Delete request received for entity:",
    entityType,
    "with ID:",
    id
  );

  let Model;

  switch (entityType) {
    case "admin":
      Model = models.adminModel;
      break;
    case "governor":
      Model = models.governorModel;
      break;
    case "tourist":
      Model = models.touristModel;
      break;
    case "tourGuide":
      Model = models.tourGuideModel;
      break;
    case "advertiser":
      Model = models.advertiserModel;
      break;
    case "seller":
      Model = models.sellerModel;
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
