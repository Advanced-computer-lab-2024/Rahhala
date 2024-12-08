import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  editTourGuide,
  getTourGuideByID,
  changePassword,
  submitDocuments,
  getDocuments, 
  registerTourGuide,
  acceptTerms, 
  getTourGuideByIDFromParams,
  loginTourGuide, 
  requestPasswordReset,
  verifyOTP,
  resetPassword,
  getNotifications
} from "../controllers/tourGuide.controller.js";

const router = express.Router();
router.post("/login", loginTourGuide);

router.put("/edit", verifyToken, editTourGuide);
router.get("/", verifyToken, getTourGuideByID);
router.put("/edit/changePassword", verifyToken, changePassword);
router.post("/submitDocuments", verifyToken, submitDocuments);
router.get("/documents", verifyToken, getDocuments); // Add this route
router.post("/register", registerTourGuide);
router.put("/acceptTerms", verifyToken, acceptTerms); // Route to accept terms and conditions
//router.get("/:id", getTourGuideByIDFromParams);
router.get("/notifications", verifyToken, getNotifications); // Route to accept terms and conditions

router.post('/requestPasswordReset', requestPasswordReset);
router.post('/verifyOTP', verifyOTP);
router.post('/resetPassword', resetPassword);

export default router;
