import pool from "../config/db.js";

// Tạo Subtask
export const createSubtask = async (name, task_id, description, date) => {
    const query = `
        INSERT INTO subtask (name, task_id, description, date)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [name, task_id, description, date];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

// Lấy danh sách tất cả Subtasks
export const getAllSubtasks = async () => {
    const query = "SELECT * FROM subtask;";
    const { rows } = await pool.query(query);
    return rows;
};

// Lấy Subtask theo ID
export const getSubtaskById = async (id) => {
    const query = "SELECT * FROM subtask WHERE id = $1;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

// Cập nhật Subtask
export const updateSubtask = async (id, name, task_id, description, date) => {
    const query = `
        UPDATE subtask 
        SET name = $1, task_id = $2, description = $3, date = $4
        WHERE id = $5 RETURNING *;
    `;
    const values = [name, task_id, description, date, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

// Xóa Subtask
export const deleteSubtask = async (id) => {
    const query = "DELETE FROM subtask WHERE id = $1 RETURNING *;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};
