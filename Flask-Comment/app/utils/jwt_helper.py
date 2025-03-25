from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps

def jwt_required_custom(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()  # Lấy user ID từ token
            print(f"Xác thực thành công! User ID: {user_id}")
            return fn(*args, **kwargs)
        except Exception as e:
            print(f" Lỗi xác thực JWT: {e}")
            return jsonify({"message": "Unauthorized", "error": str(e)}), 401
    return wrapper
