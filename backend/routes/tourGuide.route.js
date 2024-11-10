import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  editTourGuide,
  getTourGuideByID,
  changePassword,
  submitDocuments,
  getDocuments, // Add this import
  registerTourGuide,
} from "../controllers/tourGuide.controller.js";

const router = express.Router();

router.put("/edit", verifyToken, editTourGuide);
router.get("/", verifyToken, getTourGuideByID);
router.put("/edit/changePassword", verifyToken, changePassword);
router.post("/submitDocuments", verifyToken, submitDocuments);
router.get("/documents", verifyToken, getDocuments); // Add this route
router.post("/register", registerTourGuide);

export default router;
