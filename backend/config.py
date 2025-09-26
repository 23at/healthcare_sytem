from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app=Flask(__name__)
app.secret_key = "your-unique-secret-key"  # 🔐 Replace with a secure, random value



app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///healthcare_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True


db=SQLAlchemy(app)
CORS(app,origins=["http://localhost:3000", "https://healthcare-sytem-frontend.onrender.com"], supports_credentials=True)