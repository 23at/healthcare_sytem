"use client";
import React, { useState } from "react";

type Visit = {
  id: number;
  patientId: number;
  visitDate: string;
  reason: string;
};

type PrescriptionFormProps = {
  visits: Visit[];
  onSubmit: (data: {
    patientId: number;
    medicationName: string;
    dosage: string;
    startDate: string;
    endDate?: string;
  }) => void;
};

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  visits,
  onSubmit,
}) => {
  const [visitId, setVisitId] = useState<number>(visits[0]?.id || 0);
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitId || !medicationName || !dosage || !startDate) {
      alert("Please fill in all required fields");
      return;
    }

    const visit = visits.find((v) => v.id === visitId);
    if (!visit) {
      alert("Selected visit not found");
      return;
    }

    onSubmit({
      patientId: visit.patientId,
      medicationName,
      dosage,
      startDate,
      endDate: endDate || undefined,
    });

    // Clear form
    setMedicationName("");
    setDosage("");
    setStartDate("");
    setEndDate("");
    setVisitId(visits[0]?.id || 0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-2"
    >
      <label className="block">
        Visit:
        <select
          value={visitId}
          onChange={(e) => setVisitId(Number(e.target.value))}
          className="border p-2 w-full mt-1"
        >
          {visits.map((v) => (
            <option key={v.id} value={v.id}>
              {v.visitDate} | {v.reason}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        Medication Name:
        <input
          type="text"
          value={medicationName}
          onChange={(e) => setMedicationName(e.target.value)}
          className="border p-2 w-full mt-1"
          placeholder="e.g., Paracetamol"
        />
      </label>

      <label className="block">
        Dosage:
        <input
          type="text"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="border p-2 w-full mt-1"
          placeholder="e.g., 500mg"
        />
      </label>

      <label className="block">
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 w-full mt-1"
        />
      </label>

      <label className="block">
        End Date:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 w-full mt-1"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
      >
        Add Prescription
      </button>
    </form>
  );
};

export default PrescriptionForm;
