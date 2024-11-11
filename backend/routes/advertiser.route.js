import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  editAdvertiser,
  getAdvertiserByID,
  submitDocuments,
  getDocuments,
  registerAdvertiser,
  uploadMiddleware,
} from "../controllers/advertiser.controller.js";

const router = express.Router();

router.put("/:id", verifyToken, uploadMiddleware, editAdvertiser);
router.get("/:id", verifyToken, getAdvertiserByID);
router.post("/submitDocuments", verifyToken, submitDocuments);
router.get("/documents", verifyToken, getDocuments);
router.post("/register", registerAdvertiser);

export default router;