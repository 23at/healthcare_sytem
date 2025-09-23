import api from "@/api/api";

export const login = async (username: string, password: string) => {
  const res = await api.post("/login", { username, password });
  return res.data; // e.g. { message: "Login successful" }
};

export const logout = async () => {
  await api.post("/logout");
};

export const checkSession = async () => {
  const res = await api.get("/check_session");
  return res.data; // { user: { id, username, role } } or { user: null }
};
