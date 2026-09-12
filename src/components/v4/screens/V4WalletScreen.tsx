import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
  RefreshControl,
  Modal,
  TextInput,
  Share,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Gift,
  Users,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Receipt,
  Tag,
  Zap,
  Wallet,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Flame,
  Building2,
  Download,
  Share2,
  X,
  Check,
  Search,
  Plus,
  Trash2,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4AuthGate } from '../ui/V4AuthGate';
import { WalletTransactionRecord, UserBankAccountRecord } from '../../../types';
import { V4Button } from '../ui/V4Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const V4WalletScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    isAuthenticated,
    user,
    wallet,
    walletTransactions,
    cashbackSummary,
    userBankAccounts,
    fetchWallet,
    fetchWalletTransactions,
    fetchCashbackSummary,
    fetchUserBankAccounts,
    addUserBankAccount,
    deleteUserBankAccount,
    withdrawToBank,
    showToast,
  } = useAppStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWallet();
      fetchWalletTransactions();
      fetchCashbackSummary();
      fetchUserBankAccounts();
    }
  }, [isAuthenticated]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.allSettled([
      fetchWallet(),
      fetchWalletTransactions(),
      fetchCashbackSummary(),
      fetchUserBankAccounts(),
    ]);
    setRefreshing(false);
  };

  // Withdraw Modal State
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Add Bank Account Modal State
  const [addBankModalVisible, setAddBankModalVisible] = useState(false);
  const [newAccHolder, setNewAccHolder] = useState(user?.name || '');
  const [newBankName, setNewBankName] = useState('HDFC Bank');
  const [newAccNumber, setNewAccNumber] = useState('');
  const [confirmAccNumber, setConfirmAccNumber] = useState('');
  const [newIfsc, setNewIfsc] = useState('');
  const [newUpiId, setNewUpiId] = useState('');
  const [isAddingBank, setIsAddingBank] = useState(false);

  // Statement PDF Modal State
  const [statementModalVisible, setStatementModalVisible] = useState(false);
  const [statementPeriod, setStatementPeriod] = useState<'30d' | '90d' | 'fy2026'>('30d');

  // Receipt Details Modal State
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<WalletTransactionRecord | null>(null);

  // Search & Filter State for Recent Transactions
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Balances
  const availableBalance = wallet?.balance ?? user?.walletBalance ?? 0;
  const pendingCashback = wallet?.pending_cashback ?? cashbackSummary?.pending_cashback ?? 0;
  const lifetimeEarned = wallet?.lifetime_earned ?? cashbackSummary?.lifetime_earned ?? 0;

  // Mini summary
  const thisMonthEarned = cashbackSummary?.this_month_earned ?? 0;
  const referralEarnings = cashbackSummary?.referral_earnings ?? 0;
  const rentEarnings = cashbackSummary?.rent_cashback_earned ?? 0;

  // Set default bank selection if none selected
  useEffect(() => {
    if (userBankAccounts && userBankAccounts.length > 0 && !selectedBankId) {
      const primary = userBankAccounts.find((b) => b.is_primary) || userBankAccounts[0];
      setSelectedBankId(primary.id);
    }
  }, [userBankAccounts, selectedBankId]);

  // Monthly Spending & Cashback Chart Data (April - September 2026)
  const monthlyChartData = useMemo(() => {
    return [
      { month: 'Apr', spend: 20000, cashback: 200 },
      { month: 'May', spend: 20000, cashback: 200 },
      { month: 'Jun', spend: 22000, cashback: 220 },
      { month: 'Jul', spend: 22000, cashback: 220 },
      { month: 'Aug', spend: 25000, cashback: 250 },
      { month: 'Sep', spend: 25000, cashback: 250 },
    ];
  }, []);

  const maxChartSpend = 30000;

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    const list = walletTransactions || [];
    return list.filter((tx) => {
      if (selectedCategoryFilter === 'credit' && tx.type !== 'credit') return false;
      if (selectedCategoryFilter === 'debit' && tx.type !== 'debit') return false;
      if (
        selectedCategoryFilter !== 'all' &&
        selectedCategoryFilter !== 'credit' &&
        selectedCategoryFilter !== 'debit' &&
        tx.category !== selectedCategoryFilter
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(q);
        const matchesDesc = tx.description?.toLowerCase().includes(q);
        const matchesRef = tx.reference_id?.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesRef;
      }
      return true;
    });
  }, [walletTransactions, selectedCategoryFilter, searchQuery]);

  const recentTransactions = filteredTransactions.slice(0, 5);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rent_cashback':
        return { icon: CreditCard, color: '#16A34A', bg: '#DCFCE7' };
      case 'referral':
        return { icon: Users, color: '#D97706', bg: '#FEF3C7' };
      case 'reward_redemption':
        return { icon: Gift, color: '#E11D48', bg: '#FFE4E6' };
      case 'kyc_bonus':
        return { icon: ShieldCheck, color: '#0F766E', bg: '#CCFBF1' };
      case 'challenge_reward':
        return { icon: Award, color: '#7C3AED', bg: '#EDE9FE' };
      case 'flatmate_bonus':
        return { icon: Sparkles, color: '#0284C7', bg: '#E0F2FE' };
      case 'withdrawal':
      case 'bank_transfer':
        return { icon: Building2, color: '#0F766E', bg: '#CCFBF1' };
      default:
        return { icon: Zap, color: '#0F766E', bg: '#CCFBF1' };
    }
  };

  const handleConfirmWithdrawal = async () => {
    const amt = parseInt(withdrawAmount, 10);
    if (isNaN(amt) || amt < 100) {
      Alert.alert('Invalid Amount', 'Minimum withdrawal amount is ₹100.');
      return;
    }
    if (amt > availableBalance) {
      Alert.alert('Insufficient Balance', `You only have ₹${availableBalance} available.`);
      return;
    }
    if (!selectedBankId && userBankAccounts.length === 0) {
      Alert.alert('Link Account', 'Please add a bank account before withdrawing.');
      setAddBankModalVisible(true);
      return;
    }

    setIsWithdrawing(true);
    const res = await withdrawToBank(amt, selectedBankId);
    setIsWithdrawing(false);
    if (res.success) {
      setWithdrawModalVisible(false);
      setWithdrawAmount('');
    }
  };

  const handleAddBank = async () => {
    if (!newAccNumber || newAccNumber.length < 9) {
      Alert.alert('Invalid Account', 'Enter a valid bank account number (at least 9 digits).');
      return;
    }
    if (newAccNumber !== confirmAccNumber) {
      Alert.alert('Mismatch', 'Bank account numbers do not match.');
      return;
    }
    if (!newIfsc || newIfsc.length !== 11) {
      Alert.alert('Invalid IFSC', 'Enter an 11-character valid IFSC code.');
      return;
    }

    setIsAddingBank(true);
    const res = await addUserBankAccount({
      accountHolderName: newAccHolder || user?.name || 'Verified Tenant',
      bankName: newBankName || 'HDFC Bank',
      accountNumber: newAccNumber,
      ifscCode: newIfsc,
      accountType: 'savings',
      upiId: newUpiId || undefined,
    });
    setIsAddingBank(false);

    if (res.success && res.data) {
      setSelectedBankId(res.data.id);
      setAddBankModalVisible(false);
      setNewAccNumber('');
      setConfirmAccNumber('');
      setNewIfsc('');
      setNewUpiId('');
    }
  };

  const handleShareStatement = async () => {
    try {
      const stmtMsg = `🧾 REHVO Wallet Statement (${statementPeriod.toUpperCase()})\nAccount: ${user?.name || 'Verified User'}\nAvailable Balance: ₹${availableBalance}\nLifetime Cashback: ₹${lifetimeEarned}\nVerified by REHVO Financial Services\nhttps://rehvo.com`;
      await Share.share({ message: stmtMsg, title: 'REHVO Wallet Statement' });
    } catch {
      showToast('Statement copied to clipboard', 'info');
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
            <Text style={styles.headerTitle}>Wallet</Text>
            <Text style={styles.headerSubtitle}>REHVO Rewards Hub</Text>
          </View>
        </View>

        <V4AuthGate
          fullScreen={false}
          icon={Wallet}
          title="Unlock REHVO Wallet & R-Cash"
          description="Sign in to track your cashback earnings, redeem partner brand vouchers, pay rent with instant cashback, and claim challenge rewards."
          featureName="REHVO Wallet"
          benefits={[
            '1% instant cashback on monthly rent payments',
            'Exclusive food, grocery, cleaning & movers vouchers',
            'Earn ₹300 for every verified friend who joins REHVO',
            'Gamified daily & monthly R-Cash missions',
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
          <Text style={styles.headerTitle}>R-Cash Wallet</Text>
          <Text style={styles.headerSubtitle}>CRED-Grade Financial & Rewards Ledger</Text>
        </View>

        <Pressable
          style={styles.historyIconBtn}
          onPress={() => router.push('/(renter)/transactions' as any)}
          hitSlop={10}
        >
          <Receipt size={18} color="#0F766E" strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* 2. MAIN SCROLL CONTAINER */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 90 },
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
        {/* SECTION 1: HERO WALLET CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlowCircle} />
          <View style={styles.heroGlowCircle2} />

          {/* Card Top Row */}
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroTagPill}>
              <Sparkles size={11} color="#99F6E4" strokeWidth={2.6} />
              <Text style={styles.heroTagText}>AVAILABLE R-CASH BALANCE</Text>
            </View>
            <View style={styles.rateChip}>
              <Text style={styles.rateChipText}>1 R-Cash = ₹1 INR</Text>
            </View>
          </View>

          {/* Balance Amount */}
          <View style={styles.balanceRow}>
            <Text style={styles.rupeeSymbol}>₹</Text>
            <Text style={styles.balanceValue}>{availableBalance.toLocaleString('en-IN')}</Text>
            <Text style={styles.decimals}>.00</Text>
          </View>

          {/* Sub-metrics Row */}
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>PENDING CASHBACK</Text>
              <Text style={styles.heroStatValue}>+₹{pendingCashback.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>LIFETIME EARNED</Text>
              <Text style={styles.heroStatValue}>₹{lifetimeEarned.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* Quick Hero CTAs */}
          <View style={styles.heroActionsRow}>
            <Pressable
              style={({ pressed }) => [styles.heroBtnPrimary, pressed && styles.btnPressed]}
              onPress={() => router.push('/(renter)/rewards' as any)}
            >
              <Gift size={14} color="#042F2E" strokeWidth={2.4} />
              <Text style={styles.heroBtnPrimaryText}>Redeem Perks</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.heroBtnSecondary, pressed && styles.btnPressed]}
              onPress={() => setWithdrawModalVisible(true)}
            >
              <Building2 size={14} color="#CCFBF1" strokeWidth={2.4} />
              <Text style={styles.heroBtnSecondaryText}>Withdraw</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.heroBtnSecondary, pressed && styles.btnPressed]}
              onPress={() => setStatementModalVisible(true)}
            >
              <Download size={14} color="#CCFBF1" strokeWidth={2.4} />
              <Text style={styles.heroBtnSecondaryText}>Statement</Text>
            </Pressable>
          </View>
        </View>

        {/* REHVO AI: Rent Budget & Living Expense Optimizer */}
        <Pressable
          style={styles.aiWalletBanner}
          onPress={() =>
            router.push({
              pathname: '/(renter)/ai',
              params: {
                prompt: 'Plan my monthly living and rent budget for Mumbai based on my wallet spend',
                context: 'wallet',
              },
            } as any)
          }
        >
          <View style={styles.aiWalletIconWrap}>
            <Sparkles size={18} color="#0F766E" />
          </View>
          <View style={styles.aiWalletTextCol}>
            <View style={styles.aiWalletBadge}>
              <Text style={styles.aiWalletBadgeText}>AI BUDGET OPTIMIZER</Text>
            </View>
            <Text style={styles.aiWalletTitle}>Calculate 30% Safe Rent Ratio</Text>
            <Text style={styles.aiWalletSub}>
              Estimate bills, electricity & utility projections with REHVO AI
            </Text>
          </View>
          <ChevronRight size={18} color="#0F766E" />
        </Pressable>

        {/* SECTION 2: MONTHLY SPENDING & CASHBACK CHART */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Monthly Spend & Rewards</Text>
          <Text style={styles.sectionBadge}>6-MONTH TREND</Text>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartLegendRow}>
            <View style={styles.chartLegendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#0F766E' }]} />
              <Text style={styles.legendText}>Rent Paid (₹)</Text>
            </View>
            <View style={styles.chartLegendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>1% Cashback Earned</Text>
            </View>
          </View>

          <View style={styles.barsContainer}>
            {monthlyChartData.map((d) => {
              const heightPercent = Math.min(100, Math.round((d.spend / maxChartSpend) * 100));
              return (
                <View key={d.month} style={styles.barColumn}>
                  <Text style={styles.barTopVal}>₹{d.cashback}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${heightPercent}%` }]} />
                  </View>
                  <Text style={styles.barMonthLabel}>{d.month}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.chartFooterRow}>
            <Text style={styles.chartFooterText}>Total Saved in 2026: ₹1,380</Text>
            <Pressable onPress={() => router.push('/(renter)/rcash' as any)}>
              <Text style={styles.chartFooterLink}>View Breakdown &rarr;</Text>
            </Pressable>
          </View>
        </View>

        {/* SECTION 3: SAVED BANK ACCOUNTS FOR WITHDRAWAL */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Linked Bank Accounts</Text>
          <Pressable
            style={styles.addBankHeaderBtn}
            onPress={() => setAddBankModalVisible(true)}
          >
            <Plus size={13} color="#0F766E" strokeWidth={2.4} />
            <Text style={styles.addBankHeaderBtnText}>Add Account</Text>
          </Pressable>
        </View>

        {userBankAccounts.length === 0 ? (
          <View style={styles.emptyBankCard}>
            <Building2 size={24} color="#0F766E" strokeWidth={2} />
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyBankTitle}>No Bank Account Linked</Text>
              <Text style={styles.emptyBankSub}>Link your savings or current account for instant IMPS R-Cash payouts.</Text>
            </View>
            <Pressable
              style={styles.linkBankSmallBtn}
              onPress={() => setAddBankModalVisible(true)}
            >
              <Text style={styles.linkBankSmallBtnText}>Link Now</Text>
            </Pressable>
          </View>
        ) : (
          userBankAccounts.map((bank: UserBankAccountRecord) => (
            <View key={bank.id} style={styles.bankAccountCard}>
              <View style={styles.bankIconCircle}>
                <Building2 size={18} color="#0F766E" />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.bankNameText}>{bank.bank_name}</Text>
                  {bank.is_primary && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.bankAccText}>{bank.account_number_masked} • {bank.ifsc_code}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={12} color="#16A34A" />
                  <Text style={styles.verifiedText}>Penny-Drop Verified & Active</Text>
                </View>
              </View>
              <Pressable
                style={styles.deleteBankBtn}
                onPress={() => {
                  Alert.alert(
                    'Remove Bank Account',
                    `Remove ${bank.bank_name} (${bank.account_number_masked})?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Remove', style: 'destructive', onPress: () => deleteUserBankAccount(bank.id) },
                    ]
                  );
                }}
                hitSlop={10}
              >
                <Trash2 size={16} color="#DC2626" />
              </Pressable>
            </View>
          ))
        )}

        {/* SECTION 4: 6 QUICK ACTIONS GRID */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Rewards Ecosystem</Text>
        </View>

        <View style={styles.quickGrid}>
          {/* Action 1: Pay Rent */}
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.btnPressed]}
            onPress={() => router.push('/(renter)/pay-rent' as any)}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#DCFCE7' }]}>
              <CreditCard size={20} color="#16A34A" strokeWidth={2.4} />
            </View>
            <Text style={styles.actionTitle}>Pay Rent</Text>
            <Text style={styles.actionSub}>1% instant cashback</Text>
            <View style={[styles.actionBadge, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.actionBadgeText, { color: '#16A34A' }]}>Earn ₹500</Text>
            </View>
          </Pressable>

          {/* Action 2: Redeem Rewards */}
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.btnPressed]}
            onPress={() => router.push('/(renter)/rewards' as any)}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FFE4E6' }]}>
              <Gift size={20} color="#E11D48" strokeWidth={2.4} />
            </View>
            <Text style={styles.actionTitle}>Rewards Center</Text>
            <Text style={styles.actionSub}>20+ brand vouchers</Text>
            <View style={[styles.actionBadge, { backgroundColor: '#FFE4E6' }]}>
              <Text style={[styles.actionBadgeText, { color: '#E11D48' }]}>Explore</Text>
            </View>
          </Pressable>

          {/* Action 3: Share & Earn */}
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.btnPressed]}
            onPress={() => router.push('/(renter)/share-earn' as any)}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Users size={20} color="#D97706" strokeWidth={2.4} />
            </View>
            <Text style={styles.actionTitle}>Share & Earn</Text>
            <Text style={styles.actionSub}>Refer friends & roommates</Text>
            <View style={[styles.actionBadge, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.actionBadgeText, { color: '#D97706' }]}>₹300 / Friend</Text>
            </View>
          </Pressable>

          {/* Action 4: Transactions */}
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.btnPressed]}
            onPress={() => router.push('/(renter)/transactions' as any)}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Receipt size={20} color="#2563EB" strokeWidth={2.4} />
            </View>
            <Text style={styles.actionTitle}>Transactions</Text>
            <Text style={styles.actionSub}>Full transparent ledger</Text>
            <View style={[styles.actionBadge, { backgroundColor: '#EFF6FF' }]}>
              <Text style={[styles.actionBadgeText, { color: '#2563EB' }]}>History</Text>
            </View>
          </Pressable>

          {/* Action 5: Challenges & Missions */}
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.btnPressed]}
            onPress={() => router.push('/(renter)/challenges' as any)}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#EDE9FE' }]}>
              <Award size={20} color="#7C3AED" strokeWidth={2.4} />
            </View>
            <Text style={styles.actionTitle}>Challenges</Text>
            <Text style={styles.actionSub}>Gamified missions</Text>
            <View style={[styles.actionBadge, { backgroundColor: '#EDE9FE' }]}>
              <Text style={[styles.actionBadgeText, { color: '#7C3AED' }]}>Win XP</Text>
            </View>
          </Pressable>

          {/* Action 6: R-Cash Hub */}
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.btnPressed]}
            onPress={() => router.push('/(renter)/rcash' as any)}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#CCFBF1' }]}>
              <Sparkles size={20} color="#0F766E" strokeWidth={2.4} />
            </View>
            <Text style={styles.actionTitle}>R-Cash Rules</Text>
            <Text style={styles.actionSub}>6-pillar benefits</Text>
            <View style={[styles.actionBadge, { backgroundColor: '#CCFBF1' }]}>
              <Text style={[styles.actionBadgeText, { color: '#0F766E' }]}>Pillars</Text>
            </View>
          </Pressable>
        </View>

        {/* SECTION 5: TRANSACTIONS WITH SEARCH & FILTER CHIPS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Pressable
            onPress={() => router.push('/(renter)/transactions' as any)}
            hitSlop={8}
          >
            <Text style={styles.sectionSeeAll}>View All &rarr;</Text>
          </Pressable>
        </View>

        {/* Search Input */}
        <View style={styles.searchBarWrap}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, reference ID, amount..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={16} color="#94A3B8" />
            </Pressable>
          ) : null}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsScroll}
        >
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'credit', label: 'Credits (+)' },
            { id: 'debit', label: 'Debits (-)' },
            { id: 'rent_cashback', label: 'Rent Cashback' },
            { id: 'referral', label: 'Referrals' },
            { id: 'reward_redemption', label: 'Redemptions' },
          ].map((chip) => {
            const isSelected = selectedCategoryFilter === chip.id;
            return (
              <Pressable
                key={chip.id}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedCategoryFilter(chip.id)}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.transactionsContainer}>
          {recentTransactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Clock size={32} color="#0F766E" strokeWidth={1.8} />
              <Text style={styles.emptyTitle}>No Transactions Found</Text>
              <Text style={styles.emptySub}>
                {searchQuery || selectedCategoryFilter !== 'all'
                  ? 'No transactions match your current search or filter.'
                  : 'Pay your monthly rent or invite roommates to earn instant R-Cash credited directly to your balance.'}
              </Text>
            </View>
          ) : (
            recentTransactions.map((item: WalletTransactionRecord) => {
              const meta = getCategoryIcon(item.category);
              const IconComp = meta.icon;
              const isCredit = item.type === 'credit';
              const dateStr = item.created_at
                ? new Date(item.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })
                : 'Recent';

              return (
                <Pressable
                  key={item.id}
                  style={styles.txRow}
                  onPress={() => {
                    setSelectedTxn(item);
                    setReceiptModalVisible(true);
                  }}
                >
                  <View style={[styles.txIconBox, { backgroundColor: meta.bg }]}>
                    <IconComp size={18} color={meta.color} strokeWidth={2.4} />
                  </View>

                  <View style={styles.txInfo}>
                    <Text style={styles.txTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.txSub} numberOfLines={1}>
                      {dateStr} • {item.category.replace(/_/g, ' ')}
                    </Text>
                  </View>

                  <View style={styles.txAmountWrap}>
                    <Text style={[styles.txAmount, isCredit ? styles.txCredit : styles.txDebit]}>
                      {isCredit ? '+' : '-'}₹{item.amount.toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.txStatus}>{item.status}</Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* =====================================================================
          WITHDRAW TO BANK MODAL
         ===================================================================== */}
      <Modal
        visible={withdrawModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setWithdrawModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Withdraw R-Cash to Bank</Text>
                <Text style={styles.modalSub}>Instant 24/7 IMPS transfer with zero fees</Text>
              </View>
              <Pressable
                style={styles.closeBtnCircle}
                onPress={() => setWithdrawModalVisible(false)}
              >
                <X size={18} color="#0F172A" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
              <View style={styles.bankBalanceBanner}>
                <Text style={styles.bankBalanceLabel}>AVAILABLE FOR WITHDRAWAL</Text>
                <Text style={styles.bankBalanceVal}>₹{availableBalance.toLocaleString('en-IN')}</Text>
              </View>

              {/* Select Bank Account */}
              <Text style={styles.inputLabel}>SELECT DESTINATION BANK ACCOUNT</Text>
              {userBankAccounts.length === 0 ? (
                <Pressable
                  style={styles.addBankPromptBtn}
                  onPress={() => {
                    setWithdrawModalVisible(false);
                    setAddBankModalVisible(true);
                  }}
                >
                  <Plus size={16} color="#0F766E" />
                  <Text style={styles.addBankPromptText}>+ Link Bank Account to Withdraw</Text>
                </Pressable>
              ) : (
                <View style={{ gap: 8, marginBottom: 12 }}>
                  {userBankAccounts.map((bank) => {
                    const isSelected = selectedBankId === bank.id;
                    return (
                      <Pressable
                        key={bank.id}
                        style={[styles.bankSelectCard, isSelected && styles.bankSelectCardActive]}
                        onPress={() => setSelectedBankId(bank.id)}
                      >
                        <Building2 size={16} color={isSelected ? '#0F766E' : '#64748B'} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.bankSelectTitle, isSelected && styles.bankSelectTitleActive]}>
                            {bank.bank_name}
                          </Text>
                          <Text style={styles.bankSelectSub}>{bank.account_number_masked} • {bank.ifsc_code}</Text>
                        </View>
                        {isSelected && <Check size={16} color="#0F766E" strokeWidth={2.6} />}
                      </Pressable>
                    );
                  })}
                </View>
              )}

              <Text style={styles.inputLabel}>WITHDRAWAL AMOUNT (₹)</Text>
              <TextInput
                style={styles.bankInput}
                placeholder="Enter amount (Min ₹100)"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
              />

              {/* Quick Amount Chips */}
              <View style={styles.quickAmountRow}>
                {[500, 1000, 2000].map((amt) => (
                  <Pressable
                    key={amt}
                    style={styles.quickAmtPill}
                    onPress={() => setWithdrawAmount(String(amt))}
                  >
                    <Text style={styles.quickAmtText}>₹{amt}</Text>
                  </Pressable>
                ))}
                {availableBalance > 0 && (
                  <Pressable
                    style={[styles.quickAmtPill, { backgroundColor: '#0F766E' }]}
                    onPress={() => setWithdrawAmount(String(availableBalance))}
                  >
                    <Text style={[styles.quickAmtText, { color: '#FFFFFF' }]}>All (₹{availableBalance})</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.instantGuaranteeBanner}>
                <Zap size={14} color="#0F766E" />
                <Text style={styles.instantGuaranteeText}>
                  Instant IMPS Payout • Processing Fee: ₹0 (Free)
                </Text>
              </View>

              <V4Button
                title={isWithdrawing ? 'Processing IMPS Transfer...' : 'Confirm Instant Withdrawal'}
                variant="primary"
                loading={isWithdrawing}
                onPress={handleConfirmWithdrawal}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          ADD BANK ACCOUNT MODAL
         ===================================================================== */}
      <Modal
        visible={addBankModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddBankModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Link Bank Account</Text>
                <Text style={styles.modalSub}>Penny-drop verification via NPCI / IMPS</Text>
              </View>
              <Pressable
                style={styles.closeBtnCircle}
                onPress={() => setAddBankModalVisible(false)}
              >
                <X size={18} color="#0F172A" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
              <Text style={styles.inputLabel}>ACCOUNT HOLDER NAME</Text>
              <TextInput
                style={styles.bankInput}
                placeholder="Full Name as on Bank Passbook"
                placeholderTextColor="#94A3B8"
                value={newAccHolder}
                onChangeText={setNewAccHolder}
              />

              <Text style={styles.inputLabel}>BANK NAME</Text>
              <TextInput
                style={styles.bankInput}
                placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                placeholderTextColor="#94A3B8"
                value={newBankName}
                onChangeText={setNewBankName}
              />

              <Text style={styles.inputLabel}>BANK ACCOUNT NUMBER</Text>
              <TextInput
                style={styles.bankInput}
                placeholder="Enter 9-18 digit account number"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                value={newAccNumber}
                onChangeText={setNewAccNumber}
              />

              <Text style={styles.inputLabel}>CONFIRM ACCOUNT NUMBER</Text>
              <TextInput
                style={styles.bankInput}
                placeholder="Re-enter bank account number"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                value={confirmAccNumber}
                onChangeText={setConfirmAccNumber}
              />

              <Text style={styles.inputLabel}>IFSC CODE</Text>
              <TextInput
                style={styles.bankInput}
                placeholder="e.g. HDFC0000128"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                value={newIfsc}
                onChangeText={(t) => setNewIfsc(t.toUpperCase())}
              />

              <Text style={styles.inputLabel}>UPI ID (OPTIONAL)</Text>
              <TextInput
                style={styles.bankInput}
                placeholder="e.g. yourname@okhdfcbank"
                placeholderTextColor="#94A3B8"
                value={newUpiId}
                onChangeText={setNewUpiId}
              />

              <View style={styles.instantGuaranteeBanner}>
                <ShieldCheck size={14} color="#0F766E" />
                <Text style={styles.instantGuaranteeText}>
                  Zero Cost Penny Drop verification will deposit ₹1 to verify account.
                </Text>
              </View>

              <V4Button
                title={isAddingBank ? 'Verifying with NPCI...' : 'Verify & Save Bank Account'}
                variant="primary"
                loading={isAddingBank}
                onPress={handleAddBank}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          DOWNLOAD STATEMENT MODAL
         ===================================================================== */}
      <Modal
        visible={statementModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStatementModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Download Wallet Statement</Text>
                <Text style={styles.modalSub}>Official certified R-Cash ledger summary</Text>
              </View>
              <Pressable
                style={styles.closeBtnCircle}
                onPress={() => setStatementModalVisible(false)}
              >
                <X size={18} color="#0F172A" />
              </Pressable>
            </View>

            <View style={{ padding: 16, gap: 14 }}>
              <Text style={styles.inputLabel}>STATEMENT PERIOD</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[
                  { id: '30d', label: 'Last 30 Days' },
                  { id: '90d', label: 'Last 90 Days' },
                  { id: 'fy2026', label: 'FY 2026-27' },
                ].map((p) => {
                  const isSel = statementPeriod === p.id;
                  return (
                    <Pressable
                      key={p.id}
                      style={[styles.periodPill, isSel && styles.periodPillActive]}
                      onPress={() => setStatementPeriod(p.id as any)}
                    >
                      <Text style={[styles.periodPillText, isSel && styles.periodPillTextActive]}>
                        {p.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.statementSummaryBox}>
                <View style={styles.statementRow}>
                  <Text style={styles.statementLabel}>Account Holder</Text>
                  <Text style={styles.statementVal}>{user?.name || 'Verified Member'}</Text>
                </View>
                <View style={styles.statementRow}>
                  <Text style={styles.statementLabel}>Current Balance</Text>
                  <Text style={styles.statementVal}>₹{availableBalance.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.statementRow}>
                  <Text style={styles.statementLabel}>Lifetime Cashback</Text>
                  <Text style={styles.statementVal}>₹{lifetimeEarned.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.statementRow}>
                  <Text style={styles.statementLabel}>Verification Stamp</Text>
                  <Text style={[styles.statementVal, { color: '#0F766E', fontWeight: '800' }]}>
                    VERIFIED LEDGER
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable
                  style={styles.statementShareBtn}
                  onPress={handleShareStatement}
                >
                  <Share2 size={16} color="#0F766E" />
                  <Text style={styles.statementShareBtnText}>Share Statement</Text>
                </Pressable>

                <Pressable
                  style={styles.statementDownloadBtn}
                  onPress={() => {
                    setStatementModalVisible(false);
                    showToast('Statement PDF saved to Downloads', 'success');
                  }}
                >
                  <Download size={16} color="#FFFFFF" />
                  <Text style={styles.statementDownloadBtnText}>Download PDF</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          RECEIPT DETAILS MODAL
         ===================================================================== */}
      <Modal
        visible={receiptModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReceiptModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Transaction Details</Text>
                <Text style={styles.modalSub}>Tamper-evident cryptographic ledger</Text>
              </View>
              <Pressable
                style={styles.closeBtnCircle}
                onPress={() => setReceiptModalVisible(false)}
              >
                <X size={18} color="#0F172A" />
              </Pressable>
            </View>

            {selectedTxn && (
              <View style={{ padding: 16, gap: 14 }}>
                <View style={styles.receiptAmtCard}>
                  <Text style={styles.receiptAmtLabel}>TRANSACTION AMOUNT</Text>
                  <Text style={[
                    styles.receiptAmtVal,
                    selectedTxn.type === 'credit' ? { color: '#16A34A' } : { color: '#DC2626' }
                  ]}>
                    {selectedTxn.type === 'credit' ? '+' : '-'}₹{selectedTxn.amount.toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.receiptStatusPill}>{selectedTxn.status.toUpperCase()}</Text>
                </View>

                <View style={styles.receiptMetaBox}>
                  <View style={styles.receiptMetaRow}>
                    <Text style={styles.receiptMetaLabel}>Title</Text>
                    <Text style={styles.receiptMetaVal}>{selectedTxn.title}</Text>
                  </View>
                  <View style={styles.receiptMetaRow}>
                    <Text style={styles.receiptMetaLabel}>Category</Text>
                    <Text style={styles.receiptMetaVal}>{selectedTxn.category.replace(/_/g, ' ').toUpperCase()}</Text>
                  </View>
                  <View style={styles.receiptMetaRow}>
                    <Text style={styles.receiptMetaLabel}>Reference ID</Text>
                    <Text style={styles.receiptMetaVal}>{selectedTxn.reference_id || selectedTxn.id}</Text>
                  </View>
                  <View style={styles.receiptMetaRow}>
                    <Text style={styles.receiptMetaLabel}>Date & Time</Text>
                    <Text style={styles.receiptMetaVal}>
                      {new Date(selectedTxn.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>

                <V4Button
                  title="Close Details"
                  variant="primary"
                  onPress={() => setReceiptModalVisible(false)}
                />
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
    paddingVertical: 10,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.soft,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  historyIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },

  // HERO WALLET CARD
  heroCard: {
    backgroundColor: '#064E3B',
    borderRadius: 24,
    padding: 20,
    gap: 14,
    overflow: 'hidden',
    position: 'relative',
    ...V4_SHADOWS.card,
  },
  heroGlowCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#0F766E',
    opacity: 0.35,
    top: -40,
    right: -40,
  },
  heroGlowCircle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#10B981',
    opacity: 0.2,
    bottom: -30,
    left: -30,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  heroTagText: {
    color: '#99F6E4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  rateChip: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rateChipText: {
    color: '#CCFBF1',
    fontSize: 10.5,
    fontWeight: '700',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rupeeSymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#CCFBF1',
    marginRight: 4,
  },
  balanceValue: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
  decimals: {
    fontSize: 20,
    fontWeight: '700',
    color: '#99F6E4',
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 14,
    padding: 12,
  },
  heroStatItem: {
    flex: 1,
    gap: 3,
  },
  heroStatLabel: {
    fontSize: 9.5,
    color: '#99F6E4',
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heroStatValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 12,
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heroBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#34D399',
    paddingVertical: 12,
    borderRadius: 14,
    minHeight: 44,
  },
  heroBtnPrimaryText: {
    color: '#042F2E',
    fontWeight: '800',
    fontSize: 12.5,
  },
  heroBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    borderRadius: 14,
    minHeight: 44,
  },
  heroBtnSecondaryText: {
    color: '#CCFBF1',
    fontWeight: '700',
    fontSize: 12.5,
  },

  // SECTION HEADERS
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  sectionBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.6,
  },
  sectionSeeAll: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F766E',
  },

  // SPENDING & CASHBACK CHART
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
    ...V4_SHADOWS.card,
  },
  chartLegendRow: {
    flexDirection: 'row',
    gap: 14,
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
    paddingBottom: 4,
  },
  barColumn: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  barTopVal: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#10B981',
  },
  barTrack: {
    width: 14,
    height: 75,
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: '#0F766E',
    borderRadius: 7,
  },
  barMonthLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  chartFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  chartFooterText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  chartFooterLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },

  // LINKED BANK ACCOUNTS
  addBankHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  addBankHeaderBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  emptyBankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  emptyBankTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  emptyBankSub: {
    fontSize: 11,
    color: '#115E59',
    marginTop: 2,
    lineHeight: 15,
  },
  linkBankSmallBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    minHeight: 36,
    justifyContent: 'center',
  },
  linkBankSmallBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  bankAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  bankIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankNameText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  primaryBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  primaryBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#16A34A',
  },
  bankAccText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  verifiedText: {
    fontSize: 10.5,
    color: '#16A34A',
    fontWeight: '700',
  },
  deleteBankBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // QUICK GRID
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  actionSub: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
  },
  actionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 2,
  },
  actionBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
  },

  // SEARCH & FILTER
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: V4_COLORS.textPrimary,
  },
  filterChipsScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 36,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // TRANSACTIONS
  transactionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 28,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 6,
  },
  emptySub: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  txIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: {
    flex: 1,
    gap: 2,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  txSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
  },
  txAmountWrap: {
    alignItems: 'flex-end',
    gap: 2,
  },
  txAmount: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  txCredit: {
    color: '#16A34A',
  },
  txDebit: {
    color: '#DC2626',
  },
  txStatus: {
    fontSize: 9.5,
    color: V4_COLORS.textMuted,
    textTransform: 'uppercase',
  },

  // MODAL COMMON
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  modalSub: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtnCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 6,
    marginTop: 8,
  },
  bankInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13.5,
    color: V4_COLORS.textPrimary,
    minHeight: 44,
  },
  bankBalanceBanner: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    marginBottom: 10,
    gap: 3,
  },
  bankBalanceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.8,
  },
  bankBalanceVal: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F766E',
  },
  quickAmountRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 14,
  },
  quickAmtPill: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  quickAmtText: {
    fontSize: 12,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  instantGuaranteeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  instantGuaranteeText: {
    fontSize: 11.5,
    color: '#0F766E',
    fontWeight: '700',
    flex: 1,
  },
  addBankPromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#0F766E',
    paddingVertical: 14,
    minHeight: 44,
    marginBottom: 8,
  },
  addBankPromptText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  bankSelectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 44,
  },
  bankSelectCardActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E',
  },
  bankSelectTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  bankSelectTitleActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  bankSelectSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
  },

  // STATEMENT MODAL
  periodPill: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  periodPillActive: {
    backgroundColor: '#0F766E',
  },
  periodPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  periodPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  statementSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statementLabel: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
  },
  statementVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  statementShareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingVertical: 14,
    minHeight: 44,
  },
  statementShareBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  statementDownloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    borderRadius: 14,
    paddingVertical: 14,
    minHeight: 44,
  },
  statementDownloadBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // RECEIPT MODAL
  receiptAmtCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  receiptAmtLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  receiptAmtVal: {
    fontSize: 30,
    fontWeight: '900',
  },
  receiptStatusPill: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  receiptMetaBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  receiptMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptMetaLabel: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
  },
  receiptMetaVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  aiWalletBanner: {
    marginHorizontal: 16,
    marginVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#CCFBF1',
    gap: 12,
    ...V4_SHADOWS.card,
  },
  aiWalletIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiWalletTextCol: {
    flex: 1,
    gap: 2,
  },
  aiWalletBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0F766E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 2,
  },
  aiWalletBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  aiWalletTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  aiWalletSub: {
    fontSize: 11.5,
    color: '#0F766E',
    lineHeight: 16,
  },
});
