export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin?: boolean;
  avatarUrl?: string;
  role: 'user' | 'admin';
  favoriteSports?: string[];
  preferredLocations?: string[];
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface Turf {
  id: string;
  name: string;
  description: string;
  location: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  sports: string[];
  amenities: string[];
  images: string[];
  price: number;
  openTime: string;
  closeTime: string;
  rating: number;
  reviews: Review[];
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  preferences: {
    favoriteSports: string[];
    preferredLocations: string[];
    notificationPreferences: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  turfId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'reminder' | 'promotion' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    bookingId?: string;
    turfId?: string;
    actionUrl?: string;
  };
}

export interface MultiSlotBooking {
  id: string;
  userId: string;
  turfId: string;
  slots: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // Calculated distance from user's location
}

export interface Feedback {
  id: string;
  userId: string;
  bookingId: string;
  turfId: string;
  rating: number;
  categories: {
    facility: number;
    service: number;
    value: number;
    cleanliness: number;
  };
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}