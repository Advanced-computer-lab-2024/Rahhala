import express from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  editAdvertiser,
  getAdvertiserByID,
  changePassword,
  submitDocuments,
  getDocuments // Add this import
} from "../controllers/advertiser.controller.js";

const router = express.Router();

router.put("/:id", verifyToken, editAdvertiser);
router.get("/:id", verifyToken, getAdvertiserByID);
router.put("/changePassword", verifyToken, changePassword);
router.post("/submitDocuments", verifyToken, submitDocuments);
router.get("/documents", verifyToken, getDocuments); // Add this route

export default router;