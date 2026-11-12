import axios from 'axios';

const API = axios.create({
 baseURL: 'https://full-stack-admin-dashboard-production-e15a1937.up.railway.app/api', // Backend port 5001 par chal raha hai
  withCredentials: false
});

export default API;