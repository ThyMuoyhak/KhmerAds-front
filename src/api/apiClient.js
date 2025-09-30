// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://khmer365-1.onrender.com',
  // បន្ថែមនេះដើម្បី handle redirects
  maxRedirects: 5,
  validateStatus: function (status) {
    return status >= 200 && status < 400; // Accept redirects
  }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;