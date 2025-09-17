"use client";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import PrescriptionForm from "@/components/PrescriptionForm";
// import ProtectedPage from "../../components/ProtectedPage";

const PrescriptionsPage = () => {
  //   const userRole = "Admin"; // Replace with auth context
  const [visits] = useState([
    { id: "1", date: "2025-09-17", diagnosis: "Flu" },
  ]); // Replace with API
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  const addPrescription = (data: any) =>
    setPrescriptions([
      ...prescriptions,
      { id: prescriptions.length + 1, ...data },
    ]);

  return (
    // <ProtectedPage role={userRole} page="prescriptions">
    <Layout>
      <h2 className="text-xl font-bold mb-4">Prescriptions</h2>
      <PrescriptionForm onSubmit={addPrescription} visits={visits} />
      <div className="mt-6">
        <ul className="bg-white rounded shadow divide-y">
          {prescriptions.map((p) => {
            const visit = visits.find((v) => v.id === p.visitId);
            return (
              <li key={p.id} className="p-2">
                Visit: {visit?.date} | Diagnosis: {visit?.diagnosis} |
                Medication: {p.medication} | Dosage: {p.dosage}
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
