"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PrescriptionForm from "@/components/PrescriptionForm";
import api from "@/api/api";
import useAuth from "@/hooks/useAuth";
// import ProtectedPage from "../../components/ProtectedPage";
export type VisitProps = {
  id: number;
  patientId: number;
  visitDate: string;
  reason: string;
};

export type PrescriptionProps = {
  id: number;
  patientId: number;
  medicationName: string;
  dosage: string;
  startDate: string;
  endDate?: string;
};

const PrescriptionsPage = () => {
  const [visits, setVisits] = useState<VisitProps[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionProps[]>([]);

  useAuth();

  useEffect(() => {
    fetchVisits();
    fetchPrescriptions();
  }, []);
  const fetchVisits = async () => {
    try {
      const res = await api.get("/visits");
      setVisits(res.data.visits);
    } catch (error) {
      console.error("Error fetching visits:", error);
      setVisits([]);
    }
  };
  const fetchPrescriptions = async () => {
    try {
      const res = await api.get("/prescriptions");
      setPrescriptions(res.data.prescriptions);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const addPrescription = async (data: any) => {
    try {
      await api.post("/add_prescription", data);
      fetchPrescriptions(); // refresh list
    } catch (err) {
      console.error("Error adding prescription:", err);
    }
  };
  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Prescriptions</h2>
      <PrescriptionForm onSubmit={addPrescription} visits={visits} />
      <div className="mt-6">
        <ul className="bg-white rounded shadow divide-y">
          {prescriptions.map((p) => {
            const visit = visits.find((v) => v.patientId === p.patientId);
            return (
              <li key={p.id} className="p-2">
                Visit: {visit?.visitDate} | Diagnosis: {visit?.reason} |
                Medication: {p.medicationName} | Dosage: {p.dosage}
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
};

export default PrescriptionsPage;
