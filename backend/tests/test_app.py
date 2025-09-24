import pytest
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app, db
from unittest.mock import patch
from datetime import datetime

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

def test_patient(client):
    with client.application.app_context():
        admin = User(
            username="testadmin",
            password_hash=generate_password_hash("adminpass"),
            role="admin"
        )
        db.session.add(admin)
        db.session.commit()

    # Mock login by setting session values
    with client.session_transaction() as sess:
        sess["user_id"] = 1
        sess["is_admin"] = True

    response= client.get("/patients")
    assert response.status_code==200
   

def test_create_patient(client):
    with client.application.app_context():
        admin=User(id=1,username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        db.session.commit()
    
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    

    response=client.post('/add_patient', json={
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
    })
    assert response.status_code==201

def test_update_patient(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        db.session.commit()
        patient=Patient(id=1, first_name="Jane", last_name="Doe", email="jane.doe@example.com")
        db.session.add(patient)
        db.session.commit()
    
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    response=client.patch('/update_patient/1', json={
        "firstName": "Janet",
        "lastName": "Smith"
    })
    assert response.status_code==200

def test_delete_patient(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        db.session.commit()
        patient=Patient(first_name="Jane", last_name="Doe", email="jane.doe@example.com")
        db.session.add(patient)
        db.session.commit()
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    response=client.delete('/delete_patient/1')
    assert response.status_code==200

def test_visit(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        db.session.commit()
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    response=client.get("/visits")
    assert response.status_code==200

def test_add_visit(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        patient=Patient(first_name="Jane", last_name="Doe", email="jane.doe@example.com")
        db.session.add(patient)
        db.session.commit()
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True

    request= client.post('/add_visit', json={
        "patientId": 1,
        "visitDate": "2023-10-01",
        "reason": "Regular Checkup"
    })
    assert request.status_code==201

def test_update_visit(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        patient=Patient(first_name="Jane", last_name="Doe", email="jane.doe@example.com")
        db.session.add(patient)
        visit= Visit(patient_id=1, visit_date=datetime.strptime("2025-10-01", "%Y-%m-%d").date(), reason="Regular Checkup")
        db.session.add(visit)
        db.session.commit()
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    
    response= client.patch('/update_visit/1', json={
        "reason": "Updated Reason"
    })
    assert response.status_code==200
def test_delete_visit(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        patient=Patient(first_name="Jane", last_name="Doe", email="jane.doe@example.com")
        db.session.add(patient)
        visit= Visit(patient_id=1, visit_date=datetime.strptime("2025-10-01", "%Y-%m-%d").date(), reason="Regular Checkup")
        db.session.add(visit)
        db.session.commit()
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    
    response= client.delete('/delete_visit/1')
    assert response.status_code==200

def test_prescription(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        db.session.commit()
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    response=client.get("/prescriptions")
    assert response.status_code==200

def test_add_prescription(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        patient=Patient(first_name="Jane", last_name="Doe", email="jane@example.com")
        db.session.add(patient)
        db.session.commit()
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    
    response=client.post('/add_prescription', json={
        "patientId": 1,
        "medicationName": "Medicine A",
        "dosage": "10mg",
        "startDate": "2023-10-01",
        "endDate": "2023-10-10"
    })
    assert response.status_code==201

def test_update_prescription(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        patient=Patient(first_name="Jane", last_name="Doe", email="jane@example.com")
        db.session.add(patient)
        prescription=Prescription(patient_id=1, medication_name="Medicine A", dosage="10mg", start_date=datetime.strptime("2023-10-01", "%Y-%m-%d").date(), end_date=datetime.strptime("2023-10-10", "%Y-%m-%d").date())
        db.session.add(prescription)
        db.session.commit()
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    
    response=client.patch('/update_prescription/1', json={
        "dosage": "20mg"
    })
    assert response.status_code==200

def test_delete_prescription(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        patient=Patient(first_name="Jane", last_name="Doe", email="jane@example.com")
        db.session.add(patient)
        prescription=Prescription(patient_id=1, medication_name="Medicine A", dosage="10mg", start_date=datetime.strptime("2023-10-01", "%Y-%m-%d").date(), end_date=datetime.strptime("2023-10-10", "%Y-%m-%d").date())
        db.session.add(prescription)
        db.session.commit()
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    
    response=client.delete('/delete_prescription/1')
    assert response.status_code==200

def test_create_user(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        db.session.commit()
    
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    

    response=client.post('/create_user', json={
        "username": "newuser",
        "password": "newpass",
        "role": "nurse"
    })
    assert response.status_code==201

def test_delete_user(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        user=User(id=2, username="todelete", password_hash=generate_password_hash("deletepass"), role="nurse")
        db.session.add(user)
        db.session.commit()
    
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    

    response=client.delete('/delete_user/2')
    assert response.status_code==200

def test_users(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        db.session.commit()
    
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    

    response=client.get('/users')
    assert response.status_code==200

def test_update_user(client):
    with client.application.app_context():
        admin=User(username="testadmin", password_hash=generate_password_hash("adminpasshash"),role="admin")
        db.session.add(admin)
        user=User(id=2, username="toupdate", password_hash=generate_password_hash("updatepass"), role="nurse")
        db.session.add(user)
        db.session.commit()
    
    with client.session_transaction() as sess:
        sess["user_id"]=1
        sess["is_admin"]=True
    

    response=client.patch('/update_user/2', json={
        "password": "newupdatepass",
        "role": "doctor"
    })
    assert response.status_code==200

def test_login_logout(client):
    with client.application.app_context():
        user=User(username="testuser", password_hash=generate_password_hash("testpass"), role="nurse")
        db.session.add(user)
        db.session.commit()
    
    response=client.post('/login', json={
        "username": "testuser",
        "password": "testpass"
    })
    assert response.status_code==200
    

    response=client.post('/logout')
    assert response.status_code==200
 
 #integration tests can be added here

 