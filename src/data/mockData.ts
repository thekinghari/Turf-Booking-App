import { Turf, Booking, User, Slot, UserProfile } from '../types';
import { addDays, format } from 'date-fns';

export const users: User[] = [
  {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      role: 'user'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '9876543210',
    isAdmin: true,
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    role: 'user'
  },
];

export const userProfiles: UserProfile[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    address: '123 Main Street, Chennai',
    preferences: {
      favoriteSports: ['Football', 'Cricket'],
      preferredLocations: ['North', 'Central'],
      notificationPreferences: {
        email: true,
        sms: true,
        push: true
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '9876543210',
    address: '456 Admin Street, Chennai',
    preferences: {
      favoriteSports: ['Football', 'Basketball', 'Tennis'],
      preferredLocations: ['South', 'East'],
      notificationPreferences: {
        email: true,
        sms: false,
        push: true
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const turfs: Turf[] = [
  {
    id: '1',
    name: 'Chennai Sports Arena',
    description: 'A premier sports facility in Chennai offering world-class football and cricket grounds. Features floodlit facilities, professional coaching, and modern amenities.',
    location: {
      name: 'Anna Nagar',
      address: 'Block 15, 2nd Avenue, Anna Nagar, Chennai - 600040',
      coordinates: {
        latitude: 13.0827,
        longitude: 80.2107
      }
    },
    sports: ['Football', 'Cricket', 'Basketball'],
    amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Water Dispenser', 'First Aid', 'Refreshments'],
    images: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1493&q=80',
      'https://images.unsplash.com/photo-1577223194256-6c7e1d3c3c3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ],
    price: 2500,
    openTime: '06:00 AM',
    closeTime: '10:00 PM',
    rating: 4.5,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        turfId: '1',
        rating: 5,
        comment: 'Excellent facilities and well-maintained grounds. The floodlights are perfect for evening games.',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Marina Multi Sports',
    description: 'Located near the famous Marina Beach, this facility offers multiple sports options with a beautiful sea view. Perfect for both casual and professional players.',
    location: {
      name: 'Marina Beach',
      address: 'Beach Road, Marina Beach, Chennai - 600005',
      coordinates: {
        latitude: 13.0604,
        longitude: 80.2837
      }
    },
    sports: ['Football', 'Volleyball', 'Tennis'],
    amenities: ['Beach View', 'Parking', 'Showers', 'Lockers', 'Café', 'Pro Shop'],
    images: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1493&q=80'
    ],
    price: 2000,
    openTime: '05:00 AM',
    closeTime: '09:00 PM',
    rating: 4.3,
    reviews: [
      {
        id: '2',
        userId: 'user2',
        turfId: '2',
        rating: 4,
        comment: 'Great location with sea breeze. The facilities are good but could use some maintenance.',
        createdAt: '2024-03-14T15:30:00Z',
        updatedAt: '2024-03-14T15:30:00Z'
      }
    ]
  },
  {
    id: '3',
    name: 'Adyar Sports Hub',
    description: 'A modern sports complex in the heart of Adyar. Features synthetic turf, professional coaching, and state-of-the-art facilities.',
    location: {
      name: 'Adyar',
      address: 'LB Road, Adyar, Chennai - 600020',
      coordinates: {
        latitude: 13.0067,
        longitude: 80.2567
      }
    },
    sports: ['Football', 'Cricket', 'Badminton'],
    amenities: ['Synthetic Turf', 'Air Conditioned Rooms', 'Parking', 'Cafeteria', 'Medical Support', 'Training Equipment'],
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1493&q=80',
      'https://images.unsplash.com/photo-1577223194256-6c7e1d3c3c3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ],
    price: 3000,
    openTime: '06:00 AM',
    closeTime: '11:00 PM',
    rating: 4.7,
    reviews: [
      {
        id: '3',
        userId: 'user3',
        turfId: '3',
        rating: 5,
        comment: 'Best synthetic turf in Chennai. Professional staff and excellent facilities.',
        createdAt: '2024-03-13T09:15:00Z',
        updatedAt: '2024-03-13T09:15:00Z'
      }
    ]
  },
  {
    id: '4',
    name: 'T Nagar Sports Complex',
    description: 'A centrally located sports facility in T Nagar, offering multiple sports options with modern amenities. Perfect for corporate teams and weekend warriors.',
    location: {
      name: 'T Nagar',
      address: 'Burkit Road, T Nagar, Chennai - 600017',
      coordinates: {
        latitude: 13.0344,
        longitude: 80.2381
      }
    },
    sports: ['Football', 'Cricket', 'Tennis', 'Basketball'],
    amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Water Dispenser', 'First Aid', 'Refreshments', 'Corporate Events'],
    images: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1493&q=80',
      'https://images.unsplash.com/photo-1577223194256-6c7e1d3c3c3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ],
    price: 2800,
    openTime: '06:00 AM',
    closeTime: '10:00 PM',
    rating: 4.4,
    reviews: [
      {
        id: '4',
        userId: 'user4',
        turfId: '4',
        rating: 4,
        comment: 'Great location in the heart of the city. Good facilities and well-maintained grounds.',
        createdAt: '2024-03-12T14:20:00Z',
        updatedAt: '2024-03-12T14:20:00Z'
      }
    ]
  },
  {
    id: '5',
    name: 'Velachery Sports Village',
    description: 'A sprawling sports complex in Velachery with multiple grounds and facilities. Known for its professional coaching and tournament hosting capabilities.',
    location: {
      name: 'Velachery',
      address: '100 Feet Road, Velachery, Chennai - 600042',
      coordinates: {
        latitude: 13.0067,
        longitude: 80.2207
      }
    },
    sports: ['Football', 'Cricket', 'Basketball', 'Volleyball'],
    amenities: ['Multiple Grounds', 'Professional Coaching', 'Tournament Facilities', 'Parking', 'Changing Rooms', 'Cafeteria', 'Medical Support'],
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1493&q=80',
      'https://images.unsplash.com/photo-1577223194256-6c7e1d3c3c3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ],
    price: 3200,
    openTime: '05:00 AM',
    closeTime: '11:00 PM',
    rating: 4.6,
    reviews: [
      {
        id: '5',
        userId: 'user5',
        turfId: '5',
        rating: 5,
        comment: 'Excellent facilities for tournaments. Professional staff and well-maintained grounds.',
        createdAt: '2024-03-11T11:45:00Z',
        updatedAt: '2024-03-11T11:45:00Z'
      }
    ]
  },
  {
    id: '6',
    name: 'Porur Sports Center',
    description: 'A modern sports facility in Porur with synthetic turf and professional coaching. Popular among local clubs and schools.',
    location: {
      name: 'Porur',
      address: 'Mount Poonamallee Road, Porur, Chennai - 600116',
      coordinates: {
        latitude: 13.0344,
        longitude: 80.1581
      }
    },
    sports: ['Football', 'Cricket', 'Badminton'],
    amenities: ['Synthetic Turf', 'Professional Coaching', 'Parking', 'Changing Rooms', 'Water Dispenser', 'First Aid', 'Refreshments'],
    images: [
      
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1493&q=80'
    ],
    price: 2700,
    openTime: '06:00 AM',
    closeTime: '10:00 PM',
    rating: 4.5,
    reviews: [
      {
        id: '6',
        userId: 'user6',
        turfId: '6',
        rating: 4,
        comment: 'Great synthetic turf and professional coaching. Perfect for serious players.',
        createdAt: '2024-03-10T16:30:00Z',
        updatedAt: '2024-03-10T16:30:00Z'
      }
    ]
  },
  {
    id: '7',
    name: 'T Nagar Sports Complex',
    description: 'Modern sports facility in the heart of T Nagar with multiple courts and professional coaching.',
    location: {
      name: 'T Nagar Sports Complex',
      address: 'T Nagar, Chennai',
      coordinates: {
        latitude: 13.0478,
        longitude: 80.2429
      }
    },
    price: 1200,
    rating: 4.6,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        turfId: '7',
        rating: 5,
        comment: 'Excellent facilities and staff!',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Parking', 'Showers', 'Cafeteria', 'Pro Shop', 'First Aid'],
    openTime: '06:00',
    closeTime: '22:00',
    sports: ['Football', 'Cricket', 'Tennis', 'Basketball'],
  },
  {
    id: '8',
    name: 'Velachery Sports Hub',
    description: 'State-of-the-art sports facility in Velachery with international standard courts.',
    location: {
      name: 'Velachery Sports Hub',
      address: 'Velachery, Chennai',
      coordinates: {
        latitude: 13.0067,
        longitude: 80.2206
      }
    },
    price: 1500,
    rating: 4.8,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        turfId: '8',
        rating: 5,
        comment: 'World-class facilities!',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Parking', 'Showers', 'Cafeteria', 'Pro Shop', 'First Aid', 'Swimming Pool'],
    openTime: '05:00',
    closeTime: '23:00',
    sports: ['Football', 'Cricket', 'Tennis', 'Basketball', 'Swimming']
  },
  {
    id: '9',
    name: 'Anna Nagar Sports Center',
    description: 'Family-friendly sports center with multiple facilities and coaching programs.',
    location: {
      name: 'Anna Nagar Sports Center',
      address: 'Anna Nagar, Chennai',
      coordinates: {
        latitude: 13.0827,
        longitude: 80.2127
      }
    },
    price: 1000,
    rating: 4.5,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        turfId: '9',
        rating: 4,
        comment: 'Great place for family sports!',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Parking', 'Showers', 'Cafeteria', 'Pro Shop', 'First Aid', 'Kids Play Area'],
    openTime: '06:00',
    closeTime: '22:00',
    sports: ['Football', 'Cricket', 'Tennis', 'Basketball', 'Badminton']
  },
  {
    id: '10',
    name: 'Mylapore Sports Arena',
    description: 'Historic sports facility in the cultural heart of Chennai with modern amenities.',
    location: {
      name: 'Mylapore Sports Arena',
      address: 'Mylapore, Chennai',
      coordinates: {
        latitude: 13.0340,
        longitude: 80.2707
      }
    },
    price: 1300,
    rating: 4.7,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        turfId: '10',
        rating: 5,
        comment: 'Perfect blend of tradition and modern facilities!',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Parking', 'Showers', 'Cafeteria', 'Pro Shop', 'First Aid', 'Yoga Studio'],
    openTime: '05:30',
    closeTime: '22:30',
    sports: ['Football', 'Cricket', 'Tennis', 'Basketball', 'Yoga']
  },
  {
    id: '11',
    name: 'Porur Sports Village',
    description: 'Sprawling sports complex with multiple facilities and professional training programs.',
    location: {
      name: 'Porur Sports Village',
      address: 'Porur, Chennai',
      coordinates: {
        latitude: 13.0317,
        longitude: 80.1587
      }
    },
    price: 1400,
    rating: 4.6,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        turfId: '11',
        rating: 4,
        comment: 'Excellent training programs!',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Parking', 'Showers', 'Cafeteria', 'Pro Shop', 'First Aid', 'Swimming Pool', 'Gym'],
    openTime: '05:00',
    closeTime: '23:00',
    sports: ['Football', 'Cricket', 'Tennis', 'Basketball', 'Swimming', 'Athletics']
  },
  {
    id: '12',
    name: 'Tambaram Sports Complex',
    description: 'Modern sports facility serving the southern suburbs of Chennai.',
    location: {
      name: 'Tambaram Sports Complex',
      address: 'Tambaram, Chennai',
      coordinates: {
        latitude: 12.9249,
        longitude: 80.1475
      }
    },
    price: 1100,
    rating: 4.4,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        turfId: '12',
        rating: 4,
        comment: 'Great facility for the suburbs!',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Parking', 'Showers', 'Cafeteria', 'Pro Shop', 'First Aid', 'Kids Play Area'],
    openTime: '06:00',
    closeTime: '22:00',
    sports: ['Football', 'Cricket', 'Tennis', 'Basketball', 'Badminton']
  },
  {
    id: '13',
    name: 'Chromepet Sports Hub',
    description: 'Community-focused sports facility with emphasis on youth development.',
    location: {
      name: 'Chromepet Sports Hub',
      address: 'Chromepet, Chennai',
      coordinates: {
        latitude: 12.9516,
        longitude: 80.1412
      }
    },
    price: 950,
    rating: 4.3,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        turfId: '13',
        rating: 4,
        comment: 'Great for community sports!',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Parking', 'Showers', 'Cafeteria', 'Pro Shop', 'First Aid'],
    openTime: '06:00',
    closeTime: '21:00',
    sports: ['Football', 'Cricket', 'Tennis', 'Basketball']
  },
  {
    id: '14',
    name: 'Pallavaram Sports Center',
    description: 'Well-maintained sports facility with focus on community sports.',
    location: {
      name: 'Pallavaram Sports Center',
      address: 'Pallavaram, Chennai',
      coordinates: {
        latitude: 12.9675,
        longitude: 80.1505
      }
    },
    price: 900,
    rating: 4.2,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        turfId: '14',
        rating: 4,
        comment: 'Good community sports center!',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Parking', 'Showers', 'Cafeteria', 'First Aid'],
    openTime: '06:00',
    closeTime: '21:00',
    sports: ['Football', 'Cricket', 'Tennis']
  },
  {
    id: '15',
    name: 'Medavakkam Sports Complex',
    description: 'Modern sports facility serving the growing Medavakkam community.',
    location: {
      name: 'Medavakkam Sports Complex',
      address: 'Medavakkam, Chennai',
      coordinates: {
        latitude: 12.9167,
        longitude: 80.1833
      }
    },
    price: 1000,
    rating: 4.4,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        turfId: '15',
        rating: 4,
        comment: 'Great facility for the growing community!',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Parking', 'Showers', 'Cafeteria', 'Pro Shop', 'First Aid', 'Kids Play Area'],
    openTime: '06:00',
    closeTime: '22:00',
    sports: ['Football', 'Cricket', 'Tennis', 'Basketball', 'Badminton']
  },
  {
    id: '16',
    name: 'Sholinganallur Sports Hub',
    description: 'Premium sports facility in the IT corridor with state-of-the-art amenities.',
    location: {
      name: 'Sholinganallur Sports Hub',
      address: 'Sholinganallur, Chennai',
      coordinates: {
        latitude: 12.8997,
        longitude: 80.2206
      }
    },
    price: 1600,
    rating: 4.8,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        turfId: '16',
        rating: 5,
        comment: 'Premium facilities worth every penny!',
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Parking', 'Showers', 'Cafeteria', 'Pro Shop', 'First Aid', 'Swimming Pool', 'Gym', 'Spa'],
    openTime: '05:00',
    closeTime: '23:00',
    sports: ['Football', 'Cricket', 'Tennis', 'Basketball', 'Swimming', 'Athletics', 'Yoga']
  }
];

export const bookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    turfId: '1',
    turfName: 'Chennai Sports Arena',
    date: '2024-03-20',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    totalPrice: 2500,
    status: 'confirmed',
    createdAt: '2024-03-19T10:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    turfId: '2',
    turfName: 'Marina Multi Sports',
    date: '2024-03-21',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    totalPrice: 2000,
    status: 'pending',
    createdAt: '2024-03-19T11:30:00Z'
  }
];

const generateSlots = (turfId: string, price: number): Slot[] => {
  const slots: Slot[] = [];
  const today = new Date();
  
  // Generate slots for the next 7 days
  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Generate slots from 6 AM to 10 PM
    for (let hour = 6; hour < 22; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      // Check if this slot is already booked
      const isBooked = bookings.some(booking => 
        booking.turfId === turfId && 
        booking.date === dateStr && 
        booking.startTime === startTime &&
        booking.status !== 'cancelled'
      );
      
      slots.push({
        id: `${turfId}-${dateStr}-${startTime}`,
        turfId,
        date: dateStr,
        startTime,
        endTime,
        isBooked,
        price
      });
    }
  }
  
  return slots;
};

export const slots: Slot[] = [
  ...generateSlots('1', 2500),
  ...generateSlots('2', 2000),
  ...generateSlots('3', 3000),
  ...generateSlots('4', 2800),
  ...generateSlots('5', 3200),
  ...generateSlots('6', 2700),
  ...generateSlots('7', 1200),
  ...generateSlots('8', 1500),
  ...generateSlots('9', 1000),
  ...generateSlots('10', 1300),
  ...generateSlots('11', 1400),
  ...generateSlots('12', 1100),
  ...generateSlots('13', 950),
  ...generateSlots('14', 900),
  ...generateSlots('15', 1000),
  ...generateSlots('16', 1600)
];
