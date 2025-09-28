"use client";
import api from "@/api/api";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LoginPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const router = useRouter();
  const [loading, setLoading] = React.useState(true); // 🔑 wait for session check

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/check_session");
        if (res.data?.user) {
          router.replace("/");
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async () => {
    try {
      await api.post("/login", { username, password });
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("login failed");
      }
    }
  };
  if (loading) {
    return <p className="p-6 text-center">Checking session...</p>;
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        className="border p-2 w-full mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage;
