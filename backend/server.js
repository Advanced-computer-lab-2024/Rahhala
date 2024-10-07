const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const mongoose = require("mongoose");
const express = require("express");

const { getHome, registerTourist, registerUserWithRole } = require("./routes");

// Connect to MongoDB
async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
connectDB();

// Initialize Express
const app = express();
app.use(express.json()); // to parse JSON bodies

// Set the port from environment variables
const port = process.env.PORT || 8000;

// Home route
app.get(["/", "/home"], (req, res) => getHome(req, res, mongoose));

// Tourist registration route
app.post("/registerTourist", (req, res) => registerTourist(req, res));

// Tour guide, advertiser, seller registration route
app.post("/registerRole", (req, res) => registerUserWithRole(req, res));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
