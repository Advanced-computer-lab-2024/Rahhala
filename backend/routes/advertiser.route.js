import express from "express";
import {
  editAdvertiser,
  getAdvertiserByID,
} from "../controllers/advertiser.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.put("/:id", verifyToken, editAdvertiser);
router.get("/:id", verifyToken, getAdvertiserByID);

export default router;
