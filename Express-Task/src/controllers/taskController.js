import * as Task from "../models/taskModel.js";
import pool from "../config/db.js";

export const createTask = async (req, res) => {
  const { name, description,  project_section_id,author, date } = req.body;

  // Kiểm tra nếu các trường cần thiết chưa được cung cấp
  if (!name || !project_section_id || !date) {
    return res.status(400).json({ message: "Tất cả các trường name, project_section_id, date là bắt buộc." });
  }

  try {
    // Kiểm tra xem task đã tồn tại chưa ???
    const existingTask = await pool.query(
      "SELECT * FROM task WHERE name = $1  AND project_section_id = $2",
      [name, project_section_id]
    );

    if (existingTask.rows.length > 0) {
      return res.status(400).json({ message: "Task này đã tồn tại cùng project section." });
    }

    // Nếu chưa tồn tại, tạo task mới
    const task = await Task.createTask(name, description, project_section_id,author, date);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tạo task", message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  const {  project_section_id } = req.params;
  try {
    const tasks = await Task.getAllTasks(project_section_id);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách task" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task không tồn tại" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { name, description, member_id, project_section_id, date } = req.body;
    const task = await Task.updateTask(req.params.id, name, description, member_id, project_section_id, date);
    if (!task) return res.status(404).json({ error: "Task không tồn tại" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.deleteTask(req.params.id);
    if (!task) return res.status(404).json({ error: "Task không tồn tại" });
    res.json({ message: "Task đã bị xóa" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa task" });
  }
};
