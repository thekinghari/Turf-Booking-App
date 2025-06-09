import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Star, ChevronLeft, ChevronRight, Info, ArrowLeft, Navigation, Phone, Mail, Globe } from 'lucide-react';
import { Turf, Slot } from '../types';
import { turfs, slots } from '../data/mockData';
import { formatCurrency, getAmenityIcon, getSportIcon } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { BookingCalendar } from '../components/turf/BookingCalendar';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

export const TurfDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [turfSlots, setTurfSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundTurf = turfs.find(t => t.id === id);
      const filteredSlots = slots.filter(s => s.turfId === id);
      
      setTurf(foundTurf || null);
      setTurfSlots(filteredSlots);
      setLoading(false);
    }, 500);
  }, [id]);

  const handlePrevImage = () => {
    if (!turf) return;
    setCurrentImageIndex((prev) => (prev === 0 ? turf.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!turf) return;
    setCurrentImageIndex((prev) => (prev === turf.images.length - 1 ? 0 : prev + 1));
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/turf/${id}` } });
      return;
    }

    if (selectedSlot) {
      navigate(`/booking-confirm/${id}`, { 
        state: { selectedSlot } 
      });
    } else {
      // Scroll to calendar
      const calendar = document.getElementById('booking-calendar');
      if (calendar) {
        calendar.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleGetDirections = () => {
    if (!turf) return;
    const { latitude, longitude } = turf.location.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Turf Not Found</h2>
          <p className="text-gray-600 mb-6">The turf you're looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to results
        </button>

        {/* Turf Image Gallery */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="relative h-64 md:h-96">
            <img
              src={turf.images[currentImageIndex]}
              alt={turf.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Image Navigation */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {turf.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
            
            {/* Turf info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{turf.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{turf.location.name} - {turf.location.address}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                  <span>{turf.rating} ({turf.reviews.length} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Turf Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About this turf</h2>
                <p className="text-gray-700 mb-6">{turf.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Opening Hours</p>
                      <p className="text-gray-600">{turf.openTime} - {turf.closeTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Info className="h-5 w-5 text-primary-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-gray-600">{formatCurrency(turf.price)} per hour</p>
                    </div>
                  </div>
                </div>
                
                {/* Sports */}
                <h3 className="font-medium mb-2">Sports Available</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {turf.sports.map(sport => {
                    const icon = getSportIcon(sport);
                    return (
                      <div key={sport} className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                        <span className={`mr-1.5 text-primary-600`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={icon}>
                            {icon === 'ball-football' && <circle cx="12" cy="12" r="10" />}
                            {icon === 'ball-football' && <path d="m3 12 7-2 2-6 2 6 7 2-5 4 2 6-6-3-6 3 2-6-5-4Z" />}
                            {icon === 'basketball' && <circle cx="12" cy="12" r="10" />}
                            {icon === 'basketball' && <path d="M4.9 7.5C5.2 5.1 7.2 3.2 9.6 3 10 5.7 11 8.3 12.6 10.5" />}
                            {icon === 'basketball' && <path d="M3 12.5h18" />}
                            {icon === 'basketball' && <path d="M14.3 3c3.8.7 6.7 4 6.7 8m-1.7-1.5C18.6 6.7 16 4.2 12.8 3" />}
                            {icon === 'basketball' && <path d="M16.8 21.1c-2.6 1-5.5.5-7.8-1.3-.4-.4-1-.8-1.1-1.2" />}
                            {icon === 'basketball' && <path d="M10 12.1c-1.1 1.4-1.8 3-2.3 4.6-1.4-1.3-2.4-3-2.6-4.9" />}
                            {icon === 'racquet' && <circle cx="12" cy="12" r="10" />}
                            {icon === 'racquet' && <path d="M9.5 3.5 5 8" />}
                            {icon === 'racquet' && <path d="M14.5 3.5 19 8" />}
                            {icon === 'racquet' && <path d="M19 8c-1.4 1.4-3.8 3-6.4 3.4-2 .3-4-.2-5.6-1.4-1.1-.8-2.5-1-3.6-.4" />}
                            {icon === 'racquet' && <path d="M5 8c1.4 1.4 3.8 3 6.4 3.4 2 .3 4-.2 5.6-1.4 1.1-.8 2.5-1 3.6-.4" />}
                            {icon === 'activity' && <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />}
                          </svg>
                        </span>
                        {sport}
                      </div>
                    );
                  })}
                </div>

                {/* Amenities */}
                <h3 className="font-medium mb-2">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {turf.amenities.map(amenity => {
                    const icon = getAmenityIcon(amenity);
                    return (
                      <div key={amenity} className="flex items-center text-sm">
                        <span className="text-primary-600 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={icon}>
                            {/* Default icon paths based on the amenity */}
                            <path d="M12 2v20" />
                          </svg>
                        </span>
                        {amenity}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Location and Map */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Location</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetDirections}
                    leftIcon={<Navigation className="h-4 w-4" />}
                  >
                    Get Directions
                  </Button>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-start space-x-2 text-gray-600">
                    <MapPin className="h-5 w-5 text-primary-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{turf.location.name}</p>
                      <p>{turf.location.address}</p>
                    </div>
                  </div>
                </div>

                <div className="h-[400px] rounded-lg overflow-hidden relative">
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                  ) : (
                    turf && (
                      <MapContainer 
                        center={[turf.location.coordinates.latitude, turf.location.coordinates.longitude]}
                        zoom={15}
                        scrollWheelZoom={false}
                        style={mapContainerStyle}
                      >
                        <TileLayer
                          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[turf.location.coordinates.latitude, turf.location.coordinates.longitude]} />
                      </MapContainer>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">+91 9876543210</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">contact@{turf.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Website</p>
                      <a 
                        href={`https://${turf.name.toLowerCase().replace(/\s+/g, '')}.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        {turf.name.toLowerCase().replace(/\s+/g, '')}.com
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Section */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Book Now</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Price per hour</p>
                    <p className="text-2xl font-bold text-primary-600">{formatCurrency(turf.price)}</p>
                  </div>
                  <Button
                    onClick={handleBookNow}
                    className="w-full"
                    size="lg"
                  >
                    {selectedSlot ? 'Proceed to Book' : 'Select a Time Slot'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div id="booking-calendar">
              <BookingCalendar
                slots={turfSlots}
                onSelectSlot={handleSlotSelect}
                selectedSlot={selectedSlot}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};