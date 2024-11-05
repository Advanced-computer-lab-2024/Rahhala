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
  activateItinerary,
  deactivateItinerary,
  addReview,
} from "../controllers/itinerary.controller.js";

const router = express.Router();

// Define routes
router.post("/", verifyToken, addItinerary);
router.get("/", getItineraries);
router.get("/:id", getItineraryByID);
router.get("/user/:userID", getItinerariesByUserID);
router.put("/:name", editItineraryByName);
router.delete("/:name", deleteItineraryByName);
router.put("/deactivate/:id", verifyToken, deactivateItinerary);
router.put("/activate/:id", verifyToken, activateItinerary);
router.delete("/", deleteItinerary);
router.put("/", editItinerary);
router.post("/review/:id", verifyToken, addReview);

export default router;
