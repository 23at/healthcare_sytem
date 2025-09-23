"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import VisitForm from "@/components/VisitForm";
import api from "@/api/api";
import useAuth from "@/hooks/useAuth";

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

const VisitsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useAuth();
  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data.patients || []);
    } catch (err) {
      console.error(err);
      setPatients([]);
    }
  };

  // Fetch visits
  const fetchVisits = async () => {
    try {
      const res = await api.get("/visits");
      setVisits(res.data.visits || []);
    } catch (err) {
      console.error(err);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchVisits();
  }, []);

  const addVisit = async (data: {
    patientId: number;
    visitDate: string;
    reason: string;
  }) => {
    try {
      await api.post("/add_visit", data);
      fetchVisits(); // refresh visit list
      alert("Visit added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add visit");
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Visits</h2>

      <VisitForm onSubmit={addVisit} patients={patients} />

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">All Visits</h3>
        {loading ? (
          <p>Loading visits...</p>
        ) : visits.length === 0 ? (
          <p>No visits recorded.</p>
        ) : (
          <ul className="bg-white rounded shadow divide-y">
            {visits.map((v) => {
              const patient = patients.find((p) => p.id === v.patientId);
              return (
                <li key={v.id} className="p-2">
                  <strong>Patient:</strong> {patient?.firstName}{" "}
                  {patient?.lastName} <br />
                  <strong>Date:</strong> {v.visitDate} <br />
                  <strong>Reason:</strong> {v.reason}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default VisitsPage;
