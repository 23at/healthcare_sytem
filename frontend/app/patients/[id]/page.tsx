"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/api/api";
import Layout from "@/components/Layout";

type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type Visit = {
  id: number;
  patientId: number;
  visitDate: string;
  reason: string;
};

type Prescription = {
  id: number;
  patientId: number;
  medicationName: string;
  dosage: string;
  startDate: string;
  endDate?: string | null;
};

type PatientResponse = {
  patient: Patient;
  visits: Visit[];
  prescriptions: Prescription[];
};

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params?.id as string;

  const [data, setData] = useState<PatientResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    api
      .get<PatientResponse>(`/patients/${patientId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load patient details: ${err.message || ""}`);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) return <p>Loading patient details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>No patient found.</p>;

  const { patient, visits, prescriptions } = data;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Patient Info */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h1 className="text-xl font-bold">
            {patient.firstName} {patient.lastName}
          </h1>
          <p>Email: {patient.email}</p>
        </div>

        {/* Visits */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Visits</h2>
          {visits.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {visits.map((visit) => (
                <li key={visit.id}>
                  {visit.visitDate} – {visit.reason}
                </li>
              ))}
            </ul>
          ) : (
            <p>No visits recorded.</p>
          )}
        </div>

        {/* Prescriptions */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Prescriptions</h2>
          {prescriptions.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {prescriptions.map((rx) => (
                <li key={rx.id}>
                  {rx.medicationName} ({rx.dosage}) – {rx.startDate}
                  {rx.endDate ? ` → ${rx.endDate}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p>No prescriptions found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
