import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 🔥 KHÔNG DÙNG localhost:5000 nữa
  withCredentials: true,
});

export default api;
