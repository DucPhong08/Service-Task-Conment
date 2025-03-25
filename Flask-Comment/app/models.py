from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    member_id = db.Column(db.Integer, nullable=False)
    task_id = db.Column(db.Integer, nullable=False)
    is_subtask = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

    def __init__(self, content, member_id, task_id, is_subtask=False):
        self.content = content
        self.member_id = member_id
        self.task_id = task_id
        self.is_subtask = is_subtask
