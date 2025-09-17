"use client";
import React, { useState } from "react";
import Layout from "../components/Layout";
// import { canAccess } from '../utils/auth';
import Link from "next/link";

export default function Home() {
  const userRole = "Admin"; // Replace with auth context

  // Sample summary stats
  const [patients] = useState([{ id: 1 }, { id: 2 }]);
  const [visits] = useState([{ id: 1 }, { id: 2 }, { id: 3 }]);
  const [prescriptions] = useState([{ id: 1 }]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Welcome, {userRole}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="font-semibold">Total Patients</h2>
          <p className="text-xl">{patients.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="font-semibold">Total Visits</h2>
          <p className="text-xl">{visits.length}</p>
        </div>
        {/* {canAccess(userRole, "prescriptions") && ( */}
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="font-semibold">Total Prescriptions</h2>
          <p className="text-xl">{prescriptions.length}</p>
        </div>
        {/* )} */}
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
        {/* {canAccess(userRole, "prescriptions") && ( */}
        <Link
          href="/prescriptions"
          className="bg-purple-600 text-white p-4 rounded shadow text-center hover:bg-purple-700"
        >
          Manage Prescriptions
        </Link>
        {/* )} */}
      </div>
    </Layout>
  );
}
