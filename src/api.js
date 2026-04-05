import axios from "axios";

const API = axios.create({
  baseURL: "https://railway.com/project/287ab9de-1c29-42c6-a6b4-ce59c5a90a8a"
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