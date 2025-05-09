import React from 'react';
import { Link } from 'react-router-dom';
import { Turf } from '../../types';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';

interface TurfCardProps {
  turf: Turf;
}

export const TurfCard: React.FC<TurfCardProps> = ({ turf }) => {
  return (
    <Link to={`/turf/${turf.id}`}>
      <Card className="h-full transition-transform hover:translate-y-[-5px] animate-slideUp">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={turf.images[0]} 
            alt={turf.name} 
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center text-white space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{turf.location}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title and Rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{turf.name}</h3>
            <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded text-sm">
              <Star className="h-4 w-4 mr-1 fill-current" />
              <span>{turf.rating}</span>
            </div>
          </div>

          {/* Sports */}
          <div className="flex flex-wrap gap-1 mb-3">
            {turf.sports.map((sport) => (
              <span 
                key={sport} 
                className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full"
              >
                {sport}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <span className="text-xs">From</span>
              <div className="font-semibold text-base text-gray-900">{formatCurrency(turf.price)}</div>
              <span className="text-xs">per hour</span>
            </div>
            <div className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm font-medium">
              Book Now
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};