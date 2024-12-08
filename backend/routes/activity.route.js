import express from "express";
import activityModel from "../models/activity.model.js";
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
router.put("/:id", verifyToken, editActivity);
router.delete("/:id", deleteActivity);
router.get("/:id", verifyToken, getActivitiesByUserID);
router.get("/getActivity/:id", getActivityById);
router.put('/updateBookingOpen/:userId', async (req, res) => {
  try {
    console.log("entered updateBookingOpen");
      await activityModel.updateMany({ userId: req.params.userId }, { bookingOpen: false });
      res.status(200).json({ message: 'Activities updated successfully' });
  } catch (error) {
        console.error('Error updating activities:', error);
      res.status(500).json({ error: error.message });
  }
});
export default router;
