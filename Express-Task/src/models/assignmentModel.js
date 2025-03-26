import pool from "../config/db.js";

// Thêm phân công cho task
export const createTaskAssignment = async (taskId, memberId) => {
  const result = await pool.query(
    "INSERT INTO task_assignments (task_id, member_id) VALUES ($1, $2) RETURNING *",
    [taskId, memberId]
  );
  return result.rows[0];
};

// Lấy danh sách phân công cho task
export const getTaskAssignments = async (taskId) => {
  const result = await pool.query(
    "SELECT * FROM task_assignments WHERE task_id = $1",
    [taskId]
  );
  return result.rows;
};


export const assignTaskMembersToSubtask = async (subtask_id, task_id, memberIds) => {
  const query = `
    INSERT INTO subtask_assignments (subtask_id, member_id)
    SELECT $1, member_id FROM task_assignments 
    WHERE task_id = $2 
      AND member_id = ANY($3) 
      AND member_id NOT IN (
        SELECT member_id FROM subtask_assignments WHERE subtask_id = $1
      )
    RETURNING *;
  `;

  const values = [subtask_id, task_id, memberIds];
  const { rows } = await pool.query(query, values);

  return rows;
};
export const getSubtaskAssignments = async (subtask_id) => {
  const query = `
    SELECT sa.id, sa.subtask_id, sa.member_id, m.name AS member_name
    FROM subtask_assignments sa
    JOIN members m ON sa.member_id = m.id
    WHERE sa.subtask_id = $1;
  `;
  const { rows } = await pool.query(query, [subtask_id]);
  return rows;
};

// Xóa thành viên khỏi Subtask
export const removeMembersFromSubtask = async (subtask_id, memberIds) => {
  const query = `
    DELETE FROM subtask_assignments
    WHERE subtask_id = $1 AND member_id = ANY($2)
    RETURNING *;
  `;

  const values = [subtask_id, memberIds];
  const { rows } = await pool.query(query, values);

  return rows;
};

// Cập nhật phân công cho task
export const updateTaskAssignment = async (assignmentId, memberId) => {
  const result = await pool.query(
    "UPDATE task_assignments SET member_id = $1 WHERE id = $2 RETURNING *",
    [memberId, assignmentId]
  );
  return result.rows[0];
};

// Cập nhật phân công cho subtask
export const updateSubtaskAssignment = async (assignmentId, memberId) => {
  const result = await pool.query(
    "UPDATE subtask_assignments SET member_id = $1 WHERE id = $2 RETURNING *",
    [memberId, assignmentId]
  );
  return result.rows[0];
};

// Xóa phân công cho task
export const deleteTaskAssignment = async (task_id) => {
  const result = await pool.query(
    "DELETE FROM task_assignments WHERE task_id = $1 RETURNING *",
    [task_id]
  );
  return result.rows[0];
};

// Xóa phân công cho subtask
export const deleteSubtaskAssignment = async (assignmentSubtaskId) => {
  const result = await pool.query(
    "DELETE FROM subtask_assignments WHERE subtask_id = $1 RETURNING *",
    [assignmentSubtaskId]
  );
  return result.rows[0];
};
