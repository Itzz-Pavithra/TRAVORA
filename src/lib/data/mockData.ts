// ===================================================
// TRAVORA — Mock Seed Data
// Populates localStorage on first launch
// ===================================================
import { storage } from '$lib/services/storage';
import type {
  User, Trip, TripMember, ItineraryDay, Expense,
  Message, Poll, Destination, Activity, Accommodation, Transportation
} from '$lib/types';

const SEEDED_KEY = 'seeded_v3';

export function seedIfNeeded(): void {
  if (typeof window === 'undefined') return;
  if (storage.get(SEEDED_KEY)) return;

  // ---- USERS ----
  const users: User[] = [
    {
      id: 'user_arun',
      name: 'Arun Kumar',
      email: 'arun@example.com',
      password: 'demo123',
      avatarColor: '#173F35',
      travelPreference: 'group',
      currency: 'INR',
      language: 'en',
      tripsCount: 8,
      placesCount: 24,
      memoriesCount: 142,
      savedPlacesCount: 18,
      joinedAt: '2025-01-10T00:00:00Z',
      profileVisibility: 'public',
      memoryVisibility: 'friends'
    },
    {
      id: 'user_priya',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'demo123',
      avatarColor: '#D97745',
      travelPreference: 'group',
      currency: 'INR',
      language: 'en',
      tripsCount: 12,
      placesCount: 31,
      memoriesCount: 208,
      savedPlacesCount: 27,
      joinedAt: '2025-02-14T00:00:00Z',
      profileVisibility: 'public',
      memoryVisibility: 'friends'
    },
    {
      id: 'user_karthik',
      name: 'Karthik Rajan',
      email: 'karthik@example.com',
      password: 'demo123',
      avatarColor: '#66736F',
      travelPreference: 'group',
      currency: 'INR',
      language: 'en',
      tripsCount: 6,
      placesCount: 18,
      memoriesCount: 89,
      savedPlacesCount: 12,
      joinedAt: '2025-03-05T00:00:00Z',
      profileVisibility: 'public',
      memoryVisibility: 'public'
    },
    {
      id: 'user_divya',
      name: 'Divya Nair',
      email: 'divya@example.com',
      password: 'demo123',
      avatarColor: '#1f5448',
      travelPreference: 'group',
      currency: 'INR',
      language: 'en',
      tripsCount: 9,
      placesCount: 27,
      memoriesCount: 156,
      savedPlacesCount: 22,
      joinedAt: '2025-01-28T00:00:00Z',
      profileVisibility: 'public',
      memoryVisibility: 'friends'
    }
  ];

  const demoUser: User = {
    id: 'user_demo',
    name: 'Pavithra',
    email: 'pavithra@travora.app',
    password: 'travora123',
    avatarColor: '#D97745',
    travelPreference: 'group',
    currency: 'INR',
    language: 'en',
    tripsCount: 3,
    placesCount: 12,
    memoriesCount: 47,
    savedPlacesCount: 8,
    joinedAt: '2026-01-01T00:00:00Z',
    profileVisibility: 'public',
    memoryVisibility: 'friends'
  };

  storage.set('users', [...users, demoUser]);
  storage.set('current_user', demoUser);

  // ---- TRIPS ----
  const trips: Trip[] = [
    {
      id: 'trip_goa',
      name: 'Goa Escape',
      destination: 'Goa',
      country: 'India',
      coverImage: '/images/goa.jpg',
      startDate: '2026-12-12',
      endDate: '2026-12-16',
      travelers: 5,
      type: 'group',
      budget: 18500,
      currency: 'INR',
      budgetSpent: 12400,
      interests: ['beaches', 'food', 'nightlife', 'photography'],
      status: 'upcoming',
      ownerId: 'user_demo',
      memberIds: ['user_arun', 'user_priya', 'user_karthik', 'user_divya'],
      createdAt: '2026-08-01T10:00:00Z',
      description: 'A perfect beach getaway to explore the sun, sand, and vibrant culture of Goa.'
    },
    {
      id: 'trip_kerala',
      name: 'Kerala Explorer',
      destination: 'Kerala',
      country: 'India',
      coverImage: '/images/kerala.jpg',
      startDate: '2026-03-10',
      endDate: '2026-03-17',
      travelers: 2,
      type: 'group',
      budget: 22000,
      currency: 'INR',
      budgetSpent: 21800,
      interests: ['nature', 'relaxation', 'culture', 'food'],
      status: 'past',
      ownerId: 'user_demo',
      memberIds: ['user_priya'],
      createdAt: '2026-01-15T00:00:00Z',
      description: 'A serene journey through the backwaters, hill stations, and lush greenery of God\'s Own Country.'
    },
    {
      id: 'trip_singapore',
      name: 'Singapore Adventure',
      destination: 'Singapore',
      country: 'Singapore',
      coverImage: '/images/singapore.jpg',
      startDate: '2027-01-20',
      endDate: '2027-01-25',
      travelers: 4,
      type: 'group',
      budget: 85000,
      currency: 'INR',
      budgetSpent: 0,
      interests: ['culture', 'food', 'shopping', 'adventure'],
      status: 'upcoming',
      ownerId: 'user_demo',
      memberIds: ['user_arun', 'user_karthik', 'user_divya'],
      createdAt: '2026-08-15T00:00:00Z',
      description: 'An exciting urban adventure through Asia\'s cleanest city — from Marina Bay to Sentosa.'
    }
  ];

  storage.set('trips', trips);

  // ---- TRIP MEMBERS ----
  const members: TripMember[] = [
    // Goa
    { id: 'm1', tripId: 'trip_goa', userId: 'user_demo', name: 'Pavithra', email: 'pavithra@travora.app', avatarColor: '#D97745', role: 'owner', joinedAt: '2026-08-01T10:00:00Z', status: 'active' },
    { id: 'm2', tripId: 'trip_goa', userId: 'user_arun', name: 'Arun Kumar', email: 'arun@example.com', avatarColor: '#173F35', role: 'member', joinedAt: '2026-08-02T00:00:00Z', status: 'active' },
    { id: 'm3', tripId: 'trip_goa', userId: 'user_priya', name: 'Priya Sharma', email: 'priya@example.com', avatarColor: '#D97745', role: 'member', joinedAt: '2026-08-02T00:00:00Z', status: 'active' },
    { id: 'm4', tripId: 'trip_goa', userId: 'user_karthik', name: 'Karthik Rajan', email: 'karthik@example.com', avatarColor: '#66736F', role: 'member', joinedAt: '2026-08-03T00:00:00Z', status: 'active' },
    { id: 'm5', tripId: 'trip_goa', userId: 'user_divya', name: 'Divya Nair', email: 'divya@example.com', avatarColor: '#1f5448', role: 'member', joinedAt: '2026-08-03T00:00:00Z', status: 'active' },
    // Kerala
    { id: 'm6', tripId: 'trip_kerala', userId: 'user_demo', name: 'Pavithra', email: 'pavithra@travora.app', avatarColor: '#D97745', role: 'owner', joinedAt: '2026-01-15T00:00:00Z', status: 'active' },
    { id: 'm7', tripId: 'trip_kerala', userId: 'user_priya', name: 'Priya Sharma', email: 'priya@example.com', avatarColor: '#D97745', role: 'member', joinedAt: '2026-01-16T00:00:00Z', status: 'active' },
    // Singapore
    { id: 'm8', tripId: 'trip_singapore', userId: 'user_demo', name: 'Pavithra', email: 'pavithra@travora.app', avatarColor: '#D97745', role: 'owner', joinedAt: '2026-08-15T00:00:00Z', status: 'active' },
    { id: 'm9', tripId: 'trip_singapore', userId: 'user_arun', name: 'Arun Kumar', email: 'arun@example.com', avatarColor: '#173F35', role: 'member', joinedAt: '2026-08-16T00:00:00Z', status: 'active' },
    { id: 'm10', tripId: 'trip_singapore', userId: 'user_karthik', name: 'Karthik Rajan', email: 'karthik@example.com', avatarColor: '#66736F', role: 'member', joinedAt: '2026-08-16T00:00:00Z', status: 'active' },
    { id: 'm11', tripId: 'trip_singapore', userId: 'user_divya', name: 'Divya Nair', email: 'divya@example.com', avatarColor: '#1f5448', role: 'member', joinedAt: '2026-08-17T00:00:00Z', status: 'active' },
  ];
  storage.set('trip_members', members);

  // ---- ITINERARY (Goa) ----
  const goaItinerary: ItineraryDay[] = [
    {
      id: 'day_goa_1', tripId: 'trip_goa', date: '2026-12-12', dayNumber: 1, title: 'Arrival & Beach Day',
      items: [
        { id: 'gi1', dayId: 'day_goa_1', tripId: 'trip_goa', time: '10:00', title: 'Flight Arrival — Goa Airport', type: 'transport', location: 'Dabolim Airport', duration: '2h', notes: 'Pickup arranged', cost: 0, order: 1 },
        { id: 'gi2', dayId: 'day_goa_1', tripId: 'trip_goa', time: '13:00', title: 'Hotel Check-in', type: 'accommodation', location: 'Taj Fort Aguada, Goa', duration: '1h', notes: 'Check-in at 2 PM', cost: 0, order: 2 },
        { id: 'gi3', dayId: 'day_goa_1', tripId: 'trip_goa', time: '15:00', title: 'Baga Beach', type: 'activity', location: 'Baga Beach, North Goa', duration: '3h', notes: 'Water sports available', cost: 500, order: 3 },
        { id: 'gi4', dayId: 'day_goa_1', tripId: 'trip_goa', time: '19:30', title: 'Dinner at Britto\'s', type: 'food', location: 'Britto\'s, Baga Beach', duration: '1.5h', notes: 'Famous Goan seafood', cost: 1200, order: 4 },
      ]
    },
    {
      id: 'day_goa_2', tripId: 'trip_goa', date: '2026-12-13', dayNumber: 2, title: 'Heritage & Forts',
      items: [
        { id: 'gi5', dayId: 'day_goa_2', tripId: 'trip_goa', time: '09:00', title: 'Breakfast at hotel', type: 'food', location: 'Hotel', duration: '1h', cost: 0, order: 1 },
        { id: 'gi6', dayId: 'day_goa_2', tripId: 'trip_goa', time: '10:30', title: 'Fort Aguada', type: 'sightseeing', location: 'Fort Aguada, Sinquerim', duration: '2h', notes: 'Great views of the sea', cost: 50, order: 2 },
        { id: 'gi7', dayId: 'day_goa_2', tripId: 'trip_goa', time: '13:00', title: 'Lunch at Fisherman\'s Wharf', type: 'food', location: 'Fisherman\'s Wharf, Goa', duration: '1.5h', cost: 900, order: 3 },
        { id: 'gi8', dayId: 'day_goa_2', tripId: 'trip_goa', time: '15:30', title: 'Old Goa & Basilica of Bom Jesus', type: 'sightseeing', location: 'Old Goa', duration: '2h', notes: 'UNESCO World Heritage Site', cost: 0, order: 4 },
        { id: 'gi9', dayId: 'day_goa_2', tripId: 'trip_goa', time: '19:00', title: 'Cruise on Mandovi River', type: 'activity', location: 'Mandovi River', duration: '2h', notes: 'Sunset cruise with Goan folk music', cost: 800, order: 5 },
      ]
    },
    {
      id: 'day_goa_3', tripId: 'trip_goa', date: '2026-12-14', dayNumber: 3, title: 'Spice Farms & Night Market',
      items: [
        { id: 'gi10', dayId: 'day_goa_3', tripId: 'trip_goa', time: '09:30', title: 'Sahakari Spice Farm', type: 'activity', location: 'Ponda, Goa', duration: '3h', notes: 'Guided spice farm tour + Goan lunch', cost: 600, order: 1 },
        { id: 'gi11', dayId: 'day_goa_3', tripId: 'trip_goa', time: '15:00', title: 'Calangute Beach', type: 'activity', location: 'Calangute Beach', duration: '2h', cost: 0, order: 2 },
        { id: 'gi12', dayId: 'day_goa_3', tripId: 'trip_goa', time: '19:00', title: 'Saturday Night Market', type: 'activity', location: 'Arpora Night Market', duration: '3h', notes: 'Shopping + street food + live music', cost: 500, order: 3 },
      ]
    },
  ];
  storage.set('itinerary_days', goaItinerary);

  // ---- EXPENSES (Goa) ----
  const expenses: Expense[] = [
    { id: 'e1', tripId: 'trip_goa', title: 'Petrol — Pickup to Hotel', amount: 1200, currency: 'INR', category: 'petrol', paidBy: 'user_arun', paidByName: 'Arun', participants: ['user_demo', 'user_arun', 'user_priya', 'user_karthik', 'user_divya'], date: '2026-12-12', notes: 'Car rental petrol', createdAt: '2026-12-12T10:00:00Z' },
    { id: 'e2', tripId: 'trip_goa', title: 'Lunch — Fisherman\'s Wharf', amount: 2800, currency: 'INR', category: 'food', paidBy: 'user_priya', paidByName: 'Priya', participants: ['user_demo', 'user_arun', 'user_priya', 'user_karthik', 'user_divya'], date: '2026-12-13', notes: '', createdAt: '2026-12-13T13:00:00Z' },
    { id: 'e3', tripId: 'trip_goa', title: 'Hotel — 2 Nights', amount: 8500, currency: 'INR', category: 'hotel', paidBy: 'user_karthik', paidByName: 'Karthik', participants: ['user_demo', 'user_arun', 'user_priya', 'user_karthik', 'user_divya'], date: '2026-12-12', notes: 'Paid upfront for 2 nights', createdAt: '2026-12-12T13:00:00Z' },
    { id: 'e4', tripId: 'trip_goa', title: 'Fort Aguada Tickets', amount: 250, currency: 'INR', category: 'tickets', paidBy: 'user_divya', paidByName: 'Divya', participants: ['user_demo', 'user_arun', 'user_priya', 'user_karthik', 'user_divya'], date: '2026-12-13', createdAt: '2026-12-13T10:30:00Z' },
    { id: 'e5', tripId: 'trip_goa', title: 'Mandovi River Cruise', amount: 4000, currency: 'INR', category: 'activities', paidBy: 'user_demo', paidByName: 'Pavithra', participants: ['user_demo', 'user_arun', 'user_priya', 'user_karthik', 'user_divya'], date: '2026-12-13', createdAt: '2026-12-13T19:00:00Z' },
    // Kerala expenses
    { id: 'e6', tripId: 'trip_kerala', title: 'Houseboat — 2 nights', amount: 12000, currency: 'INR', category: 'hotel', paidBy: 'user_demo', paidByName: 'Pavithra', participants: ['user_demo', 'user_priya'], date: '2026-03-11', createdAt: '2026-03-11T09:00:00Z' },
    { id: 'e7', tripId: 'trip_kerala', title: 'Munnar Tea Garden Tour', amount: 1400, currency: 'INR', category: 'activities', paidBy: 'user_priya', paidByName: 'Priya', participants: ['user_demo', 'user_priya'], date: '2026-03-13', createdAt: '2026-03-13T10:00:00Z' },
  ];
  storage.set('expenses', expenses);

  // ---- MESSAGES (Goa) ----
  const messages: Message[] = [
    { id: 'msg1', tripId: 'trip_goa', userId: 'user_arun', userName: 'Arun', avatarColor: '#173F35', content: 'Guys, should we leave by 8 AM from the airport?', timestamp: '2026-08-20T10:00:00Z', type: 'text' },
    { id: 'msg2', tripId: 'trip_goa', userId: 'user_priya', userName: 'Priya', avatarColor: '#D97745', content: 'Yes! 8 AM sounds perfect 👍', timestamp: '2026-08-20T10:05:00Z', type: 'text' },
    { id: 'msg3', tripId: 'trip_goa', userId: 'user_karthik', userName: 'Karthik', avatarColor: '#66736F', content: 'I found an amazing restaurant right on the beach. We should definitely check it out! 🍤', timestamp: '2026-08-20T10:12:00Z', type: 'text' },
    { id: 'msg4', tripId: 'trip_goa', userId: 'user_demo', userName: 'Pavithra', avatarColor: '#D97745', content: 'That sounds incredible! Let\'s create a poll to vote on dinner options 🗳️', timestamp: '2026-08-20T10:18:00Z', type: 'text' },
    { id: 'msg5', tripId: 'trip_goa', userId: 'user_divya', userName: 'Divya', avatarColor: '#1f5448', content: 'Also booking the Mandovi cruise for Day 2! Don\'t miss it 🚢', timestamp: '2026-08-20T10:25:00Z', type: 'text' },
    { id: 'msg6', tripId: 'trip_goa', userId: 'user_arun', userName: 'Arun', avatarColor: '#173F35', content: 'Perfect. Can\'t wait for this trip! 🏖️ Goa here we come!!', timestamp: '2026-08-20T10:30:00Z', type: 'text' },
    { id: 'msg7', tripId: 'trip_goa', userId: 'user_priya', userName: 'Priya', avatarColor: '#D97745', content: 'Don\'t forget sunscreen everyone ☀️', timestamp: '2026-08-20T10:32:00Z', type: 'text' },
  ];
  storage.set('messages', messages);

  // ---- POLLS (Goa) ----
  const polls: Poll[] = [
    {
      id: 'poll1',
      tripId: 'trip_goa',
      question: 'Where should we have dinner on Day 1?',
      options: [
        { id: 'po1', text: 'Britto\'s (Famous Goan Seafood)', votes: ['user_arun', 'user_priya', 'user_karthik'] },
        { id: 'po2', text: 'Tito\'s Street Party', votes: ['user_divya'] },
        { id: 'po3', text: 'Local Beach Shack', votes: [] },
      ],
      createdBy: 'user_demo',
      createdByName: 'Pavithra',
      createdAt: '2026-08-20T10:35:00Z',
      status: 'closed',
      votedBy: ['user_arun', 'user_priya', 'user_karthik', 'user_divya']
    },
    {
      id: 'poll2',
      tripId: 'trip_goa',
      question: 'What water sport should we try at Baga Beach?',
      options: [
        { id: 'po4', text: 'Parasailing 🪂', votes: ['user_priya'] },
        { id: 'po5', text: 'Jet Ski 🏄', votes: ['user_arun', 'user_karthik'] },
        { id: 'po6', text: 'Banana Boat 🍌', votes: ['user_divya'] },
        { id: 'po7', text: 'Scuba Diving 🤿', votes: [] },
      ],
      createdBy: 'user_karthik',
      createdByName: 'Karthik',
      createdAt: '2026-08-22T14:00:00Z',
      status: 'active',
      votedBy: ['user_arun', 'user_priya', 'user_karthik', 'user_divya']
    }
  ];
  storage.set('polls', polls);

  // ---- DESTINATIONS ----
  const destinations: Destination[] = [
    {
      id: 'dest_goa',
      name: 'Goa',
      country: 'India',
      region: 'West Coast',
      description: 'Sun-drenched beaches, Portuguese heritage, and vibrant nightlife make Goa India\'s most beloved coastal destination.',
      rating: 4.8,
      reviewCount: 12847,
      estimatedBudget: 15000,
      currency: 'INR',
      bestTime: 'Nov – Feb',
      category: ['Beaches', 'Nightlife', 'Heritage'],
      highlights: ['Baga Beach', 'Fort Aguada', 'Old Goa Churches', 'Saturday Night Market', 'Dudhsagar Falls'],
      image: '/images/goa.jpg'
    },
    {
      id: 'dest_kerala',
      name: 'Kerala',
      country: 'India',
      region: 'South India',
      description: 'Tranquil backwaters, misty hill stations, and lush tea plantations define this gem of South India.',
      rating: 4.9,
      reviewCount: 18203,
      estimatedBudget: 18000,
      currency: 'INR',
      bestTime: 'Sep – Mar',
      category: ['Nature', 'Relaxation', 'Culture'],
      highlights: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Wayanad', 'Varkala Beach', 'Periyar Wildlife'],
      image: '/images/kerala.jpg'
    },
    {
      id: 'dest_singapore',
      name: 'Singapore',
      country: 'Singapore',
      description: 'A dazzling city-state blending futuristic architecture, lush gardens, multicultural cuisine, and world-class entertainment.',
      rating: 4.7,
      reviewCount: 9452,
      estimatedBudget: 80000,
      currency: 'INR',
      bestTime: 'Feb – Apr',
      category: ['Culture', 'Shopping', 'Food', 'Adventure'],
      highlights: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island', 'Hawker Centres', 'Universal Studios'],
      image: '/images/singapore.jpg'
    },
    {
      id: 'dest_rajasthan',
      name: 'Rajasthan',
      country: 'India',
      region: 'North India',
      description: 'The land of maharajas — royal palaces, desert safaris, and vibrant bazaars await in Rajasthan.',
      rating: 4.7,
      reviewCount: 15631,
      estimatedBudget: 20000,
      currency: 'INR',
      bestTime: 'Oct – Feb',
      category: ['Heritage', 'Culture', 'Adventure'],
      highlights: ['Hawa Mahal', 'Desert Safari', 'Udaipur Lakes', 'Jodhpur Blue City', 'Amber Fort'],
      image: '/images/rajasthan.jpg'
    },
    {
      id: 'dest_himachal',
      name: 'Himachal Pradesh',
      country: 'India',
      region: 'North India',
      description: 'Snow-capped peaks, pine forests, and serene valleys make Himachal a paradise for mountain lovers.',
      rating: 4.6,
      reviewCount: 11289,
      estimatedBudget: 16000,
      currency: 'INR',
      bestTime: 'May – Jun, Sep – Oct',
      category: ['Mountains', 'Adventure', 'Nature'],
      highlights: ['Rohtang Pass', 'Solang Valley', 'Old Manali', 'Kasol', 'Spiti Valley'],
      image: '/images/himachal.jpg'
    },
    {
      id: 'dest_bali',
      name: 'Bali',
      country: 'Indonesia',
      description: 'Spiritual temples, terraced rice fields, world-class surf, and warm hospitality — Bali is magic.',
      rating: 4.8,
      reviewCount: 22143,
      estimatedBudget: 55000,
      currency: 'INR',
      bestTime: 'Apr – Oct',
      category: ['Beaches', 'Culture', 'Nature', 'Relaxation'],
      highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur', 'Monkey Forest'],
      image: '/images/bali.jpg'
    }
  ];
  storage.set('destinations', destinations);

  // ---- ACTIVITIES (Goa) ----
  const activities: Activity[] = [
    { id: 'act1', destinationId: 'dest_goa', tripId: 'trip_goa', name: 'Parasailing at Baga Beach', location: 'Baga Beach, Goa', category: 'Adventure', description: 'Soar above the beautiful Goa coastline with an experienced parasailing team.', estimatedCost: 800, currency: 'INR', duration: '15 min', rating: 4.5, tags: ['adventure', 'water sports', 'beach'] },
    { id: 'act2', destinationId: 'dest_goa', tripId: 'trip_goa', name: 'Mandovi River Sunset Cruise', location: 'Panaji Jetty, Goa', category: 'Experience', description: 'Enjoy a beautiful sunset cruise with Goan folk music, dance, and light snacks.', estimatedCost: 800, currency: 'INR', duration: '2h', rating: 4.7, tags: ['culture', 'sunset', 'scenic'] },
    { id: 'act3', destinationId: 'dest_goa', tripId: 'trip_goa', name: 'Sahakari Spice Farm Tour', location: 'Ponda, Goa', category: 'Culture', description: 'Walk through lush spice plantations and learn about Goan agriculture with a traditional lunch.', estimatedCost: 600, currency: 'INR', duration: '3h', rating: 4.4, tags: ['culture', 'nature', 'food'] },
    { id: 'act4', destinationId: 'dest_goa', tripId: 'trip_goa', name: 'Scuba Diving at Grande Island', location: 'Grande Island, Goa', category: 'Adventure', description: 'Explore vibrant coral reefs and marine life with certified diving instructors.', estimatedCost: 3500, currency: 'INR', duration: '4h', rating: 4.8, tags: ['adventure', 'water sports', 'nature'] },
    { id: 'act5', destinationId: 'dest_goa', tripId: 'trip_goa', name: 'Arpora Saturday Night Market', location: 'Arpora, North Goa', category: 'Shopping', description: 'Explore hundreds of stalls selling handcraft, clothing, jewellery, and street food.', estimatedCost: 500, currency: 'INR', duration: '3h', rating: 4.3, tags: ['shopping', 'food', 'nightlife'] },
  ];
  storage.set('activities', activities);

  // ---- ACCOMMODATION ----
  const accommodations: Accommodation[] = [
    { id: 'acc1', tripId: 'trip_goa', name: 'Taj Fort Aguada Resort & Spa', location: 'Sinquerim, North Goa', type: 'resort', pricePerNight: 12000, currency: 'INR', rating: 4.8, reviewCount: 2341, amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant', 'WiFi', 'Bar'], checkIn: '2026-12-12', checkOut: '2026-12-16' },
    { id: 'acc2', tripId: 'trip_goa', name: 'The Park Calangute', location: 'Calangute, North Goa', type: 'hotel', pricePerNight: 5500, currency: 'INR', rating: 4.3, reviewCount: 1876, amenities: ['Pool', 'Restaurant', 'WiFi', 'Parking'] },
    { id: 'acc3', tripId: 'trip_goa', name: 'Casa de Goa', location: 'Baga, North Goa', type: 'guesthouse', pricePerNight: 2800, currency: 'INR', rating: 4.1, reviewCount: 654, amenities: ['WiFi', 'Breakfast', 'Terrace'] },
  ];
  storage.set('accommodations', accommodations);

  // ---- TRANSPORTATION ----
  const transportation: Transportation[] = [
    { id: 'tr1', tripId: 'trip_goa', type: 'flight', provider: 'IndiGo', from: 'Chennai (MAA)', to: 'Goa (GOI)', departureTime: '2026-12-12T07:30:00', arrivalTime: '2026-12-12T09:20:00', duration: '1h 50m', price: 4200, currency: 'INR', class: 'Economy', isRecommended: true },
    { id: 'tr2', tripId: 'trip_goa', type: 'flight', provider: 'Air India', from: 'Chennai (MAA)', to: 'Goa (GOI)', departureTime: '2026-12-12T09:15:00', arrivalTime: '2026-12-12T11:05:00', duration: '1h 50m', price: 5100, currency: 'INR', class: 'Economy' },
    { id: 'tr3', tripId: 'trip_goa', type: 'flight', provider: 'SpiceJet', from: 'Chennai (MAA)', to: 'Goa (GOI)', departureTime: '2026-12-12T14:00:00', arrivalTime: '2026-12-12T16:05:00', duration: '2h 05m', price: 3800, currency: 'INR', class: 'Economy' },
    { id: 'tr4', tripId: 'trip_goa', type: 'cab', provider: 'Ola / Uber', from: 'Dabolim Airport', to: 'Hotel Taj Fort Aguada', departureTime: '2026-12-12T10:00:00', arrivalTime: '2026-12-12T11:00:00', duration: '1h', price: 900, currency: 'INR', isRecommended: true },
  ];
  storage.set('transportation', transportation);

  // Mark as seeded
  storage.set(SEEDED_KEY, true);
}

export function getDestinations(): Destination[] {
  return storage.getAll<Destination>('destinations');
}

export function getActivities(tripId?: string): Activity[] {
  const all = storage.getAll<Activity>('activities');
  if (tripId) return all.filter(a => a.tripId === tripId);
  return all;
}

export function getAccommodations(tripId?: string): Accommodation[] {
  const all = storage.getAll<Accommodation>('accommodations');
  if (tripId) return all.filter(a => a.tripId === tripId);
  return all;
}

export function getTransportation(tripId?: string): Transportation[] {
  const all = storage.getAll<Transportation>('transportation');
  if (tripId) return all.filter(t => t.tripId === tripId);
  return all;
}
