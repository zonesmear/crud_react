// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://crud-react-g32u.onrender.com/api",
});

// ✅ Automatically add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
