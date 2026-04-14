import React, { useState, useMemo } from 'react';
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
import { useApp } from '@/hooks/useApp';
import { ActivityItem } from '@/components/ui/ActivityItem';
import { formatCO2, RedemptionEntry } from '@/services/transportService';

type Tab = 'trips' | 'redemptions';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { trips, redemptions, totalPoints, lifetimePoints, totalCO2Saved, tripsLogged } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('trips');

  const totalPointsEarned = useMemo(
    () => trips.reduce((sum, t) => sum + t.pointsEarned, 0),
    [trips]
  );
  const totalPointsSpent = useMemo(
    () => redemptions.reduce((sum, r) => sum + r.pointsSpent, 0),
    [redemptions]
  );

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Text style={styles.headerTitle}>Activity History</Text>
          <Text style={styles.headerSub}>Your sustainability journey</Text>
        </View>

        {/* Stats overview */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialIcons name="stars" size={24} color={Colors.gold} />
            <Text style={styles.statValue}>{lifetimePoints}</Text>
            <Text style={styles.statLabel}>Lifetime pts</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="cloud-off" size={24} color={Colors.accent} />
            <Text style={styles.statValue}>{formatCO2(totalCO2Saved)}</Text>
            <Text style={styles.statLabel}>CO₂ saved</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="route" size={24} color={Colors.primaryMid} />
            <Text style={styles.statValue}>{tripsLogged}</Text>
            <Text style={styles.statLabel}>Total trips</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="card-giftcard" size={24} color={Colors.primaryLight} />
            <Text style={styles.statValue}>{redemptions.length}</Text>
            <Text style={styles.statLabel}>Redeemed</Text>
          </View>
        </View>

        {/* Points flow */}
        <View style={styles.flowCard}>
          <View style={styles.flowItem}>
            <Text style={styles.flowSign}>+</Text>
            <View>
              <Text style={styles.flowValue}>{totalPointsEarned}</Text>
              <Text style={styles.flowLabel}>Points earned</Text>
            </View>
          </View>
          <View style={styles.flowDivider} />
          <View style={styles.flowItem}>
            <Text style={[styles.flowSign, { color: Colors.error }]}>−</Text>
            <View>
              <Text style={[styles.flowValue, { color: Colors.error }]}>{totalPointsSpent}</Text>
              <Text style={styles.flowLabel}>Points spent</Text>
            </View>
          </View>
          <View style={styles.flowDivider} />
          <View style={styles.flowItem}>
            <MaterialIcons name="account-balance-wallet" size={20} color={Colors.gold} />
            <View>
              <Text style={[styles.flowValue, { color: Colors.gold }]}>{totalPoints}</Text>
              <Text style={styles.flowLabel}>Balance</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsWrap}>
          <Pressable
            style={[styles.tab, activeTab === 'trips' && styles.tabActive]}
            onPress={() => setActiveTab('trips')}
          >
            <MaterialIcons
              name="directions-walk"
              size={16}
              color={activeTab === 'trips' ? Colors.textInverse : Colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'trips' && styles.tabTextActive]}>
              Trips ({trips.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'redemptions' && styles.tabActive]}
            onPress={() => setActiveTab('redemptions')}
          >
            <MaterialIcons
              name="card-giftcard"
              size={16}
              color={activeTab === 'redemptions' ? Colors.textInverse : Colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'redemptions' && styles.tabTextActive]}>
              Redemptions ({redemptions.length})
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.listWrap}>
          {activeTab === 'trips' ? (
            trips.length === 0 ? (
              <View style={styles.emptyWrap}>
                <MaterialIcons name="directions-walk" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No trips logged yet</Text>
                <Text style={styles.emptyText}>Head to the Log tab to record your first trip!</Text>
              </View>
            ) : (
              trips.map((trip) => <ActivityItem key={trip.id} trip={trip} />)
            )
          ) : redemptions.length === 0 ? (
            <View style={styles.emptyWrap}>
              <MaterialIcons name="card-giftcard" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No redemptions yet</Text>
              <Text style={styles.emptyText}>Earn more points and visit the Rewards tab!</Text>
            </View>
          ) : (
            redemptions.map((red) => (
              <View key={red.id} style={styles.redemptionItem}>
                <View style={styles.redemptionIcon}>
                  <Text style={styles.redemptionEmoji}>{red.rewardBadge}</Text>
                </View>
                <View style={styles.redemptionContent}>
                  <Text style={styles.redemptionName}>{red.rewardName}</Text>
                  <Text style={styles.redemptionDate}>{red.date}</Text>
                </View>
                <View style={styles.redemptionPts}>
                  <Text style={styles.redemptionPtsText}>−{red.pointsSpent} pts</Text>
                </View>
              </View>
            ))
          )}
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
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 4,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Points flow
  flowCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  flowItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  flowSign: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.accent,
  },
  flowValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  flowLabel: {
    ...Typography.micro,
    color: Colors.textMuted,
    marginTop: 2,
  },
  flowDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.cardBorder,
  },

  // Tabs
  tabsWrap: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surfaceTinted,
    borderRadius: Radius.md,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    ...Typography.label,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.textInverse,
    fontWeight: '700',
  },

  // List
  listWrap: {
    paddingHorizontal: Spacing.md,
  },

  // Redemption item
  redemptionItem: {
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
  redemptionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceTinted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  redemptionEmoji: {
    fontSize: 22,
  },
  redemptionContent: {
    flex: 1,
  },
  redemptionName: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  redemptionDate: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  redemptionPts: {
    backgroundColor: Colors.error + '15',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  redemptionPtsText: {
    ...Typography.label,
    color: Colors.error,
    fontWeight: '700',
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
