// import axios from "axios";

// export default axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: true
// });


// import axios client for API calls
import axios from "axios";

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

export default api;