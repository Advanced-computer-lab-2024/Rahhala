// configure reading from .env
import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import controllers from './controllers/controllerIndex.js';
import { verifyToken } from './middleware/auth.js';
dotenv.config({path: "../.env"});
const port = process.env.PORT //getting port from .env


// connect to MongoDB server
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


// new express app
const app = express() // express app init
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // If you are using cookies
}));


// listen for requests
app.listen(port,() => {
    console.log('listening on port', port)
})

// endpoints
app.patch("/updateAdvertiser", verifyToken, controllers.advertiserController.updateAdvertiser);
app.get("/advertiserAccount", verifyToken, controllers.advertiserController.getAdvertiserById);
app.patch("/updateTourGuide", verifyToken, controllers.tourGuideController.updateTourGuide);
app.get("/tourguideAccount", verifyToken, controllers.tourGuideController.getTourGuideById);
app.post("/createActivity", controllers.activityController.createActivity);
app.get("/museums", controllers.museumController.getAllMuseums);
app.get("/activities", controllers.activityController.getActivities);
app.get("/viewAll", controllers.touristController.getAll)
app.patch("/updateTourist", verifyToken, controllers.touristController.updateTourist);
app.get("/touristAccount",verifyToken , controllers.touristController.getTouristById);
app.post("/createMuseum", controllers.museumController.createMuseum);
app.get("/getMuseum/:id", controllers.museumController.getMuseumsByUserID);
app.patch("/updateMuseum/:id", controllers.museumController.updateMuseum);
app.delete("/deleteMuseum/:id", controllers.museumController.deleteMuseum);
app.post('/createItinerary', verifyToken, controllers.itineraryController.createItinerary);  
app.get('/getItineraries', controllers.itineraryController.getAllItineraries);
app.get('/getItineraries/:id', controllers.itineraryController.getItineraryById);
app.patch('/updateItineraries/:id', controllers.itineraryController.updateItinerary);
app.patch('/updateItinerariesName/:name', controllers.itineraryController.updateItineraryByName);
app.delete('/deleteItineraries/:id', controllers.itineraryController.deleteItinerary);
app.delete('/deleteItineraryByName/:name', controllers.itineraryController.deleteItineraryByName);
app.post('/register', controllers.authController.register);
app.post('/login', controllers.authController.login);