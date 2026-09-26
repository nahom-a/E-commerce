import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
    const message = error.response?.data?.message || 'An error occurred';
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    alert(message);
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
};

export const deliveryApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/deliveries', { params }).then((r) => r.data),
  getById: (id: number) =>
    api.get(`/deliveries/${id}`).then((r) => r.data),
  create: (data: any) =>
    api.post('/deliveries', data).then((r) => r.data),
  update: (id: number, data: any) =>
    api.put(`/deliveries/${id}`, data).then((r) => r.data),
  assignDriver: (id: number, driverId: number) =>
    api.post(`/deliveries/${id}/assign`, { driverId }).then((r) => r.data),
  changeStatus: (id: number, status: string) =>
    api.post(`/deliveries/${id}/status`, { newStatus: status }).then((r) => r.data),
  cancel: (id: number) =>
    api.post(`/deliveries/${id}/cancel`).then((r) => r.data),
  getHistory: (id: number) =>
    api.get(`/deliveries/${id}/history`).then((r) => r.data),
  getDriverDeliveries: (driverId: number) =>
    api.get(`/deliveries/driver/${driverId}`).then((r) => r.data),
};

export const driverApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/drivers', { params }).then((r) => r.data),
  getById: (id: number) =>
    api.get(`/drivers/${id}`).then((r) => r.data),
  create: (data: any) =>
    api.post('/drivers', data).then((r) => r.data),
  update: (id: number, data: any) =>
    api.put(`/drivers/${id}`, data).then((r) => r.data),
  getDeliveries: (id: number) =>
    api.get(`/drivers/${id}/deliveries`).then((r) => r.data),
};

export const customerApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/customers', { params }).then((r) => r.data),
  getById: (id: number) =>
    api.get(`/customers/${id}`).then((r) => r.data),
  create: (data: any) =>
    api.post('/customers', data).then((r) => r.data),
  update: (id: number, data: any) =>
    api.put(`/customers/${id}`, data).then((r) => r.data),
  getDeliveries: (id: number) =>
    api.get(`/customers/${id}/deliveries`).then((r) => r.data),
};

export const activityApi = {
  getAll: () =>
    api.get('/activity').then((r) => r.data),
};

export const dashboardApi = {
  getStats: () =>
    api.get('/dashboard/stats').then((r) => r.data),
  getActivity: () =>
    api.get('/dashboard/activity').then((r) => r.data),
};