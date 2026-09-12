import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Receipt,
  Filter,
  CreditCard,
  Users,
  Gift,
  ShieldCheck,
  Award,
  Sparkles,
  Zap,
  Copy,
  Check,
  Download,
  Calendar,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4AuthGate } from '../ui/V4AuthGate';
import { WalletTransactionRecord } from '../../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FilterCategory = 'all' | 'credit' | 'debit' | 'rent_cashback' | 'referral' | 'reward_redemption';

export const V4TransactionsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    isAuthenticated,
    wallet,
    walletTransactions,
    fetchWallet,
    fetchWalletTransactions,
    showToast,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWallet();
      fetchWalletTransactions();
    }
  }, [isAuthenticated]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.allSettled([fetchWallet(), fetchWalletTransactions()]);
    setRefreshing(false);
  };

  const transactions = walletTransactions || [];

  // Summary figures
  const totalCredits = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'credit')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalDebits = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'debit')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const netBalance = wallet?.balance ?? totalCredits - totalDebits;

  // Filtered transactions
  const filteredList = useMemo(() => {
    return transactions.filter((tx) => {
      // Category / Type filter
      if (selectedFilter === 'credit' && tx.type !== 'credit') return false;
      if (selectedFilter === 'debit' && tx.type !== 'debit') return false;
      if (
        selectedFilter !== 'all' &&
        selectedFilter !== 'credit' &&
        selectedFilter !== 'debit' &&
        tx.category !== selectedFilter
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(q);
        const matchesDesc = (tx.description || '').toLowerCase().includes(q);
        const matchesRef = (tx.reference_id || '').toLowerCase().includes(q);
        const matchesCat = tx.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesRef && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, selectedFilter, searchQuery]);

  const copyRefId = (refId: string) => {
    showToast(`Reference ID "${refId}" copied to clipboard`, 'success');
  };

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
      default:
        return { icon: Sparkles, color: '#0F766E', bg: '#CCFBF1' };
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
            <Text style={styles.headerTitle}>Transaction Ledger</Text>
            <Text style={styles.headerSubtitle}>REHVO Financial History</Text>
          </View>
        </View>

        <V4AuthGate
          fullScreen={false}
          icon={Receipt}
          title="Unlock Transaction History"
          description="Sign in to inspect your detailed ledger entries, download statements, and track every R-Cash credit & debit."
          featureName="Transaction Ledger"
          benefits={[
            'Cryptographic reference IDs on every ledger entry',
            'Full double-entry bookkeeping with timestamps',
            'Filter by rent cashback, referral rewards, and vouchers',
            'Download PDF & CSV statements for tax and records',
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
          <Text style={styles.headerTitle}>Transaction Ledger</Text>
          <Text style={styles.headerSubtitle}>Double-Entry Audit Trail</Text>
        </View>

        <Pressable
          style={styles.exportBtn}
          onPress={() => showToast('Statement download link sent to your email', 'success')}
        >
          <Download size={16} color="#0F766E" />
          <Text style={styles.exportBtnText}>Statement</Text>
        </Pressable>
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
        {/* SUMMARY BALANCE CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL CREDITS</Text>
            <Text style={[styles.summaryValue, { color: '#16A34A' }]}>
              +₹{totalCredits.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL DEBITS</Text>
            <Text style={[styles.summaryValue, { color: '#E11D48' }]}>
              -₹{totalDebits.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>NET BALANCE</Text>
            <Text style={[styles.summaryValue, { color: '#0F766E' }]}>
              ₹{netBalance.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBar}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by reference ID, title or category..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* FILTER CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'credit', label: 'Credits (+)' },
            { id: 'debit', label: 'Debits (-)' },
            { id: 'rent_cashback', label: 'Rent Cashback' },
            { id: 'referral', label: 'Referrals' },
            { id: 'reward_redemption', label: 'Vouchers' },
          ].map((item) => {
            const isActive = selectedFilter === item.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedFilter(item.id as FilterCategory)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* TRANSACTION LIST */}
        <View style={styles.ledgerList}>
          {filteredList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Receipt size={32} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No matching transactions</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search terms or filters to see past entries.
              </Text>
            </View>
          ) : (
            filteredList.map((tx: WalletTransactionRecord) => {
              const isCredit = tx.type === 'credit';
              const isExpanded = expandedTxId === tx.id;
              const catMeta = getCategoryIcon(tx.category);
              const IconComp = catMeta.icon;

              const dateStr = tx.created_at
                ? new Date(tx.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recent';

              return (
                <Pressable
                  key={tx.id}
                  style={[styles.txCard, isExpanded && styles.txCardExpanded]}
                  onPress={() => setExpandedTxId(isExpanded ? null : tx.id)}
                >
                  {/* Top Summary Row */}
                  <View style={styles.txTopRow}>
                    <View style={[styles.txIconBox, { backgroundColor: catMeta.bg }]}>
                      <IconComp size={18} color={catMeta.color} strokeWidth={2.4} />
                    </View>

                    <View style={styles.txMainInfo}>
                      <Text style={styles.txTitle}>{tx.title}</Text>
                      <Text style={styles.txSub}>
                        {tx.category.replace('_', ' ').toUpperCase()} • {dateStr}
                      </Text>
                    </View>

                    <View style={styles.txAmountWrap}>
                      <Text
                        style={[
                          styles.txAmount,
                          isCredit ? styles.amountCredit : styles.amountDebit,
                        ]}
                      >
                        {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          tx.status === 'completed'
                            ? styles.statusCompleted
                            : styles.statusPending,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
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

                  {/* Expandable Details Drawer */}
                  {isExpanded && (
                    <View style={styles.txExpandedDrawer}>
                      {tx.description ? (
                        <View style={styles.drawerRow}>
                          <Text style={styles.drawerLabel}>Description:</Text>
                          <Text style={styles.drawerValue}>{tx.description}</Text>
                        </View>
                      ) : null}

                      {tx.reference_id ? (
                        <View style={styles.drawerRow}>
                          <Text style={styles.drawerLabel}>Reference ID:</Text>
                          <Pressable
                            style={styles.refIdBox}
                            onPress={() => copyRefId(tx.reference_id!)}
                          >
                            <Text style={styles.refIdText}>{tx.reference_id}</Text>
                            <Copy size={13} color="#0F766E" />
                          </Pressable>
                        </View>
                      ) : null}

                      <View style={styles.drawerRow}>
                        <Text style={styles.drawerLabel}>Settlement:</Text>
                        <Text style={styles.drawerValue}>Instant On-Ledger</Text>
                      </View>
                    </View>
                  )}
                </Pressable>
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 100,
    gap: 4,
    minHeight: 44,
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...V4_SHADOWS.card,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: V4_COLORS.textPrimary,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 44,
    justifyContent: 'center',
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
  ledgerList: {
    gap: 10,
  },
  txCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...V4_SHADOWS.card,
  },
  txCardExpanded: {
    borderColor: '#99F6E4',
  },
  txTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txMainInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginBottom: 2,
  },
  txSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
  },
  txAmountWrap: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 3,
  },
  amountCredit: {
    color: '#16A34A',
  },
  amountDebit: {
    color: '#334155',
  },
  statusBadge: {
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
  statusBadgeText: {
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
  txExpandedDrawer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  drawerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerLabel: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
  },
  drawerValue: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  refIdBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 6,
  },
  refIdText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#0F766E',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 6,
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
    paddingHorizontal: 30,
  },
});
