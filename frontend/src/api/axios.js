import axios from 'axios';

// Connect to the API Gateway - Use environment variable
const api = axios.create({
  baseURL: (window._env_ && window._env_.VITE_API_HOST) || import.meta.env.VITE_API_HOST || 'https://api.puneetdevops.online',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
