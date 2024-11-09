import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addAdmin,
  deleteEntity,
  changePassword,
  viewPendingAdvertisers,
  acceptAdvertiser,
  rejectAdvertiser,
  viewPendingTourGuides,
  acceptTourGuide,
  rejectTourGuide,
  viewPendingSellers,
  acceptSeller,
  rejectSeller,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", addAdmin);
router.delete("/:entityType/:id", deleteEntity);
router.put("/changePassword", verifyToken, changePassword);
router.get("/viewPendingAdvertisers", verifyToken, viewPendingAdvertisers);
router.put("/acceptAdvertiser/:_id", verifyToken, acceptAdvertiser);
router.put("/rejectAdvertiser/:_id", verifyToken, rejectAdvertiser);
router.get("/viewPendingTourGuides", verifyToken, viewPendingTourGuides);
router.put("/acceptTourGuide/:_id", verifyToken, acceptTourGuide);
router.put("/rejectTourGuide/:_id", verifyToken, rejectTourGuide);
router.get("/viewPendingSellers", verifyToken, viewPendingSellers);
router.put("/acceptSeller/:_id", verifyToken, acceptSeller);
router.put("/rejectSeller/:_id", verifyToken, rejectSeller);
export default router;
