import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { 
    addAdmin, 
    deleteEntity,
    changePassword,
     } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/", addAdmin);
router.delete("/:id/:entityType", deleteEntity);
router.put("/changePassword", verifyToken, changePassword);
export default router;
