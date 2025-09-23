"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/api";

export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/check_session");
        setUser(res.data.user);
      } catch {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return user;
}
