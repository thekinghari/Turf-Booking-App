import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Switch } from '../ui/Switch';
import { notificationService } from '../../services/NotificationService';
import { Star, MapPin, Bell } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { profile, loading, error, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    preferences: {
      favoriteSports: profile?.preferences.favoriteSports || [],
      preferredLocations: profile?.preferences.preferredLocations || [],
      notificationPreferences: {
        email: profile?.preferences.notificationPreferences.email || false,
        sms: profile?.preferences.notificationPreferences.sms || false,
        push: profile?.preferences.notificationPreferences.push || false,
      },
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSportChange = (sport: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        favoriteSports: prev.preferences.favoriteSports.includes(sport)
          ? prev.preferences.favoriteSports.filter((s) => s !== sport)
          : [...prev.preferences.favoriteSports, sport],
      },
    }));
  };

  const handleLocationChange = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        preferredLocations: prev.preferences.preferredLocations.includes(location)
          ? prev.preferences.preferredLocations.filter((l) => l !== location)
          : [...prev.preferences.preferredLocations, location],
      },
    }));
  };

  const handleNotificationChange = (type: 'email' | 'sms' | 'push') => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notificationPreferences: {
          ...prev.preferences.notificationPreferences,
          [type]: !prev.preferences.notificationPreferences[type],
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
      // Send notification about profile update
      await notificationService.sendNotification({
        userId: profile!.id,
        type: 'system',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated.',
        read: false,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">My Profile</h1>
              <Button
                variant={isEditing ? 'outline' : 'primary'}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                    <Input
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                    <Input
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                {/* Sports Preferences */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Favorite Sports</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Football', 'Cricket', 'Tennis', 'Basketball', 'Badminton'].map((sport) => (
                      <div
                        key={sport}
                        className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer ${
                          formData.preferences.favoriteSports.includes(sport)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200'
                        }`}
                        onClick={() => isEditing && handleSportChange(sport)}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            formData.preferences.favoriteSports.includes(sport)
                              ? 'text-primary-500'
                              : 'text-gray-400'
                          }`}
                        />
                        <span>{sport}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Preferences */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Preferred Locations</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['North', 'South', 'East', 'West', 'Central'].map((location) => (
                      <div
                        key={location}
                        className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer ${
                          formData.preferences.preferredLocations.includes(location)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200'
                        }`}
                        onClick={() => isEditing && handleLocationChange(location)}
                      >
                        <MapPin
                          className={`h-5 w-5 ${
                            formData.preferences.preferredLocations.includes(location)
                              ? 'text-primary-500'
                              : 'text-gray-400'
                          }`}
                        />
                        <span>{location}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notification Preferences */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-gray-500" />
                        <span>Email Notifications</span>
                      </div>
                      <Switch
                        checked={formData.preferences.notificationPreferences.email}
                        onChange={() => isEditing && handleNotificationChange('email')}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-gray-500" />
                        <span>SMS Notifications</span>
                      </div>
                      <Switch
                        checked={formData.preferences.notificationPreferences.sms}
                        onChange={() => isEditing && handleNotificationChange('sms')}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-gray-500" />
                        <span>Push Notifications</span>
                      </div>
                      <Switch
                        checked={formData.preferences.notificationPreferences.push}
                        onChange={() => isEditing && handleNotificationChange('push')}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 