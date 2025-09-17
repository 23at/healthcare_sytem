from config import db

class Patient(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    first_name=db.Column(db.String(80), unique=False, nullable=False)
    last_name=db.Column(db.String(80), unique=False, nullable=False)
    email=db.Column(db.String(120), unique=True, nullable=False)
    visits = db.relationship('Visit', backref='patient', lazy=True)
    prescriptions = db.relationship('Prescription', backref='patient', lazy=True)



    def to_json(self):
        return{
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email
        }

class Visit(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    patient_id=db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    visit_date=db.Column(db.Date, nullable=False)
    reason=db.Column(db.String(200), nullable=False)

    def to_json(self):
        return{
            "id": self.id,
            "patientId": self.patient_id,
            "visitDate": self.visit_date.isoformat(),
            "reason": self.reason
        }

class Prescription(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    patient_id=db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    medication_name=db.Column(db.String(100), nullable=False)
    dosage=db.Column(db.String(50), nullable=False)
    start_date=db.Column(db.Date, nullable=False)
    end_date=db.Column(db.Date, nullable=True)

    def to_json(self):
        return{
            "id": self.id,
            "patientId": self.patient_id,
            "medicationName": self.medication_name,
            "dosage": self.dosage,
            "startDate": self.start_date.isoformat(),
            "endDate": self.end_date.isoformat() if self.end_date else None
        }
