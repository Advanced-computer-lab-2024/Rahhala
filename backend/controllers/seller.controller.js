import sellerModel from "../models/seller.model.js";

// Add Seller to the Database
export const getSeller = async (req, res) => {
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
  const id = req.user.id;
  console.log("entered edit seller with id ", req.user.id);
  const { name, description, email, username, logo, status } = req.body;


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
          logo,
          status
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
      return res
        .status(400)
        .json({
          message: "New password cannot be the same as the old password",
        });
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
      return res
        .status(400)
        .json({
          error: "Both ID card image and taxation registry image are required",
        });
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
// Add this function to fetch documents
export const getDocuments = async (req, res) => {
  try {
    const documents = await sellerRequestModel.find(
      {},
      "idCardImage taxationRegistryImage"
    );
    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
};

export const acceptTerms = async (req, res) => {
  const userID = req.user.id;
  console.log("Accept terms and conditions request received with ID:", userID);

  try {
    // Find the seller by ID and update the acceptedTermsAndConditions field
    const updatedSeller = await sellerModel.findByIdAndUpdate(
      userID,
      { $set: { acceptedTermsAndConditions: true } },
      { new: true, runValidators: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({
      message: "Terms and conditions accepted successfully",
      profile: updatedSeller,
    });
  } catch (error) {
    console.error("Error accepting terms and conditions:", error);
    res.status(500).json({ error: "Error accepting terms and conditions" });
  }
};

//Register Seller
export const registerSeller = async (req, res) => {
  const {
    username,
    email,
    password,
    name,
    idCardImage,
    taxationRegistryImage,
    description,
    logo,
  } = req.body;

  try {
    const seller = await sellerModel.create({
      username,
      email,
      password,
      name,
      idCardImage,
      taxationRegistryImage,
      description,
      logo,
    });

    res
      .status(201)
      .json({ message: "Seller registered successfully", profile: seller });
  } catch (error) {
    console.error("Error registering seller:", error);
    res.status(500).json({ error: "Error registering seller" });
  }
};
