import express from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  editAdvertiser,
  getAdvertiserByID,
  changePassword,
  submitDocuments,
} from "../controllers/advertiser.controller.js";

const router = express.Router();

router.put("/:id", verifyToken, editAdvertiser);
router.get("/:id", verifyToken, getAdvertiserByID);
router.put("/changePassword", verifyToken, changePassword);
router.post("/submitDocuments", verifyToken, submitDocuments);
export default router;
