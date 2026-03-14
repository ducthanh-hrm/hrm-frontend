import axios from "axios";

const API = axios.create({
  baseURL: "https://hrm-backend-zeta.vercel.app"
});

export default API;