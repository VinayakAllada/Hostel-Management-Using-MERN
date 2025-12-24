import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject(new Error("Network error. Please check your connection."));
    }

    // Handle specific status codes
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      console.error("Unauthorized:", message);
    } else if (status === 403) {
      console.error("Forbidden:", message);
    } else if (status === 404) {
      console.error("Not found:", message);
    } else if (status >= 500) {
      console.error("Server error:", message);
    }

    return Promise.reject(error);
  }
);

export default api;
