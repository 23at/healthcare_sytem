"use client";

import React, { useState, useEffect } from "react";

// Form data type
export type PatientFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

// Props for the form
type PatientFormProps = {
  onSubmit: (data: PatientFormData) => void;
  onCancel?: () => void;
  initialData?: PatientFormData; // optional initial values for editing
};

const PatientForm: React.FC<PatientFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [fName, setFName] = useState(initialData?.firstName || "");
  const [lName, setLName] = useState(initialData?.lastName || "");
  const [emailAddr, setEmailAddr] = useState(initialData?.email || "");

  useEffect(() => {
    setFName(initialData?.firstName || "");
    setLName(initialData?.lastName || "");
    setEmailAddr(initialData?.email || "");
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName || !lName || !emailAddr) {
      alert("Please fill all fields");
      return;
    }

    onSubmit({ firstName: fName, lastName: lName, email: emailAddr });

    // Reset form if adding new
    if (!initialData) {
      setFName("");
      setLName("");
      setEmailAddr("");
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setFName(initialData?.firstName || "");
    setLName(initialData?.lastName || "");
    setEmailAddr(initialData?.email || "");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-2"
    >
      <label className="block">
        First Name:
        <input
          type="text"
          value={fName}
          onChange={(e) => setFName(e.target.value)}
          className="border p-2 w-full mt-1"
          placeholder="First Name"
        />
      </label>

      <label className="block">
        Last Name:
        <input
          type="text"
          value={lName}
          onChange={(e) => setLName(e.target.value)}
          className="border p-2 w-full mt-1"
          placeholder="Last Name"
        />
      </label>

      <label className="block">
        Email:
        <input
          type="email"
          value={emailAddr}
          onChange={(e) => setEmailAddr(e.target.value)}
          className="border p-2 w-full mt-1"
          placeholder="Email"
        />
      </label>

      <div className="flex space-x-2 mt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {initialData ? "Update Patient" : "Add Patient"}
        </button>

        {initialData && (
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
  );
};

export default PatientForm;
