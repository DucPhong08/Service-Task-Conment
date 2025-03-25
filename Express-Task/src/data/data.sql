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
    member_id INT, --id người tạo ?????????
    project_section_id INT NOT NULL,
    date DATE, --thêm date deadline task
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
