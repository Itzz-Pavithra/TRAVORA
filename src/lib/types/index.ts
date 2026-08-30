// ===================================================
// TRAVORA — TypeScript Type Definitions
// ===================================================

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  avatarColor: string;
  bio?: string;
  travelPreference: 'solo' | 'group' | null;
  currency: string;
  language: string;
  tripsCount: number;
  placesCount: number;
  memoriesCount: number;
  savedPlacesCount: number;
  joinedAt: string;
  profileVisibility: 'public' | 'friends' | 'private';
  memoryVisibility: 'public' | 'friends' | 'private';
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  country: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  travelers: number;
  type: 'solo' | 'group';
  budget: number;
  currency: string;
  budgetSpent: number;
  interests: string[];
  status: 'upcoming' | 'active' | 'past';
  ownerId: string;
  memberIds: string[];
  createdAt: string;
  description?: string;
}

export interface TripMember {
  id: string;
  tripId: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  avatarColor: string;
  role: 'owner' | 'member';
  joinedAt: string;
  status: 'active' | 'pending';
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region?: string;
  description: string;
  image?: string;
  rating: number;
  reviewCount: number;
  estimatedBudget: number;
  currency: string;
  bestTime: string;
  category: string[];
  highlights: string[];
  isSaved?: boolean;
}

export interface Place {
  id: string;
  name: string;
  type: 'restaurant' | 'hotel' | 'activity' | 'attraction' | 'destination';
  location: string;
  image?: string;
  rating: number;
  price?: string;
  description?: string;
  tags?: string[];
  tripId?: string;
  savedAt?: string;
}

export interface ItineraryDay {
  id: string;
  tripId: string;
  date: string;
  dayNumber: number;
  title: string;
  items: ItineraryItem[];
}

export interface ItineraryItem {
  id: string;
  dayId: string;
  tripId: string;
  time: string;
  title: string;
  type: 'accommodation' | 'transport' | 'food' | 'activity' | 'sightseeing' | 'other';
  location?: string;
  duration?: string;
  notes?: string;
  cost?: number;
  order: number;
}

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  currency: string;
  category: 'petrol' | 'food' | 'hotel' | 'transport' | 'activities' | 'shopping' | 'tickets' | 'other';
  paidBy: string;
  paidByName: string;
  participants: string[];
  date: string;
  notes?: string;
  createdAt: string;
}

export interface Settlement {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}

export interface Message {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  avatarColor: string;
  content: string;
  timestamp: string;
  type: 'text' | 'system';
}

export interface Poll {
  id: string;
  tripId: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  status: 'active' | 'closed';
  votedBy: string[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[];
}

export interface Memory {
  id: string;
  tripId: string;
  uploadedBy: string;
  uploadedByName: string;
  avatarColor: string;
  date: string;
  location?: string;
  caption?: string;
  dayNumber?: number;
  mediaType: 'image' | 'video';
  mediaKey: string;
  thumbnail?: string;
  likes: string[];
  createdAt: string;
  width?: number;
  height?: number;
}

export interface Activity {
  id: string;
  destinationId?: string;
  tripId?: string;
  name: string;
  location: string;
  category: string;
  image?: string;
  description: string;
  estimatedCost: number;
  currency: string;
  duration: string;
  rating: number;
  tags: string[];
}

export interface Accommodation {
  id: string;
  tripId?: string;
  name: string;
  location: string;
  image?: string;
  type: 'hotel' | 'hostel' | 'resort' | 'airbnb' | 'guesthouse';
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  checkIn?: string;
  checkOut?: string;
  isSaved?: boolean;
}

export interface Transportation {
  id: string;
  tripId?: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'cab' | 'road';
  provider: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  class?: string;
  isRecommended?: boolean;
  notes?: string;
}

export interface SavedPlace {
  id: string;
  userId: string;
  placeId: string;
  name: string;
  location: string;
  image?: string;
  type: 'destination' | 'restaurant' | 'hotel' | 'activity';
  savedAt: string;
}

export interface TravelChallenge {
  id: string;
  tripId: string;
  text: string;
  completedBy: string[];
}

export interface TravelPrompt {
  id: string;
  text: string;
  votes: Record<string, string>;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
