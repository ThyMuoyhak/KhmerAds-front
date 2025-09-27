// In src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://khmer365-1.onrender.com', // Updated to Render URL
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
