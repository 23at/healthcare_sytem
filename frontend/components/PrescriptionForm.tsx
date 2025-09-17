"use client";
import React, { useState } from "react";

type PrescriptionFormProps = {
  onSubmit: (data: any) => void;
  visits: any[];
};

const PrescriptionForm = ({ onSubmit, visits }: PrescriptionFormProps) => {
  const [visitId, setVisitId] = useState("");
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitId || !medication || !dosage) return;
    onSubmit({ visitId, medication, dosage });
    setVisitId("");
    setMedication("");
    setDosage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-2"
    >
      <select
        value={visitId}
        onChange={(e) => setVisitId(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="">Select Visit</option>
        {visits.map((v) => (
          <option key={v.id} value={v.id}>
            {v.date} | {v.diagnosis}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Medication"
        value={medication}
        onChange={(e) => setMedication(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="Dosage"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
        className="border p-2 w-full"
      />
      <button className="bg-purple-600 text-white px-4 py-2 rounded">
        Add Prescription
      </button>
    </form>
  );
};

export default PrescriptionForm;
