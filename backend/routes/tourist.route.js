import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getTouristByID,
  editTourist,
  getTourists,
  getTouristByEmail,
} from "../controllers/tourist.controller.js";

const router = express.Router();

router.get("/:id", verifyToken, getTouristByID);
router.put("/:id", verifyToken, editTourist);
router.get("/", getTourists);
router.get("/", getTouristByEmail);

export default router;
