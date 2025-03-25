import pool from "../config/db.js";

// Tạo Task
export const createTask = async (name, description, member_id,author, project_section_id,date) => {
    const query = `
        INSERT INTO task (name, description, member_id,author, project_section_id,date)
        VALUES ($1, $2, $3, $4, $5,$6) RETURNING *;
    `;
    const values = [name, description, member_id,author, project_section_id, date];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

// Lấy danh sách tất cả Tasks
export const getAllTasks = async () => {
    const query = "SELECT * FROM task;";
    const { rows } = await pool.query(query);
    return rows;
};

// Lấy Task theo ID
export const getTaskById = async (id) => {
    const query = "SELECT * FROM task WHERE id = $1;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

// Cập nhật Task
export const updateTask = async (id, name, description, member_id, project_section_id,date) => {
    const query = `
        UPDATE task 
        SET name = $1, description = $2, member_id = $3, project_section_id = $4 , date = $5
        WHERE id = $6 RETURNING *;
    `;
    const values = [name, description, member_id, project_section_id , date, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

// Xóa Task
export const deleteTask = async (id) => {
    const query = "DELETE FROM task WHERE id = $1 RETURNING *;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};
