import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContextType, User } from '../types';
import { users } from '../data/mockData';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = users.find(u => u.email === email);
        
        // In a real app, we would validate the password here
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  };

  const register = async (name: string, email: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
          reject(new Error('Email already in use'));
        } else {
          // In a real app, we would create a new user in the database
          const newUser: User = {
            id: `${users.length + 1}`,
            name,
            email,
            phone: '', // Add a default or collected phone value here
            isAdmin: false,
          };
          
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          resolve();
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    register,
    logout
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};