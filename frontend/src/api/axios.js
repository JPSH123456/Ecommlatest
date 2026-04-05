import axios from 'axios';

// Connect to the API Gateway at port 8000
const api = axios.create({
  // baseURL: 'http://localhost:8000',
  baseURL: 'http://api.puneetdevops.online',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
