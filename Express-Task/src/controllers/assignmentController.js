import * as assignmentModel from "../models/assignmentModel.js";
import pool from "../config/db.js";

// Tạo phân công cho task

export const assignTask = async (req, res) => {
  const { taskId } = req.params;
  const { memberIds } = req.body;

  if (!Array.isArray(memberIds) || memberIds.length === 0) {
    return res
      .status(400)
      .json({ message: "Danh sách memberIds không hợp lệ" });
  }

  try {
    const existingAssignments = await pool.query(
      "SELECT member_id FROM task_assignments WHERE task_id = $1 AND member_id = ANY($2)",
      [taskId, memberIds]
    );

    // Lọc ra các member chưa được gán
    const existingMemberIds = existingAssignments.rows.map(
      (row) => row.member_id
    );
    const newMemberIds = memberIds.filter(
      (id) => !existingMemberIds.includes(id)
    );

    if (newMemberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Tất cả thành viên này đã được gán vào task này." });
    }

    // Chuẩn bị giá trị để INSERT nhiều bản ghi cùng lúc
    const values = newMemberIds
      .map((memberId, index) => `($1, $${index + 2})`)
      .join(",");
    const query = `INSERT INTO task_assignments (task_id, member_id) VALUES ${values} RETURNING *`;
    const params = [taskId, ...newMemberIds];

    // Thực thi câu lệnh INSERT
    const { rows } = await pool.query(query, params);

    return res.status(201).json({
      message: "Phân công thành công",
      assignments: rows,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi khi phân công thành viên", error: error.message });
  }
};

// Lấy phân công cho task
export const getTaskAssignments = async (req, res, next) => {
  const { taskId } = req.params;

  try {
    // Lấy phân công cho task
    const assignments = await assignmentModel.getTaskAssignments(taskId);
    if (assignments.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có phân công cho task này." });
    }
    return res.status(200).json(assignments);
  } catch (error) {
    next(error);
  }
};
// Xóa thành viên khỏi Task Assignment
export const removeMemberFromTask = async (req, res) => {
  const { taskId, memberId } = req.params;

  try {
    // Kiểm tra task assignment có tồn tại không
    const assignment = await pool.query(
      "SELECT * FROM task_assignments WHERE task_id = $1 AND member_id = $2",
      [taskId, memberId]
    );

    if (assignment.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phân công này." });
    }

    // Xóa assignment
    await pool.query(
      "DELETE FROM task_assignments WHERE task_id = $1 AND member_id = $2",
      [taskId, memberId]
    );

    return res
      .status(200)
      .json({ message: "Xóa thành viên khỏi task thành công." });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Lỗi khi xóa thành viên khỏi task",
        error: error.message,
      });
  }
};

export const assignTaskMembersToSubtask = async (req, res) => {
  try {
    const { subtaskId, taskId } = req.params;
    const { memberIds } = req.body;

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ message: "Danh sách memberIds không hợp lệ." });
    }

    // Kiểm tra subtask có tồn tại không
    const subtaskExists = await pool.query(
      "SELECT id FROM subtask WHERE id = $1",
      [subtaskId]
    );
    if (subtaskExists.rows.length === 0) {
      return res.status(400).json({ message: "Subtask không tồn tại." });
    }

    const assignments = await assignmentModel.assignTaskMembersToSubtask(
      subtaskId,
      taskId,
      memberIds
    );

    res.status(201).json({
      message: "Gán thành viên vào Subtask thành công",
      assignedMembers: assignments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi gán thành viên vào subtask",
      error: error.message,
    });
  }
};


// Lấy danh sách thành viên được gán vào Subtask
export const getSubtaskAssignments = async (req, res) => {
  try {
    const { subtaskId } = req.params;
    const assignments = await assignmentModel.getSubtaskAssignments(subtaskId);
    res.status(200).json(assignments);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách phân công",
        error: error.message,
      });
  }
};

// Xóa một thành viên khỏi Subtask
export const removeTaskMembersFromSubtask = async (req, res) => {
  try {
    const { subtaskId } = req.params;
    const { memberIds } = req.body;

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ message: "Danh sách memberIds không hợp lệ." });
    }

    // Kiểm tra subtask có tồn tại không
    const subtaskExists = await pool.query(
      "SELECT id FROM subtask WHERE id = $1",
      [subtaskId]
    );
    if (subtaskExists.rows.length === 0) {
      return res.status(400).json({ message: "Subtask không tồn tại." });
    }

    const removedAssignments = await assignmentModel.removeMembersFromSubtask(subtaskId, memberIds);

    if (removedAssignments.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy thành viên trong subtask." });
    }

    res.status(200).json({
      message: "Xóa thành viên khỏi subtask thành công",
      removedMembers: removedAssignments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa thành viên khỏi subtask",
      error: error.message,
    });
  }
};

// Cập nhật phân công cho task
// export const updateTaskAssignment = async (req, res, next) => {
//   const { assignmentId } = req.params;
//   const { memberId } = req.body;

//   try {
//     // Cập nhật phân công cho task
//     const assignment = await assignmentModel.updateTaskAssignment(assignmentId, memberId);
//     return res.status(200).json({ message: "Cập nhật phân công thành công", assignment });
//   } catch (error) {
//     next(error);
//   }
// };

// Cập nhật phân công cho subtask
// export const updateSubtaskAssignment = async (req, res, next) => {
//   const { assignmentId } = req.params;
//   const { memberId } = req.body;

//   try {
//     // Cập nhật phân công cho subtask
//     const assignment = await assignmentModel.updateSubtaskAssignment(assignmentId, memberId);
//     return res.status(200).json({ message: "Cập nhật phân công thành công", assignment });
//   } catch (error) {
//     next(error);
//   }
// };

// Xóa phân công cho task
export const deleteTaskAssignment = async (req, res, next) => {
  const { assignmentTaskId } = req.params;

  try {
    // Xóa phân công cho task
    const assignment = await assignmentModel.deleteTaskAssignment(assignmentTaskId);
    return res
      .status(200)
      .json({ message: "Xóa phân công thành công", assignment });
  } catch (error) {
    next(error);
  }
};

// Xóa phân công cho subtask
export const deleteSubtaskAssignment = async (req, res, next) => {
  const { assignmentId } = req.params;

  try {
    // Xóa phân công cho subtask
    const assignment = await assignmentModel.deleteSubtaskAssignment(
      assignmentId
    );
    return res
      .status(200)
      .json({ message: "Xóa phân công thành công", assignment });
  } catch (error) {
    next(error);
  }
};
