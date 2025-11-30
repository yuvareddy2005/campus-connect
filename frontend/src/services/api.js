import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- REQUEST INTERCEPTOR (Attaches Token) ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR (Unwraps Data & Handles Errors) ---
api.interceptors.response.use(
  (response) => {
    // If the backend returns our standard ApiResponse structure
    if (response.data && response.data.success !== undefined) {
      // Return the inner 'data' so components get what they expect
      // We attach the 'message' to it just in case a component needs it
      if (response.data.data && typeof response.data.data === 'object') {
         response.data.data._message = response.data.message;
      }
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    // If the backend returned a structured error (from GlobalExceptionHandler)
    if (error.response && error.response.data) {
      const serverError = error.response.data;
      // You could log this or trigger a global toast notification here
      console.error("API Error:", serverError.message || serverError.error);
      
      // Pass the helpful message down to the component
      return Promise.reject(serverError.message || "An unexpected error occurred");
    }
    return Promise.reject(error);
  }
);

export default api;