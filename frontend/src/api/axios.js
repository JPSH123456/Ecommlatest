import axios from 'axios';

// Connect to the API Gateway - Using build-time configuration
const apiHost = import.meta.env.VITE_API_HOST || 'https://api.puneetdevops.online';

console.log("🚀 API Host Initialized:", apiHost);

const api = axios.create({
  baseURL: apiHost,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
