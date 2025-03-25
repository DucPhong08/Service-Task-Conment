import express from "express";
import { 
  assignTask, getTaskAssignments, 
  assignSubtask, getSubtaskAssignments,
//   updateTaskAssignment, updateSubtaskAssignment,
  deleteTaskAssignment, deleteSubtaskAssignment 
} from "../controllers/assignmentController.js";

const router = express.Router();

// Routes cho Task Assignment
router.post("/tasks/:taskId/assignments", assignTask);
router.get("/tasks/:taskId/assignments", getTaskAssignments);
// router.put("/tasks/assignments/:assignmentId", updateTaskAssignment);
router.delete("/tasks/assignments/:assignmentId", deleteTaskAssignment);

// Routes cho Subtask Assignment
router.post("/subtasks/:subtaskId/assignments", assignSubtask);
router.get("/subtasks/:subtaskId/assignments", getSubtaskAssignments);
// router.put("/subtasks/assignments/:assignmentId", updateSubtaskAssignment);
router.delete("/subtasks/assignments/:assignmentId", deleteSubtaskAssignment);

export default router;
