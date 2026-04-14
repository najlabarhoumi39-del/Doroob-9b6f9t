import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography, Shadow } from '@/constants/theme';
import { TripEntry } from '@/services/transportService';
import { formatCO2 } from '@/services/transportService';

type Props = {
  trip: TripEntry;
};

export const ActivityItem = React.memo(({ trip }: Props) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: trip.modeColor + '20' }]}>
        <MaterialIcons name={trip.modeIcon as any} size={22} color={trip.modeColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{trip.modeName}</Text>
        <Text style={styles.meta}>
          {trip.quantity} {trip.unit} · {trip.date}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.pts}>+{trip.pointsEarned} pts</Text>
        <Text style={styles.co2}>-{formatCO2(trip.co2Saved)} CO₂</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
  },
  pts: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.gold,
    marginBottom: 2,
  },
  co2: {
    ...Typography.micro,
    color: Colors.accent,
  },
});
