import pool from "../config/db.js";

const createTaskTable = async () => {
  const queryText = `
    -- Tạo bảng Project Section
    CREATE TABLE IF NOT EXISTS project_section (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

    -- Tạo bảng Members (thành viên)
    CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
    );

    -- Tạo bảng Task
    CREATE TABLE IF NOT EXISTS task (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        member_id INT,
        project_section_id INT NOT NULL,
        author VARCHAR(255) NOT NULL DEFAULT 'System', 
        date DATE, 
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL, -- Khi xóa member, task vẫn giữ nguyên
        FOREIGN KEY (project_section_id) REFERENCES project_section(id) ON DELETE CASCADE -- Khi xóa project_section, task cũng bị xóa
    );

    -- Tạo bảng Task Assignments (phân công công việc)
    CREATE TABLE IF NOT EXISTS task_assignments (
        id SERIAL PRIMARY KEY,
        task_id INT NOT NULL,
        member_id INT NOT NULL,
        FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE, -- Khi xóa task, tự động xóa phân công
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE -- Khi xóa member, tự động xóa phân công
    );

    -- Tạo bảng Subtask (công việc con)
    CREATE TABLE IF NOT EXISTS subtask (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        task_id INT NOT NULL,
        description TEXT,
        date DATE,
        FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE -- Khi xóa task, tự động xóa subtask
    );

    -- Tạo bảng Subtask Assignments (phân công công việc con)
    CREATE TABLE IF NOT EXISTS subtask_assignments (
        id SERIAL PRIMARY KEY,
        subtask_id INT NOT NULL,
        member_id INT NOT NULL,
        FOREIGN KEY (subtask_id) REFERENCES subtask(id) ON DELETE CASCADE, -- Khi xóa subtask, tự động xóa phân công
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE -- Khi xóa member, tự động xóa phân công
    );

    -- Chỉ mục tối ưu truy vấn
    CREATE INDEX IF NOT EXISTS idx_task_member ON task(member_id);
    CREATE INDEX IF NOT EXISTS idx_subtask_task ON subtask(task_id);

  `;

  try {
    await pool.query(queryText);
    console.log("Bảng Task đã được tạo.");
  } catch (e) {
    console.error("Lỗi khi tạo bảng task:", e);
  }
};

const createTrigger = async () => {
  const triggerFunction = `
    CREATE OR REPLACE FUNCTION check_subtask_date()
    RETURNS TRIGGER AS $$
    DECLARE
        taskDate DATE;
    BEGIN
        -- Lấy ngày của Task cha
        SELECT date INTO taskDate FROM task WHERE id = NEW.task_id;

        -- Nếu Task không tồn tại, báo lỗi
        IF taskDate IS NULL THEN
            RAISE EXCEPTION 'Lỗi: task_id không tồn tại trong bảng task';
        END IF;

        -- Nếu ngày của Subtask lớn hơn ngày của Task cha, báo lỗi
        IF NEW.date > taskDate THEN
            RAISE EXCEPTION 'Lỗi: Ngày của subtask không được lớn hơn ngày của task cha';
        END IF;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;

  const triggerText = `
    DO $$ 
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'before_subtask_insert'
        ) THEN
            CREATE TRIGGER before_subtask_insert
            BEFORE INSERT ON subtask
            FOR EACH ROW
            EXECUTE FUNCTION check_subtask_date();
        END IF;
    END $$;
  `;

  try {
    await pool.query(triggerFunction);
    await pool.query(triggerText);
    console.log("Trigger đã được tạo thành công.");
  } catch (e) {
    console.error("Lỗi khi tạo trigger:", e);
  }
};

const setupDatabase = async () => {
  await createTaskTable();
  await createTrigger();
};

export default setupDatabase;
