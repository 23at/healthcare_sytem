"use client";

import React, { useState, useEffect } from "react";

type Patient = {
  id: number;
  firstName: string;
  lastName: string;
};

export type Visit = {
  id: number;
  patientId: number;
  visitDate: string;
  reason: string;
};

type VisitFormProps = {
  patients: Patient[];
  visits: Visit[];
  onAdd: (data: {
    patientId: number;
    visitDate: string;
    reason: string;
  }) => void;
  onUpdate: (
    id: number,
    data: { patientId: number; visitDate: string; reason: string }
  ) => void;
  onDelete: (id: number) => void;
};

const VisitForm: React.FC<VisitFormProps> = ({
  patients,
  visits,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [patientId, setPatientId] = useState<number | "">("");
  const [visitDate, setVisitDate] = useState("");
  const [reason, setReason] = useState("");

  // Reset defaults when patients or editingVisit changes
  useEffect(() => {
    if (editingVisit) {
      setPatientId(editingVisit.patientId);
      setVisitDate(editingVisit.visitDate);
      setReason(editingVisit.reason);
    } else if (patients.length > 0 && patientId === "") {
      setPatientId(patients[0].id);
      setVisitDate("");
      setReason("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingVisit, patients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId || !visitDate || !reason.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const data = {
      patientId: Number(patientId),
      visitDate,
      reason: reason.trim(),
    };

    if (editingVisit) {
      onUpdate(editingVisit.id, data);
      setEditingVisit(null);
    } else {
      onAdd(data);
    }

    setPatientId(patients[0]?.id || "");
    setVisitDate("");
    setReason("");
  };

  const handleCancel = () => {
    setEditingVisit(null);
    setPatientId(patients[0]?.id || "");
    setVisitDate("");
    setReason("");
  };

  return (
    <div className="space-y-4">
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
            required
          >
            <option value="">Select a patient</option>
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
            required
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
            required
          />
        </label>

        <div className="flex space-x-2 mt-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editingVisit ? "Update Visit" : "Add Visit"}
          </button>
          {editingVisit && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Visit List */}
      <ul className="bg-white rounded shadow divide-y">
        {visits.map((v) => {
          const patient = patients.find((p) => p.id === v.patientId);
          return (
            <li key={v.id} className="p-2 flex justify-between items-center">
              <span>
                <strong>
                  {patient?.firstName} {patient?.lastName}
                </strong>{" "}
                – {v.visitDate} – {v.reason}
              </span>
              <div className="space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditingVisit(v)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => {
                    if (confirm("Delete this visit?")) onDelete(v.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VisitForm;
