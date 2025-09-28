import unittest
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app import app, db
from models import User, Patient, Visit, Prescription
from werkzeug.security import generate_password_hash

class IntegrationTest(unittest.TestCase):
    def setUp(self):
        # Configure app for testing
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['SECRET_KEY'] = 'testsecret'

        self.client = app.test_client()

        # Set up database with a test user
        with app.app_context():
            db.create_all()
            test_user = User(username='asmita_dev', password_hash=generate_password_hash('124test'), role="user" )
            db.session.add(test_user)
            db.session.commit()

    def tearDown(self):
        with app.app_context():
            db.drop_all()

    def login(self):
        """Helper to login and keep session cookie"""
        return self.client.post('/login', json={
            'username': 'asmita_dev',
            'password': '124test'
        })

    # ---------- AUTH TESTS ----------
    def test_login_success(self):
        res = self.login()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()['message'], 'login successful')

    def test_login_failure(self):
        res = self.client.post('/login', json={'username': 'asmita_dev', 'password': 'wrong'})
        self.assertEqual(res.status_code, 401)

    # ---------- PATIENT TESTS ----------
    def test_add_patient(self):
        self.login()
        res = self.client.post('/add_patient', json={"firstName": "Asmi", "lastName": "Tamang", "email": "asmita@example.com"})
        self.assertEqual(res.status_code, 201)
        self.assertIn('message', res.get_json())
    

    def test_get_patients(self):
        self.login()
        # Add a patient first
        self.client.post('/patients')
        res = self.client.get('/patients')
        self.assertEqual(res.status_code, 200)
        self.assertIn('patients', res.get_json())

    # ---------- VISIT TESTS ----------
    def test_add_visit(self):
        self.login()
        # Add patient first
        patient=self.client.post('/add_patient', json={"firstName": "Asmi", "lastName": "Tamang", "email": "example@.com"})
        res = self.client.post('/add_visit', json={ "patientId": 1,"visitDate": "2025-09-16", "reason": "Routine checkup"})
        self.assertEqual(res.status_code, 201)
        self.assertIn('message', res.get_json())

    # ---------- PRESCRIPTION TESTS ----------
    def test_add_prescription(self):
        self.login()
        # Add patient
        self.client.post('/add_patient', json={"firstName": "Asmi", "lastName": "Tamang", "email": "example@.com"})
        res = self.client.post('/add_prescription', json={'patientId': 1, 'medicationName': 'Aspirin',"dosage":"200mg twice daily for 7 days. ",
        "startDate": "2025-09-17",
        "endDate": "2025-09-24"})
        self.assertEqual(res.status_code, 201)
        self.assertIn('message', res.get_json())


if __name__ == "__main__":
    unittest.main()
