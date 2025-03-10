"use client"

import axios from 'axios';

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

const api = axios.create({
  baseURL: base_url,
  timeout: 1000000,
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