"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PrescriptionForm from "@/components/PrescriptionForm";
import axios from "axios";
import { set } from "zod";
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
  //   const userRole = "Admin"; // Replace with auth context
  const [visits, setVisits] = useState<VisitProps[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionProps[]>([]);
  useEffect(() => {
    fetchVisits();
    fetchPrescriptions();
  }, []);
  const fetchVisits = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/visits");
      setVisits(res.data.visits);
    } catch (error) {
      console.error("Error fetching visits:", error);
      setVisits([]);
    }
  };
  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/prescriptions");
      setPrescriptions(res.data.prescriptions);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };
  // const addPrescription = (data: any) =>
  //   setPrescriptions([
  //     ...prescriptions,
  //     { id: prescriptions.length + 1, ...data },
  //   ]);

  const addPrescription = async (data: any) => {
    try {
      await axios.post("http://127.0.0.1:5000/add_prescription", data);
      fetchPrescriptions(); // refresh list
    } catch (err) {
      console.error("Error adding prescription:", err);
    }
  };
  return (
    // <ProtectedPage role={userRole} page="prescriptions">
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
    // </ProtectedPage>
  );
};

export default PrescriptionsPage;
