// import axios client for API calls
import axios from "axios";

// Axios instance configured for backend API calls with cookies
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// api.defaults.headers.common["Authorization"] = `Bearer ${token}`;


export default api;