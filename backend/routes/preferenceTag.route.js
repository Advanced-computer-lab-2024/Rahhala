import express from "express";
import {

createTag,
getTags,
getTagById,
updateTag,
deleteTag,
} from "../controllers/preferenceTag.controller.js";

const router = express.Router();

// Define routes
router.post("/", createTag);
router.get("/", getTags);
router.get("/:id", getTagById);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

export default router;