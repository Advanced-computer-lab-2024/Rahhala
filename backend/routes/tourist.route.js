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
  changePassword,
  addReview,
} from "../controllers/tourist.controller.js";

const router = express.Router();

router.get("/", verifyToken, getTouristByID);
router.put("/:id", verifyToken, editTourist);
router.get("/", getTourists);
router.get("/", getTouristByEmail);
router.post("/profile/request-delete", verifyToken, requestAccountDeletion);
router.get("/viewComplaints", verifyToken, getComplaints);
router.post("/bookItinerary", verifyToken, bookItinerary);
router.put("/changePassword", verifyToken, changePassword);
router.post('/reviews', verifyToken, addReview);
export default router;
