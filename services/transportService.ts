import { TRANSPORT_MODES, TransportMode } from '@/constants/config';

export type TripEntry = {
  id: string;
  modeId: string;
  modeName: string;
  modeIcon: string;
  modeColor: string;
  quantity: number;
  unit: string;
  pointsEarned: number;
  co2Saved: number; // grams
  timestamp: Date;
  date: string;
};

export type RedemptionEntry = {
  id: string;
  rewardId: string;
  rewardName: string;
  rewardBadge: string;
  pointsSpent: number;
  timestamp: Date;
  date: string;
};

// Mock history data — Qatar-specific routes
const mockTrips: TripEntry[] = [
  {
    id: 't1',
    modeId: 'doha_metro',
    modeName: 'Doha Metro',
    modeIcon: 'subway',
    modeColor: '#8B1A1A',
    quantity: 1,
    unit: 'trip',
    pointsEarned: 20,
    co2Saved: 1800,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    date: 'Today',
  },
  {
    id: 't2',
    modeId: 'ec_tram',
    modeName: 'EC Tram',
    modeIcon: 'tram',
    modeColor: '#6B4FA0',
    quantity: 1,
    unit: 'trip',
    pointsEarned: 18,
    co2Saved: 1500,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    date: 'Today',
  },
  {
    id: 't3',
    modeId: 'walking',
    modeName: 'Walking',
    modeIcon: 'directions-walk',
    modeColor: '#52B788',
    quantity: 2,
    unit: 'km',
    pointsEarned: 20,
    co2Saved: 240,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    date: 'Today',
  },
  {
    id: 't4',
    modeId: 'mowasalat_bus',
    modeName: 'Karwa Bus',
    modeIcon: 'directions-bus',
    modeColor: '#2D6A4F',
    quantity: 1,
    unit: 'trip',
    pointsEarned: 15,
    co2Saved: 1200,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    date: 'Yesterday',
  },
  {
    id: 't5',
    modeId: 'cycling',
    modeName: 'Qatar Bike',
    modeIcon: 'directions-bike',
    modeColor: '#40916C',
    quantity: 4,
    unit: 'km',
    pointsEarned: 32,
    co2Saved: 560,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    date: 'Yesterday',
  },
  {
    id: 't6',
    modeId: 'lusail_tram',
    modeName: 'Lusail Tram',
    modeIcon: 'tram',
    modeColor: '#1A6BAF',
    quantity: 2,
    unit: 'trip',
    pointsEarned: 36,
    co2Saved: 3000,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    date: '2 days ago',
  },
];

const mockRedemptions: RedemptionEntry[] = [
  {
    id: 'red1',
    rewardId: 'r1',
    rewardName: 'Free Costa Coffee',
    rewardBadge: '☕',
    pointsSpent: 50,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    date: '3 days ago',
  },
];

export function getTransportMode(id: string): TransportMode | undefined {
  return TRANSPORT_MODES.find((m) => m.id === id);
}

export function calculatePoints(modeId: string, quantity: number): number {
  const mode = getTransportMode(modeId);
  if (!mode) return 0;
  return Math.round(mode.pointsPerUnit * quantity);
}

export function calculateCO2(modeId: string, quantity: number): number {
  const mode = getTransportMode(modeId);
  if (!mode) return 0;
  return Math.round(mode.co2SavedPerUnit * quantity);
}

export function getMockTrips(): TripEntry[] {
  return [...mockTrips];
}

export function getMockRedemptions(): RedemptionEntry[] {
  return [...mockRedemptions];
}

export function formatCO2(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${grams} g`;
}

export function getTotalStats(trips: TripEntry[]) {
  const totalPoints = trips.reduce((sum, t) => sum + t.pointsEarned, 0);
  const totalCO2 = trips.reduce((sum, t) => sum + t.co2Saved, 0);
  const totalTrips = trips.length;
  return { totalPoints, totalCO2, totalTrips };
}
