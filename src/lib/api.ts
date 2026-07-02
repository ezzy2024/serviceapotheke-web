import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for sending and receiving HttpOnly cookies
});

// Request interceptor: No need to manually attach tokens anymore!
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Global 401 handler
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, redirect to login ONLY if they are on a protected route
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
