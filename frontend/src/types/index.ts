export type Role = 'ADMIN' | 'DISPATCHER' | 'DRIVER';

export type DeliveryStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED';

export type DriverStatus = 'AVAILABLE' | 'ON_DELIVERY' | 'OFFLINE';

export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type PackageSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Delivery {
  id: number;
  deliveryNumber: string;
  customerId: number | null;
  customerName: string | null;
  recipientName: string;
  recipientPhone: string;
  address: string;
  city: string;
  packageDescription: string;
  packageSize: PackageSize | string;
  priority: Priority;
  status: DeliveryStatus;
  driverId: number | null;
  driverName: string | null;
  scheduledDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: number;
  phone: string;
  vehicle: string;
  licenseNumber: string;
  status: DriverStatus;
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
  oldStatus: string | null;
  newStatus: DeliveryStatus;
  changedBy: User | null;
  changedAt: string;
  note: string | null;
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

export interface CreateDeliveryPayload {
  customerId?: number;
  recipientName: string;
  recipientPhone: string;
  address: string;
  city: string;
  packageDescription: string;
  packageSize?: string;
  priority?: Priority;
  scheduledDate?: string | null;
  driverId?: number | null;
}

export interface CreateDriverPayload {
  phone: string;
  vehicle: string;
  licenseNumber: string;
  status: DriverStatus;
}

export interface CreateCustomerPayload {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
}