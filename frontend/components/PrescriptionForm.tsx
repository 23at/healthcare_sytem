"use client";

import React, { useEffect, useState } from "react";

export type VisitProps = {
  id: number;
  patientId: number;
  visitDate: string;
  reason: string;
};

export type PrescriptionProps = {
  id?: number;
  patientId: number;
  visitId?: number;
  medicationName: string;
  dosage: string;
  startDate: string;
  endDate?: string;
};

type PrescriptionFormProps = {
  visits: VisitProps[];
  initialData?: PrescriptionProps;
  onSubmit: (data: PrescriptionProps) => void;
  onCancel?: () => void;
};

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  visits,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [visitId, setVisitId] = useState<number | undefined>(
    initialData?.visitId || visits[0]?.id
  );
  const [medicationName, setMedicationName] = useState(
    initialData?.medicationName || ""
  );
  const [dosage, setDosage] = useState(initialData?.dosage || "");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");

  useEffect(() => {
    if (visits.length > 0 && visitId === undefined) {
      setVisitId(visits[0].id);
    }
  }, [visits, visitId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitId || !medicationName || !dosage || !startDate) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      patientId: visits.find((v) => v.id === visitId)?.patientId || 0,
      visitId,
      medicationName,
      dosage,
      startDate,
      endDate: endDate || undefined,
      id: initialData?.id,
    });

    // Clear form if adding new
    if (!initialData) {
      setMedicationName("");
      setDosage("");
      setStartDate("");
      setEndDate("");
      setVisitId(visits[0]?.id);
    }
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
          required
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
          required
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
          required
        />
      </label>

      <label className="block">
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 w-full mt-1"
          required
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

      <div className="flex space-x-2 mt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {initialData ? "Update Prescription" : "Add Prescription"}
        </button>
        {initialData && onCancel && (
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PrescriptionForm;
