import axios from 'axios';

// Connect to the API Gateway - Hardcoded for production simplicity
const api = axios.create({
  baseURL: 'https://api.puneetdevops.online',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
