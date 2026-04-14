import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

type Props = {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'gold' | 'green' | 'outline';
};

export const PointsBadge = React.memo(({ points, size = 'md', variant = 'gold' }: Props) => {
  const sizeStyles = {
    sm: { paddingHorizontal: 8, paddingVertical: 3, fontSize: 12 },
    md: { paddingHorizontal: 12, paddingVertical: 5, fontSize: 14 },
    lg: { paddingHorizontal: 16, paddingVertical: 7, fontSize: 16 },
  };

  const variantStyles = {
    gold: { backgroundColor: Colors.gold, textColor: Colors.textOnGold },
    green: { backgroundColor: Colors.accent, textColor: Colors.textInverse },
    outline: { backgroundColor: 'transparent', textColor: Colors.gold, borderWidth: 1.5, borderColor: Colors.gold },
  };

  const s = sizeStyles[size];
  const v = variantStyles[variant];

  return (
    <View
      style={[
        styles.badge,
        {
          paddingHorizontal: s.paddingHorizontal,
          paddingVertical: s.paddingVertical,
          backgroundColor: v.backgroundColor,
          borderWidth: ('borderWidth' in v ? v.borderWidth : 0) as number,
          borderColor: ('borderColor' in v ? v.borderColor : 'transparent') as string,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: s.fontSize, color: v.textColor }]}>
        {points} pts
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
