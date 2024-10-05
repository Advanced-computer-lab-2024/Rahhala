const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Tourist = require("./models/Tourist"); // Import the Tourist model
const Role = require("./models/Role"); // Import the Role model

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

// Tourist profile read route
router.get("/profile/tourist/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const tourist = await Tourist.findOne({ email });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Send profile data, excluding password
    const { username, email, mobileNumber, nationality, dob, occupation, wallet } = tourist;
    res.status(200).json({
      profile: { username, email, mobileNumber, nationality, dob, occupation, wallet }
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tourist profile" });
  }
});

// Tourist profile update route (excluding username and wallet)
router.put("/profile/tourist/:email", async (req, res) => {
  const { email } = req.params;
  const { mobileNumber, nationality, dob, occupation } = req.body;

  try {
    const tourist = await Tourist.findOne({ email });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Update the fields that are allowed to be updated
    tourist.mobileNumber = mobileNumber || tourist.mobileNumber;
    tourist.nationality = nationality || tourist.nationality;
    tourist.dob = dob || tourist.dob;
    tourist.occupation = occupation || tourist.occupation;

    await tourist.save();
    res.status(200).json({ message: "Tourist profile updated successfully", profile: tourist });
  } catch (error) {
    res.status(500).json({ error: "Error updating tourist profile" });
  }
});

module.exports = router;
