import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  ShieldCheck,
  Crown,
  Receipt,
  Users,
  Gift,
  TrendingUp,
  Award,
  ChevronRight,
  Check,
  Target,
  Building,
  HeartHandshake,
  Clock,
  Filter,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4AuthGate } from '../ui/V4AuthGate';
import { WalletTransactionRecord } from '../../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FilterType = 'all' | 'credit' | 'debit' | 'rent' | 'referral';

export const V4RCashScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    isAuthenticated,
    user,
    wallet,
    walletTransactions,
    cashbackSummary,
    fetchWallet,
    fetchWalletTransactions,
    fetchCashbackSummary,
  } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWallet();
      fetchWalletTransactions();
      fetchCashbackSummary();
    }
  }, [isAuthenticated]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.allSettled([
      fetchWallet(),
      fetchWalletTransactions(),
      fetchCashbackSummary(),
    ]);
    setRefreshing(false);
  };

  const balance = wallet?.balance ?? user?.walletBalance ?? 550;
  const pendingCashback = wallet?.pending_cashback ?? cashbackSummary?.pending_cashback ?? 120;
  const lifetimeEarned = wallet?.lifetime_earned ?? cashbackSummary?.lifetime_earned ?? 700;
  const lifetimeRedeemed = wallet?.lifetime_redeemed ?? cashbackSummary?.lifetime_redeemed ?? 150;

  const breakdown = cashbackSummary?.breakdown ?? {
    rent_cashback: 250,
    referral_cashback: 300,
    rewards_cashback: 150,
    welcome_bonus: 50,
    listing_bonus: 0,
    flatmate_bonus: 50,
  };

  const filteredTransactions = useMemo(() => {
    const list = walletTransactions || [];
    switch (activeFilter) {
      case 'credit':
        return list.filter((t) => t.type === 'credit');
      case 'debit':
        return list.filter((t) => t.type === 'debit');
      case 'rent':
        return list.filter((t) => t.category === 'rent_cashback');
      case 'referral':
        return list.filter((t) => t.category === 'referral');
      default:
        return list;
    }
  }, [walletTransactions, activeFilter]);

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
            <Text style={styles.headerTitle}>R-Cash Dashboard</Text>
            <Text style={styles.headerSubtitle}>REHVO Rewards Currency</Text>
          </View>
        </View>

        <V4AuthGate
          fullScreen={false}
          icon={Sparkles}
          title="Unlock R-Cash Rewards"
          description="Sign in to view your R-Cash balance, track live cashbacks, and redeem 1:1 against rent and partner vouchers."
          featureName="R-Cash Rewards"
          benefits={[
            '1 R-Cash = ₹1 INR guaranteed fixed value',
            '1% automatic cashback on every rent payment',
            '₹300 cashback for every verified friend referred',
            'Zero deduction, zero expiry on accumulated balance',
          ]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>R-Cash Dashboard</Text>
          <Text style={styles.headerSubtitle}>1 R-Cash = ₹1 Indian Rupee</Text>
        </View>

        <Pressable
          style={styles.rewardsHeaderBtn}
          onPress={() => router.push('/(renter)/rewards' as any)}
        >
          <Gift size={16} color="#0F766E" />
          <Text style={styles.rewardsHeaderBtnText}>Redeem</Text>
        </Pressable>
      </View>

      {/* 2. SCROLL CONTENT */}
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
        {/* HERO BALANCE CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />

          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Sparkles size={12} color="#99F6E4" />
              <Text style={styles.heroBadgeText}>TOTAL R-CASH BALANCE</Text>
            </View>
            <View style={styles.pegBadge}>
              <Text style={styles.pegBadgeText}>₹1 = 1 R-Cash</Text>
            </View>
          </View>

          <View style={styles.heroBalanceRow}>
            <Text style={styles.heroRupee}>₹</Text>
            <Text style={styles.heroBalanceNum}>{balance.toLocaleString('en-IN')}</Text>
            <Text style={styles.heroDecimal}>.00</Text>
          </View>

          {/* Sub Stats */}
          <View style={styles.heroStatsGrid}>
            <View style={styles.heroStatCol}>
              <Text style={styles.heroStatLabel}>PENDING</Text>
              <Text style={styles.heroStatNum}>+₹{pendingCashback}</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatCol}>
              <Text style={styles.heroStatLabel}>LIFETIME EARNED</Text>
              <Text style={styles.heroStatNum}>₹{lifetimeEarned}</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatCol}>
              <Text style={styles.heroStatLabel}>REDEEMED</Text>
              <Text style={styles.heroStatNum}>₹{lifetimeRedeemed}</Text>
            </View>
          </View>

          {/* Action CTA Button */}
          <Pressable
            style={({ pressed }) => [styles.redeemHeroBtn, pressed && styles.btnPressed]}
            onPress={() => router.push('/(renter)/rewards' as any)}
          >
            <Gift size={16} color="#042F2E" strokeWidth={2.4} />
            <Text style={styles.redeemHeroBtnText}>Redeem for Brand Vouchers</Text>
            <ArrowUpRight size={16} color="#042F2E" />
          </Pressable>
        </View>

        {/* 6-PILLAR CASHBACK BREAKDOWN */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>6-Pillar Cashback Breakdown</Text>
        </View>

        <View style={styles.pillarsGrid}>
          {/* Pillar 1: Rent Cashback */}
          <View style={styles.pillarCard}>
            <View style={[styles.pillarIconBox, { backgroundColor: '#DCFCE7' }]}>
              <CreditCard size={18} color="#16A34A" />
            </View>
            <Text style={styles.pillarTitle}>Rent Payment</Text>
            <Text style={styles.pillarEarned}>₹{breakdown.rent_cashback} earned</Text>
            <Text style={styles.pillarRate}>1% instant (up to ₹500/mo)</Text>
          </View>

          {/* Pillar 2: Friend Referrals */}
          <View style={styles.pillarCard}>
            <View style={[styles.pillarIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Users size={18} color="#D97706" />
            </View>
            <Text style={styles.pillarTitle}>Referrals</Text>
            <Text style={styles.pillarEarned}>₹{breakdown.referral_cashback} earned</Text>
            <Text style={styles.pillarRate}>₹300 per verified friend</Text>
          </View>

          {/* Pillar 3: DigiLocker KYC */}
          <View style={styles.pillarCard}>
            <View style={[styles.pillarIconBox, { backgroundColor: '#CCFBF1' }]}>
              <ShieldCheck size={18} color="#0F766E" />
            </View>
            <Text style={styles.pillarTitle}>Identity Pass</Text>
            <Text style={styles.pillarEarned}>₹{breakdown.welcome_bonus} earned</Text>
            <Text style={styles.pillarRate}>Flat ₹100 on Aadhaar KYC</Text>
          </View>

          {/* Pillar 4: Flatmate Connect */}
          <View style={styles.pillarCard}>
            <View style={[styles.pillarIconBox, { backgroundColor: '#E0F2FE' }]}>
              <HeartHandshake size={18} color="#0284C7" />
            </View>
            <Text style={styles.pillarTitle}>Flatmate Network</Text>
            <Text style={styles.pillarEarned}>₹{breakdown.flatmate_bonus} earned</Text>
            <Text style={styles.pillarRate}>₹50 profile + ₹25 1st match</Text>
          </View>

          {/* Pillar 5: Property Listing */}
          <View style={styles.pillarCard}>
            <View style={[styles.pillarIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Building size={18} color="#9333EA" />
            </View>
            <Text style={styles.pillarTitle}>Owner Listing</Text>
            <Text style={styles.pillarEarned}>₹{breakdown.listing_bonus} earned</Text>
            <Text style={styles.pillarRate}>₹500 on 1st verified listing</Text>
          </View>

          {/* Pillar 6: Challenges & Missions */}
          <View style={styles.pillarCard}>
            <View style={[styles.pillarIconBox, { backgroundColor: '#FCE7F3' }]}>
              <Target size={18} color="#DB2777" />
            </View>
            <Text style={styles.pillarTitle}>Quests & Missions</Text>
            <Text style={styles.pillarEarned}>Gamified R-Cash</Text>
            <Text style={styles.pillarRate}>Up to ₹500 in tasks</Text>
          </View>
        </View>

        {/* LEDGER FILTER TABS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>R-Cash Ledger</Text>
          <Text style={styles.txCountText}>{filteredTransactions.length} entries</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsRow}
        >
          {(['all', 'credit', 'debit', 'rent', 'referral'] as FilterType[]).map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <Pressable
                key={tab}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(tab)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {tab === 'all'
                    ? 'All Activity'
                    : tab === 'credit'
                    ? 'Credits (+)'
                    : tab === 'debit'
                    ? 'Debits (-)'
                    : tab === 'rent'
                    ? 'Rent Only'
                    : 'Referrals'}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* TRANSACTIONS LIST */}
        <View style={styles.ledgerContainer}>
          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyLedger}>
              <Receipt size={28} color="#94A3B8" />
              <Text style={styles.emptyLedgerTitle}>No matching transactions</Text>
              <Text style={styles.emptyLedgerSub}>
                Transactions for this category will show up here once credited.
              </Text>
            </View>
          ) : (
            filteredTransactions.map((tx: WalletTransactionRecord) => {
              const isCredit = tx.type === 'credit';
              const dateStr = tx.created_at
                ? new Date(tx.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Recent';

              return (
                <View key={tx.id} style={styles.ledgerRow}>
                  <View
                    style={[
                      styles.ledgerIconBox,
                      { backgroundColor: isCredit ? '#DCFCE7' : '#F1F5F9' },
                    ]}
                  >
                    {isCredit ? (
                      <ArrowDownLeft size={18} color="#16A34A" strokeWidth={2.4} />
                    ) : (
                      <ArrowUpRight size={18} color="#475569" strokeWidth={2.4} />
                    )}
                  </View>

                  <View style={styles.ledgerInfo}>
                    <Text style={styles.ledgerTitle} numberOfLines={1}>{tx.title}</Text>
                    <Text style={styles.ledgerDesc} numberOfLines={1}>
                      {tx.description || tx.category.replace('_', ' ')}
                    </Text>
                    <Text style={styles.ledgerDate}>{dateStr}</Text>
                  </View>

                  <View style={styles.ledgerAmountWrap}>
                    <Text
                      style={[
                        styles.ledgerAmount,
                        isCredit ? styles.amountCredit : styles.amountDebit,
                      ]}
                    >
                      {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        tx.status === 'completed'
                          ? styles.statusCompleted
                          : styles.statusPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          tx.status === 'completed'
                            ? styles.statusTextCompleted
                            : styles.statusTextPending,
                        ]}
                      >
                        {tx.status}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  rewardsHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 4,
  },
  rewardsHeaderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  scrollContent: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: '#0F766E',
    borderRadius: V4_RADIUS.card,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    ...V4_SHADOWS.card,
  },
  heroGlow: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#14B8A6',
    opacity: 0.3,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    gap: 6,
  },
  heroBadgeText: {
    color: '#99F6E4',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pegBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  pegBadgeText: {
    color: '#E6FFFA',
    fontSize: 11,
    fontWeight: '600',
  },
  heroBalanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  heroRupee: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 4,
  },
  heroBalanceNum: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroDecimal: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    marginLeft: 2,
  },
  heroStatsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  heroStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  heroStatNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroStatDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  redeemHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A7F3D0',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  redeemHeroBtnText: {
    color: '#042F2E',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  txCountText: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  pillarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  pillarCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...V4_SHADOWS.card,
  },
  pillarIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pillarTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginBottom: 2,
  },
  pillarEarned: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F766E',
    marginBottom: 2,
  },
  pillarRate: {
    fontSize: 10,
    color: V4_COLORS.textSecondary,
  },
  filterTabsRow: {
    gap: 8,
    paddingBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  ledgerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...V4_SHADOWS.card,
  },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  ledgerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ledgerInfo: {
    flex: 1,
  },
  ledgerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
    marginBottom: 2,
  },
  ledgerDesc: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  ledgerDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  ledgerAmountWrap: {
    alignItems: 'flex-end',
  },
  ledgerAmount: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  amountCredit: {
    color: '#16A34A',
  },
  amountDebit: {
    color: '#334155',
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  statusTextCompleted: {
    color: '#16A34A',
  },
  statusTextPending: {
    color: '#D97706',
  },
  emptyLedger: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 6,
  },
  emptyLedgerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  emptyLedgerSub: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
