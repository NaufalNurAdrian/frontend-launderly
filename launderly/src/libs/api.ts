"use client"

import axios from 'axios';

const api = axios.create({
  baseURL: `http://localhost:8000/api`,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
  
});
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers!.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });
export default api;