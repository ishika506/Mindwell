import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8800/api", // your backend URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // if using auth
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
