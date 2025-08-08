// src/services/api.js
import axios from 'axios';
import { getToken, clearAuthData } from '../utils/authUtils'; // We use getToken here

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Get backend URL from .env

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending/receiving cookies (like our JWT cookie)
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = getToken(); // Retrieve token from localStorage (if stored there)
    // If using HttpOnly cookies exclusively, getToken() might return null.
    // The browser automatically sends HttpOnly cookies with 'withCredentials: true'.
    // However, if you also rely on a Bearer token in headers (e.g., for some frontend logic or if cookies fail),
    // this line ensures it's added.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is due to authentication failure (e.g., token expired or invalid)
    if (error.response && error.response.status === 401) {
      console.log('Authentication failed or token expired. Clearing auth data...');
      clearAuthData(); // Clear any local auth data immediately
      // Optionally, you might want to force a redirect to login here,
      // but often it's better to let components handle it or let a higher-level AuthContext manage it
      // based on isAuthenticated status changing to false.
      // window.location.href = '/login'; // Or use react-router-dom's navigate in a context/hook
    }
    return Promise.reject(error);
  }
);

export default api;