import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function getSportIcon(sport: string): string {
  switch (sport.toLowerCase()) {
    case 'football':
      return 'ball-football';
    case 'basketball':
      return 'basketball';
    case 'tennis':
      return 'racquet';
    case 'badminton':
      return 'racquet';
    case 'volleyball':
      return 'ball-volleyball';
    case 'cricket':
      return 'cricket';
    case 'rugby':
      return 'rugby-ball';
    default:
      return 'activity';
  }
}

export function getAmenityIcon(amenity: string): string {
  switch (amenity.toLowerCase()) {
    case 'parking':
      return 'car';
    case 'changing rooms':
      return 'door-open';
    case 'floodlights':
      return 'lamp-ceiling';
    case 'refreshments':
      return 'coffee';
    case 'spectator area':
      return 'users';
    case 'coaching':
      return 'school';
    case 'equipment rental':
      return 'package';
    case 'air conditioning':
      return 'air-vent';
    case 'cafeteria':
      return 'utensils';
    case 'pro shop':
      return 'shopping-bag';
    case 'ball machine':
      return 'cpu';
    case 'premium changing rooms':
      return 'castle';
    default:
      return 'circle';
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}