// ===================================================
// TRAVORA — Mock Data Catalogue (JavaScript)
// ===================================================

export const mockDestinations = [
  {
    id: 'dest_goa',
    name: 'Goa',
    country: 'India',
    region: 'South Asia',
    description: 'Pristine golden beaches, Portuguese colonial heritage, vibrant night shacks, and tropical spice plantations.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 342,
    estimatedBudget: 25000,
    currency: 'INR',
    bestTime: 'Nov – Feb',
    category: ['Beaches', 'Nightlife', 'Food', 'Culture'],
    highlights: ['Baga Beach Water Sports', 'Fort Aguada Sunset View', 'Basilica of Bom Jesus', 'Dudhsagar Waterfalls']
  },
  {
    id: 'dest_kerala',
    name: 'Kerala',
    country: 'India',
    region: 'South Asia',
    description: 'Tranquil emerald backwaters, tea gardens in Munnar, Ayurvedic wellness, and palm-fringed coastlines.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 420,
    estimatedBudget: 32000,
    currency: 'INR',
    bestTime: 'Sep – Mar',
    category: ['Nature', 'Relaxation', 'Food'],
    highlights: ['Alleppey Houseboat Stay', 'Munnar Tea Plantations', 'Periyar Wildlife Sanctuary', 'Varkala Cliff Beach']
  },
  {
    id: 'dest_singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Southeast Asia',
    description: 'Futuristic gardens, world-class street food, luxury shopping, and iconic skyline views.',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 890,
    estimatedBudget: 85000,
    currency: 'INR',
    bestTime: 'Nov – Jan',
    category: ['Shopping', 'Nightlife', 'Culture', 'Food'],
    highlights: ['Gardens by the Bay Light Show', 'Marina Bay Sands Infinity Pool', 'Sentosa Cable Car', 'Lau Pa Sat Hawker Center']
  },
  {
    id: 'dest_manali',
    name: 'Manali & Ladakh',
    country: 'India',
    region: 'Himalayas',
    description: 'Snow-capped mountain passes, river rafting, ancient monasteries, and high-altitude road trips.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 215,
    estimatedBudget: 40000,
    currency: 'INR',
    bestTime: 'May – Oct',
    category: ['Adventure', 'Mountains', 'Nature'],
    highlights: ['Atal Tunnel Drive', 'Solang Valley Paragliding', 'Pangong Tso Lake', 'Rohtang Pass Snow View']
  }
];

export function getDestinations() {
  return mockDestinations;
}

export function getActivities(tripId) {
  return [
    {
      id: 'act_baga',
      tripId,
      name: 'Water Sports at Baga Beach',
      location: 'Baga Beach, North Goa',
      category: 'Adventure',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      description: 'Parasailing, jet ski rides, and banana boat experiences on North Goa\'s main beach strip.',
      estimatedCost: 2500,
      currency: 'INR',
      duration: '2 hours',
      rating: 4.7,
      tags: ['Beach', 'Water Sports', 'Adrenaline']
    },
    {
      id: 'act_aguada',
      tripId,
      name: 'Sunset View at Fort Aguada',
      location: 'Sinquerim, Goa',
      category: 'Sightseeing',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
      description: '17th-century Portuguese fortress lighthouse overlooking the Arabian Sea.',
      estimatedCost: 50,
      currency: 'INR',
      duration: '1.5 hours',
      rating: 4.8,
      tags: ['Fort', 'Sunset', 'Photography']
    },
    {
      id: 'act_spice',
      tripId,
      name: 'Sahakari Spice Plantation Tour',
      location: 'Ponda, Central Goa',
      category: 'Food & Culinary',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
      description: 'Guided herbal spice tour followed by an authentic traditional Goan buffet lunch.',
      estimatedCost: 600,
      currency: 'INR',
      duration: '3 hours',
      rating: 4.6,
      tags: ['Food', 'Nature', 'Culture']
    }
  ];
}

export function getAccommodations(tripId) {
  return [
    {
      id: 'acc_taj',
      tripId,
      name: 'Taj Holiday Village Resort',
      location: 'Sinquerim, Candolim, Goa',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      type: 'resort',
      pricePerNight: 12500,
      currency: 'INR',
      rating: 4.9,
      reviewCount: 512,
      amenities: ['Private Beach', 'Swimming Pool', 'Spa', 'Free WiFi', 'Breakfast Included'],
      checkIn: '14:00',
      checkOut: '11:00'
    },
    {
      id: 'acc_hostel',
      tripId,
      name: 'Zostel Goa (Anjuna)',
      location: 'Anjuna Beach, Goa',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
      type: 'hostel',
      pricePerNight: 1200,
      currency: 'INR',
      rating: 4.7,
      reviewCount: 380,
      amenities: ['Social Common Room', 'Free WiFi', 'Cafe', 'Air Conditioning'],
      checkIn: '13:00',
      checkOut: '10:00'
    }
  ];
}

export function getTransportation(tripId) {
  return [
    {
      id: 'tr_flight_out',
      tripId,
      type: 'flight',
      provider: 'IndiGo 6E-204',
      from: 'Bangalore (BLR)',
      to: 'Goa (GOI)',
      departureTime: '08:30 AM',
      arrivalTime: '09:45 AM',
      duration: '1h 15m',
      price: 4200,
      currency: 'INR',
      class: 'Economy',
      isRecommended: true
    },
    {
      id: 'tr_cab_transfer',
      tripId,
      type: 'cab',
      provider: 'Goa Miles Taxi',
      from: 'Dabolim Airport',
      to: 'Candolim Hotel',
      departureTime: '10:15 AM',
      arrivalTime: '11:15 AM',
      duration: '1 hour',
      price: 1400,
      currency: 'INR',
      isRecommended: true
    }
  ];
}
