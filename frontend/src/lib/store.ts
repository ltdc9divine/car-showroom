import { create } from 'zustand';
import { User, Car } from '@/types';

// Helper to safely access localStorage
const getStoredAuth = () => {
  if (typeof window === 'undefined') return { user: null, token: null };
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return {
      user: user ? JSON.parse(user) : null,
      token,
    };
  } catch {
    return { user: null, token: null };
  }
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const stored = getStoredAuth();
  return {
    user: stored.user,
    token: stored.token,
    isAuthenticated: !!stored.user,
    setUser: (user, token) => {
      set({ user, token, isAuthenticated: !!user });
      if (typeof window !== 'undefined') {
        if (user && token) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    },
    logout: () => {
      set({ user: null, token: null, isAuthenticated: false });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    },
  };
});

interface CartItem extends Car {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (car: Car, quantity?: number) => void;
  removeItem: (carId: string) => void;
  updateQuantity: (carId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (car, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item._id === car._id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item._id === car._id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }
      return { items: [...state.items, { ...car, quantity }] };
    });
  },
  removeItem: (carId) => {
    set((state) => ({
      items: state.items.filter((item) => item._id !== carId),
    }));
  },
  updateQuantity: (carId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item._id === carId ? { ...item, quantity } : item,
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
