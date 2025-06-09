import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { Turf } from '../types';
import { turfs } from '../data/mockData';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { TurfCard } from '../components/home/TurfCard';

export const SearchPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [sportFilter, setSportFilter] = useState(searchParams.get('sport') || '');
  const [locationFilter, setLocationFilter] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [filteredTurfs, setFilteredTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(10); // Default radius in kilometers

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Apply initial filters
    filterTurfs();
    setLoading(false);
  }, [searchTerm, sportFilter, locationFilter, priceRange, radius]);

  const filterTurfs = () => {
    let results = [...turfs];
    
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        turf => 
          turf.name.toLowerCase().includes(searchLower) || 
          turf.location.name.toLowerCase().includes(searchLower) || 
          turf.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sport filter
    if (sportFilter) {
      results = results.filter(
        turf => turf.sports.some(sport => sport.toLowerCase() === sportFilter.toLowerCase())
      );
    }
    
    // Location filter
    if (locationFilter) {
      results = results.filter(
        turf => turf.location.name.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    // Price range filter
    results = results.filter(
      turf => turf.price >= priceRange[0] && turf.price <= priceRange[1]
    );

    // Distance filter if user location is available
    if (userLocation) {
      results = results.filter(turf => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          turf.location.coordinates.latitude,
          turf.location.coordinates.longitude
        );
        return distance <= radius;
      });
    }
    
    setFilteredTurfs(results);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterTurfs();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSportFilter('');
    setLocationFilter('');
    setPriceRange([0, 5000]);
    setRadius(10);
    filterTurfs();
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const availableSports = ['Football', 'Basketball', 'Tennis', 'Cricket', 'Badminton', 'Volleyball', 'Rugby'];
  const availableLocations = [...new Set(turfs.map(turf => turf.location.name))];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Turf</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search by name, location or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Button type="submit">Search</Button>
            <Button 
              type="button" 
              variant="outline" 
              className="md:hidden"
              onClick={toggleMobileFilters}
              leftIcon={<Filter className="h-4 w-4" />}
            >
              Filters
            </Button>
          </div>
        </form>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters (Desktop) */}
          <div className="hidden lg:block">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  <button 
                    onClick={clearFilters} 
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear All
                  </button>
                </div>
                
                {/* Sport Filter */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Sport</h3>
                  <div className="space-y-1.5">
                    {availableSports.map(sport => (
                      <div key={sport} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`sport-${sport}`}
                          checked={sportFilter === sport}
                          onChange={() => setSportFilter(sportFilter === sport ? '' : sport)}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor={`sport-${sport}`} className="ml-2 text-sm text-gray-700">
                          {sport}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Location Filter */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Location</h3>
                  <div className="space-y-1.5">
                    {availableLocations.map(location => (
                      <div key={location} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`location-${location}`}
                          checked={locationFilter === location}
                          onChange={() => setLocationFilter(locationFilter === location ? '' : location)}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor={`location-${location}`} className="ml-2 text-sm text-gray-700">
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
                
                {/* Distance Filter */}
                {userLocation && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Distance</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>0 km</span>
                        <span>{radius} km</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={radius}
                        onChange={(e) => setRadius(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredTurfs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTurfs.map(turf => (
                  <TurfCard key={turf.id} turf={turf} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No turfs found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};