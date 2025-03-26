import express from "express";
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from "../controllers/taskController.js";
// import verifyToken from "../middlewares/auth.middleware.js"; 

const router = express.Router();

router.post("/",createTask);
router.get("/project_section/:project_section_id", getAllTasks);
router.get("/:id",getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
