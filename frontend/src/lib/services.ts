import apiClient from './api';
import { Car, Brand, Order, User } from '@/types';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

// SWR fetcher
const fetcher = (url: string) => apiClient.get(url).then((res) => res.data);

// Auth APIs (non-cached)
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    apiClient.post('/api/auth/register', data),
  login: (email: string, password: string) =>
    apiClient.post('/api/auth/login', { email, password }),
};

// Cached Cars APIs
export const carsAPI = {
  useAll: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `/api/cars?${params}` : '/api/cars';
    return useSWR(url, fetcher, { revalidateOnFocus: false });
  },
  useById: (id: string) => useSWR(`/api/cars/${id}`, fetcher),
  useSearch: (query: string) => useSWR(`/api/cars/search?q=${query}`, fetcher),
  getAll: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `/api/cars?${params}` : '/api/cars';
    return apiClient.get(url);
  },
  create: (data: any) => apiClient.post('/api/cars', data),
  update: (id: string, data: any) => apiClient.put(`/api/cars/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/cars/${id}`),
};

// Cached Brands APIs
export const brandsAPI = {
  useAll: () => useSWR('/api/brands', fetcher),
  useById: (id: string) => useSWR(`/api/brands/${id}`, fetcher),
  getAll: () => apiClient.get('/api/brands'),
  create: (data: any) => apiClient.post('/api/brands', data),
  update: (id: string, data: any) => apiClient.put(`/api/brands/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/brands/${id}`),
};

// Cached Orders APIs
export const ordersAPI = {
  useMyOrders: () => useSWR('/api/orders/my', fetcher),
  useAll: () => useSWR('/api/orders', fetcher),
  useById: (id: string) => useSWR(`/api/orders/${id}`, fetcher),
  useStats: () => useSWR('/api/orders/stats', fetcher),
  getMyOrders: () => apiClient.get('/api/orders/my'),
  getAll: () => apiClient.get('/api/orders'),
  create: (data: any) => apiClient.post('/api/orders', data),
  update: (id: string, data: any) => apiClient.put(`/api/orders/${id}`, data),
  updateStatus: (id: string, status: string) =>
    apiClient.put(`/api/orders/${id}/status`, { status }),
  delete: (id: string) => apiClient.delete(`/api/orders/${id}`),
  scheduleVisit: (orderId: string, data: { name: string; phone: string; date: string }) =>
    apiClient.post(`/api/orders/${orderId}/schedule-visit`, data),
};
