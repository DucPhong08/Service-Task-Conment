import * as assignmentModel from "../models/assignmentModel.js";

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
    const assignments = [];
    for (const memberId of memberIds) {
      // Kiểm tra xem thành viên đã được phân công chưa
      const existingAssignment = await pool.query(
        "SELECT * FROM task_assignments WHERE task_id = $1 AND member_id = $2",
        [taskId, memberId]
      );

      if (existingAssignment.rows.length > 0) {
        return res
          .status(400)
          .json({
            message: `Thành viên với ID ${memberIds.join(
              ", "
            )} đã được phân công vào task này`,
          });
      }

      // Nếu chưa, tạo phân công mới
      const assignment = await assignmentModel.createTaskAssignment({
        task_id: taskId,
        member_id: memberId,
      });
      assignments.push(assignment);
    }

    return res.status(201).json({
      message: "Phân công thành công",
      assignments,
    });
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Lỗi khi phân công thành viên", error: e.message });
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

// Tạo phân công cho subtask
export const assignSubtask = async (req, res, next) => {
  const { subtaskId } = req.params;
  const { memberId } = req.body;

  if (!Array.isArray(memberIds) || memberIds.length === 0) {
    return res
      .status(400)
      .json({ message: "Danh sách memberIds không hợp lệ" });
  }

  try {
    const assignments = [];
    for (const memberId of memberIds) {
      // Kiểm tra xem thành viên đã được phân công chưa
      const existingAssignment = await pool.query(
        "SELECT * FROM subtask_assignments WHERE subtask_id = $1 AND member_id = $2",
        [subtaskId, memberId]
      );

      if (existingAssignment.rows.length > 0) {
        return res
          .status(400)
          .json({
            message: `Thành viên với ID ${memberIds.join(
              ", "
            )} đã được phân công vào subtask này`,
          });
      }

      // Nếu chưa, tạo phân công mới
      const assignment = await assignmentModel.createSubtaskAssignment({
        subtask_id: subtaskId,
        member_id: memberId,
      });
      assignments.push(assignment);
    }

    return res.status(201).json({
      message: "Phân công thành công",
      assignments,
    });
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Lỗi khi phân công thành viên", error: e.message });
  }
};

// Lấy phân công cho subtask
export const getSubtaskAssignments = async (req, res, next) => {
  const { subtaskId } = req.params;

  try {
    // Lấy phân công cho subtask
    const assignments = await assignmentModel.getSubtaskAssignments(subtaskId);
    if (assignments.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có phân công cho subtask này." });
    }
    return res.status(200).json(assignments);
  } catch (error) {
    next(error);
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
  const { assignmentId } = req.params;

  try {
    // Xóa phân công cho task
    const assignment = await assignmentModel.deleteTaskAssignment(assignmentId);
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
