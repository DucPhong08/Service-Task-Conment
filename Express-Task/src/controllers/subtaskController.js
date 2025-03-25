import * as Subtask from "../models/subtaskModel.js";

export const createSubtask = async (req, res) => {
    const { name, task_id, description, date } = req.body;
  
    // Kiểm tra nếu name hoặc task_id không được cung cấp
    if (!name || !task_id) {
      return res.status(400).json({ message: "Tên subtask và task_id là bắt buộc." });
    }
  
    try {
      // Kiểm tra xem subtask đã tồn tại chưa ?????
      const existingSubtask = await pool.query(
        "SELECT * FROM subtask WHERE task_id = $1 AND name = $2",
        [task_id, name]
      );
  
      if (existingSubtask.rows.length > 0) {
        return res.status(400).json({ message: "Subtask này đã tồn tại trong task." });
      }
  
      // Nếu chưa tồn tại, tạo subtask mới
      const subtask = await Subtask.createSubtask(name, task_id, description, date);
      res.status(201).json(subtask);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tạo subtask" });
    }
  };

export const getAllSubtasks = async (req, res) => {
  try {
    const subtasks = await Subtask.getAllSubtasks();
    res.json(subtasks);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách subtask" });
  }
};

export const getSubtaskById = async (req, res) => {
  try {
    const subtask = await Subtask.getSubtaskById(req.params.id);
    if (!subtask) return res.status(404).json({ error: "Subtask không tồn tại" });
    res.json(subtask);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy subtask" });
  }
};

export const updateSubtask = async (req, res) => {
  try {
    const { name, task_id, description, date } = req.body;
    const subtask = await Subtask.updateSubtask(req.params.id, name, task_id, description, date);
    if (!subtask) return res.status(404).json({ error: "Subtask không tồn tại" });
    res.json(subtask);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật subtask" });
  }
};

export const deleteSubtask = async (req, res) => {
  try {
    const subtask = await Subtask.deleteSubtask(req.params.id);
    if (!subtask) return res.status(404).json({ error: "Subtask không tồn tại" });
    res.json({ message: "Subtask đã bị xóa" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa subtask" });
  }
};
