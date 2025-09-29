import axios from "axios";

const api = axios.create({
  // baseURL: "https://healthcare-sytem.onrender.com",
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export default api;
