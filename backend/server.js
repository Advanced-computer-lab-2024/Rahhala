const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Import models
const Tourist = require('./models/Tourist'); // For tourists
const Role = require('./models/Role'); // For tour guides, advertisers, and sellers

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

  if (!['tour_guide', 'advertiser', 'seller'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified.' });
  }

  const existingUser = await Role.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use.' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newRole = new Role({
    email,
    username,
    password: hashedPassword,
    role
  });

  try {
    await newRole.save();
    res.status(201).json({ message: `${role.replace('_', ' ')} registered successfully!` });
  } catch (error) {
    res.status(500).json({ error: 'Error saving user to database.' });
  }
});

// Profile routes for tourists
app.use('/profile', require('./routes'));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
