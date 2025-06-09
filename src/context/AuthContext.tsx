import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Mock login - replace with actual API call
      // In a real app, this would be an API call to verify credentials
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0], // Use part of email as name for demo
        role: 'user',
        phone: '+1234567890',
        avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
        favoriteSports: ['Football', 'Cricket'],
        preferredLocations: ['North', 'Central'],
        notificationPreferences: {
          email: true,
          sms: true,
          push: true
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Basic validation
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }

      // Mock registration - replace with actual API call
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9), // Generate random ID
        email,
        name,
        role: 'user',
        phone: '',
        avatarUrl: `https://i.pravatar.cc/150?u=${email}`, // Generate avatar based on email
        favoriteSports: [],
        preferredLocations: [],
        notificationPreferences: {
          email: true,
          sms: false,
          push: true
        }
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};