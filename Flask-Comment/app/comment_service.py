from flask import jsonify, request
from app.models import db, Comment
from flask_jwt_extended import get_jwt_identity
from app.utils.jwt_helper import jwt_required_custom


class CommentService:
    @staticmethod
    def get_all_comments():  
        # Lấy tất cả bình luận
        comments = Comment.query.all()
        if not comments:
            return jsonify({"message": "Không có bình luận nào"}), 200
        return jsonify([{"id": c.id, "content": c.content, "member_id": c.member_id, "task_id": c.task_id} for c in comments])

    @staticmethod
    # @jwt_required_custom 
    
    def create_comment():
        # tạo một bình luận mới với user_id từ JWT
        data = request.get_json()

        # Lấy user_id từ JWT token
        # user_id = get_jwt_identity() ???????????????

        # Kiểm tra dữ liệu đầu vào (task_id & content bắt buộc)
        if not data.get("content") or not data.get("task_id"):
            return jsonify({"error": "Thiếu dữ liệu content hoặc task_id"}), 400

        new_comment = Comment(
            content=data["content"],
            member_id= None,  # Dùng user_id từ token  không biết làm microServive 
            task_id=data["task_id"],
            is_subtask=data.get("is_subtask", False)
        )

        try:
            db.session.add(new_comment)
            db.session.commit()
            # print(f"Bình luận mới được tạo bởi user {user_id}: {new_comment.id}")
            return jsonify({"message": "Bình luận đã được tạo", "id": new_comment.id}), 201
        except Exception as e:
            db.session.rollback()  
            print(f"Lỗi khi tạo bình luận: {e}")
            return jsonify({"error": "Lỗi server khi lưu bình luận"}), 500

    @staticmethod
    def get_comment_by_id(comment_id):
        """Lấy bình luận theo ID"""
        comment = Comment.query.get(comment_id)
        if not comment:
            return jsonify({"error": "Không tìm thấy bình luận"}), 404

        return jsonify({
            "id": comment.id,
            "content": comment.content,
            "member_id": comment.member_id,
            "task_id": comment.task_id,
            "is_subtask": comment.is_subtask
        })

    
    @staticmethod
    # @jwt_required_custom  
    def update_comment(comment_id):
        # Chỉnh sửa nội dung bình luận
        comment = Comment.query.get(comment_id)
        # user_id = get_jwt_identity()
        if not comment:
            return jsonify({"error": "Không tìm thấy bình luận"}), 404
        # Kiểm tra quyền sửa (chỉ chủ sở hữu mới được sửa)
        # if comment.member_id != user_id:
        #     return jsonify({"error": "Bạn không có quyền sửa bình luận này"}), 403

        data = request.get_json()
        if not data.get("content"):
            return jsonify({"error": "Thiếu nội dung mới"}), 400
        comment.content = data["content"]
        try:
            db.session.commit()
            # print(f" Bình luận {comment_id} đã được sửa bởi user {user_id}")
            return jsonify({"message": "Bình luận đã được cập nhật", "id": comment.id}), 200
        except Exception as e:
            db.session.rollback()
            print(f"Lỗi khi cập nhật bình luận {comment_id}: {e}")
            return jsonify({"error": "Lỗi server khi cập nhật bình luận"}), 500
        
    @staticmethod
    # @jwt_required_custom  
    def delete_comment(comment_id):
        comment = Comment.query.get(comment_id)
        # user_id = get_jwt_identity() 

        if not comment:
            return jsonify({"error": "Không tìm thấy bình luận"}), 404

        # chỉ chủ sở hữu bình luận mới được xóa
        # if comment.member_id != user_id:
        #     return jsonify({"error": "Bạn không có quyền xóa bình luận này"}), 403
        try:
            db.session.delete(comment)
            db.session.commit()
            return jsonify({"message": "Bình luận đã bị xóa"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Lỗi server khi xóa bình luận", "detail": str(e)}), 500