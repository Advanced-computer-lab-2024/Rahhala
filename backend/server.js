const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Import models
const Tourist = require('./models/Tourist'); // For tourists
const TourGuide = require('./models/TourGuide'); // For tour guides
const Advertiser = require('./models/Advertiser'); // For advertisers
const Seller = require('./models/Seller'); // For sellers

// Create a new Express application
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Home route
app.get(["/", "/home"], (req, res) => {
  res.json({ message: "Welcome to the app!" });
});

// Registration endpoint for tourists
app.post('/register', async (req, res) => {
  const { email, username, password, mobileNumber, nationality, dob, occupation } = req.body;

  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  if (age < 18) {
    return res.status(400).json({ error: 'You must be at least 18 years old to register.' });
  }

  const existingUser = await Tourist.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use.' });
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
    res.status(201).json({ message: 'Tourist registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving user to database.' });
  }
});

// Registration endpoint for professionals (tour guides, advertisers, sellers)
app.post('/register-role', async (req, res) => {
  const { email, username, password, role } = req.body;

  const existingTourGuide = await TourGuide.findOne({ email });
  const existingAdvertiser = await Advertiser.findOne({ email });
  const existingSeller = await Seller.findOne({ email });

  if (existingTourGuide || existingAdvertiser || existingSeller) {
    return res.status(400).json({ error: 'Email already in use.' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  let newRole;
  switch (role) {
    case 'tour_guide':
      newRole = new TourGuide({ email, username, password: hashedPassword });
      break;
    case 'advertiser':
      newRole = new Advertiser({ email, username, password: hashedPassword });
      break;
    case 'seller':
      newRole = new Seller({ email, username, password: hashedPassword });
      break;
    default:
      return res.status(400).json({ error: 'Invalid role specified.' });
  }

  try {
    await newRole.save();
    res.status(201).json({ message: `${role.replace('_', ' ')} registered successfully!` });
  } catch (error) {
    res.status(500).json({ error: 'Error saving user to database.' });
  }
});

// Create or update tour guide profile
app.put('/profile/tour_guide', async (req, res) => {
  const { email, mobileNumber, yearsOfExperience, previousWork } = req.body;

  try {
    const user = await TourGuide.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Tour guide not found' });
    }

    // Update the tour guide's profile details
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.yearsOfExperience = yearsOfExperience || user.yearsOfExperience;
    if (previousWork) {
      user.previousWork = previousWork; // Replace with new data
    }
    user.profileCreated = true;

    await user.save();
    res.status(200).json({ message: 'Tour guide profile updated successfully', profile: user });
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Read tour guide profile
app.get('/profile/tour_guide/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await TourGuide.findOne({ email });

    if (!user || !user.profileCreated) {
      return res.status(404).json({ error: 'Tour guide profile not found or not created yet' });
    }

    res.status(200).json({ profile: user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Create or update advertiser profile
app.put('/advertiser-profile', async (req, res) => {
  const { email, hotline, companyProfile, websiteLink } = req.body;

  try {
    const user = await Advertiser.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Advertiser not found' });
    }

    // Update the advertiser's profile details
    user.hotline = hotline || user.hotline;
    user.companyProfile = companyProfile || user.companyProfile;
    user.websiteLink = websiteLink || user.websiteLink;
    user.profileCreated = true;

    await user.save();
    res.status(200).json({ message: 'Advertiser profile updated successfully', profile: user });
  } catch (error) {
    res.status(500).json({ error: 'Error updating advertiser profile' });
  }
});

// Read advertiser profile
app.get('/advertiser-profile/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await Advertiser.findOne({ email });

    if (!user || !user.profileCreated) {
      return res.status(404).json({ error: 'Advertiser profile not found or not created yet' });
    }

    res.status(200).json({ profile: user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching advertiser profile' });
  }
});

// Create or update seller profile
app.put('/seller-profile', async (req, res) => {
  const { email, name, description } = req.body;

  try {
    const user = await Seller.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Update the seller's profile details
    user.name = name || user.name;
    user.description = description || user.description;
    user.profileCreated = true;

    await user.save();
    res.status(200).json({ message: 'Seller profile updated successfully', profile: user });
  } catch (error) {
    res.status(500).json({ error: 'Error updating seller profile' });
  }
});

// Read seller profile
app.get('/seller-profile/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await Seller.findOne({ email });

    if (!user || !user.profileCreated) {
      return res.status(404).json({ error: 'Seller profile not found or not created yet' });
    }

    res.status(200).json({ profile: user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching seller profile' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
