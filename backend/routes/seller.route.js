import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  editSeller,
  getSeller,
  changePassword,
  submitDocuments,
  acceptTerms,
  getDocuments, // Add this import
  registerSeller,
} from "../controllers/seller.controller.js";

const router = express.Router();

router.put("/edit", verifyToken, editSeller);
router.get("/", verifyToken, getSeller);
router.put("/changePassword", verifyToken, changePassword);
router.post("/submitDocuments", verifyToken, submitDocuments);
router.put("/acceptTerms", verifyToken, acceptTerms);
router.get("/documents", verifyToken, getDocuments); // Add this route
router.post("/register", registerSeller);

export default router;
