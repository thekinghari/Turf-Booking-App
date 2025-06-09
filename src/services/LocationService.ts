import { Location, Turf } from '../types';

class LocationService {
  private static instance: LocationService;

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          reject(new Error('Unable to retrieve your location'));
        }
      );
    });
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  async getNearbyTurfs(
    userLocation: { latitude: number; longitude: number },
    radius: number = 10 // Default radius in kilometers
  ): Promise<(Turf & { distance: number })[]> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/turfs');
      if (!response.ok) throw new Error('Failed to fetch turfs');
      const turfs: Turf[] = await response.json();

      // Calculate distances and filter by radius
      const nearbyTurfs = turfs
        .map((turf) => ({
          ...turf,
          distance: this.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            turf.location.coordinates.latitude,
            turf.location.coordinates.longitude
          ),
        }))
        .filter((turf) => turf.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      return nearbyTurfs;
    } catch (error) {
      console.error('Error fetching nearby turfs:', error);
      throw error;
    }
  }

  async searchLocations(query: string): Promise<Location[]> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search locations');
      return response.json();
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  }

  async getLocationDetails(locationId: string): Promise<Location> {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/locations/${locationId}`);
      if (!response.ok) throw new Error('Failed to fetch location details');
      return response.json();
    } catch (error) {
      console.error('Error fetching location details:', error);
      throw error;
    }
  }

  async getRecommendedTurfs(
    userLocation: { latitude: number; longitude: number },
    userPreferences: { favoriteSports: string[]; preferredLocations: string[] }
  ): Promise<(Turf & { score: number })[]> {
    try {
      const nearbyTurfs = await this.getNearbyTurfs(userLocation);
      
      // Calculate recommendation score based on:
      // 1. Distance (closer is better)
      // 2. Matching sports (higher score for preferred sports)
      // 3. Location preference (higher score for preferred locations)
      const scoredTurfs = nearbyTurfs.map((turf) => {
        let score = 0;
        
        // Distance score (inverse of distance)
        score += (10 - Math.min(turf.distance, 10)) * 0.4;
        
        // Sports match score
        const matchingSports = turf.sports.filter((sport) =>
          userPreferences.favoriteSports.includes(sport)
        ).length;
        score += (matchingSports / turf.sports.length) * 0.3;
        
        // Location preference score
        if (userPreferences.preferredLocations.includes(turf.location.name)) {
          score += 0.3;
        }
        
        return {
          ...turf,
          score,
        };
      });

      // Sort by score in descending order
      return scoredTurfs.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Error getting recommended turfs:', error);
      throw error;
    }
  }
}

export const locationService = LocationService.getInstance(); 