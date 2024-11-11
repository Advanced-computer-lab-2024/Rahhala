import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getTouristByID,
  editTourist,
  getTourists,
  getTouristByEmail,
  requestAccountDeletion,
  getComplaints,
  bookItinerary,
  bookActivity,
  bookMuseum,
  cancelActivityBooking,
  cancelItineraryBooking,
  cancelMuseumBooking,
  changePassword,
  addReview,
  addMoneyToWallet,
  redeemLoyaltyPoints
} from "../controllers/tourist.controller.js";

const router = express.Router();

router.get("/", verifyToken, getTouristByID);
router.put("/edit/:id", verifyToken, editTourist);
router.get("/", getTourists);
router.get("/", getTouristByEmail);
router.post("/profile/request-delete", verifyToken, requestAccountDeletion);
router.get("/viewComplaints", verifyToken, getComplaints);
router.post("/bookItinerary", verifyToken, bookItinerary);
router.post("/bookActivity", verifyToken, bookActivity);
router.post("/bookMuseum", verifyToken, bookMuseum);
router.put("/cancelActivityBooking", verifyToken, cancelActivityBooking);
router.put("/cancelItineraryBooking", verifyToken, cancelItineraryBooking);
router.put("/cancelMuseumBooking", verifyToken, cancelMuseumBooking);
router.put("/changePassword", verifyToken, changePassword);
router.post('/reviews', verifyToken, addReview);
router.put('/addMoneyToWallet', verifyToken, addMoneyToWallet);
router.post('/redeemLoyaltyPoints', verifyToken, redeemLoyaltyPoints);
export default router;
