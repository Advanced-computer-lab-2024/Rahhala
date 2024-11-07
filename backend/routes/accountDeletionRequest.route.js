import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
    createAccountDeletionRequest,
    getAllAccountDeletionRequests,
    getAccountDeletionRequestById,
    updateAccountDeletionRequestById,
    deleteAccountDeletionRequestById,
} from "../controllers/accountDeletionRequest.controller.js";

const router = express.Router();

router.post("/", verifyToken, createAccountDeletionRequest);
router.get("/", verifyToken, getAllAccountDeletionRequests);
router.get("/:id", verifyToken, getAccountDeletionRequestById);
router.put("/:id", verifyToken, updateAccountDeletionRequestById);
router.delete("/:id", verifyToken, deleteAccountDeletionRequestById);

export default router;