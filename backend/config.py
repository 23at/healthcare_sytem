from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app=Flask(__name__)
app.secret_key = "your-unique-secret-key"  # 🔐 Replace with a secure, random value

CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///healthcare_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

db=SQLAlchemy(app)