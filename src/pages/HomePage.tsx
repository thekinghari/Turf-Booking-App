import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Star, Users } from 'lucide-react';
import { Turf } from '../types';
import { turfs } from '../data/mockData';
import { HeroSection } from '../components/home/HeroSection';
import { TurfCard } from '../components/home/TurfCard';
import { Button } from '../components/ui/Button';

export const HomePage: React.FC = () => {
  const [popularTurfs, setPopularTurfs] = useState<Turf[]>([]);
  
  useEffect(() => {
    // Sort turfs by rating and get top 4
    const sortedTurfs = [...turfs].sort((a, b) => b.rating - a.rating).slice(0, 4);
    setPopularTurfs(sortedTurfs);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Popular Turfs */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Turfs</h2>
            <Link to="/search" className="text-primary-600 hover:text-primary-700 flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularTurfs.map(turf => (
              <TurfCard key={turf.id} turf={turf} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Booking your favorite sports venue has never been easier. Follow these simple steps and get ready for an amazing sports experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find a Turf</h3>
              <p className="text-gray-600">
                Search for turfs by location, sport, or availability to find the perfect venue for your game.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book a Slot</h3>
              <p className="text-gray-600">
                Choose your preferred date and time slot, and make a secure booking in just a few clicks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Play & Enjoy</h3>
              <p className="text-gray-600">
                Arrive at the venue, enjoy your game, and share your experience by leaving a review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-primary-100">
            Book your favorite turf now and enjoy a seamless sporting experience with friends and teammates.
          </p>
          <Button 
            size="lg" 
            className="bg-accent-500 text-white hover:bg-accent-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            onClick={() => window.location.href = '/search'}
          >
            Find Turfs Near You
          </Button>
        </div>
      </section>
    </div>
  );
};