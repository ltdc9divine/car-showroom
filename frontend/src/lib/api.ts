import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from './store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get token from store or localStorage
const getToken = (): string | null => {
  // First try to get from zustand store
  const storeToken = useAuthStore.getState().token;
  console.log('[API] Store token:', storeToken ? 'exists' : 'null');
  
  if (storeToken) return storeToken;
  
  // Fallback to localStorage directly
  if (typeof window !== 'undefined') {
    const lsToken = localStorage.getItem('token');
    console.log('[API] LS token:', lsToken ? 'exists' : 'null');
    return lsToken;
  }
  return null;
};

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[API] Sending request with token:', config.url);
  } else {
    console.log('[API] NO TOKEN for request:', config.url);
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('[API] Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
