import sellerModel from "../models/seller.model.js";

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
  console.log("entered editSeller");
  const id = req.user.id;
  const { email, name, description, username } = req.body;

  try {
    const seller = await sellerModel.findById(id);

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Update seller's profile details
    seller.name = name || seller.name;
    seller.description = description || seller.description;
    seller.email = email || seller.email;
    seller.username = username || seller.username;
    seller.profileCreated = true;

    await seller.save();
    res.status(200).json({
      message: "Seller profile updated successfully",
      profile: seller,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating seller profile" });
  }
};

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userID = req.user.id;
    console.log("Change password request received with ID:", userID);
    try {
        // Search for the seller using the email
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

        // Update the password
        seller.password = newPassword;
        await seller.save();

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
