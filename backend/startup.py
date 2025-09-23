import sqlite3
from werkzeug.security import generate_password_hash
from config import db
from models import User

def init_db():
    db.create_all
if not User.query.filter_by(username="admin").first():
    default_user = User(
        username="admin",
        password_hash=generate_password_hash("adminpass"),
        role="admin"
    )
    db.session.add(default_user)
    db.session.commit()