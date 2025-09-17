"use client";
import React from "react";
import Layout from "../../../components/Layout";
import { useParams } from "next/navigation";
import Link from "next/link";

// Sample data – replace with real API fetch
const samplePatients = [
  { id: "1", name: "John Doe", age: 35, contact: "555-1234" },
  { id: "2", name: "Jane Smith", age: 28, contact: "555-5678" },
];

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
  const patientId = params.id;

  // Find the patient
  const patient = samplePatients.find((p) => p.id === patientId);
  if (!patient)
    return (
      <Layout>
        <p className="p-4">Patient not found</p>
      </Layout>
    );

  // Get visits and prescriptions for this patient
  const visits = sampleVisits.filter((v) => v.patientId === patientId);
  const prescriptions = samplePrescriptions.filter((pres) =>
    visits.some((v) => v.id === pres.visitId)
  );

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Patient Details</h2>
      <div className="bg-white p-4 rounded shadow mb-6">
        <p>
          <strong>Name:</strong> {patient.name}
        </p>
        <p>
          <strong>Age:</strong> {patient.age}
        </p>
        <p>
          <strong>Contact:</strong> {patient.contact}
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-2">Visits</h3>
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
      )}
    </Layout>
  );
}
