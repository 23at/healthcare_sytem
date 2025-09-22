import pytest
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app, db


from werkzeug.security import generate_password_hash
from models import Patient, Visit, Prescription, User

#unit test for main.py
@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()



def test_create_user(client):
    with client.application.app_context():
        admin_user=User(id=1,username="admin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin_user)
        db.session.commit()
        assert User.query.count()==1
    response=client.post('/login', json={
        "username": "admin",
        "password": "adminpasshash"
    })
    assert response.status_code==200

    response =client.post('/create_user', json={
        "username": "testuser",
        "password": "testpass",
        "role": "admin"
    })
    assert response.status_code==201
    with client.application.app_context():
        user=User.query.filter_by(username="testuser").first()
        assert user is not None
        assert user.password_hash is not None
        assert user.role=="admin"

def test_create_patient(client):
    response=client.post('/create_patient', json={
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
    })
    assert response.status_code==201
    with client.application.app_context():
        patient=Patient.query.filter_by(email="