import axios from "axios";

// IMPORTANT: URL should end with /api
const API_URL = import.meta.env.VITE_API_URL || "https://online-prescription-platform-7kp8.onrender.com/api";

const api = axios.create({
    baseURL: API_URL,  // This should end with /api
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log(`📥 API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error("❌ Response Error:", error.response?.status, error.message);
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;