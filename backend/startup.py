import sqlite3
from werkzeug.security import generate_password_hash
from config import db
from models import User
from backend.app import app

def init_db():
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username="admin").first():
            default_user = User(
                username="admin",
                password_hash=generate_password_hash("adminpass"),
                role="admin"
            )
            db.session.add(default_user)
            db.session.commit()
            print("Database initialized and default admin user created.")
        else:
            print("Database already initialized.")


def delete_user(username):
    with app.app_context():
        user = User.query.filter_by(username=username).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            print(f"User '{username}' deleted successfully.")
        else:
            print(f"User '{username}' not found.")

if __name__ == "__main__":  
    with app.app_context():
        if not User.query.filter_by(username="asmita_dev").first():
            default_user = User(
            username="asmita_dev",
            password_hash=generate_password_hash("124test"),
            role="admin"
            )
            db.session.add(default_user)
            db.session.commit()
            print("Database initialized and default admin user created.")
