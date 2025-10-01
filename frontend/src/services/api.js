import axios from 'axios';

// Create a new Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// --- Request Interceptor ---
// This function will be called before every request is sent
api.interceptors.request.use(
  (config) => {
    // Get the user data (which includes the token) from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // If the user and token exist, add the Authorization header
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;