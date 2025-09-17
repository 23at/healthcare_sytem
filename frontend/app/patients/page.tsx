"use client";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import PatientForm from "../../components/PatientForm";
import axios from "axios";

type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/patients");
      setPatients(res.data.patients);
    } catch (err) {
      console.error(err);
    }
  };

  const addPatient = async (data: any) => {
    try {
      await axios.post("http://127.0.0.1:5000/add_patient", data);
      fetchPatients();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePatient = async (data: any) => {
    if (!editingPatient) return;
    try {
      await axios.patch(
        `http://127.0.0.1:5000/update_patient/${editingPatient.id}`,
        data
      );
      setEditingPatient(null);
      fetchPatients();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePatient = async (id: number) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`http://127.0.0.1:5000/delete_patient/${id}`);
      fetchPatients();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (editingPatient) {
      updatePatient(data);
    } else {
      addPatient(data);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Patients</h2>

      <h3 className="text-lg font-semibold mb-2">
        {editingPatient ? "Edit Patient" : "Add Patient"}
      </h3>
      <PatientForm
        key={editingPatient?.id || "new"}
        onSubmit={handleFormSubmit}
        {...(editingPatient || {})}
      />

      <h3 className="text-lg font-semibold mt-6 mb-2">Patient List</h3>
      {patients.length === 0 ? (
        <p>No patients yet.</p>
      ) : (
        <ul className="bg-white rounded shadow divide-y">
          {patients.map((p) => (
            <li key={p.id} className="p-2 flex justify-between items-center">
              <span>
                {p.firstName} {p.lastName} | {p.email}
              </span>
              <div className="space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditingPatient(p)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => deletePatient(p.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
