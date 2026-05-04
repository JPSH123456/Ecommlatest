import axios from 'axios';

// Connect to the API Gateway - Dynamic Environment Injection
// Falls back to hardcoded URL if VITE_API_HOST is not provided in Kubernetes
const apiHost = window._env_?.VITE_API_HOST || 'https://api.puneetdevops.online';

console.log("🚀 [v100] Connecting to API Host:", apiHost);

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
