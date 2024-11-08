import sellerModel from "../models/seller.model.js";
import sellerRequestModel from "../models/sellerRequest.model.js";

// Add Seller to the Database
export const getSeller = async (req, res) => {
  console.log("entered getSeller");

  const id = req.user.id;

  try {
    const seller = await sellerModel.findById(id);

    if (!seller) {
      return res.status(404).json({ error: "Seller profile not found" });
    }

    res.status(200).json({ profile: seller });
  } catch (error) {
    res.status(500).json({ error: "Error fetching seller profile" });
  }
};

// Edit Seller Information
export const editSeller = async (req, res) => {
  const  id  = req.user.id;
  console.log(req.user.id);
  const { name, description, email, username } = req.body;


  try {
    // Find the seller by ID and update the specified fields
    const updatedSeller = await sellerModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          description,
          email,
          username,
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    console.log("Seller is updated successfully");
    res.status(200).json({
      message: "Seller profile updated successfully",
      profile: updatedSeller,
    });
  } catch (error) {
    console.log("Error updating seller profile:", error);
    res.status(500).json({ error: "Error updating seller profile" });
  }
};

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userID = req.user.id;
    console.log("Change password request received with ID:", userID);

    try {
        // Search for the seller using the ID
        const seller = await sellerModel.findById(userID);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        // Check if the old password matches
        if (oldPassword !== seller.password) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // Check if the new password is the same as the old password
        if (newPassword === oldPassword) {
            return res.status(400).json({ message: "New password cannot be the same as the old password" });
        }

        // Update the password using findByIdAndUpdate
        await sellerModel.findByIdAndUpdate(userID, { password: newPassword });

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Error changing password" });
    }
};

export const submitDocuments = async (req, res) => {
    const { idCardImage, taxationRegistryImage } = req.body;
    const userID = req.user.id;

    try {
        const seller = await sellerModel.findById(userID);

        if (!seller) {
            return res.status(404).json({ error: "Seller not found" });
        }
        if (!idCardImage || !taxationRegistryImage) {
            return res.status(400).json({ error: "Both ID card image and taxation registry image are required" });
        }
        seller.idCardImage = idCardImage;
        seller.taxationRegistryImage = taxationRegistryImage;

        await seller.save();
        
        res.status(200).json({
            message: "Documents submitted successfully",
            profile: seller,
        });
    } catch (error) {
        res.status(500).json({ error: "Error submitting documents" });
    }
};

export const createAccoutRequest = async (req, res) => {
    const { email, password, name, username, idCardImage, taxationRegistryImage, logo, description } = req.body;

    try {
        const seller = await sellerRequestModel.create({
            username,
            email,
            password,
            name,
            username,
            idCardImage,
            taxationRegistryImage,
            description,
            logo,
        });

        res.status(201).json({
            message: "Seller account request created successfully",
            profile: seller,
        });
    } catch (error) {
        res.status(500).json({ error: "Error creating seller account request" });
    }
};
