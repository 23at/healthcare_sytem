"use client";
import React, { useState } from "react";

const VisitForm = ({
  onSubmit,
  patients,
}: {
  onSubmit: (data: any) => void;
  patients: any[];
}) => {
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ patientId, date, notes, diagnosis });
    setPatientId("");
    setDate("");
    setNotes("");
    setDiagnosis("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-2"
    >
      <select
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="">Select Patient</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Visit
      </button>
    </form>
  );
};

export default VisitForm;
