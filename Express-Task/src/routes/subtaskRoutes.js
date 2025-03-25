import express from "express";
import { createSubtask, getAllSubtasks, getSubtaskById, updateSubtask, deleteSubtask } from "../controllers/subtaskController.js";

const router = express.Router();

router.post("/", createSubtask);
router.get("/", getAllSubtasks);
router.get("/:id", getSubtaskById);
router.put("/:id", updateSubtask);
router.delete("/:id", deleteSubtask);

export default router;
