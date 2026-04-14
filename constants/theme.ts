// Doroob Design System
export const Colors = {
  // Brand
  primary: '#1B4332',       // Deep forest green
  primaryLight: '#2D6A4F',
  primaryMid: '#40916C',
  accent: '#52B788',        // Mint green
  accentLight: '#74C69D',
  gold: '#F4A261',          // Warm gold for points/rewards
  goldLight: '#FFD166',

  // Surface
  background: '#F0F7F4',    // Soft green-tinted white
  surface: '#FFFFFF',
  surfaceTinted: '#E8F5EE', // Light mint tint
  card: '#FFFFFF',
  cardBorder: '#D8EDDF',

  // Text
  textPrimary: '#1A2E22',
  textSecondary: '#4A6741',
  textMuted: '#7A9E7E',
  textInverse: '#FFFFFF',
  textOnGold: '#7B3F00',

  // Semantic
  success: '#38A169',
  warning: '#F4A261',
  error: '#E53E3E',
  info: '#3182CE',

  // Transport mode colors
  walking: '#52B788',
  cycling: '#40916C',
  bus: '#2D6A4F',
  metro: '#1B4332',
  tram: '#74C69D',
  carpool: '#F4A261',
  scooter: '#FFD166',

  // Tab bar
  tabBar: '#1B4332',
  tabBarBorder: '#2D6A4F',
  tabActive: '#74C69D',
  tabInactive: '#4A7C59',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Typography = {
  heroTitle: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  pageTitle: { fontSize: 22, fontWeight: '700' as const },
  sectionTitle: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 26 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const },
  label: { fontSize: 14, fontWeight: '500' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  points: { fontSize: 32, fontWeight: '700' as const },
  micro: { fontSize: 11, fontWeight: '500' as const },
};

export const Shadow = {
  sm: {
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};
