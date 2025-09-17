"use client";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import VisitForm from "../../components/VisitForm";

const VisitsPage = () => {
  const [patients] = useState([{ id: "1", name: "John Doe" }]); // Replace with API
  const [visits, setVisits] = useState<any[]>([]);

  const addVisit = (data: any) =>
    setVisits([...visits, { id: visits.length + 1, ...data }]);

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Doctor Visits</h2>
      <VisitForm onSubmit={addVisit} patients={patients} />
      <div className="mt-6">
        <ul className="bg-white rounded shadow divide-y">
          {visits.map((v) => (
            <li key={v.id} className="p-2">
              Patient:{" "}
              {patients.find((p) => p.id === v.patientId)?.name || "Unknown"} |
              Date: {v.date} | Diagnosis: {v.diagnosis}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default VisitsPage;
