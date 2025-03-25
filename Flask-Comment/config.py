import os

class Config :
    # Cấu hình Flask
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = FLASK_ENV == "development"
    
    # Cấu hình PostgreSQL
    DB_USER = "postgres"
    DB_PASSWORD = "123"
    DB_HOST = "localhost"
    DB_PORT = "5432"  
    DB_NAME = "postgres"

    SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Cấu hình JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
