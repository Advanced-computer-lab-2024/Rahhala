import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addAdmin,
  deleteEntity,
  changePassword,
  viewPendingAdvertisers,
  acceptAdvertiser,
  rejectAdvertiser,
  viewPendingSellers,
  acceptSeller,
  rejectSeller,
  viewPendingTourGuides,
  acceptTourGuide,
  rejectTourGuide,
  viewUsersInfo, 
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", verifyToken, addAdmin);
router.delete("/:entityType/:id", verifyToken, deleteEntity);
router.put("/changePassword", verifyToken, changePassword);
router.get("/pendingAdvertisers", verifyToken, viewPendingAdvertisers);
router.put("/acceptAdvertiser/:_id", verifyToken, acceptAdvertiser);
router.put("/rejectAdvertiser/:_id", verifyToken, rejectAdvertiser);
router.get("/pendingSellers", verifyToken, viewPendingSellers);
router.put("/acceptSeller/:_id", verifyToken, acceptSeller);
router.put("/rejectSeller/:_id", verifyToken, rejectSeller);
router.get("/pendingTourGuides", verifyToken, viewPendingTourGuides);
router.put("/acceptTourGuide/:_id", verifyToken, acceptTourGuide);
router.put("/rejectTourGuide/:_id", verifyToken, rejectTourGuide);
router.get("/viewUsersInfo", verifyToken, viewUsersInfo);


export default router;