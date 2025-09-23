"use client";

import useAuth from "@/hooks/useAuth";
import api from "@/api/api";
import { useRouter } from "next/navigation";

export default function PatientsPage() {
  const user = useAuth(); // 🔑 will redirect if not logged in
  const router = useRouter();

  if (!user) return <p>Checking session...</p>;

  const handleLogout = async () => {
    try {
      await api.post("/logout"); // clear Flask session
      router.push("/login"); // redirect to login page
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div>
      <h1>Patients Page</h1>
      <p>
        Welcome, {user.username} ({user.role})
      </p>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-3 py-1 rounded mt-4"
      >
        Logout
      </button>

      {/* rest of your patients code here */}
    </div>
  );
}
