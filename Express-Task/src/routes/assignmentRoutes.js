import express from "express";
import {
  assignTask,
  getTaskAssignments,
  //   updateTaskAssignment, updateSubtaskAssignment,
  deleteTaskAssignment,
  removeMemberFromTask,
  assignTaskMembersToSubtask,
  getSubtaskAssignments,
  removeTaskMembersFromSubtask,
} from "../controllers/assignmentController.js";

const router = express.Router();

// Routes cho Task Assignment
router.post("/tasks/:taskId/assignments", assignTask);
router.get("/tasks/:taskId/assignments", getTaskAssignments);
// router.put("/tasks/assignments/:assignmentId", updateTaskAssignment);
router.delete("/tasks/assignments/:assignmentTaskId", deleteTaskAssignment);
router.delete("/tasks/:taskId/members/:memberId", removeMemberFromTask);

// Routes cho Subtask Assignment
router.post(
  "/subtasks/:subtaskId/assignments/:taskId",
  assignTaskMembersToSubtask
);
router.get("/subtasks/:subtaskId/assignments", getSubtaskAssignments);
router.delete(
  "/subtasks/:subtaskId/remove-members",
  removeTaskMembersFromSubtask
);
router.delete("/subtasks/assignments/:assignmentSubtaskId", deleteTaskAssignment);


export default router;
