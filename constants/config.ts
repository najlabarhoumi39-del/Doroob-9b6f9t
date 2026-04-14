export type TransportMode = {
  id: string;
  name: string;
  icon: string;
  pointsPerUnit: number;
  unit: string;
  unitLabel: string;
  color: string;
  co2SavedPerUnit: number; // grams per unit
  description: string;
};

export const TRANSPORT_MODES: TransportMode[] = [
  {
    id: 'walking',
    name: 'Walking',
    icon: 'directions-walk',
    pointsPerUnit: 10,
    unit: 'km',
    unitLabel: 'per km',
    color: '#52B788',
    co2SavedPerUnit: 120,
    description: 'Explore Doha on foot — corniche, souqs & beyond',
  },
  {
    id: 'cycling',
    name: 'Qatar Bike',
    icon: 'directions-bike',
    pointsPerUnit: 8,
    unit: 'km',
    unitLabel: 'per km',
    color: '#40916C',
    co2SavedPerUnit: 140,
    description: 'Qatar Bike shared cycling network across Doha',
  },
  {
    id: 'doha_metro',
    name: 'Doha Metro',
    icon: 'subway',
    pointsPerUnit: 20,
    unit: 'trip',
    unitLabel: 'per trip',
    color: '#8B1A1A',
    co2SavedPerUnit: 1800,
    description: 'Red, Green & Gold lines across the city',
  },
  {
    id: 'mowasalat_bus',
    name: 'Karwa Bus',
    icon: 'directions-bus',
    pointsPerUnit: 15,
    unit: 'trip',
    unitLabel: 'per trip',
    color: '#2D6A4F',
    co2SavedPerUnit: 1200,
    description: 'Mowasalat public bus network in Qatar',
  },
  {
    id: 'ec_tram',
    name: 'EC Tram',
    icon: 'tram',
    pointsPerUnit: 18,
    unit: 'trip',
    unitLabel: 'per trip',
    color: '#6B4FA0',
    co2SavedPerUnit: 1500,
    description: 'Education City Tram linking QU & partner universities',
  },
  {
    id: 'lusail_tram',
    name: 'Lusail Tram',
    icon: 'tram',
    pointsPerUnit: 18,
    unit: 'trip',
    unitLabel: 'per trip',
    color: '#1A6BAF',
    co2SavedPerUnit: 1500,
    description: 'Lusail City light rail connecting Fox Hills & Marina',
  },
  {
    id: 'carpool',
    name: 'Carpool',
    icon: 'people',
    pointsPerUnit: 12,
    unit: 'trip',
    unitLabel: 'per trip',
    color: '#D4A574',
    co2SavedPerUnit: 900,
    description: 'Share a ride, reduce emissions across Qatar',
  },
  {
    id: 'water_taxi',
    name: 'Water Taxi',
    icon: 'directions-boat',
    pointsPerUnit: 25,
    unit: 'trip',
    unitLabel: 'per trip',
    color: '#1565C0',
    co2SavedPerUnit: 2000,
    description: 'Doha Corniche & Pearl-Qatar water taxi routes',
  },
];

export type RewardCategory = 'food' | 'drinks' | 'transport' | 'shopping' | 'experiences';

export type Reward = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: RewardCategory;
  partner: string;
  badge: string;
  color: string;
  available: number;
  popular?: boolean;
  new?: boolean;
};

export const REWARDS: Reward[] = [
  {
    id: 'r1',
    name: 'Free Costa Coffee',
    description: 'Any size hot or iced drink at Costa Coffee Qatar',
    pointsCost: 50,
    category: 'drinks',
    partner: 'Costa Coffee Qatar',
    badge: '☕',
    color: '#6F2B0A',
    available: 100,
    popular: true,
  },
  {
    id: 'r2',
    name: 'Doha Metro Day Pass',
    description: 'Unlimited Red, Green & Gold line rides for one day',
    pointsCost: 100,
    category: 'transport',
    partner: 'Qatar Rail (QNRS)',
    badge: '🚇',
    color: '#8B1A1A',
    available: 50,
    popular: true,
  },
  {
    id: 'r3',
    name: '20% Souq Waqif Dining',
    description: 'Discount at participating Souq Waqif restaurants, min spend 50 QAR',
    pointsCost: 150,
    category: 'food',
    partner: 'Souq Waqif Hospitality',
    badge: '🍽️',
    color: '#C05621',
    available: 200,
  },
  {
    id: 'r4',
    name: 'Free Karwa Bus Ride',
    description: 'Single Mowasalat bus journey anywhere in Qatar',
    pointsCost: 80,
    category: 'transport',
    partner: 'Mowasalat (Karwa)',
    badge: '🚌',
    color: '#2D6A4F',
    available: 500,
  },
  {
    id: 'r5',
    name: 'Tim Hortons Drink',
    description: 'Any medium hot or cold drink at Tim Hortons Qatar',
    pointsCost: 40,
    category: 'drinks',
    partner: 'Tim Hortons Qatar',
    badge: '🥤',
    color: '#C8102E',
    available: 150,
    new: true,
  },
  {
    id: 'r6',
    name: 'Eco Tote Bag',
    description: 'Doroob-branded reusable tote, proudly made in Qatar',
    pointsCost: 200,
    category: 'shopping',
    partner: 'Doroob Store',
    badge: '🛍️',
    color: '#52B788',
    available: 30,
    new: true,
  },
  {
    id: 'r7',
    name: 'VOX Cinema Ticket',
    description: 'One standard screening at VOX Cinemas Mall of Qatar',
    pointsCost: 300,
    category: 'experiences',
    partner: 'VOX Cinemas Qatar',
    badge: '🎬',
    color: '#E63946',
    available: 25,
  },
  {
    id: 'r8',
    name: 'Qatar Bike Hour',
    description: 'One free hour on the Qatar Bike sharing network',
    pointsCost: 60,
    category: 'transport',
    partner: 'Qatar Bike',
    badge: '🚲',
    color: '#40916C',
    available: 80,
  },
  {
    id: 'r9',
    name: 'Katara Dining Voucher',
    description: 'Lunch or dinner voucher at Katara Cultural Village restaurants',
    pointsCost: 180,
    category: 'food',
    partner: 'Katara Cultural Village',
    badge: '🌱',
    color: '#276749',
    available: 60,
  },
  {
    id: 'r10',
    name: 'Monthly Metro Pass',
    description: 'Unlimited Doha Metro rides for 30 days on all lines',
    pointsCost: 500,
    category: 'transport',
    partner: 'Qatar Rail (QNRS)',
    badge: '🎫',
    color: '#8B1A1A',
    available: 20,
  },
];

export const CATEGORY_LABELS: Record<RewardCategory, string> = {
  food: 'Food',
  drinks: 'Drinks',
  transport: 'Transport',
  shopping: 'Shopping',
  experiences: 'Experiences',
};

export const CATEGORY_ICONS: Record<RewardCategory, string> = {
  food: 'restaurant',
  drinks: 'local-cafe',
  transport: 'directions-transit',
  shopping: 'shopping-bag',
  experiences: 'star',
};
