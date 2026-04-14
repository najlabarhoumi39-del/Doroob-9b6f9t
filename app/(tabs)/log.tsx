import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography, Shadow } from '@/constants/theme';
import { TRANSPORT_MODES, TransportMode } from '@/constants/config';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';

export default function LogTripScreen() {
  const insets = useSafeAreaInsets();
  const { logTrip, totalPoints } = useApp();
  const { showAlert } = useAlert();

  const [selectedMode, setSelectedMode] = useState<TransportMode | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [submitted, setSubmitted] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);

  const previewPoints = useCallback(() => {
    if (!selectedMode) return 0;
    const q = parseFloat(quantity) || 0;
    return Math.round(selectedMode.pointsPerUnit * q);
  }, [selectedMode, quantity]);

  const handleLog = useCallback(() => {
    if (!selectedMode) {
      showAlert('Select a Transport Mode', 'Please choose how you travelled today.');
      return;
    }
    const q = parseFloat(quantity);
    if (!q || q <= 0) {
      showAlert('Invalid Quantity', `Please enter a valid number of ${selectedMode.unit}s.`);
      return;
    }
    if (q > 200) {
      showAlert('Quantity Too High', 'Please enter a realistic travel distance or trip count.');
      return;
    }

    const result = logTrip(selectedMode.id, q);
    if (result) {
      setLastPoints(result.pointsEarned);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedMode(null);
        setQuantity('1');
        setLastPoints(0);
      }, 2500);
    }
  }, [selectedMode, quantity, logTrip, showAlert]);

  const pts = previewPoints();

  if (submitted) {
    return (
      <View style={[styles.successWrap, { paddingTop: insets.top }]}>
        <View style={styles.successCircle}>
          <MaterialIcons name="check-circle" size={64} color={Colors.accent} />
        </View>
        <Text style={styles.successTitle}>Trip Logged!</Text>
        <View style={styles.successPts}>
          <Text style={styles.successPtsLabel}>You earned</Text>
          <Text style={styles.successPtsValue}>+{lastPoints} pts</Text>
        </View>
        <Text style={styles.successSub}>Keep it up — every Qatar commute counts 🇯🇮🌿</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.xxl }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Text style={styles.headerTitle}>Log a Trip</Text>
          <Text style={styles.headerSub}>Log your Qatar green commute &amp; earn points</Text>
          <View style={styles.balancePill}>
            <MaterialIcons name="stars" size={16} color={Colors.gold} />
            <Text style={styles.balanceText}>{totalPoints} pts balance</Text>
          </View>
        </View>

        {/* Mode Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How did you travel?</Text>
          <View style={styles.modeGrid}>
            {TRANSPORT_MODES.map((mode) => {
              const isSelected = selectedMode?.id === mode.id;
              return (
                <Pressable
                  key={mode.id}
                  style={({ pressed }) => [
                    styles.modeCard,
                    isSelected && styles.modeCardSelected,
                    isSelected && { borderColor: mode.color, backgroundColor: mode.color + '12' },
                    pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
                  ]}
                  onPress={() => setSelectedMode(mode)}
                >
                  <View
                    style={[
                      styles.modeIcon,
                      { backgroundColor: isSelected ? mode.color : mode.color + '18' },
                    ]}
                  >
                    <MaterialIcons
                      name={mode.icon as any}
                      size={24}
                      color={isSelected ? Colors.textInverse : mode.color}
                    />
                  </View>
                  <Text style={[styles.modeName, isSelected && { color: mode.color, fontWeight: '700' }]}>
                    {mode.name}
                  </Text>
                  <View style={styles.modePts}>
                    <Text style={[styles.modePtsText, isSelected && { color: mode.color }]}>
                      {mode.pointsPerUnit} pts/{mode.unit}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Quantity Input */}
        {selectedMode ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {selectedMode.unit === 'trip' ? 'Number of trips' : `Distance (${selectedMode.unit})`}
            </Text>
            <View style={styles.quantityRow}>
              <Pressable
                style={styles.qBtn}
                onPress={() => {
                  const v = parseFloat(quantity) || 1;
                  if (v > 0.5) setQuantity(String(Math.max(0.5, v - (selectedMode.unit === 'trip' ? 1 : 0.5))));
                }}
              >
                <MaterialIcons name="remove" size={22} color={Colors.primary} />
              </Pressable>
              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
                selectTextOnFocus
              />
              <Pressable
                style={styles.qBtn}
                onPress={() => {
                  const v = parseFloat(quantity) || 0;
                  setQuantity(String(v + (selectedMode.unit === 'trip' ? 1 : 0.5)));
                }}
              >
                <MaterialIcons name="add" size={22} color={Colors.primary} />
              </Pressable>
              <View style={styles.unitBadge}>
                <Text style={styles.unitText}>{selectedMode.unit}</Text>
              </View>
            </View>

            {/* Mode info */}
            <View style={styles.modeInfo}>
              <MaterialIcons name="info-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.modeInfoText}>{selectedMode.description}</Text>
            </View>
          </View>
        ) : null}

        {/* Points Preview */}
        <View style={styles.section}>
          <View style={styles.previewCard}>
            <View style={styles.previewLeft}>
              <Text style={styles.previewLabel}>Points to earn</Text>
              <Text style={[styles.previewPts, pts > 0 && { color: Colors.gold }]}>
                {pts > 0 ? `+${pts}` : '—'}
              </Text>
            </View>
            {selectedMode ? (
              <View style={styles.previewRight}>
                <View style={styles.previewStat}>
                  <MaterialIcons name="cloud-off" size={14} color={Colors.accent} />
                  <Text style={styles.previewStatText}>
                    ~{Math.round(selectedMode.co2SavedPerUnit * (parseFloat(quantity) || 0))}g CO₂ saved
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.previewHint}>Select a mode above</Text>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              !selectedMode && styles.submitBtnDisabled,
              pressed && selectedMode && { opacity: 0.88, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleLog}
          >
            <MaterialIcons name="add-location-alt" size={22} color={Colors.textInverse} />
            <Text style={styles.submitText}>Log Trip & Earn Points</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.pageTitle,
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
  },
  headerSub: {
    ...Typography.label,
    color: Colors.accentLight,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  balancePill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  balanceText: {
    ...Typography.label,
    color: Colors.goldLight,
    fontWeight: '700',
  },

  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  // Mode Grid
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  modeCard: {
    width: '22%',
    minWidth: 76,
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    ...Shadow.sm,
  },
  modeCardSelected: {
    borderWidth: 2,
  },
  modeIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  modeName: {
    ...Typography.micro,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  modePts: {},
  modePtsText: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // Quantity
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  qBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceTinted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  quantityInput: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primaryMid,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.sm,
  },
  unitBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 44,
    alignItems: 'center',
  },
  unitText: {
    ...Typography.label,
    color: Colors.textInverse,
    fontWeight: '700',
  },
  modeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
  },
  modeInfoText: {
    ...Typography.caption,
    color: Colors.textMuted,
    flex: 1,
  },

  // Preview
  previewCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadow.sm,
  },
  previewLeft: {},
  previewLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  previewPts: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  previewRight: {},
  previewStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewStatText: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '500',
  },
  previewHint: {
    ...Typography.label,
    color: Colors.textMuted,
  },

  // Submit
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    gap: Spacing.sm,
    ...Shadow.md,
  },
  submitBtnDisabled: {
    backgroundColor: Colors.textMuted,
    ...Shadow.sm,
  },
  submitText: {
    ...Typography.bodyMedium,
    color: Colors.textInverse,
    fontWeight: '700',
  },

  // Success
  successWrap: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surfaceTinted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.lg,
  },
  successTitle: {
    ...Typography.heroTitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  successPts: {
    alignItems: 'center',
    backgroundColor: Colors.gold + '20',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gold + '40',
  },
  successPtsLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  successPtsValue: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.gold,
    letterSpacing: -1,
  },
  successSub: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
