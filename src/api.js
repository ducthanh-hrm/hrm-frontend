import axios from "axios";

const API = axios.create({
  baseURL: "https://hrm-backend-zeta.vercel.app"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = token; // giữ nguyên
  }

  return config;
});

// 🔥 thêm cái này là đủ xịn rồi
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      window.location.reload(); // quay về login
    }
    return Promise.reject(err);
  }
);

export default API;