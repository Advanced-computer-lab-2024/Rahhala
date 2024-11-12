import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintsByUserId,
  filterComplaintsByStatus,
  markComplaintResolved,
} from "../controllers/complaint.controller.js";

const router = express.Router();

router.post("/", verifyToken, createComplaint);
router.get("/", getAllComplaints);
router.get("/get/:id", verifyToken, getComplaintById);
router.put("/:id", verifyToken, updateComplaint);
router.delete("/:id", verifyToken, deleteComplaint);
router.get("/user", verifyToken, getComplaintsByUserId);
router.get("/status", verifyToken, filterComplaintsByStatus);
router.put("/markResolved/:id", verifyToken, markComplaintResolved);
export default router;
