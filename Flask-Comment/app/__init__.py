from flask import Flask
from flask_jwt_extended import JWTManager
from app.models import db 
from config import Config
from app.comment_routes import comment_bp

jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(comment_bp, url_prefix="/comments")
    
    
    with app.app_context():
        try:
            conn = db.engine.connect()
            conn.close()
            print(" Kết nối database thành công!")  
        except Exception as e:
            print(f" Lỗi kết nối database: {e}")
    return app
