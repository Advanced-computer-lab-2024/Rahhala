import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  editTourGuide,
  getTourGuideByID,
  changePassword,
  submitDocuments,
  getDocuments // Add this import
} from "../controllers/tourGuide.controller.js";

const router = express.Router();

router.put("/:id", verifyToken, editTourGuide);
router.get("/:id", verifyToken, getTourGuideByID);
router.put("/changePassword", verifyToken, changePassword);
router.post("/submitDocuments", verifyToken, submitDocuments);
router.get("/documents", verifyToken, getDocuments); // Add this route

export default router;