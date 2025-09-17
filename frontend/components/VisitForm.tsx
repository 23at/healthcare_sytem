"use client";
import React, { useState } from "react";

type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type VisitFormProps = {
  onSubmit: (data: {
    patientId: number;
    visitDate: string;
    reason: string;
  }) => void;
  patients: Patient[];
};

const VisitForm: React.FC<VisitFormProps> = ({ onSubmit, patients }) => {
  const [patientId, setPatientId] = useState<number>(patients[0]?.id || 0);
  const [visitDate, setVisitDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId || !visitDate || !reason) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      patientId,
      visitDate,
      reason,
    });

    // Reset form
    setVisitDate("");
    setReason("");
    setPatientId(patients[0]?.id || 0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-2"
    >
      <label className="block">
        Patient:
        <select
          value={patientId}
          onChange={(e) => setPatientId(Number(e.target.value))}
          className="border p-2 w-full mt-1"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        Visit Date:
        <input
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          className="border p-2 w-full mt-1"
        />
      </label>

      <label className="block">
        Reason / Diagnosis:
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border p-2 w-full mt-1"
          placeholder="e.g., Flu, Checkup"
        />
      </label>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded mt-2"
      >
        Add Visit
      </button>
    </form>
  );
};

export default VisitForm;
