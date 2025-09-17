"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { set } from "zod";
type Patient = {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
};

const sampleVisits = [
  { id: "1", patientId: "1", date: "2025-09-17", diagnosis: "Flu" },
  { id: "2", patientId: "1", date: "2025-09-01", diagnosis: "Checkup" },
];

const samplePrescriptions = [
  { id: "1", visitId: "1", medication: "Paracetamol", dosage: "500mg" },
  { id: "2", visitId: "1", medication: "Cough Syrup", dosage: "10ml" },
];

export default function PatientDetailPage() {
  const params = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const id = Number(params.id);

  // const patientId = params.id;

  useEffect(() => {
    if (id) {
      fetchPatient(id);
    }
  }, [id]);
  const fetchPatient = async (patientId: Number) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/patients/${patientId}`
      );
      if (res.data?.patient) {
        setPatient(res.data.patient);
      } else {
        setPatient(null); // no patient found
      }
    } catch (err) {
      setPatient(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Find the patient
  // const patient = samplePatients.find((p) => p.id === patientId);
  if (loading) {
    return (
      <Layout>
        <p className="p-4">Loading patient...</p>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout>
        <p className="p-4 text-red-600">No patient found.</p>
      </Layout>
    );
  }

  // Get visits and prescriptions for this patient
  // const visits = sampleVisits.filter((v) => v.patientId === patientId);
  // const prescriptions = samplePrescriptions.filter((pres) =>
  //   visits.some((v) => v.id === pres.visitId)
  // );

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Patient Details</h2>
      <div className="bg-white p-4 rounded shadow mb-6">
        <p>
          <strong>Name:</strong> {patient.firstName}
        </p>
        <p>
          <strong>Age:</strong> {patient.lastName}
        </p>
        <p>
          <strong>Contact:</strong> {patient.email}
        </p>
      </div>

      {/* <h3 className="text-lg font-semibold mb-2">Visits</h3>
      {visits.length === 0 ? (
        <p>No visits recorded.</p>
      ) : (
        <ul className="bg-white rounded shadow divide-y mb-6">
          {visits.map((v) => (
            <li key={v.id} className="p-2">
              <p>
                <strong>Date:</strong> {v.date}
              </p>
              <p>
                <strong>Diagnosis:</strong> {v.diagnosis}
              </p>
              <Link
                href={`/prescriptions?visitId=${v.id}`}
                className="text-purple-600 hover:underline"
              >
                View Prescriptions
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
      {prescriptions.length === 0 ? (
        <p>No prescriptions recorded.</p>
      ) : (
        <ul className="bg-white rounded shadow divide-y">
          {prescriptions.map((p) => {
            const visit = visits.find((v) => v.id === p.visitId);
            return (
              <li key={p.id} className="p-2">
                <p>
                  <strong>Medication:</strong> {p.medication}
                </p>
                <p>
                  <strong>Dosage:</strong> {p.dosage}
                </p>
                <p>
                  <strong>Visit Date:</strong> {visit?.date}
                </p>
              </li>
            );
          })}
        </ul>
      )} */}
    </Layout>
  );
}
