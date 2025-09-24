"use client";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import api from "@/api/api";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  const user = useAuth(); //  gives you session + role
  const [patientsCount, setPatientsCount] = useState(0);
  const [visitsCount, setVisitsCount] = useState(0);
  const [prescriptionsCount, setPrescriptionsCount] = useState(0);

  const fetchSummary = async () => {
    try {
      // fire all 3 at once
      const [patientsRes, visitsRes, prescriptionsRes] = await Promise.all([
        api.get("/patients", { withCredentials: true }),
        api.get("/visits", { withCredentials: true }),
        api.get("/prescriptions", { withCredentials: true }),
      ]);

      setPatientsCount(patientsRes.data?.patients?.length ?? 0);
      setVisitsCount(visitsRes.data?.visits?.length ?? 0);
      setPrescriptionsCount(prescriptionsRes.data?.prescriptions?.length ?? 0);
    } catch (err: unknown) {
      console.error("Failed to fetch dashboard summary:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSummary();
    }
  }, [user]);

  if (!user) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.role}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="font-semibold">Total Patients</h2>
          <p className="text-xl">{patientsCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="font-semibold">Total Visits</h2>
          <p className="text-xl">{visitsCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="font-semibold">Total Prescriptions</h2>
          <p className="text-xl">{prescriptionsCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/patients"
          className="bg-blue-600 text-white p-4 rounded shadow text-center hover:bg-blue-700"
        >
          Manage Patients
        </Link>
        <Link
          href="/visits"
          className="bg-green-600 text-white p-4 rounded shadow text-center hover:bg-green-700"
        >
          Manage Visits
        </Link>
        <Link
          href="/prescriptions"
          className="bg-purple-600 text-white p-4 rounded shadow text-center hover:bg-purple-700"
        >
          Manage Prescriptions
        </Link>
      </div>
    </Layout>
  );
}
