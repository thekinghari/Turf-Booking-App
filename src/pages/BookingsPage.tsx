import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../types';
import { bookings } from '../data/mockData';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency, getStatusColor } from '../lib/utils';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      // Simulate API call
      setTimeout(() => {
        // Filter bookings for current user
        const filteredBookings = bookings.filter(booking => booking.userId === user.id);
        setUserBookings(filteredBookings);
        setLoading(false);
      }, 500);
    }
  }, [user]);
  
  const currentDate = new Date();
  
  const upcomingBookings = userBookings.filter(booking => {
    const bookingDate = new Date(`${booking.date}T${booking.startTime}`);
    return bookingDate >= currentDate || booking.status === 'pending';
  });
  
  const pastBookings = userBookings.filter(booking => {
    const bookingDate = new Date(`${booking.date}T${booking.startTime}`);
    return bookingDate < currentDate && booking.status !== 'pending';
  });
  
  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'upcoming'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Bookings
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'past'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past Bookings
            </button>
          </div>
        </div>
        
        {/* Bookings List */}
        <div className="space-y-4">
          {displayBookings.length > 0 ? (
            displayBookings.map(booking => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  {/* Booking Info */}
                  <div className="p-4 md:col-span-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.turfName}</h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>Location details will be shown here</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                        <span>{booking.startTime} - {booking.endTime}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                      <Link to={`/turf/${booking.turfId}`}>
                        <Button variant="outline" size="sm">View Turf</Button>
                      </Link>
                      
                      {activeTab === 'upcoming' && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                          Cancel Booking
                        </Button>
                      )}
                      
                      {activeTab === 'past' && booking.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          Write Review
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Payment Info */}
                  <div className="p-4 md:col-span-2 bg-gray-50">
                    <h4 className="font-medium mb-3">Payment Information</h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking ID</span>
                        <span className="font-medium">BK{booking.id.padStart(4, '0')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Date</span>
                        <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method</span>
                        <span>Pay at Venue</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                        <span className="font-medium">Total Amount</span>
                        <span className="font-bold text-primary-700">{formatCurrency(booking.totalPrice)}</span>
                      </div>
                    </div>
                    
                    {activeTab === 'upcoming' && (
                      <div className="mt-4 text-sm bg-primary-50 p-3 rounded-md">
                        <p className="text-primary-800">
                          <span className="font-medium">Note:</span> Please arrive 15 minutes before your slot time.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming bookings."
                  : "You don't have any past bookings."}
              </p>
              <Link to="/search">
                <Button>Find Turfs to Book</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};