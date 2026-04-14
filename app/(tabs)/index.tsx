import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, Typography, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { ActivityItem } from '@/components/ui/ActivityItem';
import { REWARDS } from '@/constants/config';
import { formatCO2 } from '@/services/transportService';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userName, userCity, userLevel, totalPoints, lifetimePoints, totalCO2Saved, tripsLogged, trips } =
    useApp();

  const recentTrips = useMemo(() => trips.slice(0, 3), [trips]);
  const featuredRewards = useMemo(() => REWARDS.filter((r) => r.popular).slice(0, 2), []);

  const levelProgress = useMemo(() => {
    const thresholds = [0, 100, 300, 600, 1000];
    const labels = ['Seedling', 'Sprout', 'Explorer', 'Green Rider', 'Eco Champion'];
    let idx = 0;
    for (let i = 0; i < thresholds.length - 1; i++) {
      if (lifetimePoints >= thresholds[i]) idx = i;
    }
    const next = thresholds[idx + 1] || thresholds[idx];
    const curr = thresholds[idx];
    const progress = idx >= labels.length - 1 ? 1 : (lifetimePoints - curr) / (next - curr);
    return { progress: Math.min(progress, 1), nextLevel: labels[idx + 1] || 'Max', ptsToNext: Math.max(0, next - lifetimePoints) };
  }, [lifetimePoints]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View style={[styles.hero, { paddingTop: insets.top + Spacing.md }]}>
          <Image
            source={require('@/assets/images/hero.png')}
            style={styles.heroBg}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroGreeting}>مرحباً · {userCity}</Text>
                <Text style={styles.heroName}>{userName} 👋</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{userLevel}</Text>
              </View>
            </View>

            {/* Points Card */}
            <View style={styles.pointsCard}>
              <View style={styles.pointsLeft}>
                <Text style={styles.pointsLabel}>Your Points</Text>
                <Text style={styles.pointsValue}>{totalPoints.toLocaleString()}</Text>
                <Text style={styles.pointsSub}>Available to redeem</Text>
              </View>
              <View style={styles.pointsDivider} />
              <View style={styles.pointsRight}>
                <View style={styles.statRow}>
                  <MaterialIcons name="cloud-off" size={16} color={Colors.accent} />
                  <Text style={styles.statValue}>{formatCO2(totalCO2Saved)}</Text>
                </View>
                <Text style={styles.statLabel}>CO₂ saved</Text>
                <View style={[styles.statRow, { marginTop: Spacing.sm }]}>
                  <MaterialIcons name="route" size={16} color={Colors.accent} />
                  <Text style={styles.statValue}>{tripsLogged}</Text>
                </View>
                <Text style={styles.statLabel}>Trips logged</Text>
              </View>
            </View>

            {/* Level Progress */}
            <View style={styles.progressWrap}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress to {levelProgress.nextLevel}</Text>
                <Text style={styles.progressPts}>{levelProgress.ptsToNext} pts to go</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${levelProgress.progress * 100}%` }]} />
              </View>
            </View>
          </View>
        </View>

        {/* QUICK LOG */}
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [styles.logCTA, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}
            onPress={() => router.push('/(tabs)/log')}
          >
            <MaterialIcons name="add-circle-outline" size={24} color={Colors.textInverse} />
            <Text style={styles.logCTAText}>Log a Trip & Earn Points</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color={Colors.textInverse} />
          </Pressable>
        </View>

        {/* FEATURED REWARDS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Rewards</Text>
            <Pressable onPress={() => router.push('/(tabs)/rewards')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rewardsRow}
          >
            {featuredRewards.map((reward) => (
              <Pressable
                key={reward.id}
                style={({ pressed }) => [styles.featuredCard, pressed && { opacity: 0.88 }]}
                onPress={() => router.push('/(tabs)/rewards')}
              >
                <View style={[styles.featuredEmoji, { backgroundColor: reward.color + '20' }]}>
                  <Text style={styles.featuredEmojiText}>{reward.badge}</Text>
                </View>
                <Text style={styles.featuredName}>{reward.name}</Text>
                <Text style={styles.featuredPartner}>{reward.partner}</Text>
                <View style={styles.featuredPts}>
                  <Text style={styles.featuredPtsText}>{reward.pointsCost} pts</Text>
                </View>
                {totalPoints >= reward.pointsCost ? (
                  <View style={styles.canRedeem}>
                    <Text style={styles.canRedeemText}>Redeem now!</Text>
                  </View>
                ) : (
                  <Text style={styles.ptsNeeded}>
                    Need {reward.pointsCost - totalPoints} more
                  </Text>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* RECENT ACTIVITY */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Pressable onPress={() => router.push('/(tabs)/history')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          {recentTrips.length === 0 ? (
            <View style={styles.emptyState}>
              <Image
                source={require('@/assets/images/empty_trips.png')}
                style={styles.emptyImage}
                contentFit="contain"
              />
              <Text style={styles.emptyTitle}>No trips yet</Text>
              <Text style={styles.emptyText}>Start logging your sustainable commutes!</Text>
            </View>
          ) : (
            recentTrips.map((trip) => <ActivityItem key={trip.id} trip={trip} />)
          )}
        </View>

        {/* IMPACT BANNER */}
        <View style={[styles.section, styles.impactBanner]}>
          <MaterialIcons name="forest" size={32} color={Colors.accent} />
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.impactTitle}>Your Impact This Week</Text>
            <Text style={styles.impactText}>
              You saved {formatCO2(totalCO2Saved)} of CO₂ riding Qatar's green transit — equivalent to planting{' '}
              {Math.max(1, Math.round(totalCO2Saved / 21000))} tree{totalCO2Saved >= 21000 ? 's' : ''} in Qatar!
            </Text>
          </View>
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
  scroll: {
    flex: 1,
  },

  // Hero
  hero: {
    position: 'relative',
    minHeight: 340,
    marginBottom: Spacing.lg,
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary + 'CC',
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  heroContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  heroGreeting: {
    ...Typography.label,
    color: Colors.accentLight,
  },
  heroName: {
    ...Typography.pageTitle,
    color: Colors.textInverse,
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: Colors.accent + '30',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.accent + '60',
  },
  levelText: {
    ...Typography.caption,
    color: Colors.accentLight,
    fontWeight: '600',
  },

  // Points card
  pointsCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: Spacing.md,
  },
  pointsLeft: {
    flex: 1,
  },
  pointsLabel: {
    ...Typography.caption,
    color: Colors.accentLight,
    marginBottom: 4,
    fontWeight: '500',
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.goldLight,
    letterSpacing: -1,
  },
  pointsSub: {
    ...Typography.micro,
    color: Colors.accentLight,
    marginTop: 4,
  },
  pointsDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: Spacing.md,
  },
  pointsRight: {
    justifyContent: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    ...Typography.label,
    color: Colors.textInverse,
    fontWeight: '600',
  },
  statLabel: {
    ...Typography.micro,
    color: Colors.accentLight,
    marginTop: 1,
    marginLeft: 22,
  },

  // Progress
  progressWrap: {
    marginTop: Spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    ...Typography.micro,
    color: Colors.accentLight,
  },
  progressPts: {
    ...Typography.micro,
    color: Colors.goldLight,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.goldLight,
    borderRadius: Radius.full,
  },

  // Sections
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
  },
  seeAll: {
    ...Typography.label,
    color: Colors.primaryMid,
    fontWeight: '600',
  },

  // Log CTA
  logCTA: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.md,
  },
  logCTAText: {
    ...Typography.bodyMedium,
    color: Colors.textInverse,
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },

  // Featured rewards
  rewardsRow: {
    paddingRight: Spacing.md,
    gap: Spacing.sm,
  },
  featuredCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    width: 160,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  featuredEmoji: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  featuredEmojiText: {
    fontSize: 26,
  },
  featuredName: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  featuredPartner: {
    ...Typography.micro,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  featuredPts: {
    backgroundColor: Colors.gold + '20',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  featuredPtsText: {
    ...Typography.micro,
    color: Colors.gold,
    fontWeight: '700',
  },
  canRedeem: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  canRedeemText: {
    ...Typography.micro,
    color: Colors.textInverse,
    fontWeight: '700',
  },
  ptsNeeded: {
    ...Typography.micro,
    color: Colors.textMuted,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyImage: {
    width: 180,
    height: 135,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // Impact banner
  impactBanner: {
    backgroundColor: Colors.surfaceTinted,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  impactTitle: {
    ...Typography.label,
    color: Colors.primaryMid,
    fontWeight: '700',
    marginBottom: 4,
  },
  impactText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
