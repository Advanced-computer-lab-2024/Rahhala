import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {

createComplaint,
getAllComplaints,
getComplaintById,
updateComplaint,
deleteComplaint,
getComplaintsByUserId,
} from "../controllers/complaint.controller.js";

const router = express.Router();

router.post("/", verifyToken, createComplaint);
router.get("/", getAllComplaints);
router.get("/:id", verifyToken, getComplaintById);
router.put("/:id", verifyToken, updateComplaint);
router.delete("/:id", verifyToken, deleteComplaint);
router.get("/user", verifyToken, getComplaintsByUserId);

export default router;