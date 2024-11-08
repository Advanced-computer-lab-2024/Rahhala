import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { 
    editSeller,
    getSeller,
    changePassword,
    submitDocuments, } from "../controllers/seller.controller.js";

const router = express.Router();

router.put("/edit", verifyToken, editSeller);
router.get("/", verifyToken, getSeller);
router.put("/changePassword", verifyToken, changePassword);
router.post("/submitDocuments", verifyToken, submitDocuments);


export default router;
