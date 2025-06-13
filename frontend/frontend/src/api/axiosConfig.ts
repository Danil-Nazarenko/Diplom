import axios from 'axios';
import { getToken } from '../utils/authHelper';

const api = axios.create({
  baseURL: 'http://localhost:5045/api',
});

api.interceptors.request.use((config) => {
  const token = getToken();

  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
