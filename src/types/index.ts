export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
}

export interface Turf {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  amenities: string[];
  openTime: string;
  closeTime: string;
  sports: string[];
}

export interface Slot {
  id: string;
  turfId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  turfId: string;
  turfName: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}