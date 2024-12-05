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
  flagItinerary,
  unflagItinerary,
} from "../controllers/itinerary.controller.js";

const router = express.Router();

// Define routes
router.post("/", verifyToken, addItinerary);
router.get("/", getItineraries);
router.get("/id/:id", getItineraryByID);
router.get("/user", verifyToken, getItinerariesByUserID);
router.put("/name/:name", editItineraryByName);
router.delete("/name/:name", deleteItineraryByName);
router.put("/deactivate/:id", verifyToken, deactivateItinerary);
router.put("/activate/:id", verifyToken, activateItinerary);
router.delete("/delete/:id", deleteItinerary);
router.put("/update/:id", editItinerary);
router.post("/review/:id", verifyToken, addReview);
router.put('/flag/:id', verifyToken, flagItinerary);
router.put('/unflag/:id', verifyToken, unflagItinerary);
router.put('/updateIsActive/:userId', async (req, res) => {
  try {
      await itineraryModel.updateMany({ userId: req.params.userId }, { isActive: false });
      res.status(200).json({ message: 'Itineraries updated successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
export default router;
