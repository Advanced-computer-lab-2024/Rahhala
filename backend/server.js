import productRoutes from "./routes/product.route.js";


const dotenv = require("dotenv");
dotenv.config({ path: "../.env" }); // Adjust path if needed
const port = process.env.PORT;

// Connect to MongoDB server
const mongoose = require("mongoose");
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
}
connectDB();

// Import required routes
const { createUser, createActivity, getActivity, updateActivity, deleteActivity, addHistoricalTag, getItinerary, createItinerary, sortItinerary, sortActivity, updateItinerary } = require("./routes");

// Import product routes
const productRoutes = require("./routes/product.route");

// Initialize Express app
const express = require("express");
const app = express();
app.use(express.json());

// Define routes
app.post("/createUser", (req, res) => createUser(req, res));
app.post("/createActivity", (req, res) => createActivity(req, res));
app.post("/getActivity", (req, res) => getActivity(req, res));
app.post("/createItinerary", (req, res) => createItinerary(req, res));
app.get("/filterItinerary", (req, res) => getItinerary(req, res));
app.get("/sortItinerary", (req, res) => sortItinerary(req, res));
app.get("/sortActivity", (req, res) => sortActivity(req, res));
app.patch("/updateItinerary", (req, res) => updateItinerary(req, res));

// Add product route (prefix all product routes with /api/products)
app.use("/api/products", productRoutes);
app.use("/create", productRoutes);  // Where productRoutes contains the route for creating products

// Listen for requests
app.listen(port, () => {
  console.log("Listening on port", port);
});
