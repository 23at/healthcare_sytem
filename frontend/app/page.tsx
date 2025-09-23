"use client";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import api from "@/api/api";

export default function Home() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [patientsCount, setPatientsCount] = useState(0);
  const [visitsCount, setVisitsCount] = useState(0);
  const [prescriptionsCount, setPrescriptionsCount] = useState(0);

  const fetchSummary = async () => {
    try {
      // ✅ 1. Check session / role
      const sessionRes = await api.get("/check_session", {
        withCredentials: true,
      });
      setUserRole(sessionRes.data?.user?.role ?? "Guest");

      // ✅ 2. Fetch patients
      const patientsRes = await api.get("/patients", { withCredentials: true });
      setPatientsCount(patientsRes.data?.patients?.length ?? 0);

      // ✅ 3. Fetch visits
      const visitsRes = await api.get("/visits", { withCredentials: true });
      setVisitsCount(visitsRes.data?.visits?.length ?? 0);

      // ✅ 4. Fetch prescriptions
      const prescriptionsRes = await api.get("/prescriptions", {
        withCredentials: true,
      });
      setPrescriptionsCount(prescriptionsRes.data?.prescriptions?.length ?? 0);
    } catch (err) {
      console.error("Failed to fetch dashboard summary", err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Welcome, {userRole}</h1>

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
