import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addActivity,
  getActivities,
  editActivity,
  deleteActivity,
  getActivitiesByUserID,
  getActivityById
} from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/", verifyToken, addActivity);
router.post("/createActivity", addActivity);
router.get("/", getActivities);
router.put("/", verifyToken, editActivity);
router.delete("/", deleteActivity);
router.get("/:id", verifyToken, getActivitiesByUserID);
router.get("/getActivity/:id", getActivityById);

export default router;
