import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography, Shadow } from '@/constants/theme';
import { REWARDS, Reward, RewardCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/constants/config';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';

type FilterCategory = 'all' | RewardCategory;

const FILTERS: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'food', label: 'Food' },
  { id: 'transport', label: 'Transport' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'experiences', label: 'Experiences' },
];

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const { totalPoints, redeemReward } = useApp();
  const { showAlert } = useAlert();

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [affordable, setAffordable] = useState(false);

  const filtered = useMemo(() => {
    let list = REWARDS;
    if (activeFilter !== 'all') list = list.filter((r) => r.category === activeFilter);
    if (affordable) list = list.filter((r) => r.pointsCost <= totalPoints);
    return list;
  }, [activeFilter, affordable, totalPoints]);

  const handleRedeem = useCallback(
    (reward: Reward) => {
      if (totalPoints < reward.pointsCost) {
        showAlert(
          'Not Enough Points',
          `You need ${reward.pointsCost - totalPoints} more points to redeem ${reward.name}.`,
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }
      showAlert(
        `Redeem ${reward.name}?`,
        `This will cost ${reward.pointsCost} points. Your new balance will be ${totalPoints - reward.pointsCost} pts.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Redeem',
            style: 'default',
            onPress: () => {
              const success = redeemReward(reward);
              if (success) {
                showAlert('Reward Redeemed! 🎉', `Your ${reward.name} voucher is ready. Check your email for details.`);
              }
            },
          },
        ]
      );
    },
    [totalPoints, redeemReward, showAlert]
  );

  const renderReward = useCallback(
    ({ item: reward }: { item: Reward }) => {
      const canAfford = totalPoints >= reward.pointsCost;
      return (
        <Pressable
          style={({ pressed }) => [
            styles.rewardCard,
            !canAfford && styles.rewardCardLocked,
            pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => handleRedeem(reward)}
        >
          {/* Badge/Tags */}
          <View style={styles.rewardBadgeRow}>
            {reward.popular ? (
              <View style={[styles.tag, { backgroundColor: Colors.gold + '20' }]}>
                <Text style={[styles.tagText, { color: Colors.gold }]}>🔥 Popular</Text>
              </View>
            ) : null}
            {reward.new ? (
              <View style={[styles.tag, { backgroundColor: Colors.accent + '20' }]}>
                <Text style={[styles.tagText, { color: Colors.accent }]}>✨ New</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.rewardRow}>
            {/* Emoji */}
            <View style={[styles.rewardEmoji, { backgroundColor: reward.color + '18' }]}>
              <Text style={styles.rewardEmojiText}>{reward.badge}</Text>
              {!canAfford ? (
                <View style={styles.lockOverlay}>
                  <MaterialIcons name="lock" size={16} color={Colors.textMuted} />
                </View>
              ) : null}
            </View>

            {/* Info */}
            <View style={styles.rewardInfo}>
              <Text style={[styles.rewardName, !canAfford && styles.textDimmed]}>{reward.name}</Text>
              <Text style={styles.rewardDescription} numberOfLines={2}>{reward.description}</Text>
              <Text style={styles.rewardPartner}>by {reward.partner}</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.rewardFooter}>
            <View style={[styles.costBadge, canAfford ? styles.costBadgeAffordable : styles.costBadgeLocked]}>
              <MaterialIcons
                name="stars"
                size={14}
                color={canAfford ? Colors.gold : Colors.textMuted}
              />
              <Text style={[styles.costText, !canAfford && styles.textDimmed]}>
                {reward.pointsCost} pts
              </Text>
            </View>
            {canAfford ? (
              <Pressable
                style={styles.redeemBtn}
                onPress={() => handleRedeem(reward)}
              >
                <Text style={styles.redeemBtnText}>Redeem</Text>
                <MaterialIcons name="arrow-forward" size={14} color={Colors.textInverse} />
              </Pressable>
            ) : (
              <Text style={styles.needMore}>
                Need {reward.pointsCost - totalPoints} more
              </Text>
            )}
          </View>
        </Pressable>
      );
    },
    [totalPoints, handleRedeem]
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={styles.pointsBanner}>
          <MaterialIcons name="stars" size={20} color={Colors.gold} />
          <Text style={styles.pointsBannerText}>{totalPoints} pts available</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((f) => (
            <Pressable
              key={f.id}
              style={[styles.filterChip, activeFilter === f.id && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.id)}
            >
              <Text
                style={[styles.filterText, activeFilter === f.id && styles.filterTextActive]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
          <Pressable
            style={[styles.filterChip, affordable && styles.filterChipAffordable]}
            onPress={() => setAffordable((v) => !v)}
          >
            <MaterialIcons
              name="check-circle"
              size={14}
              color={affordable ? Colors.textInverse : Colors.textMuted}
            />
            <Text style={[styles.filterText, affordable && styles.filterTextActive]}>
              {' '}Affordable
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Rewards List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderReward}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialIcons name="search-off" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No rewards found</Text>
            <Text style={styles.emptyText}>Try a different filter or earn more points</Text>
          </View>
        }
      />
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
    paddingBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerTitle: {
    ...Typography.pageTitle,
    color: Colors.textInverse,
  },
  pointsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pointsBannerText: {
    ...Typography.label,
    color: Colors.goldLight,
    fontWeight: '700',
  },

  // Filters
  filtersWrap: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.surface,
  },
  filtersContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceTinted,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipAffordable: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterText: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.textInverse,
  },

  // List
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },

  // Reward card
  rewardCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  rewardCardLocked: {
    opacity: 0.75,
  },
  rewardBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  rewardEmoji: {
    width: 60,
    height: 60,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    position: 'relative',
  },
  rewardEmojiText: {
    fontSize: 30,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 2,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  rewardDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  rewardPartner: {
    ...Typography.micro,
    color: Colors.textMuted,
  },
  rewardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: Spacing.sm,
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  costBadgeAffordable: {
    backgroundColor: Colors.gold + '18',
  },
  costBadgeLocked: {
    backgroundColor: Colors.surfaceTinted,
  },
  costText: {
    ...Typography.label,
    color: Colors.gold,
    fontWeight: '700',
  },
  textDimmed: {
    color: Colors.textMuted,
  },
  redeemBtn: {
    backgroundColor: Colors.primaryMid,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    gap: 4,
  },
  redeemBtnText: {
    ...Typography.label,
    color: Colors.textInverse,
    fontWeight: '700',
  },
  needMore: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  // Empty
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
