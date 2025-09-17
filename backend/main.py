from flask import request, jsonify
from config import app, db
from models import Patient
from models import Visit
from models import Prescription
from datetime import datetime

#API routes for paitent info

@app.route("/patients/<int:patient_id>", methods=["GET"])
def get_patient(patient_id):
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"patient": None, "message": "Patient not found"}), 200
    return jsonify({"patient": patient.to_json()})


@app.route("/patients", methods=["GET"])
def get_patients():
    patients=Patient.query.all()
    json_patients= list(map(lambda p: p.to_json(), patients))
    return jsonify({"patients": json_patients}),200

@app.route("/add_patient", methods=["POST"])
def add_patient():
    first_name=request.json["firstName"]
    last_name=request.json["lastName"]
    email=request.json["email"]
   

    if not first_name or not last_name or not email:
        return(
             jsonify({"message": "Missing data"}), 400
        )
    new_patient=Patient(first_name=first_name, last_name=last_name, email=email)
    try:
        db.session.add(new_patient)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Patient added successfully"}), 200

@app.route("/update_patient/<int:patient_id>", methods=["PATCH"])
def update_patient(patient_id):
    patient= Patient.query.get(patient_id)

    if not patient:
        return jsonify({"message": "Patient not found"}),404
    data= request.json
    patient.first_name=data.get("firstName", patient.first_name)
    patient.last_name=data.get("lastName", patient.last_name)
    patient.email=data.get("email", patient.email)

    db.session.commit()
    return jsonify({"message": "Patient updated successfully"}), 200

@app.route("/delete_patient/<int:patient_id>", methods=["DELETE"])
def delete_patient(patient_id):
    patient= Patient.query.get(patient_id)

    if not patient:
        return jsonify({"message": "Patient not found"}),404

    db.session.delete(patient)
    db.session.commit()
    return jsonify({"message": "Patient deleted successfully"}), 200



#API routes for visits

@app.route("/visits", methods=["GET"])
def get_visits():
    visits=Visit.query.all()
    json_visits= list(map(lambda v: v.to_json(), visits))
    return jsonify({"visits": json_visits}), 201


@app.route("/add_visit", methods=["POST"])
def add_visit():
    patient_id=request.json["patientId"]
    data = request.get_json() 
    visit_date = datetime.strptime(data["visitDate"], "%Y-%m-%d").date()
    reason=request.json["reason"]

    if not patient_id or not visit_date or not reason:
        return(
             jsonify({"message": "Missing data"}), 400
        )
    new_visit=Visit(patient_id=patient_id, visit_date=visit_date, reason=reason)
    try:
        db.session.add(new_visit)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Visit added successfully"}), 201

@app.route("/update_visit/<int:visit_id>", methods=["PATCH"])
def update_visit(visit_id):
    visit= Visit.query.get(visit_id)

    if not visit:
        return jsonify({"message": "Visit not found"}),404
    data= request.get_json()
    if "visitDate" in data:
        try:
            visit.visit_date = datetime.strptime(data["visitDate"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    visit.patient_id=data.get("patientId", visit.patient_id)
   
    visit.reason=data.get("reason", visit.reason)

    db.session.commit()
    return jsonify({"message": "Visit updated successfully"}), 200

@app.route("/delete_visit/<int:visit_id>", methods=["DELETE"])
def delete_visit(visit_id):
    visit= Visit.query.get(visit_id)

    if not visit:
        return jsonify({"message": "Visit not found"}),404

    db.session.delete(visit)
    db.session.commit()
    return jsonify({"message": "Visit deleted successfully"}), 200

#API routes for prescriptions

@app.route("/prescriptions", methods=["GET"])
def get_prescriptions():
    prescriptions=Prescription.query.all()
    json_prescriptions= list(map(lambda p: p.to_json(), prescriptions))
    return jsonify({"prescriptions": json_prescriptions})

@app.route("/add_prescription", methods=["POST"])
def add_prescription():
    patient_id=request.json["patientId"]
    medication_name=request.json["medicationName"]
    dosage=request.json["dosage"]
    start_date=request.json["startDate"]
    end_date=request.json.get("endDate", None)

    if not patient_id or not medication_name or not dosage or not start_date:
        return(
             jsonify({"message": "Missing data"}), 400
        )
    new_prescription=Prescription(patient_id=patient_id, medication_name=medication_name, dosage=dosage, start_date=start_date, end_date=end_date)
    
    try:
        db.session.add(new_prescription)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Prescription added successfully"}), 201

@app.route("/update_prescription/<int:prescription_id>", methods=["PATCH"])
def update_prescription(prescription_id):
    prescription= Prescription.query.get(prescription_id)

    if not prescription:
        return jsonify({"message": "Prescription not found"}),404
    data= request.json
    prescription.patient_id=data.get("patientId", prescription.patient_id)
    prescription.medication_name=data.get("medicationName", prescription.medication_name)
    prescription.dosage=data.get("dosage", prescription.dosage)
    prescription.start_date=data.get("startDate", prescription.start_date)
    prescription.end_date=data.get("endDate", prescription.end_date)

    db.session.commit()
    return jsonify({"message": "Prescription updated successfully"}), 200

@app.route("/delete_prescription/<int:prescription_id>", methods=["DELETE"])
def delete_prescription(prescription_id):
    prescription= Prescription.query.get(prescription_id)

    if not prescription:
        return jsonify({"message": "Prescription not found"}),404

    db.session.delete(prescription)
    db.session.commit()
    return jsonify({"message": "Prescription deleted successfully"}), 200



if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)