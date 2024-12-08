import advertiserModel from "../models/advertiser.model.js";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import tourGuideModel from "../models/tourGuide.model.js";

dotenv.config({ path: "../../.env" }); // Adjust path if needed

// Add Advertiser
export const editAdvertiser = async (req, res) => {
  console.log("entered editAdvertiser");

  const { username, email, companyName, websiteLink, hotline, companyProfile, status, oldPassword, newPassword, logo, taxationRegistryImage, idCardImage } = req.body;
  const userId = req.user.id;
  try {
    const advertiser = await advertiserModel.findById(userId);

    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }

    console.log("logo is ", logo);  

    // Update advertiser's profile details
    advertiser.idCardImage = idCardImage || advertiser.idCardImage;
    advertiser.taxationRegistryImage = taxationRegistryImage || advertiser.taxationRegistryImage;
    advertiser.username = username || advertiser.username;
    advertiser.email = email || advertiser.email;
    advertiser.companyName = companyName || advertiser.companyName;
    advertiser.websiteLink = websiteLink || advertiser.websiteLink;
    advertiser.hotline = hotline || advertiser.hotline;
    advertiser.companyProfile = companyProfile || advertiser.companyProfile;
    advertiser.profileCreated = true;
    advertiser.status = status || advertiser.status;
    advertiser.logo = logo || advertiser.logo;

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
    if (logo) {
      console.log("Received logo:", logo);
      advertiser.logo = logo;
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



// Generate OTP
const generateOTP = () => {
  return crypto.randomBytes(3).toString('hex'); // Generate a 6-digit OTP
};

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: 'no-reply@example.com',
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP for password reset is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Request OTP for Password Reset
export const requestPasswordReset = async (req, res) => {
  console.log("entered requestPasswordReset");
  const { email } = req.body;

  try {
    const advertiser = await advertiserModel.findOne({ email });

    if (!advertiser) {
      return res.status(404).json({ error: 'advertiser not found' });
    }

    const otp = generateOTP();
    advertiser.resetPasswordOTP = otp;
    advertiser.resetPasswordExpires = Date.now() + 3600000; // OTP expires in 1 hour

    await advertiser.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ error: 'Error requesting password reset' });
  }
};

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    try {
      const advertiser = await advertiserModel.findOne({ email });
  
      if (!advertiser) {
        return res.status(404).json({ error: 'advertiser not found' });
      }
  
      if (advertiser.resetPasswordOTP !== otp || advertiser.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
  
      advertiser.password = newPassword;
      advertiser.resetPasswordOTP = undefined;
      advertiser.resetPasswordExpires = undefined;
  
      await advertiser.save();
  
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ error: 'Error resetting password' });
    }
  };
