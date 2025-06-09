import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface UserPreferences {
  favoriteSports: string[];
  preferredLocations: string[];
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  preferences: UserPreferences;
}

interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        // Initialize profile with user data
        const initialProfile: UserProfile = {
          id: user.id,
          name: user.name || '',
          email: user.email,
          phone: user.phone || '',
          address: '',
          preferences: {
            favoriteSports: user.favoriteSports || [],
            preferredLocations: user.preferredLocations || [],
            notificationPreferences: user.notificationPreferences || {
              email: true,
              sms: false,
              push: true,
            },
          },
        };

        // Store the initial profile in localStorage
        localStorage.setItem('userProfile', JSON.stringify(initialProfile));
        setProfile(initialProfile);
        setError(null);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;

    try {
      // Update both profile and user data
      const updatedProfile = { ...profile, ...data };
      setProfile(updatedProfile);
      
      // Update user data in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUser = {
          ...userData,
          name: data.name || userData.name,
          phone: data.phone || userData.phone,
          favoriteSports: data.preferences?.favoriteSports || userData.favoriteSports,
          preferredLocations: data.preferences?.preferredLocations || userData.preferredLocations,
          notificationPreferences: data.preferences?.notificationPreferences || userData.notificationPreferences,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // Update profile in localStorage
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  return (
    <UserContext.Provider value={{ profile, loading, error, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser }; 