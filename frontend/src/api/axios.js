import axios from 'axios';

// Connect to the API Gateway - ABSOLUTE PRODUCTION HTTPS URL
// Unique Tag for Cache Verification: [v100-PROD-STABLE]
const PROD_API_URL = 'https://api.puneetdevops.online';
const apiHost = PROD_API_URL; 

console.log("🚀 PROD FIX [v100] applied! Connecting to:", apiHost);

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
