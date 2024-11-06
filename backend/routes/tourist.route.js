import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getTouristByID,
  editTourist,
  getTourists,
  getTouristByEmail,
  requestAccountDeletion,
  fileComplaint,
  getComplaints,
  bookItinerary,
  changePassword,
  setTripPreferences
} from "../controllers/tourist.controller.js";

const router = express.Router();

router.get("/:id", verifyToken, getTouristByID);
router.put("/:id", verifyToken, editTourist);
router.get("/", getTourists);
router.get("/", getTouristByEmail);
router.post("/profile/request-delete", verifyToken, requestAccountDeletion);
router.post("/complaints", verifyToken, fileComplaint);
router.get("/viewComplaints", verifyToken, getComplaints);
router.post("/bookItinerary", verifyToken, bookItinerary);
router.put("/changePassword", verifyToken, changePassword);
router.post("/preferences", verifyToken, setTripPreferences);
export default router;
