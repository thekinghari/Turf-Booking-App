import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';

export const  HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${searchTerm}`);
  };

  return (
    <div className="relative bg-gradient-to-r from-primary-800 to-secondary-900 text-white py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuOTE3IDAgSDUwdjEwaDEwVjBoLTAuMDgzWk0wIDUwdjEwaDEwVjUwSDBaTTEwIDAgSDBWMTBoMTBWMFoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight animate-slideUp">
            Book Your Favorite Sports Venues With Ease
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 animate-slideUp" style={{ animationDelay: '100ms' }}>
            Find and book the best turfs for football, cricket, tennis and more in your area
          </p>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="bg-white/10 backdrop-blur-sm p-2 rounded-lg flex items-center mb-8 border border-white/20 animate-slideUp"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex-1 flex items-center bg-white rounded-md overflow-hidden">
              <div className="pl-3 pr-2 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search by location, sport, or turf name"
                className="w-full p-3 text-gray-800 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="ml-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3"
            >
              Search
            </Button>
          </form>

          {/* Popular Categories */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 animate-slideUp" style={{ animationDelay: '300ms' }}>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate('/search?sport=football')}
              leftIcon={<span className="mr-1">⚽</span>}
            >
              Football
            </Button>
            <Button 
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate('/search?sport=cricket')}
              leftIcon={<span className="mr-1">🏏</span>}
            >
              Cricket
            </Button>
            <Button 
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate('/search?sport=tennis')}
              leftIcon={<span className="mr-1">🎾</span>}
            >
              Tennis
            </Button>
            <Button 
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate('/search?sport=basketball')}
              leftIcon={<span className="mr-1">🏀</span>}
            >
              Basketball
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,58.7C672,43,768,21,864,21.3C960,21,1056,43,1152,48C1248,53,1344,43,1392,37.3L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};