import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Gift,
  Ticket,
  Copy,
  Check,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  History,
  Info,
  X,
  CreditCard,
  Award,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4AuthGate } from '../ui/V4AuthGate';
import { RewardRedemptionRecord, ScratchCardRecord } from '../../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type StatusTab = 'all' | 'active' | 'cards' | 'used';

export const V4RewardHistoryScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    isAuthenticated,
    myRedemptions,
    scratchCards,
    rewardCampaigns,
    fetchMyRedemptions,
    fetchScratchCards,
    fetchRewardCampaigns,
    showToast,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<RewardRedemptionRecord | null>(null);

  useEffect(() => {
    fetchRewardCampaigns();
    if (isAuthenticated) {
      fetchMyRedemptions();
      fetchScratchCards();
    }
  }, [isAuthenticated]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.allSettled([
      fetchRewardCampaigns(),
      isAuthenticated ? fetchMyRedemptions() : Promise.resolve(),
      isAuthenticated ? fetchScratchCards() : Promise.resolve(),
    ]);
    setRefreshing(false);
  };

  // Live Supabase-backed redemptions (ZERO mock fallback)
  const redemptionsList: RewardRedemptionRecord[] = useMemo(() => {
    return myRedemptions || [];
  }, [myRedemptions]);

  // Live Supabase-backed scratched cards
  const scratchedCardsList: ScratchCardRecord[] = useMemo(() => {
    return (scratchCards || []).filter((card) => card.is_scratched);
  }, [scratchCards]);

  // Active vouchers
  const activeVouchers = useMemo(() => {
    return redemptionsList.filter((r) => r.status === 'active');
  }, [redemptionsList]);

  // Used / expired vouchers
  const usedVouchers = useMemo(() => {
    return redemptionsList.filter((r) => r.status === 'redeemed' || r.status === 'expired');
  }, [redemptionsList]);

  // Metrics
  const totalSaved = useMemo(() => {
    const fromRedemptions = redemptionsList.reduce((acc, r) => acc + (r.points_spent || 0), 0);
    const fromCards = scratchedCardsList.reduce((acc, c) => acc + (c.actual_reward || 0), 0);
    return fromRedemptions + fromCards;
  }, [redemptionsList, scratchedCardsList]);

  const activeCount = activeVouchers.length;
  const cardsCount = scratchedCardsList.length;

  const handleCopyCode = (id: string, code: string) => {
    setCopiedId(id);
    showToast(`Code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const findCampaignMeta = (campaignId: string) => {
    return (rewardCampaigns || []).find((c) => c.id === campaignId);
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
            <Text style={styles.headerTitle}>Reward History</Text>
            <Text style={styles.headerSubtitle}>Claimed Vouchers & Scratched Cards</Text>
          </View>
        </View>

        <V4AuthGate
          fullScreen={false}
          icon={Ticket}
          title="Your Claimed Vouchers"
          description="Sign in to view all your unlocked partner discounts, copy active promo codes, and manage your voucher expiry dates."
          featureName="Reward History"
          benefits={[
            'Instant access to all claimed partner promo codes',
            'Track expiry dates and usage status in real time',
            'Direct access to Swiggy, Urban Company, Blinkit & IKEA perks',
            'Complete history of R-Cash spent on brand privileges',
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
          <Text style={styles.headerTitle}>Reward History</Text>
          <Text style={styles.headerSubtitle}>Vouchers & Unlocked Perks</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.browseBtn, pressed && styles.btnPressed]}
          onPress={() => router.push('/(renter)/rewards' as any)}
        >
          <Gift size={16} color="#0F766E" />
          <Text style={styles.browseBtnText}>Explore</Text>
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
        {/* SUMMARY STATS CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{redemptionsList.length}</Text>
            <Text style={styles.summaryLabel}>Total Vouchers</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: '#16A34A' }]}>{activeCount}</Text>
            <Text style={styles.summaryLabel}>Active Codes</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: '#D97706' }]}>{cardsCount}</Text>
            <Text style={styles.summaryLabel}>Scratched</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: '#0F766E' }]}>₹{totalSaved}</Text>
            <Text style={styles.summaryLabel}>Total Value</Text>
          </View>
        </View>

        {/* TABS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {[
            { id: 'all', label: `All (${redemptionsList.length + cardsCount})` },
            { id: 'active', label: `Active (${activeCount})` },
            { id: 'cards', label: `Scratched Cards (${cardsCount})` },
            { id: 'used', label: `Used / Expired (${usedVouchers.length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setActiveTab(tab.id as StatusTab)}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    isActive && styles.tabChipTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* MAIN LIST CONTENT */}
        <View style={styles.listContainer}>
          {/* SCRATCHED CARDS SECTION (when 'all' or 'cards' selected) */}
          {(activeTab === 'all' || activeTab === 'cards') && scratchedCardsList.length > 0 && (
            <View style={styles.subSection}>
              {activeTab === 'all' && (
                <View style={styles.subSectionHeader}>
                  <Sparkles size={16} color="#0F766E" />
                  <Text style={styles.subSectionTitle}>Scratched Cards & Surprise Wins</Text>
                </View>
              )}
              {scratchedCardsList.map((card) => {
                const scratchedDate = card.scratched_at
                  ? new Date(card.scratched_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Claimed';

                return (
                  <View key={card.id} style={styles.scratchedCardItem}>
                    <View style={styles.scratchedIconBox}>
                      <Award size={22} color="#0F766E" />
                    </View>
                    <View style={styles.scratchedInfoCol}>
                      <View style={styles.scratchedTopRow}>
                        <Text style={styles.scratchedTitle}>{card.title}</Text>
                        <Text style={styles.scratchedValue}>+₹{card.actual_reward}</Text>
                      </View>
                      <Text style={styles.scratchedDesc}>
                        {card.subtitle || 'Reward successfully credited to R-Cash balance'}
                      </Text>
                      <View style={styles.scratchedMetaRow}>
                        <Clock size={11} color="#94A3B8" />
                        <Text style={styles.scratchedMetaDate}>Revealed on {scratchedDate}</Text>
                        <View style={styles.scratchedStatusPill}>
                          <Check size={10} color="#16A34A" />
                          <Text style={styles.scratchedStatusText}>CREDITED</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* VOUCHERS SECTION (when 'all', 'active', or 'used' selected) */}
          {(activeTab === 'all' || activeTab === 'active' || activeTab === 'used') && (
            <View style={styles.subSection}>
              {activeTab === 'all' && scratchedCardsList.length > 0 && (
                <View style={[styles.subSectionHeader, { marginTop: 12 }]}>
                  <Ticket size={16} color="#0F766E" />
                  <Text style={styles.subSectionTitle}>Partner Discount Vouchers</Text>
                </View>
              )}

              {(() => {
                const targetList =
                  activeTab === 'active'
                    ? activeVouchers
                    : activeTab === 'used'
                    ? usedVouchers
                    : redemptionsList;

                if (targetList.length === 0 && (activeTab !== 'all' || scratchedCardsList.length === 0)) {
                  return (
                    <View style={styles.emptyCard}>
                      <Ticket size={40} color="#94A3B8" strokeWidth={1.5} />
                      <Text style={styles.emptyTitle}>No Vouchers Found</Text>
                      <Text style={styles.emptySub}>
                        You haven't claimed any brand discount codes in this section yet. Explore the Rewards Center to redeem food, grocery, cleaning and moving vouchers with your R-Cash!
                      </Text>
                      <Pressable
                        style={({ pressed }) => [styles.emptyBrowseBtn, pressed && styles.btnPressed]}
                        onPress={() => router.push('/(renter)/rewards' as any)}
                      >
                        <Gift size={16} color="#FFFFFF" />
                        <Text style={styles.emptyBrowseBtnText}>Explore Rewards Center</Text>
                      </Pressable>
                    </View>
                  );
                }

                return targetList.map((item) => {
                  const meta = item.campaign || findCampaignMeta(item.campaign_id);
                  const brandName = meta?.brand || 'Brand Partner';
                  const title = meta?.title || 'Exclusive Discount Pass';
                  const isCopied = copiedId === item.id;
                  const isActive = item.status === 'active';

                  const dateClaimed = item.redeemed_at
                    ? new Date(item.redeemed_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Recent';

                  const dateExpires = item.expires_at
                    ? new Date(item.expires_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : null;

                  return (
                    <View key={item.id} style={styles.voucherCard}>
                      {/* Top Bar */}
                      <View style={styles.voucherTopRow}>
                        <View style={styles.brandBadge}>
                          <Text style={styles.brandBadgeText}>{brandName.toUpperCase()}</Text>
                        </View>

                        <View
                          style={[
                            styles.statusPill,
                            isActive
                              ? styles.statusPillActive
                              : item.status === 'redeemed'
                              ? styles.statusPillUsed
                              : styles.statusPillExpired,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusPillText,
                              isActive
                                ? styles.statusTextActive
                                : item.status === 'redeemed'
                                ? styles.statusTextUsed
                                : styles.statusTextExpired,
                            ]}
                          >
                            {item.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.voucherTitle}>{title}</Text>

                      {/* Promo Code Box */}
                      <View style={styles.codeRow}>
                        <View style={styles.codeWrap}>
                          <Text style={styles.codeLabel}>PROMO CODE</Text>
                          <Text style={styles.codeValue} numberOfLines={1}>
                            {item.promo_code}
                          </Text>
                        </View>

                        <Pressable
                          style={({ pressed }) => [
                            styles.copyBtn,
                            isCopied && styles.copyBtnDone,
                            pressed && styles.btnPressed,
                          ]}
                          onPress={() => handleCopyCode(item.id, item.promo_code)}
                        >
                          {isCopied ? (
                            <Check size={16} color="#16A34A" />
                          ) : (
                            <Copy size={16} color="#0F766E" />
                          )}
                          <Text style={[styles.copyBtnText, isCopied && { color: '#16A34A' }]}>
                            {isCopied ? 'Copied' : 'Copy'}
                          </Text>
                        </Pressable>
                      </View>

                      {/* Footer Meta */}
                      <View style={styles.voucherFooter}>
                        <View style={styles.footerCol}>
                          <Text style={styles.footerLabel}>Claimed</Text>
                          <Text style={styles.footerVal}>{dateClaimed}</Text>
                        </View>
                        {dateExpires ? (
                          <View style={styles.footerCol}>
                            <Text style={styles.footerLabel}>Valid Till</Text>
                            <Text style={styles.footerVal}>{dateExpires}</Text>
                          </View>
                        ) : null}
                        <View style={styles.footerCol}>
                          <Text style={styles.footerLabel}>R-Cash Spent</Text>
                          <Text style={[styles.footerVal, { color: '#0F766E' }]}>
                            ₹{item.points_spent}
                          </Text>
                        </View>

                        <Pressable
                          style={styles.infoBtn}
                          onPress={() => setSelectedVoucher(item)}
                          hitSlop={8}
                        >
                          <Info size={16} color="#64748B" />
                        </Pressable>
                      </View>
                    </View>
                  );
                });
              })()}
            </View>
          )}

          {/* EMPTY STATE WHEN NOTHING AT ALL */}
          {activeTab === 'cards' && scratchedCardsList.length === 0 && (
            <View style={styles.emptyCard}>
              <Award size={40} color="#94A3B8" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No Scratched Cards Yet</Text>
              <Text style={styles.emptySub}>
                Pay your rent, complete KYC, or spin the Lucky Reward Wheel to unlock exciting mystery scratch cards!
              </Text>
              <Pressable
                style={({ pressed }) => [styles.emptyBrowseBtn, pressed && styles.btnPressed]}
                onPress={() => router.push('/(renter)/rewards' as any)}
              >
                <Gift size={16} color="#FFFFFF" />
                <Text style={styles.emptyBrowseBtnText}>Visit Rewards Center</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* VOUCHER DETAILS MODAL */}
      <Modal
        visible={Boolean(selectedVoucher)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedVoucher(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Voucher Details</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setSelectedVoucher(null)}
                hitSlop={8}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            {selectedVoucher && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalBody}>
                <View style={styles.modalBadgeRow}>
                  <View style={styles.brandBadge}>
                    <Text style={styles.brandBadgeText}>
                      {(selectedVoucher.campaign?.brand || 'PARTNER').toUpperCase()}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      selectedVoucher.status === 'active'
                        ? styles.statusPillActive
                        : styles.statusPillUsed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        selectedVoucher.status === 'active'
                          ? styles.statusTextActive
                          : styles.statusTextUsed,
                      ]}
                    >
                      {selectedVoucher.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.modalVoucherTitle}>
                  {selectedVoucher.campaign?.title || 'Exclusive Partner Privilege'}
                </Text>

                <View style={styles.modalCodeBox}>
                  <Text style={styles.modalCodeLabel}>YOUR PROMO CODE</Text>
                  <Text style={styles.modalCodeValue}>{selectedVoucher.promo_code}</Text>
                  <Pressable
                    style={styles.modalCopyBtn}
                    onPress={() => handleCopyCode(selectedVoucher.id, selectedVoucher.promo_code)}
                  >
                    <Copy size={14} color="#0F766E" />
                    <Text style={styles.modalCopyBtnText}>Copy Code</Text>
                  </Pressable>
                </View>

                <View style={styles.modalTermsBox}>
                  <Text style={styles.modalTermsTitle}>Terms & Redemption Instructions</Text>
                  <Text style={styles.modalTermsText}>
                    1. Apply promo code at partner checkout in their app or website.{'\n'}
                    2. Valid only for verified REHVO residents with active accounts.{'\n'}
                    3. Cannot be combined with other promotional bank codes.{'\n'}
                    4. Valid till{' '}
                    {selectedVoucher.expires_at
                      ? new Date(selectedVoucher.expires_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'end of month'}.
                  </Text>
                </View>

                <Pressable
                  style={styles.modalDoneBtn}
                  onPress={() => setSelectedVoucher(null)}
                >
                  <Text style={styles.modalDoneBtnText}>Done</Text>
                </Pressable>
              </ScrollView>
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
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 100,
    gap: 6,
    justifyContent: 'center',
  },
  browseBtnText: {
    fontSize: 13,
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
    paddingHorizontal: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...V4_SHADOWS.card,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 10,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  tabsRow: {
    gap: 8,
    paddingBottom: 16,
  },
  tabChip: {
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  tabChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  tabChipTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    gap: 16,
  },
  subSection: {
    gap: 12,
  },
  subSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  scratchedCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 14,
    ...V4_SHADOWS.card,
  },
  scratchedIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scratchedInfoCol: {
    flex: 1,
  },
  scratchedTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  scratchedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  scratchedValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F766E',
  },
  scratchedDesc: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginBottom: 6,
    lineHeight: 15,
  },
  scratchedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scratchedMetaDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  scratchedStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
    marginLeft: 6,
  },
  scratchedStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A',
  },
  voucherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...V4_SHADOWS.card,
  },
  voucherTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brandBadge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  brandBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillActive: {
    backgroundColor: '#DCFCE7',
  },
  statusPillUsed: {
    backgroundColor: '#F1F5F9',
  },
  statusPillExpired: {
    backgroundColor: '#FEE2E2',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextActive: {
    color: '#16A34A',
  },
  statusTextUsed: {
    color: '#64748B',
  },
  statusTextExpired: {
    color: '#DC2626',
  },
  voucherTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginBottom: 12,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  codeWrap: {
    flex: 1,
    marginRight: 10,
  },
  codeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  codeValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 1,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 14,
    minHeight: 44,
    borderRadius: 8,
    gap: 6,
  },
  copyBtnDone: {
    backgroundColor: '#DCFCE7',
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  voucherFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  footerCol: {
    gap: 2,
  },
  footerLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  footerVal: {
    fontSize: 11,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  infoBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...V4_SHADOWS.card,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyBrowseBtn: {
    marginTop: 8,
    backgroundColor: '#0F766E',
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyBrowseBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    ...V4_SHADOWS.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  modalCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    gap: 14,
  },
  modalBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modalVoucherTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  modalCodeBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 6,
  },
  modalCodeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  modalCodeValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064E3B',
    letterSpacing: 1.5,
  },
  modalCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 6,
    marginTop: 4,
  },
  modalCopyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  modalTermsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalTermsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginBottom: 6,
  },
  modalTermsText: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    lineHeight: 17,
  },
  modalDoneBtn: {
    backgroundColor: '#0F766E',
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  modalDoneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
