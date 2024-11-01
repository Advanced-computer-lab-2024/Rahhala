import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addItinerary,
  getItineraries,
  getItineraryByID,
  getItinerariesByUserID,
  editItineraryByName,
  deleteItineraryByName,
  deleteItinerary,
  editItinerary,
} from "../controllers/itinerary.controller.js";

const router = express.Router();

// Define routes
router.post("/", verifyToken, addItinerary);
router.get("/", getItineraries);
router.get("/:id", getItineraryByID);
router.get("/user/:userID", getItinerariesByUserID);
router.put("/:name", editItineraryByName);
router.delete("/:name", deleteItineraryByName);
router.delete("/", deleteItinerary);
router.put("/", editItinerary);

export default router;
