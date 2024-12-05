import tourGuideModel from "../models/tourGuide.model.js";
import { generateToken, comparePasswords } from "../utils/jwt.js";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';


dotenv.config({ path: "../../.env" }); // Adjust path if needed


// Generate OTP
const generateOTP = () => {
  return crypto.randomBytes(3).toString('hex'); // Generate a 6-digit OTP
};

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
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

// Accept Terms and Conditions
export const acceptTerms = async (req, res) => {
    console.log("entered acceptTerms");
  const id = req.user.id;

  try {
    const user = await tourGuideModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Tour guide not found" });
    }

    user.acceptedTermsAndConditions = true;

    await user.save();

    res.status(200).json({ message: "Terms and conditions accepted successfully" });
  } catch (error) {
    console.error("Error accepting terms and conditions:", error);
    res.status(500).json({ error: "Error accepting terms and conditions" });
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

// Get Tour Guide by ID from Params
export const getTourGuideByIDFromParams = async (req, res) => {
    console.log("entered getTourGuideByIDFromParams");
    const { id } = req.params;
    console.log("Tour guide ID:", id);

    try {
        const user = await tourGuideModel.findById(id);
        console.log("Tour guide profile:", user); // Log the profile data

        if (!user) {
            return res.status(404).json({ error: "Tour guide profile not found" });
        }
        res.status(200).json({ profile: user });
    } catch (error) {
        res.status(500).json({ error: "Error fetching tour guide profile" });
    }
};

// Login Tour Guide
export const loginTourGuide = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the tourguide by username
    const tourGuide = await tourGuideModel.findOne({ username });


    if (!tourGuide) {
      return res.status(404).json({ error: "Tour Guide not found" });
    }

    // Compare the provided password with the stored password
    const isMatch = await comparePasswords(tourGuide.password, password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = generateToken(tourGuide, "tourguide");
    console.log("tourguide is ", tourGuide)   

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in tour guide:", error);
    res.status(500).json({ error: "Error logging in tour guide" });
  }
};

// Request OTP for Password Reset
export const requestPasswordReset = async (req, res) => {
  console.log("entered requestPasswordReset");
  const { email } = req.body;

  try {
    const tourGuide = await tourGuideModel.findOne({ email });

    if (!tourGuide) {
      return res.status(404).json({ error: 'Tour Guide not found' });
    }

    const otp = generateOTP();
    tourGuide.resetPasswordOTP = otp;
    tourGuide.resetPasswordExpires = Date.now() + 3600000; // OTP expires in 1 hour

    await tourGuide.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ error: 'Error requesting password reset' });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const { email }= req.body;
  const { otp } = req.body;

  try {
    const tourGuide = await tourGuideModel.findOne({ email });

    if (!tourGuide) {
      return res.status(404).json({ error: 'Tour Guide not found' });
    }

    if (tourGuide.resetPasswordOTP !== otp || tourGuide.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Error verifying OTP' });
  }
};
// Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const tourGuide = await tourGuideModel.findOne({ email });

    if (!tourGuide) {
      return res.status(404).json({ error: 'Tour Guide not found' });
    }

    if (tourGuide.resetPasswordOTP !== otp || tourGuide.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    tourGuide.password = newPassword;
    tourGuide.resetPasswordOTP = undefined;
    tourGuide.resetPasswordExpires = undefined;

    await tourGuide.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Error resetting password' });
  }
};
