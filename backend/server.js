// configure reading from .env
const dotenv = require("dotenv")
dotenv.config({path: "../.env"});
const port = process.env.PORT //getting port from .env


// connect to MongoDB server
const mongoose = require("mongoose");
let conn; // used to communicate with DB
async function connectDB() {
    try {
      conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1); // Exit the process with failure
    }
  }
connectDB();

// import required routes
const {createUser, createActivity, getActivity, updateItinerary, getItinerary1, getItinerary2, createItinerary} = require("./routes")


// new express app
const express = require('express')
const app = express() // express app init
app.use(express.json());


// listen for requests
app.listen(port,() => {
    console.log('listening on port', port)
})

// sample endpoint
app.post("/createUser", (req, res) => createUser(req, res, conn))
app.post("/createActivity", (req, res) => createActivity(req, res, conn))
app.post("/getActivity", (req, res) => getActivity(req, res, conn))
app.get("/createItinerary", (req, res) => createItinerary(req, res, conn))
app.get("/filterItinerary1", (req, res) => getItinerary1(req, res, conn))
app.get("/filterItinerary2", (req, res) => getItinerary2(req, res, conn))
app.patch("/updateItinerary", (req, res) => updateItinerary(req, res, conn))