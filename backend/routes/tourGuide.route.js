import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  editTourGuide,
  getTourGuideByID,
} from "../controllers/tourGuide.controller.js";

const router = express.Router();

router.put("/:id", verifyToken, editTourGuide);
router.get("/:id", verifyToken, getTourGuideByID);

export default router;