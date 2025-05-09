import { Turf, Booking, User, Slot } from '../types';
import { addDays, format } from 'date-fns';

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    isAdmin: false,
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '9876543210',
    isAdmin: true,
  },
];

export const turfs: Turf[] = [
  {
    id: '1',
    name: 'Green Field Arena',
    description: 'Premium synthetic grass football turf with floodlights and changing rooms',
    location: 'Downtown',
    address: '123 Main Street, Downtown',
    price: 1200,
    rating: 4.7,
    reviews: 124,
    images: [
      'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg',
      'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
      'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg'
    ],
    amenities: ['Floodlights', 'Changing Rooms', 'Parking', 'Refreshments', 'Spectator Area'],
    openTime: '06:00',
    closeTime: '23:00',
    sports: ['Football', 'Rugby'],
  },
  {
    id: '2',
    name: 'Court Central',
    description: 'Multi-purpose court for basketball, volleyball, and badminton with high-quality flooring',
    location: 'Uptown',
    address: '456 Oak Avenue, Uptown',
    price: 800,
    rating: 4.5,
    reviews: 89,
    images: [
      'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg',
      'https://images.pexels.com/photos/945471/pexels-photo-945471.jpeg',
      'https://images.pexels.com/photos/1032117/pexels-photo-1032117.jpeg'
    ],
    amenities: ['Air Conditioning', 'Equipment Rental', 'Changing Rooms', 'Parking'],
    openTime: '07:00',
    closeTime: '22:00',
    sports: ['Basketball', 'Volleyball', 'Badminton'],
  },
  {
    id: '3',
    name: 'Pitch Perfect',
    description: 'FIFA-standard football turf with professional setup and amenities',
    location: 'Westside',
    address: '789 Pine Road, Westside',
    price: 1500,
    rating: 4.9,
    reviews: 156,
    images: [
      'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg',
      'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
      'https://images.pexels.com/photos/3448250/pexels-photo-3448250.jpeg'
    ],
    amenities: ['Floodlights', 'Premium Changing Rooms', 'Coaching', 'Parking', 'Cafeteria'],
    openTime: '05:00',
    closeTime: '00:00',
    sports: ['Football'],
  },
  {
    id: '4',
    name: 'Smash Court',
    description: 'Premium tennis courts with professional-grade surfaces',
    location: 'Eastside',
    address: '101 Maple Drive, Eastside',
    price: 600,
    rating: 4.3,
    reviews: 72,
    images: [
      'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
      'https://images.pexels.com/photos/6956896/pexels-photo-6956896.jpeg',
      'https://images.pexels.com/photos/2352270/pexels-photo-2352270.jpeg'
    ],
    amenities: ['Ball Machine', 'Coaching', 'Changing Rooms', 'Pro Shop'],
    openTime: '06:00',
    closeTime: '21:00',
    sports: ['Tennis'],
  },
];

// Generate slots for the next 7 days
export const generateSlots = (): Slot[] => {
  const slots: Slot[] = [];
  const timeSlots = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
                     '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  
  turfs.forEach(turf => {
    for (let day = 0; day < 7; day++) {
      const date = format(addDays(new Date(), day), 'yyyy-MM-dd');
      
      timeSlots.forEach((startTime, index) => {
        if (index < timeSlots.length - 1) {
          const endTime = timeSlots[index + 1];
          
          // Only create slots within the turf's opening hours
          if (startTime >= turf.openTime && endTime <= turf.closeTime) {
            slots.push({
              id: `${turf.id}-${date}-${startTime}`,
              turfId: turf.id,
              date,
              startTime,
              endTime,
              isBooked: Math.random() > 0.7, // Randomly mark some slots as booked
              price: turf.price,
            });
          }
        }
      });
    }
  });
  
  return slots;
};

export const slots = generateSlots();

export const bookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    turfId: '1',
    turfName: 'Green Field Arena',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    startTime: '18:00',
    endTime: '19:00',
    totalPrice: 1200,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '1',
    turfId: '3',
    turfName: 'Pitch Perfect',
    date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    startTime: '19:00',
    endTime: '20:00',
    totalPrice: 1500,
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: '1',
    turfId: '2',
    turfName: 'Court Central',
    date: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '11:00',
    totalPrice: 800,
    status: 'completed',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
];