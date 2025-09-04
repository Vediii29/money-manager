import axios from "axios";
import { BASE_URL } from "./apiEndpoints.js";

const axiosConfig = axios.create({
    baseURL: BASE_URL, 
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// List of endpoints that do not require authorization header
const excludeEndpoints = ["/login", "/register", "/status", "/activate", "/health"];

// Request interceptor
axiosConfig.interceptors.request.use((config) => {
    const shouldSkipToken = excludeEndpoints.some((endpoint) => {
        return config.url?.includes(endpoint);
    });
    
    if (!shouldSkipToken) {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor (FIXED - this was incorrectly set as request interceptor)
axiosConfig.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
        if (error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        } else if (error.response.status === 403) {
            console.error("Access forbidden. You may not have permission.");
        } else if (error.response.status === 500) {
            console.error("Server error. Please try again later");
        }
    } else if (error.code === "ECONNABORTED") {
        console.error("Request timeout. Please try again.");
    }
    return Promise.reject(error);
});

export default axiosConfig;