import  pool  from "../config/db.js";

// Thêm phân công cho task
export const createTaskAssignment = async (taskId, memberId) => {
  const result = await pool.query(
    'INSERT INTO task_assignments (task_id, member_id) VALUES ($1, $2) RETURNING *',
    [taskId, memberId]
  );
  return result.rows[0];
};

// Lấy danh sách phân công cho task
export const getTaskAssignments = async (taskId) => {
  const result = await pool.query(
    'SELECT * FROM task_assignments WHERE task_id = $1',
    [taskId]
  );
  return result.rows;
};

// Thêm phân công cho subtask
export const createSubtaskAssignment = async (subtaskId, memberId) => {
  const result = await pool.query(
    'INSERT INTO subtask_assignments (subtask_id, member_id) VALUES ($1, $2) RETURNING *',
    [subtaskId, memberId]
  );
  return result.rows[0];
};

// Lấy danh sách phân công cho subtask
export const getSubtaskAssignments = async (subtaskId) => {
  const result = await pool.query(
    'SELECT * FROM subtask_assignments WHERE subtask_id = $1',
    [subtaskId]
  );
  return result.rows;
};

// Cập nhật phân công cho task
export const updateTaskAssignment = async (assignmentId, memberId) => {
  const result = await pool.query(
    'UPDATE task_assignments SET member_id = $1 WHERE id = $2 RETURNING *',
    [memberId, assignmentId]
  );
  return result.rows[0];
};

// Cập nhật phân công cho subtask
export const updateSubtaskAssignment = async (assignmentId, memberId) => {
  const result = await pool.query(
    'UPDATE subtask_assignments SET member_id = $1 WHERE id = $2 RETURNING *',
    [memberId, assignmentId]
  );
  return result.rows[0];
};

// Xóa phân công cho task
export const deleteTaskAssignment = async (assignmentId) => {
  const result = await pool.query(
    'DELETE FROM task_assignments WHERE id = $1 RETURNING *',
    [assignmentId]
  );
  return result.rows[0];
};

// Xóa phân công cho subtask
export const deleteSubtaskAssignment = async (assignmentId) => {
  const result = await pool.query(
    'DELETE FROM subtask_assignments WHERE id = $1 RETURNING *',
    [assignmentId]
  );
  return result.rows[0];
};
