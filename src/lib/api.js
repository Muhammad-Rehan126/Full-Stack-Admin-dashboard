import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', // Backend port 5001 par chal raha hai
  withCredentials: true
});

export default API;