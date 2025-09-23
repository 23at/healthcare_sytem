"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PrescriptionForm, {
  PrescriptionProps,
  VisitProps,
} from "@/components/PrescriptionForm";
import api from "@/api/api";
import useAuth from "@/hooks/useAuth";

const PrescriptionsPage = () => {
  const [visits, setVisits] = useState<VisitProps[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionProps[]>([]);
  const [editingPrescription, setEditingPrescription] =
    useState<PrescriptionProps | null>(null);

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

  const addPrescription = async (data: PrescriptionProps) => {
    try {
      await api.post("/add_prescription", data);
      fetchPrescriptions();
      alert("Prescription added successfully");
    } catch (err) {
      console.error("Error adding prescription:", err);
      alert("Failed to add prescription");
    }
  };

  const updatePrescription = async (id: number, data: PrescriptionProps) => {
    try {
      await api.patch(`/update_prescription/${id}`, data);
      setEditingPrescription(null);
      fetchPrescriptions();
      alert("Prescription updated successfully");
    } catch (err) {
      console.error("Error updating prescription:", err);
      alert("Failed to update prescription");
    }
  };

  const deletePrescription = async (id: number) => {
    if (!confirm("Are you sure you want to delete this prescription?")) return;
    try {
      await api.delete(`/delete_prescription/${id}`);
      fetchPrescriptions();
      alert("Prescription deleted successfully");
    } catch (err) {
      console.error("Error deleting prescription:", err);
      alert("Failed to delete prescription");
    }
  };

  const handleFormSubmit = (data: PrescriptionProps) => {
    if (editingPrescription) {
      if (editingPrescription?.id !== undefined) {
        updatePrescription(editingPrescription.id, data);
      }
    } else {
      addPrescription(data);
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Prescriptions</h2>

      <PrescriptionForm
        visits={visits}
        onSubmit={handleFormSubmit}
        key={editingPrescription?.id || "new"}
        initialData={editingPrescription || undefined}
        onCancel={() => setEditingPrescription(null)}
      />

      <div className="mt-6">
        <ul className="bg-white rounded shadow divide-y">
          {prescriptions.map((p) => {
            const visit = visits.find((v) => v.id === p.patientId);
            return (
              <li key={p.id} className="p-2 flex justify-between items-center">
                <div>
                  Visit: {visit?.visitDate} | Diagnosis: {visit?.reason} |
                  Medication: {p.medicationName} | Dosage: {p.dosage}
                </div>
                <div className="space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => setEditingPrescription(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() =>
                      p.id !== undefined && deletePrescription(p.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
};

export default PrescriptionsPage;
