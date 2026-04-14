import React, { createContext, useState, ReactNode, useCallback } from 'react';
import {
  TripEntry,
  RedemptionEntry,
  getMockTrips,
  getMockRedemptions,
  calculatePoints,
  calculateCO2,
  getTransportMode,
} from '@/services/transportService';
import { REWARDS, Reward } from '@/constants/config';

export type AppContextType = {
  // User
  userName: string;
  userCity: string;
  userLevel: string;
  totalPoints: number;
  lifetimePoints: number;
  totalCO2Saved: number; // grams
  tripsLogged: number;

  // Data
  trips: TripEntry[];
  redemptions: RedemptionEntry[];

  // Actions
  logTrip: (modeId: string, quantity: number) => TripEntry | null;
  redeemReward: (reward: Reward) => boolean;
  getTodayTrips: () => TripEntry[];
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const MOCK_INITIAL_POINTS = 145;

function getUserLevel(points: number): string {
  if (points < 100) return 'Seedling 🌱';
  if (points < 300) return 'Sprout 🌿';
  if (points < 600) return 'Explorer 🚴';
  if (points < 1000) return 'Green Rider 🌳';
  return 'Eco Champion 🏆';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initialTrips = getMockTrips();
  const initialRedemptions = getMockRedemptions();

  const initialCO2 = initialTrips.reduce((sum, t) => sum + t.co2Saved, 0);
  const initialEarned = initialTrips.reduce((sum, t) => sum + t.pointsEarned, 0);
  const initialSpent = initialRedemptions.reduce((sum, r) => sum + r.pointsSpent, 0);

  const [trips, setTrips] = useState<TripEntry[]>(initialTrips);
  const [redemptions, setRedemptions] = useState<RedemptionEntry[]>(initialRedemptions);
  const [totalPoints, setTotalPoints] = useState(
    MOCK_INITIAL_POINTS + initialEarned - initialSpent
  );
  const [lifetimePoints, setLifetimePoints] = useState(MOCK_INITIAL_POINTS + initialEarned);
  const [totalCO2Saved, setTotalCO2Saved] = useState(initialCO2);

  const logTrip = useCallback((modeId: string, quantity: number): TripEntry | null => {
    const mode = getTransportMode(modeId);
    if (!mode) return null;

    const pts = calculatePoints(modeId, quantity);
    const co2 = calculateCO2(modeId, quantity);
    const now = new Date();

    const entry: TripEntry = {
      id: `t_${Date.now()}`,
      modeId,
      modeName: mode.name,
      modeIcon: mode.icon,
      modeColor: mode.color,
      quantity,
      unit: mode.unit,
      pointsEarned: pts,
      co2Saved: co2,
      timestamp: now,
      date: 'Just now',
    };

    setTrips((prev) => [entry, ...prev]);
    setTotalPoints((prev) => prev + pts);
    setLifetimePoints((prev) => prev + pts);
    setTotalCO2Saved((prev) => prev + co2);

    return entry;
  }, []);

  const redeemReward = useCallback(
    (reward: Reward): boolean => {
      if (totalPoints < reward.pointsCost) return false;

      const now = new Date();
      const entry: RedemptionEntry = {
        id: `red_${Date.now()}`,
        rewardId: reward.id,
        rewardName: reward.name,
        rewardBadge: reward.badge,
        pointsSpent: reward.pointsCost,
        timestamp: now,
        date: 'Just now',
      };

      setRedemptions((prev) => [entry, ...prev]);
      setTotalPoints((prev) => prev - reward.pointsCost);
      return true;
    },
    [totalPoints]
  );

  const getTodayTrips = useCallback((): TripEntry[] => {
    return trips.filter((t) => t.date === 'Today' || t.date === 'Just now');
  }, [trips]);

  return (
    <AppContext.Provider
      value={{
        userName: 'Ahmed',
        userCity: 'Doha, Qatar',
        userLevel: getUserLevel(lifetimePoints),
        totalPoints,
        lifetimePoints,
        totalCO2Saved,
        tripsLogged: trips.length,
        trips,
        redemptions,
        logTrip,
        redeemReward,
        getTodayTrips,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
