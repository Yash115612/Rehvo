import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  Flame,
  Target,
  Gift,
  ArrowRight,
  Check,
  Lock,
  Trophy,
  Users,
  ShieldCheck,
  Zap,
  X,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4AuthGate } from '../ui/V4AuthGate';
import { ChallengeRecord, AchievementBadgeRecord, FriendLeaderboardItem } from '../../../types';
import { campaignsService } from '../../../services/campaigns';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PeriodFilter = 'all' | 'daily' | 'weekly' | 'monthly';

export const V4ChallengesScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    isAuthenticated,
    wallet,
    user,
    challenges,
    gamification,
    achievementBadges,
    fetchChallenges,
    claimChallengeReward,
    fetchWallet,
    fetchGamification,
    fetchAchievementBadges,
    showToast,
  } = useAppStore();

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('all');
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [leaderboard, setLeaderboard] = useState<FriendLeaderboardItem[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadgeRecord | null>(null);

  useEffect(() => {
    fetchChallenges();
    fetchAchievementBadges();
    if (isAuthenticated) {
      fetchWallet();
      fetchGamification();
      loadLeaderboard();
    }
  }, [isAuthenticated]);

  const loadLeaderboard = async () => {
    try {
      const data = await campaignsService.getFriendLeaderboard(user?.id || '');
      setLeaderboard(data);
    } catch {
      setLeaderboard([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.allSettled([
      fetchChallenges(),
      fetchAchievementBadges(),
      isAuthenticated ? fetchWallet() : Promise.resolve(),
      isAuthenticated ? fetchGamification() : Promise.resolve(),
      isAuthenticated ? loadLeaderboard() : Promise.resolve(),
    ]);
    setRefreshing(false);
  };

  // ZERO mock data - live balance
  const balance = wallet?.balance ?? user?.walletBalance ?? 0;
  const challengeList = challenges || [];

  const filteredChallenges = useMemo(() => {
    if (selectedPeriod === 'all') return challengeList;
    return challengeList.filter((c) => c.period === selectedPeriod);
  }, [challengeList, selectedPeriod]);

  // Gamification metrics
  const currentXp = gamification?.current_xp || 0;
  const currentLevel = gamification?.current_level || 1;
  const nextLevelXp = currentLevel * 500;
  const xpProgressPercent = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));
  const currentStreak = gamification?.current_streak || 0;
  const highestStreak = gamification?.highest_streak || 0;

  // Challenge Statistics
  const completedCount = challengeList.filter(
    (c) => c.is_completed || c.is_claimed
  ).length;
  const claimableCount = challengeList.filter(
    (c) => c.is_completed && !c.is_claimed
  ).length;
  const claimableSum = challengeList
    .filter((c) => c.is_completed && !c.is_claimed)
    .reduce((acc, c) => acc + c.reward_amount, 0);

  const handleClaim = async (challenge: ChallengeRecord) => {
    if (!isAuthenticated) {
      showToast('Sign in to claim challenge bonuses', 'info');
      router.push('/(renter)/login' as any);
      return;
    }
    setClaimingId(challenge.id);
    try {
      await claimChallengeReward(challenge.challenge_id || challenge.id);
      fetchGamification();
    } finally {
      setClaimingId(null);
    }
  };

  const handleAction = (challenge: ChallengeRecord) => {
    const id = challenge.challenge_id || challenge.id;
    if (id.includes('rent')) {
      router.push('/(renter)/pay-rent' as any);
    } else if (id.includes('flatmate')) {
      router.push('/(renter)/flatmates' as any);
    } else if (id.includes('referral') || id.includes('friend')) {
      router.push('/(renter)/share-earn' as any);
    } else if (id.includes('kyc')) {
      router.push('/(renter)/kyc' as any);
    } else {
      router.push('/(renter)/flats' as any);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.root, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Challenges & Missions</Text>
            <Text style={styles.headerSubtitle}>Gamified R-Cash Quests</Text>
          </View>
        </View>

        <V4AuthGate
          fullScreen={false}
          icon={Award}
          title="Gamified R-Cash Quests"
          description="Sign in to complete rental, flatmate and referral missions and claim instant R-Cash bonuses into your wallet."
          featureName="Challenges"
          benefits={[
            'Daily, weekly and monthly rental missions',
            'Earn up to ₹500 extra R-Cash every single month',
            'Instant claim with direct ledger credit',
            'Unlock VIP Gold and Platinum badges',
          ]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Challenges & Missions</Text>
          <Text style={styles.headerSubtitle}>Gamified Cashback Quests</Text>
        </View>

        <View style={styles.balancePill}>
          <Sparkles size={14} color="#0F766E" />
          <Text style={styles.balancePillText}>₹{balance}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0F766E"
            colors={['#0F766E']}
          />
        }
      >
        {/* HERO XP & STREAK BANNER */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />

          <View style={styles.heroTopRow}>
            <View style={styles.levelBadge}>
              <Trophy size={13} color="#D97706" />
              <Text style={styles.levelBadgeText}>LEVEL {currentLevel} RESIDENT</Text>
            </View>

            <View style={styles.streakBadge}>
              <Flame size={14} color="#F59E0B" />
              <Text style={styles.streakBadgeText}>
                {currentStreak} DAY {currentStreak === 1 ? 'STREAK' : 'STREAK'}
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Level Up & Earn R-Cash</Text>
          <Text style={styles.heroSub}>
            Complete missions to earn XP, unlock exclusive achievement badges, and climb the renter leaderboard.
          </Text>

          {/* XP Progress Bar */}
          <View style={styles.xpProgressContainer}>
            <View style={styles.xpProgressRow}>
              <Text style={styles.xpLabel}>Level {currentLevel} Progress</Text>
              <Text style={styles.xpVal}>
                {currentXp} / {nextLevelXp} XP ({xpProgressPercent}%)
              </Text>
            </View>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${xpProgressPercent}%` }]} />
            </View>
          </View>

          {/* Quick Metrics */}
          <View style={styles.heroMetricsRow}>
            <View style={styles.heroMetricItem}>
              <Text style={styles.heroMetricVal}>
                {completedCount}/{challengeList.length}
              </Text>
              <Text style={styles.heroMetricLabel}>Completed</Text>
            </View>
            <View style={styles.heroMetricDivider} />
            <View style={styles.heroMetricItem}>
              <Text style={[styles.heroMetricVal, { color: '#99F6E4' }]}>
                {claimableCount} Ready
              </Text>
              <Text style={styles.heroMetricLabel}>To Claim</Text>
            </View>
            <View style={styles.heroMetricDivider} />
            <View style={styles.heroMetricItem}>
              <Text style={styles.heroMetricVal}>+₹{claimableSum}</Text>
              <Text style={styles.heroMetricLabel}>Unclaimed</Text>
            </View>
          </View>
        </View>

        {/* ACHIEVEMENT BADGES GALLERY */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Award size={18} color="#0F766E" />
            <Text style={styles.sectionTitle}>Achievement Badges</Text>
          </View>
          <Text style={styles.sectionSub}>
            {(achievementBadges || []).filter((b) => b.is_unlocked).length}/{(achievementBadges || []).length || 6} Unlocked
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgesRow}
        >
          {(achievementBadges || []).map((badge) => {
            const isUnlocked = Boolean(badge.is_unlocked);
            return (
              <Pressable
                key={badge.id}
                style={({ pressed }) => [
                  styles.badgeCard,
                  isUnlocked ? styles.badgeCardUnlocked : styles.badgeCardLocked,
                  pressed && styles.btnPressed,
                ]}
                onPress={() => setSelectedBadge(badge)}
              >
                <View
                  style={[
                    styles.badgeIconWrap,
                    isUnlocked ? styles.badgeIconWrapUnlocked : styles.badgeIconWrapLocked,
                  ]}
                >
                  {isUnlocked ? (
                    <Award size={24} color="#0F766E" />
                  ) : (
                    <Lock size={20} color="#94A3B8" />
                  )}
                </View>
                <Text style={styles.badgeTitle} numberOfLines={1}>
                  {badge.title}
                </Text>
                <View
                  style={[
                    styles.tierTag,
                    badge.tier === 'emerald'
                      ? styles.tierEmerald
                      : badge.tier === 'gold'
                      ? styles.tierGold
                      : styles.tierSilver,
                  ]}
                >
                  <Text style={styles.tierTagText}>{badge.tier.toUpperCase()}</Text>
                </View>
                <Text style={styles.badgeXp}>+{badge.xp_reward} XP</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* PERIOD TABS */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <View style={styles.sectionTitleRow}>
            <Target size={18} color="#0F766E" />
            <Text style={styles.sectionTitle}>Missions & Quests</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodTabs}
        >
          {[
            { id: 'all', label: 'All Missions' },
            { id: 'daily', label: 'Daily' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'monthly', label: 'Monthly' },
          ].map((tab) => {
            const isActive = selectedPeriod === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.periodChip, isActive && styles.periodChipActive]}
                onPress={() => setSelectedPeriod(tab.id as PeriodFilter)}
              >
                <Text
                  style={[
                    styles.periodChipText,
                    isActive && styles.periodChipTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* CHALLENGE CARDS LIST */}
        <View style={styles.challengesList}>
          {filteredChallenges.length === 0 ? (
            <View style={styles.emptyCard}>
              <Target size={36} color="#94A3B8" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No Missions in this Section</Text>
              <Text style={styles.emptySub}>
                Check back soon or select "All Missions" to view active rental challenges.
              </Text>
            </View>
          ) : (
            filteredChallenges.map((item) => {
              const isClaimed = Boolean(item.is_claimed);
              const isCompleted = Boolean(item.is_completed && !isClaimed);
              const current = item.current_progress || 0;
              const target = Math.max(1, item.target_progress || 1);
              const progressRatio = Math.min(1, current / target);
              const progressPercent = Math.round(progressRatio * 100);
              const isClaiming = claimingId === item.id;

              return (
                <View key={item.id} style={styles.challengeCard}>
                  {/* Header Row */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.periodBadge}>
                      <Text style={styles.periodBadgeText}>{item.period.toUpperCase()}</Text>
                    </View>
                    <View style={styles.rewardBadge}>
                      <Sparkles size={11} color="#0F766E" />
                      <Text style={styles.rewardBadgeText}>+₹{item.reward_amount} R-Cash</Text>
                    </View>
                  </View>

                  {/* Title & Description */}
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>

                  {/* Progress Bar */}
                  <View style={styles.progressSection}>
                    <View style={styles.progressTextRow}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressRatio}>
                        {current}/{target} ({progressPercent}%)
                      </Text>
                    </View>

                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${progressPercent}%` },
                          isCompleted && styles.progressFillCompleted,
                          isClaimed && styles.progressFillClaimed,
                        ]}
                      />
                    </View>
                  </View>

                  {/* Card Action Footer */}
                  <View style={styles.cardFooter}>
                    {isClaimed ? (
                      <View style={styles.claimedPill}>
                        <Check size={16} color="#16A34A" />
                        <Text style={styles.claimedPillText}>Claimed (+₹{item.reward_amount})</Text>
                      </View>
                    ) : isCompleted ? (
                      <Pressable
                        style={({ pressed }) => [
                          styles.claimActionBtn,
                          pressed && styles.btnPressed,
                          isClaiming && { opacity: 0.7 },
                        ]}
                        onPress={() => handleClaim(item)}
                        disabled={isClaiming}
                      >
                        {isClaiming ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <>
                            <Gift size={16} color="#FFFFFF" strokeWidth={2.4} />
                            <Text style={styles.claimActionBtnText}>
                              Claim +₹{item.reward_amount} R-Cash
                            </Text>
                          </>
                        )}
                      </Pressable>
                    ) : (
                      <Pressable
                        style={({ pressed }) => [
                          styles.goToTaskBtn,
                          pressed && styles.btnPressed,
                        ]}
                        onPress={() => handleAction(item)}
                      >
                        <Text style={styles.goToTaskBtnText}>Go to Mission</Text>
                        <ArrowRight size={16} color="#0F766E" />
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* FRIEND LEADERBOARD */}
        <View style={[styles.sectionHeader, { marginTop: 12 }]}>
          <View style={styles.sectionTitleRow}>
            <Users size={18} color="#0F766E" />
            <Text style={styles.sectionTitle}>Community Leaderboard</Text>
          </View>
          <Text style={styles.sectionSub}>Top Renters this Season</Text>
        </View>

        <View style={styles.leaderboardCard}>
          {leaderboard.map((item, idx) => {
            const isTop3 = item.rank <= 3;
            const rankMedal =
              item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `${item.rank}`;

            return (
              <View
                key={item.id}
                style={[
                  styles.leaderRow,
                  item.is_user && styles.leaderRowUser,
                  idx === leaderboard.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.rankBadge}>
                  <Text style={[styles.rankText, isTop3 && styles.rankTextTop]}>
                    {rankMedal}
                  </Text>
                </View>

                <View style={styles.leaderAvatar}>
                  <Text style={styles.leaderAvatarText}>
                    {item.name.slice(0, 1).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.leaderInfoCol}>
                  <View style={styles.leaderNameRow}>
                    <Text style={[styles.leaderName, item.is_user && styles.leaderNameUser]}>
                      {item.name} {item.is_user && '(You)'}
                    </Text>
                  </View>
                  <View style={styles.leaderStreakRow}>
                    <Flame size={12} color="#F59E0B" />
                    <Text style={styles.leaderStreakText}>{item.streak_days} days streak</Text>
                  </View>
                </View>

                <View style={styles.leaderXpCol}>
                  <Text style={styles.leaderXpVal}>{item.xp} XP</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* BADGE DETAIL MODAL */}
      <Modal
        visible={Boolean(selectedBadge)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.badgeModalCard}>
            <View style={styles.badgeModalHeader}>
              <Text style={styles.badgeModalTitle}>Achievement Details</Text>
              <Pressable
                style={styles.closeBtn}
                onPress={() => setSelectedBadge(null)}
                hitSlop={8}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            {selectedBadge && (
              <View style={styles.badgeModalBody}>
                <View
                  style={[
                    styles.badgeModalIconBox,
                    selectedBadge.is_unlocked ? styles.badgeModalIconBoxUnlocked : styles.badgeModalIconBoxLocked,
                  ]}
                >
                  {selectedBadge.is_unlocked ? (
                    <Award size={44} color="#0F766E" />
                  ) : (
                    <Lock size={40} color="#94A3B8" />
                  )}
                </View>

                <Text style={styles.badgeModalBadgeTitle}>{selectedBadge.title}</Text>
                <Text style={styles.badgeModalBadgeDesc}>{selectedBadge.description}</Text>

                <View style={styles.badgeModalStatusRow}>
                  <View
                    style={[
                      styles.tierTag,
                      selectedBadge.tier === 'emerald'
                        ? styles.tierEmerald
                        : selectedBadge.tier === 'gold'
                        ? styles.tierGold
                        : styles.tierSilver,
                    ]}
                  >
                    <Text style={styles.tierTagText}>{selectedBadge.tier.toUpperCase()} TIER</Text>
                  </View>

                  <View style={styles.badgeRewardPill}>
                    <Sparkles size={12} color="#0F766E" />
                    <Text style={styles.badgeRewardText}>+{selectedBadge.xp_reward} XP Reward</Text>
                  </View>
                </View>

                <View style={styles.badgeStatusInfoBox}>
                  {selectedBadge.is_unlocked ? (
                    <View style={styles.statusUnlockedRow}>
                      <CheckCircle2 size={16} color="#16A34A" />
                      <Text style={styles.statusUnlockedText}>Unlocked & Claimed</Text>
                    </View>
                  ) : (
                    <View style={styles.statusLockedRow}>
                      <Clock size={16} color="#64748B" />
                      <Text style={styles.statusLockedText}>Complete missions to unlock this badge</Text>
                    </View>
                  )}
                </View>

                <Pressable
                  style={styles.modalDoneBtn}
                  onPress={() => setSelectedBadge(null)}
                >
                  <Text style={styles.modalDoneBtnText}>Got it</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 100,
    gap: 6,
    justifyContent: 'center',
  },
  balancePillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  scrollContent: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: '#064E3B',
    borderRadius: V4_RADIUS.card,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    ...V4_SHADOWS.card,
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#0F766E',
    opacity: 0.4,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 5,
  },
  levelBadgeText: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 5,
  },
  streakBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FEF3C7',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 17,
    marginBottom: 14,
  },
  xpProgressContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  xpProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 11,
    color: '#99F6E4',
    fontWeight: '700',
  },
  xpVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  xpTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 3,
  },
  heroMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  heroMetricItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroMetricVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  heroMetricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  heroMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  badgesRow: {
    gap: 10,
    paddingBottom: 16,
  },
  badgeCard: {
    width: 110,
    borderRadius: V4_RADIUS.card,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  badgeCardUnlocked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCFBF1',
    ...V4_SHADOWS.card,
  },
  badgeCardLocked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.7,
  },
  badgeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeIconWrapUnlocked: {
    backgroundColor: '#CCFBF1',
  },
  badgeIconWrapLocked: {
    backgroundColor: '#F1F5F9',
  },
  badgeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  tierTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  tierEmerald: {
    backgroundColor: '#CCFBF1',
  },
  tierGold: {
    backgroundColor: '#FEF3C7',
  },
  tierSilver: {
    backgroundColor: '#F1F5F9',
  },
  tierTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#0F766E',
  },
  badgeXp: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F766E',
  },
  periodTabs: {
    gap: 8,
    paddingBottom: 14,
  },
  periodChip: {
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  periodChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  periodChipTextActive: {
    color: '#FFFFFF',
  },
  challengesList: {
    gap: 12,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    paddingVertical: 36,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
    ...V4_SHADOWS.card,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...V4_SHADOWS.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  periodBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  periodBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 4,
  },
  rewardBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: 14,
  },
  progressSection: {
    marginBottom: 14,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  progressRatio: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#0F766E',
  },
  progressFillCompleted: {
    backgroundColor: '#16A34A',
  },
  progressFillClaimed: {
    backgroundColor: '#94A3B8',
  },
  cardFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  claimedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    minHeight: 44,
    borderRadius: 10,
    gap: 6,
  },
  claimedPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  claimActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    minHeight: 44,
    borderRadius: 10,
    gap: 6,
  },
  claimActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  goToTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    minHeight: 44,
    borderRadius: 10,
    gap: 6,
  },
  goToTaskBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  leaderboardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...V4_SHADOWS.card,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  leaderRowUser: {
    backgroundColor: '#F0FDFA',
    marginHorizontal: -8,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  rankBadge: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  rankTextTop: {
    fontSize: 16,
  },
  leaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  leaderAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F766E',
  },
  leaderInfoCol: {
    flex: 1,
  },
  leaderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  leaderName: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  leaderNameUser: {
    color: '#0F766E',
  },
  leaderStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  leaderStreakText: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
  },
  leaderXpCol: {
    alignItems: 'flex-end',
  },
  leaderXpVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  badgeModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    ...V4_SHADOWS.card,
  },
  badgeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeModalBody: {
    alignItems: 'center',
    gap: 12,
  },
  badgeModalIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  badgeModalIconBoxUnlocked: {
    backgroundColor: '#CCFBF1',
  },
  badgeModalIconBoxLocked: {
    backgroundColor: '#F1F5F9',
  },
  badgeModalBadgeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  badgeModalBadgeDesc: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  badgeModalStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeRewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 4,
  },
  badgeRewardText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  badgeStatusInfoBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  statusUnlockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statusUnlockedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  statusLockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statusLockedText: {
    fontSize: 12,
    color: '#64748B',
  },
  modalDoneBtn: {
    width: '100%',
    backgroundColor: '#0F766E',
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalDoneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
