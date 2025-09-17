"use client";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import PatientForm from "../../components/PatientForm";

const PatientsPage = () => {
  const [patients, setPatients] = useState<any[]>([]);

  const addPatient = (data: any) => {
    setPatients([...patients, { id: patients.length + 1, ...data }]);
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Patients</h2>
      <PatientForm onSubmit={addPatient} />
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Patient List</h3>
        <ul className="bg-white rounded shadow divide-y">
          {patients.map((p) => (
            <li key={p.id} className="p-2">
              {p.name} | Age: {p.age} | Contact: {p.contact}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default PatientsPage;
