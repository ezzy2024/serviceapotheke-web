import axios from 'axios';
import { useToastStore } from '@/components/ui/Toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

let csrfToken: string | null = null;
let isFetchingCsrf = false;
let csrfPromise: Promise<string> | null = null;

const fetchCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  if (isFetchingCsrf && csrfPromise) return csrfPromise;

  isFetchingCsrf = true;
  csrfPromise = axios.get(`${api.defaults.baseURL}/Auth/csrf-token`, { withCredentials: true })
    .then(res => {
      csrfToken = res.data.csrfToken;
      return csrfToken as string;
    })
    .finally(() => {
      isFetchingCsrf = false;
    });

  return csrfPromise;
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Only attach CSRF token for mutating methods
    if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      try {
        const token = await fetchCsrfToken();
        if (token) {
          config.headers['X-CSRF-TOKEN'] = token;
        }
      } catch (e) {
        console.warn('Failed to fetch CSRF token', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/login';
        }
      } else if (error.response.status === 429) {
        useToastStore.getState().addToast({
          message: 'Zu viele Anfragen. Bitte warten Sie einen Moment.',
          type: 'warning',
          duration: 5000
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
