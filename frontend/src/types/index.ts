export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
}

export interface Brand {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface Car {
  _id: string;
  name: string;
  brand: Brand | string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  images: string[];
  interiorImages?: string[];
  angleImages?: string[];
  description: string;
  color?: string;
  rating?: number;
  reviews?: number;
  isAvailable: boolean;
}

export interface OrderItem {
  car: Car | string;
  price: number;
  quantity: number;
}

export interface ScheduleVisit {
  name: string;
  phone: string;
  date: string;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  total: number;
  depositAmount?: number;
  paymentSessionId?: string;
  status: OrderStatus;
  notes?: string;
  deliveryDate?: string;
  shippingAddress?: string;
  scheduleVisit?: ScheduleVisit;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'deposited' | 'completed' | 'cancelled';
