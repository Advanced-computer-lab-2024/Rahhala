const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Tourist = require("./models/Tourist"); // Import the Tourist model
const TourGuide = require("./models/TourGuide"); // Import the TourGuide model
const Advertiser = require("./models/Advertiser"); // Import the Advertiser model
const Seller = require("./models/Seller"); // Import the Seller model

const router = express.Router();

// Home route (generic)
router.get("/", async (req, res) => {
  res.json({ message: "Welcome to the app!" });
});

// Registration route for tourists
router.post("/register", async (req, res) => {
  const { email, username, password, mobileNumber, nationality, dob, occupation } = req.body;

  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  if (age < 18) {
    return res.status(400).json({ error: "You must be at least 18 years old to register." });
  }

  const existingUser = await Tourist.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already in use." });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newTourist = new Tourist({
    email,
    username,
    password: hashedPassword,
    mobileNumber,
    nationality,
    dob,
    occupation,
  });

  try {
    await newTourist.save();
    res.status(201).json({ message: "Tourist registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving user to database." });
  }
});

// Tourist profile update route
router.put("/profile/tourist", async (req, res) => {
  const { email, mobileNumber, nationality, dob, occupation, wallet } = req.body;

  try {
    const tourist = await Tourist.findOne({ email });

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Prevent updating the username and wallet
    if (wallet && wallet !== tourist.wallet) {
      return res.status(400).json({ error: "Wallet cannot be updated." });
    }

    // Update other profile fields
    tourist.mobileNumber = mobileNumber || tourist.mobileNumber;
    tourist.nationality = nationality || tourist.nationality;
    tourist.dob = dob || tourist.dob;
    tourist.occupation = occupation || tourist.occupation;

    await tourist.save();
    res.status(200).json({ message: "Tourist profile updated successfully", profile: tourist });
  } catch (error) {
    res.status(500).json({ error: "Error updating tourist profile." });
  }
});

// Tourist profile retrieval route
router.get("/profile/tourist/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const tourist = await Tourist.findOne({ email });

    if (!tourist) {
      return res.status(404).json({ error: "Tourist profile not found" });
    }

    res.status(200).json({ profile: tourist });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tourist profile." });
  }
});

// Registration route for professionals (tour guides, advertisers, sellers)
router.post("/register-role", async (req, res) => {
  const { email, username, password, role } = req.body;

  const existingUserTourGuide = await TourGuide.findOne({ email });
  const existingUserAdvertiser = await Advertiser.findOne({ email });
  const existingUserSeller = await Seller.findOne({ email });

  if (existingUserTourGuide || existingUserAdvertiser || existingUserSeller) {
    return res.status(400).json({ error: "Email already in use." });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  let newRole;
  switch (role) {
    case "tour_guide":
      newRole = new TourGuide({ email, username, password: hashedPassword });
      break;
    case "advertiser":
      newRole = new Advertiser({ email, username, password: hashedPassword });
      break;
    case "seller":
      newRole = new Seller({ email, username, password: hashedPassword });
      break;
    default:
      return res.status(400).json({ error: "Invalid role specified." });
  }

  try {
    await newRole.save();
    res.status(201).json({ message: `${role.replace("_", " ")} registered successfully!` });
  } catch (error) {
    res.status(500).json({ error: "Error saving user to database." });
  }
});

// Tour Guide profile routes
router.put("/profile/tour_guide", async (req, res) => {
  const { email, mobileNumber, yearsOfExperience, previousWork } = req.body;

  try {
    const user = await TourGuide.findOne({ email });

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
});

router.get("/profile/tour_guide/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await TourGuide.findOne({ email });

    if (!user || !user.profileCreated) {
      return res.status(404).json({ error: "Tour guide profile not found or not created yet" });
    }

    res.status(200).json({ profile: user });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tour guide profile" });
  }
});

// Advertiser profile routes
router.put("/advertiser/profile", async (req, res) => {
  const { email, companyName, website, hotline, companyProfile } = req.body;

  try {
    const advertiser = await Advertiser.findOne({ email });

    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }

    // Update advertiser's profile details
    advertiser.companyName = companyName || advertiser.companyName;
    advertiser.website = website || advertiser.website;
    advertiser.hotline = hotline || advertiser.hotline;
    advertiser.companyProfile = companyProfile || advertiser.companyProfile;
    advertiser.profileCreated = true;

    await advertiser.save();
    res.status(200).json({ message: "Advertiser profile updated successfully", profile: advertiser });
  } catch (error) {
    res.status(500).json({ error: "Error updating advertiser profile" });
  }
});

router.get("/advertiser/profile/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const advertiser = await Advertiser.findOne({ email });

    if (!advertiser || !advertiser.profileCreated) {
      return res.status(404).json({ error: "Advertiser profile not found or not created yet" });
    }

    res.status(200).json({ profile: advertiser });
  } catch (error) {
    res.status(500).json({ error: "Error fetching advertiser profile" });
  }
});

// Seller profile routes
router.put("/seller/profile", async (req, res) => {
  const { email, name, description } = req.body;

  try {
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Update seller's profile details
    seller.name = name || seller.name;
    seller.description = description || seller.description;
    seller.profileCreated = true;

    await seller.save();
    res.status(200).json({ message: "Seller profile updated successfully", profile: seller });
  } catch (error) {
    res.status(500).json({ error: "Error updating seller profile" });
  }
});

router.get("/seller/profile/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const seller = await Seller.findOne({ email });

    if (!seller || !seller.profileCreated) {
      return res.status(404).json({ error: "Seller profile not found or not created yet" });
    }

    res.status(200).json({ profile: seller });
  } catch (error) {
    res.status(500).json({ error: "Error fetching seller profile" });
  }
});

module.exports = router;
