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
router.delete("/:id/:entityType", deleteEntity);
router.put("/changePassword", verifyToken, changePassword);
router.get("/viewPendingAdvertisers", verifyToken, viewPendingAdvertisers);
router.put("/acceptAdvertiser/:id", verifyToken, acceptAdvertiser);
router.put("/rejectAdvertiser/:id", verifyToken, rejectAdvertiser);
router.get("/viewPendingTourGuides", verifyToken, viewPendingTourGuides);
router.put("/acceptTourGuide/:id", verifyToken, acceptTourGuide);
router.put("/rejectTourGuide/:id", verifyToken, rejectTourGuide);
router.get("/viewPendingSellers", verifyToken, viewPendingSellers);
router.put("/acceptSeller/:id", verifyToken, acceptSeller);
router.put("/rejectSeller/:id", verifyToken, rejectSeller);
export default router;
