import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, Search, MapPin, X } from 'lucide-react';
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [filteredTurfs, setFilteredTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apply initial filters
    filterTurfs();
    setLoading(false);
  }, [searchTerm, sportFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const filterTurfs = () => {
    let results = [...turfs];
    
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        turf => 
          turf.name.toLowerCase().includes(searchLower) || 
          turf.location.toLowerCase().includes(searchLower) || 
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
        turf => turf.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    // Price range filter
    results = results.filter(
      turf => turf.price >= priceRange[0] && turf.price <= priceRange[1]
    );
    
    setFilteredTurfs(results);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterTurfs();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSportFilter('');
    setLocationFilter('');
    setPriceRange([0, 2000]);
    filterTurfs();
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const availableSports = ['Football', 'Basketball', 'Tennis', 'Cricket', 'Badminton', 'Volleyball', 'Rugby'];
  const availableLocations = [...new Set(turfs.map(turf => turf.location))];

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
                          className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
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
                          className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        />
                        <label htmlFor={`location-${location}`} className="ml-2 text-sm text-gray-700 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Price Range (per hour)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-primary-600"
                    />
                    <Button size="sm" fullWidth onClick={filterTurfs}>Apply Filters</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white p-4 overflow-y-auto animate-slideRight">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  <div className="flex space-x-2 items-center">
                    <button 
                      onClick={clearFilters} 
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Clear All
                    </button>
                    <button onClick={toggleMobileFilters} className="text-gray-500">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Sport Filter */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Sport</h3>
                  <div className="space-y-1.5">
                    {availableSports.map(sport => (
                      <div key={sport} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`sport-mobile-${sport}`}
                          checked={sportFilter === sport}
                          onChange={() => setSportFilter(sportFilter === sport ? '' : sport)}
                          className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        />
                        <label htmlFor={`sport-mobile-${sport}`} className="ml-2 text-sm text-gray-700">
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
                          id={`location-mobile-${location}`}
                          checked={locationFilter === location}
                          onChange={() => setLocationFilter(locationFilter === location ? '' : location)}
                          className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        />
                        <label htmlFor={`location-mobile-${location}`} className="ml-2 text-sm text-gray-700 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Price Range (per hour)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-primary-600"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button fullWidth onClick={() => {
                    filterTurfs();
                    toggleMobileFilters();
                  }}>Apply Filters</Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Results */}
          <div className="lg:col-span-3">
            {/* Applied Filters */}
            {(searchTerm || sportFilter || locationFilter || priceRange[1] < 2000) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {searchTerm && (
                  <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Search: {searchTerm}
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        filterTurfs();
                      }}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {sportFilter && (
                  <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Sport: {sportFilter}
                    <button 
                      onClick={() => {
                        setSportFilter('');
                        filterTurfs();
                      }}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {locationFilter && (
                  <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Location: {locationFilter}
                    <button 
                      onClick={() => {
                        setLocationFilter('');
                        filterTurfs();
                      }}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {priceRange[1] < 2000 && (
                  <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Max Price: ₹{priceRange[1]}
                    <button 
                      onClick={() => {
                        setPriceRange([0, 2000]);
                        filterTurfs();
                      }}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                {loading ? (
                  "Loading results..."
                ) : (
                  `Found ${filteredTurfs.length} ${filteredTurfs.length === 1 ? 'turf' : 'turfs'}`
                )}
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                {filteredTurfs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTurfs.map(turf => (
                      <TurfCard key={turf.id} turf={turf} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <h3 className="text-lg font-semibold mb-2">No turfs found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any turfs matching your search criteria. Try adjusting your filters or search terms.
                    </p>
                    <Button onClick={clearFilters}>Clear All Filters</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};