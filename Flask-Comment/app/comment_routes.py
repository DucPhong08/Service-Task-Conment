from flask import Blueprint, request
from app.comment_service import CommentService

comment_bp = Blueprint("comments", __name__)

# Định nghĩa routes theo kiểu add_url_rule
comment_bp.add_url_rule("/", view_func=CommentService.get_all_comments, methods=["GET"])

comment_bp.add_url_rule("/", view_func=CommentService.create_comment, methods=["POST"])

comment_bp.add_url_rule(
    "/<comment_id>", view_func=CommentService.get_comment_by_id, methods=["GET"]
)

comment_bp.add_url_rule(
    "/<comment_id>", view_func=CommentService.delete_comment, methods=["DELETE"]
)
