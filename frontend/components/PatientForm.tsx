"use client";
import React, { useState } from "react";

const PatientForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, age, contact });
    setName("");
    setAge("");
    setContact("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-2"
    >
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="Contact"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Patient
      </button>
    </form>
  );
};

export default PatientForm;
