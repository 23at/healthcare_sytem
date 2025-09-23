"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import VisitForm, { Visit } from "@/components/VisitForm";
import api from "@/api/api";
import useAuth from "@/hooks/useAuth";

type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

const VisitsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useAuth();

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients", { withCredentials: true });
      setPatients(res.data.patients || []);
    } catch (err) {
      console.error(err);
      setPatients([]);
    }
  };

  // Fetch visits
  const fetchVisits = async () => {
    try {
      const res = await api.get("/visits", { withCredentials: true });
      setVisits(res.data.visits || []);
    } catch (err) {
      console.error(err);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchVisits();
  }, []);

  // Add visit
  const addVisit = async (data: {
    patientId: number;
    visitDate: string;
    reason: string;
  }) => {
    try {
      await api.post("/add_visit", data, { withCredentials: true });
      fetchVisits();
      alert("Visit added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add visit");
    }
  };

  // Update visit
  const updateVisit = async (
    id: number,
    data: { patientId: number; visitDate: string; reason: string }
  ) => {
    try {
      await api.patch(`/update_visit/${id}`, data, { withCredentials: true });
      fetchVisits();
      alert("Visit updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update visit");
    }
  };

  // Delete visit
  const deleteVisit = async (id: number) => {
    try {
      await api.delete(`/delete_visit/${id}`, { withCredentials: true });
      fetchVisits();
      alert("Visit deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete visit");
    }
  };

  if (loading) return <p>Loading visits...</p>;

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Visits</h2>

      <VisitForm
        patients={patients}
        visits={visits}
        onAdd={addVisit}
        onUpdate={updateVisit}
        onDelete={deleteVisit}
      />
    </Layout>
  );
};

export default VisitsPage;
