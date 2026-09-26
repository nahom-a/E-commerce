export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Delivery {
  id: number;
  deliveryNumber: string;
  customerId: number;
  customerName: string;
  recipientName: string;
  recipientPhone: string;
  address: string;
  city: string;
  packageDescription: string;
  packageSize: string;
  priority: string;
  status: string;
  driverId: number | null;
  driverName: string | null;
  scheduledDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: number;
  phone: string;
  vehicle: string;
  licenseNumber: string;
  status: string;
  userName: string;
  activeDeliveries: number;
}

export interface Customer {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: string;
}

export interface ActivityLog {
  id: number;
  actor: string;
  action: string;
  entityType: string;
  entityId: number;
  description: string;
  createdAt: string;
}

export interface DeliveryStatusHistory {
  id: number;
  deliveryId: number;
  oldStatus: string;
  newStatus: string;
  changedBy: string;
  changedAt: string;
  note: string;
}

export interface DashboardStats {
  activeDeliveries: number;
  pendingAssignment: number;
  outForDelivery: number;
  deliveredToday: number;
  failedToday: number;
  deliveriesLast7Days: Array<{ date: string; count: number }>;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}