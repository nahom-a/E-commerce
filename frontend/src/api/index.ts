import axios from 'axios';
import {
  ApiResponse,
  CreateCustomerPayload,
  CreateDeliveryPayload,
  CreateDriverPayload,
  Customer,
  DashboardStats,
  Delivery,
  DeliveryStatusHistory,
  Driver,
  ActivityLog,
  PageResponse,
  User,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { email, password });
    return res.data.data;
  },
};

export const deliveryApi = {
  getAll: async (params?: Record<string, any>): Promise<PageResponse<Delivery>> => {
    const res = await api.get<ApiResponse<PageResponse<Delivery>>>('/deliveries', { params });
    return res.data.data;
  },
  getById: async (id: number): Promise<Delivery> => {
    const res = await api.get<ApiResponse<Delivery>>(`/deliveries/${id}`);
    return res.data.data;
  },
  create: async (data: CreateDeliveryPayload): Promise<Delivery> => {
    const res = await api.post<ApiResponse<Delivery>>('/deliveries', data);
    return res.data.data;
  },
  update: async (id: number, data: Partial<CreateDeliveryPayload>): Promise<Delivery> => {
    const res = await api.put<ApiResponse<Delivery>>(`/deliveries/${id}`, data);
    return res.data.data;
  },
  assignDriver: async (id: number, driverId: number): Promise<Delivery> => {
    const res = await api.post<ApiResponse<Delivery>>(`/deliveries/${id}/assign`, { driverId });
    return res.data.data;
  },
  changeStatus: async (id: number, status: string, note?: string): Promise<Delivery> => {
    const res = await api.post<ApiResponse<Delivery>>(`/deliveries/${id}/status`, { newStatus: status, note });
    return res.data.data;
  },
  cancel: async (id: number): Promise<void> => {
    await api.post<ApiResponse<void>>(`/deliveries/${id}/cancel`);
  },
  getHistory: async (id: number): Promise<DeliveryStatusHistory[]> => {
    const res = await api.get<ApiResponse<DeliveryStatusHistory[]>>(`/deliveries/${id}/history`);
    return res.data.data;
  },
  getDriverDeliveries: async (driverId: number): Promise<Delivery[]> => {
    const res = await api.get<ApiResponse<Delivery[]>>(`/deliveries/driver/${driverId}`);
    return res.data.data;
  },
};

export const driverApi = {
  getAll: async (params?: Record<string, any>): Promise<PageResponse<Driver>> => {
    const res = await api.get<ApiResponse<PageResponse<Driver>>>('/drivers', { params });
    return res.data.data;
  },
  getById: async (id: number): Promise<Driver> => {
    const res = await api.get<ApiResponse<Driver>>(`/drivers/${id}`);
    return res.data.data;
  },
  create: async (data: CreateDriverPayload): Promise<Driver> => {
    const res = await api.post<ApiResponse<Driver>>('/drivers', data);
    return res.data.data;
  },
  update: async (id: number, data: Partial<CreateDriverPayload>): Promise<Driver> => {
    const res = await api.put<ApiResponse<Driver>>(`/drivers/${id}`, data);
    return res.data.data;
  },
  getDeliveries: async (id: number): Promise<Delivery[]> => {
    const res = await api.get<ApiResponse<Delivery[]>>(`/drivers/${id}/deliveries`);
    return res.data.data;
  },
};

export const customerApi = {
  getAll: async (params?: Record<string, any>): Promise<PageResponse<Customer>> => {
    const res = await api.get<ApiResponse<PageResponse<Customer>>>('/customers', { params });
    return res.data.data;
  },
  getById: async (id: number): Promise<Customer> => {
    const res = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
    return res.data.data;
  },
  create: async (data: CreateCustomerPayload): Promise<Customer> => {
    const res = await api.post<ApiResponse<Customer>>('/customers', data);
    return res.data.data;
  },
  update: async (id: number, data: Partial<CreateCustomerPayload>): Promise<Customer> => {
    const res = await api.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return res.data.data;
  },
  getDeliveries: async (id: number): Promise<Delivery[]> => {
    const res = await api.get<ApiResponse<Delivery[]>>(`/customers/${id}/deliveries`);
    return res.data.data;
  },
};

export const activityApi = {
  getAll: async (): Promise<ActivityLog[]> => {
    const res = await api.get<ApiResponse<ActivityLog[]>>('/activity');
    return res.data.data;
  },
};

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return res.data.data;
  },
  getActivity: async (): Promise<ActivityLog[]> => {
    const res = await api.get<ApiResponse<ActivityLog[]>>('/dashboard/activity');
    return res.data.data;
  },
};

export default api;