import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Slot, Turf, Booking } from '../types';
import { turfs, bookings } from '../data/mockData';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency } from '../lib/utils';
import { Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/NotificationService';

export const BookingConfirmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  
  // Get the selected slot from location state
  const selectedSlot = location.state?.selectedSlot as Slot | undefined;
  const turf = turfs.find(t => t.id === id) as Turf | undefined;
  
  if (!selectedSlot || !turf) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Invalid Booking</h2>
          <p className="text-gray-600 mb-6">
            The booking information is incomplete or invalid. Please go back and try again.
          </p>
          <Button onClick={() => navigate(`/turf/${id}`)}>
            Go Back to Turf
          </Button>
        </div>
      </div>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!user?.email) {
        throw new Error('Email address is required for booking confirmation');
      }

      if (!phoneNumber) {
        throw new Error('Phone number is required for booking confirmation');
      }

      // Create new booking
      const newBooking: Booking = {
        id: (bookings.length + 1).toString(),
        userId: user?.id || '',
        turfId: turf.id,
        turfName: turf.name,
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        totalPrice: selectedSlot.price,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      console.log('Creating new booking:', newBooking);
      
      // Add new booking to bookings array
      bookings.push(newBooking);
      
      // Send notifications
      try {
        console.log('Sending notifications for booking:', {
          bookingId: newBooking.id,
          userEmail: user.email,
          userPhone: phoneNumber
        });

        await notificationService.sendBookingConfirmation(
          newBooking,
          user.email,
          phoneNumber
        );

        console.log('Notifications sent successfully');
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
        // Don't throw the error, just log it and continue
        // The booking is still valid even if notifications fail
      }
      
      setLoading(false);
      setBookingSuccess(true);
    } catch (error) {
      console.error('Booking error:', error);
      setError(error instanceof Error ? error.message : 'Failed to confirm booking. Please try again.');
      setLoading(false);
    }
  };
  
  if (bookingSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Your booking has been confirmed. We've sent a confirmation to your email address.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Turf:</div>
                  <div className="font-medium">{turf.name}</div>
                  
                  <div className="text-gray-500">Date:</div>
                  <div className="font-medium">{selectedSlot.date}</div>
                  
                  <div className="text-gray-500">Time:</div>
                  <div className="font-medium">{selectedSlot.startTime} - {selectedSlot.endTime}</div>
                  
                  <div className="text-gray-500">Booking ID:</div>
                  <div className="font-medium">BK{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</div>
                </div>
              </div>
              
              <Button fullWidth onClick={() => navigate('/bookings')}>
                View My Bookings
              </Button>
              <Button 
                variant="outline" 
                fullWidth 
                className="mt-3"
                onClick={() => navigate('/')}
              >
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Turf
        </button>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirm Your Booking</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Booking Form */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                          label="Name"
                          value={user?.name || ''}
                          disabled
                        />
                        <Input 
                          label="Email"
                          value={user?.email || ''}
                          disabled
                        />
                      </div>
                      
                      <Input 
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Special Requests (Optional)
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Any special requests or notes for your booking"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h3 className="font-medium mb-3">Payment Method</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-3">
                            <input
                              type="radio"
                              id="pay-later"
                              name="payment-method"
                              checked
                              readOnly
                              className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                            />
                            <label htmlFor="pay-later" className="ml-2 text-sm font-medium text-gray-700">
                              Pay at Venue
                            </label>
                          </div>
                          <p className="text-sm text-gray-500">
                            You can pay directly at the venue before your slot time.
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <Button 
                          type="submit" 
                          fullWidth 
                          size="lg"
                          isLoading={loading}
                        >
                          Confirm Booking
                        </Button>
                        <p className="text-xs text-gray-500 text-center mt-3">
                          By confirming, you agree to our Terms and Conditions and Cancellation Policy
                        </p>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Booking Summary */}
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-semibold mb-4">Booking Summary</h2>
                    
                    <div className="mb-4">
                      <div className="relative h-24 w-full rounded-md overflow-hidden mb-3">
                        <img 
                          src={turf.images[0]} 
                          alt={turf.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium">{turf.name}</h3>
                      <p className="text-sm text-gray-600">{turf.location.name} - {turf.location.address}</p>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mb-3">
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium">{selectedSlot.date}</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-600">Time</span>
                        <span className="font-medium">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">1 hour</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 py-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-primary-700">{formatCurrency(selectedSlot.price)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Includes all applicable taxes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};