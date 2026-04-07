import axios from "axios";

// Tạo instance Axios
const API = axios.create({
  baseURL: "https://hrm-backend-final.onrender.com"
});

// Interceptor trước khi gửi request: gắn token nếu có
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token; // auto thêm Bearer
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor xử lý response
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