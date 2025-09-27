import axios from "axios";

const api = axios.create({
  baseURL: "https://healthcare-sytem.onrender.com",
  withCredentials: true,
});

export default api;
