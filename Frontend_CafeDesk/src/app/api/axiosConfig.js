// src/app/services/axiosConfig.js

import axios from "axios";

// ================= AXIOS INSTANCE =================

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================

api.interceptors.request.use(
  (config) => {
    // Prevent SSR localStorage crash
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// ================= RESPONSE INTERCEPTOR =================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    // ================= NETWORK ERROR =================

    if (!error.response) {
      console.error("Network Error / Backend Down");

      return Promise.reject({
        message: "Server not responding",
      });
    }

    // ================= UNAUTHORIZED =================

    if (error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // Prevent infinite reload
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    // ================= FORBIDDEN =================

    if (error.response.status === 403) {
      console.error("Access Denied");

      return Promise.reject({
        message: "Access denied",
      });
    }

    // ================= SERVER ERROR =================

    if (error.response.status >= 500) {
      console.error("Internal Server Error");

      return Promise.reject({
        message: "Internal server error",
      });
    }

    return Promise.reject(error);
  },
);

export default api;
