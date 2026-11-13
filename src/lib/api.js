import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://full-stack-admin-dashboard-production-e15a1937.up.railway.app/api',
  withCredentials: true
});

export default API;
