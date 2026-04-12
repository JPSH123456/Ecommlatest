import axios from 'axios';

// Connect to the API Gateway - Primary Production URL
// We use a hardcoded fallback to ensure it NEVER defaults to localhost in a production build
const PROD_API_URL = 'https://api.puneetdevops.online';
const apiHost = import.meta.env.VITE_API_HOST || PROD_API_URL;

console.log("🌐 API Host Connection:", apiHost);

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
