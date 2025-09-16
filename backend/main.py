from flask import request, jsonify
from config import app, db
from models import Patient

@app.route("/patients", methods=["GET"])
def get_patients():
    patients=Patient.query.all()
    json_patients= list(map(lambda p: p.to_json(), patients))
    return jsonify({"patients": json_patients})

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
    
    return jsonify({"message": "Patient added successfully"}), 201

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


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)