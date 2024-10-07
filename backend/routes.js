const User = require('./models/User'); 
const bcrypt = require('bcryptjs');

// Home route to check the collections in the database
const getHome = async(req, res, conn) => {
    console.log("Received a request");
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);
    res.json({
        message: "Welcome to the app",
        collections: collectionNames,
    });
};

// Tourist Registration Route
const registerTourist = async (req, res) => {
    try {
        const { username, email, password, mobileNumber, nationality, dob, job } = req.body;

        // Basic validation
        if (!username || !email || !password || !dob || !mobileNumber) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        // Check age restriction
        const currentDate = new Date();
        const birthDate = new Date(dob);
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
            return res.status(400).json({ message: "You must be at least 18 years old to register" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new tourist user
        const newTourist = new User({
            username,
            email,
            password,
            role: 'tourist',
            mobileNumber,
            nationality,
            dob,
            job
        });

        // Save the tourist to the database
        await newTourist.save();
        res.status(201).json({ message: "Tourist registered successfully" });

    } catch (error) {
        console.error("Error during tourist registration:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Register route for tour guide/advertiser/seller
const registerUserWithRole = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Basic validation
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        // Validate role
        if (!['guide', 'advertiser', 'seller'].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password,
            role
        });

        // Save user to the database
        await newUser.save();

        // Return success message
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Error during registration:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getHome, registerTourist, registerUserWithRole };
