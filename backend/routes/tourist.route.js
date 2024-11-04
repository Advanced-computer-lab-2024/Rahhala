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
router.post("/profile/request-delete", authenticate, requestAccountDeletion);
router.post("/complaints", authenticate, fileComplaint);
router.get("/viewComplaints", authenticate, getComplaints);
export default router;
