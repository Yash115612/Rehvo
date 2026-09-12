import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Dimensions,
  Image,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  Gift,
  Ticket,
  Copy,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
  Zap,
  Tag,
  Clock,
  ExternalLink,
  History,
  RotateCw,
  Award,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { RewardCampaignRecord, ScratchCardRecord } from '../../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CategoryFilter =
  | 'all'
  | 'food'
  | 'cleaning'
  | 'shopping'
  | 'furniture'
  | 'packers'
  | 'travel'
  | 'exclusive';

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Rewards' },
  { id: 'food', label: 'Food & Dining' },
  { id: 'cleaning', label: 'Home Services' },
  { id: 'shopping', label: 'Groceries' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'packers', label: 'Movers & Packers' },
  { id: 'travel', label: 'Outstation Travel' },
  { id: 'exclusive', label: 'REHVO Exclusive' },
];

export const V4RewardsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    isAuthenticated,
    user,
    wallet,
    rewardCampaigns,
    myRedemptions,
    scratchCards,
    fetchRewardCampaigns,
    fetchMyRedemptions,
    fetchScratchCards,
    revealScratchCard,
    spinRewardWheel,
    fetchWallet,
    redeemRewardCampaign,
    showToast,
  } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<RewardCampaignRecord | null>(null);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Scratch Card Modal State
  const [activeScratchCard, setActiveScratchCard] = useState<ScratchCardRecord | null>(null);
  const [isScratchedLocal, setIsScratchedLocal] = useState(false);
  const [revealedAmount, setRevealedAmount] = useState<number>(0);
  const [isRevealing, setIsRevealing] = useState(false);

  // Wheel Spin State
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelWonPrize, setWheelWonPrize] = useState<string | null>(null);
  const [wheelModalVisible, setWheelModalVisible] = useState(false);
  const spinAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    fetchRewardCampaigns();
    if (isAuthenticated) {
      fetchWallet();
      fetchMyRedemptions();
      fetchScratchCards();
    }
  }, [isAuthenticated]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.allSettled([
      fetchRewardCampaigns(),
      isAuthenticated ? fetchWallet() : Promise.resolve(),
      isAuthenticated ? fetchMyRedemptions() : Promise.resolve(),
      isAuthenticated ? fetchScratchCards() : Promise.resolve(),
    ]);
    setRefreshing(false);
  };

  const balance = wallet?.balance ?? user?.walletBalance ?? 0;

  const filteredCampaigns = useMemo(() => {
    const list = rewardCampaigns || [];
    if (selectedCategory === 'all') return list;
    return list.filter((c) => c.category === selectedCategory);
  }, [rewardCampaigns, selectedCategory]);

  const handleOpenRedeemModal = (campaign: RewardCampaignRecord) => {
    if (!isAuthenticated) {
      showToast('Sign in to claim brand vouchers', 'info');
      router.push('/(renter)/login' as any);
      return;
    }
    const existing = (myRedemptions || []).find((r) => r.campaign_id === campaign.id);
    if (existing) {
      setRedeemedCode(existing.promo_code);
    } else {
      setRedeemedCode(null);
    }
    setSelectedCampaign(campaign);
    setCopied(false);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedCampaign) return;

    if (balance < selectedCampaign.required_points) {
      showToast(`You need ${selectedCampaign.required_points - balance} more R-Cash`, 'error');
      return;
    }

    setIsRedeeming(true);
    try {
      const res = await redeemRewardCampaign(selectedCampaign.id);
      if (res.success && res.promoCode) {
        setRedeemedCode(res.promoCode);
      }
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleCopyCode = (code: string) => {
    setCopied(true);
    showToast(`Code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  // Scratch Action
  const handleOpenScratchCard = (card: ScratchCardRecord) => {
    setActiveScratchCard(card);
    setIsScratchedLocal(card.is_scratched);
    setRevealedAmount(card.actual_reward);
  };

  const handleScratch = async () => {
    if (!activeScratchCard || isScratchedLocal || isRevealing) return;
    setIsRevealing(true);
    const res = await revealScratchCard(activeScratchCard.id);
    setIsRevealing(false);
    if (res.success) {
      setIsScratchedLocal(true);
      setRevealedAmount(res.rewardAmount);
    }
  };

  // Spin Wheel Action
  const handleSpinWheel = () => {
    if (wheelSpinning) return;
    if (!isAuthenticated) {
      showToast('Sign in to spin the wheel', 'info');
      router.push('/(renter)/login' as any);
      return;
    }

    setWheelSpinning(true);
    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(async () => {
      const res = await spinRewardWheel();
      setWheelSpinning(false);
      if (res.success) {
        setWheelWonPrize(res.prize);
        setWheelModalVisible(true);
      }
    });
  };

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1440deg'],
  });

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
          <Text style={styles.headerTitle}>Rewards Center</Text>
          <Text style={styles.headerSubtitle}>CRED-Inspired Brand Perks</Text>
        </View>

        <Pressable
          style={styles.historyBtn}
          onPress={() => router.push('/(renter)/reward-history' as any)}
          hitSlop={8}
        >
          <History size={16} color="#0F766E" />
          <Text style={styles.historyBtnText}>My Vouchers</Text>
        </Pressable>
      </View>

      {/* 2. SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
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
        {/* BALANCE BANNER */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>YOUR R-CASH BALANCE</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceRupee}>₹</Text>
              <Text style={styles.balanceVal}>{balance.toLocaleString('en-IN')}</Text>
            </View>
            <Text style={styles.balanceSub}>1 R-Cash = ₹1 Voucher Value</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.walletBtn, pressed && styles.btnPressed]}
            onPress={() => router.push('/(renter)/wallet' as any)}
          >
            <Text style={styles.walletBtnText}>Wallet &rarr;</Text>
          </Pressable>
        </View>

        {/* SECTION: SCRATCH CARDS SHELF */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color="#0F766E" strokeWidth={2.4} />
            <Text style={styles.sectionTitle}>Mystery Scratch Cards</Text>
          </View>
          <Text style={styles.sectionBadge}>REVEAL CASHBACK</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scratchShelf}
        >
          {scratchCards.length === 0 ? (
            <View style={styles.scratchEmptyCard}>
              <Gift size={24} color="#0F766E" />
              <View>
                <Text style={styles.scratchEmptyTitle}>No Scratch Cards Yet</Text>
                <Text style={styles.scratchEmptySub}>Pay your monthly rent to unlock mystery cashback cards up to ₹500.</Text>
              </View>
            </View>
          ) : (
            scratchCards.map((card) => (
              <Pressable
                key={card.id}
                style={[styles.scratchItemCard, card.is_scratched && styles.scratchItemCardScratched]}
                onPress={() => handleOpenScratchCard(card)}
              >
                <View style={styles.scratchBadgeRow}>
                  <Sparkles size={12} color={card.is_scratched ? '#0F766E' : '#F59E0B'} />
                  <Text style={styles.scratchItemBadge}>
                    {card.is_scratched ? 'CLAIMED' : 'UNSCRATCHED'}
                  </Text>
                </View>
                <Text style={styles.scratchItemTitle}>{card.title}</Text>
                <View style={styles.scratchRewardBox}>
                  {card.is_scratched ? (
                    <Text style={styles.scratchItemReward}>+₹{card.actual_reward}</Text>
                  ) : (
                    <Text style={styles.scratchItemHidden}>TAP TO SCRATCH</Text>
                  )}
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>

        {/* SECTION: DAILY REWARD WHEEL */}
        <View style={styles.wheelCard}>
          <View style={styles.wheelLeftInfo}>
            <View style={styles.wheelBadgePill}>
              <Zap size={11} color="#99F6E4" />
              <Text style={styles.wheelBadgeText}>DAILY LUCKY SPIN</Text>
            </View>
            <Text style={styles.wheelTitle}>Spin & Win Free Perks</Text>
            <Text style={styles.wheelSub}>Win instant R-Cash bonuses, deep cleaning coupons & rent discounts.</Text>
            <Pressable
              style={({ pressed }) => [styles.spinBtn, wheelSpinning && { opacity: 0.7 }, pressed && styles.btnPressed]}
              onPress={handleSpinWheel}
              disabled={wheelSpinning}
            >
              <RotateCw size={14} color="#042F2E" strokeWidth={2.4} />
              <Text style={styles.spinBtnText}>{wheelSpinning ? 'Spinning...' : 'Spin the Wheel'}</Text>
            </Pressable>
          </View>

          <View style={styles.wheelRightGraphic}>
            <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
              <View style={styles.wheelVisualCircle}>
                <View style={[styles.wheelSegment, { transform: [{ rotate: '0deg' }], backgroundColor: '#0F766E' }]} />
                <View style={[styles.wheelSegment, { transform: [{ rotate: '60deg' }], backgroundColor: '#047857' }]} />
                <View style={[styles.wheelSegment, { transform: [{ rotate: '120deg' }], backgroundColor: '#065F46' }]} />
                <View style={[styles.wheelSegment, { transform: [{ rotate: '180deg' }], backgroundColor: '#0F766E' }]} />
                <View style={[styles.wheelSegment, { transform: [{ rotate: '240deg' }], backgroundColor: '#047857' }]} />
                <View style={[styles.wheelSegment, { transform: [{ rotate: '300deg' }], backgroundColor: '#065F46' }]} />
                <View style={styles.wheelCenterPin}>
                  <Sparkles size={16} color="#F59E0B" />
                </View>
              </View>
            </Animated.View>
          </View>
        </View>

        {/* SECTION: CATEGORY FILTER CHIPS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Brand Offers & Vouchers</Text>
          <Text style={styles.sectionBadge}>{filteredCampaigns.length} OFFERS</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* OFFERS GRID */}
        <View style={styles.campaignsGrid}>
          {filteredCampaigns.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Tag size={32} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Offers Found</Text>
              <Text style={styles.emptySub}>Check back soon for new partner brand vouchers in this category.</Text>
            </View>
          ) : (
            filteredCampaigns.map((camp) => {
              const isClaimed = (myRedemptions || []).some((r) => r.campaign_id === camp.id);
              const canAfford = balance >= camp.required_points;

              return (
                <View key={camp.id} style={styles.campaignCard}>
                  <Image source={{ uri: camp.image_url }} style={styles.campaignImage} />
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{camp.discount_badge}</Text>
                  </View>

                  <View style={styles.campaignBody}>
                    <View style={styles.brandRow}>
                      <Text style={styles.brandName}>{camp.brand}</Text>
                      <View style={styles.pointsBadge}>
                        <Sparkles size={11} color="#0F766E" strokeWidth={2.4} />
                        <Text style={styles.pointsBadgeText}>{camp.required_points} R-Cash</Text>
                      </View>
                    </View>

                    <Text style={styles.campaignTitle} numberOfLines={2}>{camp.title}</Text>
                    <Text style={styles.campaignDesc} numberOfLines={2}>{camp.description}</Text>

                    <Pressable
                      style={({ pressed }) => [
                        styles.redeemBtn,
                        isClaimed ? styles.redeemBtnClaimed : canAfford ? styles.redeemBtnActive : styles.redeemBtnDisabled,
                        pressed && styles.btnPressed,
                      ]}
                      onPress={() => handleOpenRedeemModal(camp)}
                    >
                      <Ticket size={14} color={isClaimed || canAfford ? '#FFFFFF' : '#94A3B8'} strokeWidth={2.2} />
                      <Text style={[
                        styles.redeemBtnText,
                        isClaimed || canAfford ? { color: '#FFFFFF' } : { color: '#94A3B8' },
                      ]}>
                        {isClaimed ? 'View Code' : canAfford ? 'Redeem Voucher' : `Need ${camp.required_points - balance} R-Cash`}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* =====================================================================
          INTERACTIVE SCRATCH CARD MODAL
         ===================================================================== */}
      <Modal
        visible={!!activeScratchCard}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveScratchCard(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.scratchModalCard}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Mystery Scratch Card</Text>
                <Text style={styles.modalSub}>Guaranteed R-Cash rent cashback</Text>
              </View>
              <Pressable
                style={styles.closeBtnCircle}
                onPress={() => setActiveScratchCard(null)}
              >
                <X size={18} color="#0F172A" />
              </Pressable>
            </View>

            <View style={styles.scratchCanvasBox}>
              {isScratchedLocal ? (
                <View style={styles.scratchedRewardContent}>
                  <Sparkles size={48} color="#10B981" />
                  <Text style={styles.scratchedCongrats}>Congratulations!</Text>
                  <Text style={styles.scratchedAmount}>₹{revealedAmount}</Text>
                  <Text style={styles.scratchedSub}>Credited directly to your R-Cash Wallet balance</Text>
                </View>
              ) : (
                <Pressable
                  style={styles.scratchCover}
                  onPress={handleScratch}
                  disabled={isRevealing}
                >
                  <Gift size={42} color="#064E3B" />
                  <Text style={styles.scratchTapText}>
                    {isRevealing ? 'Revealing...' : 'TAP TO REVEAL REWARD'}
                  </Text>
                  <Text style={styles.scratchRangeText}>Win ₹25 to ₹500 instant cashback</Text>
                </Pressable>
              )}
            </View>

            <View style={{ padding: 16 }}>
              <V4Button
                title={isScratchedLocal ? 'Awesome, Done!' : 'Scratch Card'}
                variant="primary"
                onPress={() => {
                  if (isScratchedLocal) {
                    setActiveScratchCard(null);
                  } else {
                    handleScratch();
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          LUCKY WHEEL WON MODAL
         ===================================================================== */}
      <Modal
        visible={wheelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWheelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.scratchModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>🎉 Lucky Wheel Winner!</Text>
              <Pressable
                style={styles.closeBtnCircle}
                onPress={() => setWheelModalVisible(false)}
              >
                <X size={18} color="#0F172A" />
              </Pressable>
            </View>

            <View style={[styles.scratchCanvasBox, { backgroundColor: '#F0FDFA' }]}>
              <Award size={48} color="#0F766E" />
              <Text style={styles.scratchedCongrats}>You Won!</Text>
              <Text style={[styles.scratchedAmount, { fontSize: 24, textAlign: 'center' }]}>
                {wheelWonPrize}
              </Text>
              <Text style={styles.scratchedSub}>Added to your active REHVO account perks</Text>
            </View>

            <View style={{ padding: 16 }}>
              <V4Button
                title="Claim Perk"
                variant="primary"
                onPress={() => setWheelModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          REDEEM / PROMO CODE MODAL
         ===================================================================== */}
      <Modal
        visible={!!selectedCampaign}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCampaign(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>
                  {redeemedCode ? 'Your Promo Voucher' : 'Redeem Offer'}
                </Text>
                <Text style={styles.modalSub}>{selectedCampaign?.brand}</Text>
              </View>
              <Pressable
                style={styles.closeBtnCircle}
                onPress={() => setSelectedCampaign(null)}
              >
                <X size={18} color="#0F172A" />
              </Pressable>
            </View>

            {selectedCampaign && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14 }}>
                <View style={styles.modalHeroBanner}>
                  <Text style={styles.modalDiscount}>{selectedCampaign.discount_badge}</Text>
                  <Text style={styles.modalCampTitle}>{selectedCampaign.title}</Text>
                </View>

                {redeemedCode ? (
                  <View style={styles.codeRevealBox}>
                    <Text style={styles.codeRevealLabel}>EXCLUSIVE PROMO CODE</Text>
                    <View style={styles.codeRow}>
                      <Text style={styles.codeText}>{redeemedCode}</Text>
                      <Pressable
                        style={styles.copyCodeBtn}
                        onPress={() => handleCopyCode(redeemedCode)}
                      >
                        {copied ? <Check size={16} color="#16A34A" /> : <Copy size={16} color="#0F766E" />}
                        <Text style={[styles.copyCodeText, copied && { color: '#16A34A' }]}>
                          {copied ? 'Copied' : 'Copy'}
                        </Text>
                      </Pressable>
                    </View>
                    <Text style={styles.codeValidity}>
                      Valid for 30 days across all official {selectedCampaign.brand} channels.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.costBox}>
                    <View style={styles.costRow}>
                      <Text style={styles.costLabel}>Required R-Cash</Text>
                      <Text style={styles.costVal}>{selectedCampaign.required_points} Points</Text>
                    </View>
                    <View style={styles.costRow}>
                      <Text style={styles.costLabel}>Your Balance</Text>
                      <Text style={styles.costVal}>₹{balance} Available</Text>
                    </View>
                  </View>
                )}

                <View style={styles.termsBox}>
                  <Text style={styles.termsTitle}>Terms & Conditions</Text>
                  <Text style={styles.termsText}>{selectedCampaign.terms}</Text>
                </View>

                {!redeemedCode && (
                  <V4Button
                    title={isRedeeming ? 'Unlocking Promo Code...' : `Confirm Redeem (${selectedCampaign.required_points} R-Cash)`}
                    variant="primary"
                    loading={isRedeeming}
                    onPress={handleConfirmRedeem}
                  />
                )}
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
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    minHeight: 44,
  },
  historyBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },

  // BALANCE BANNER
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    borderRadius: 20,
    padding: 18,
    ...V4_SHADOWS.card,
  },
  balanceInfo: {
    gap: 2,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#99F6E4',
    letterSpacing: 0.8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  balanceRupee: {
    fontSize: 20,
    fontWeight: '700',
    color: '#CCFBF1',
    marginRight: 2,
  },
  balanceVal: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  balanceSub: {
    fontSize: 11,
    color: '#CCFBF1',
    fontWeight: '600',
  },
  walletBtn: {
    backgroundColor: '#34D399',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  walletBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#042F2E',
  },

  // SECTION HEADER
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

  // SCRATCH CARDS SHELF
  scratchShelf: {
    flexDirection: 'row',
    gap: 12,
  },
  scratchEmptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    flex: 1,
  },
  scratchEmptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  scratchEmptySub: {
    fontSize: 11,
    color: '#115E59',
    marginTop: 2,
  },
  scratchItemCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 8,
    ...V4_SHADOWS.soft,
  },
  scratchItemCardScratched: {
    borderColor: '#CCFBF1',
  },
  scratchBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scratchItemBadge: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.6,
  },
  scratchItemTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    lineHeight: 15,
  },
  scratchRewardBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scratchItemReward: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F766E',
  },
  scratchItemHidden: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.5,
  },

  // LUCKY WHEEL CARD
  wheelCard: {
    flexDirection: 'row',
    backgroundColor: '#0F766E',
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    overflow: 'hidden',
    ...V4_SHADOWS.card,
  },
  wheelLeftInfo: {
    flex: 1,
    gap: 6,
  },
  wheelBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  wheelBadgeText: {
    color: '#99F6E4',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  wheelTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  wheelSub: {
    fontSize: 11,
    color: '#CCFBF1',
    lineHeight: 15,
  },
  spinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#34D399',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
    minHeight: 44,
  },
  spinBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#042F2E',
  },
  wheelRightGraphic: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  wheelVisualCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#34D399',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelSegment: {
    position: 'absolute',
    width: 90,
    height: 45,
    top: 0,
    transformOrigin: 'bottom center',
    opacity: 0.8,
  },
  wheelCenterPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...V4_SHADOWS.soft,
  },

  // CATEGORY CHIPS
  categoryScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 44,
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // CAMPAIGNS GRID
  campaignsGrid: {
    gap: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
  },
  campaignCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    ...V4_SHADOWS.card,
  },
  campaignImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#F1F5F9',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#064E3B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  discountBadgeText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  campaignBody: {
    padding: 16,
    gap: 8,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  pointsBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  campaignTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    lineHeight: 20,
  },
  campaignDesc: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    lineHeight: 16,
  },
  redeemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 4,
    minHeight: 44,
  },
  redeemBtnActive: {
    backgroundColor: '#0F766E',
  },
  redeemBtnClaimed: {
    backgroundColor: '#059669',
  },
  redeemBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  redeemBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
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
  scratchModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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

  // SCRATCH CANVAS
  scratchCanvasBox: {
    height: 200,
    margin: 16,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#F59E0B',
    overflow: 'hidden',
  },
  scratchCover: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scratchTapText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#78350F',
    letterSpacing: 0.8,
  },
  scratchRangeText: {
    fontSize: 11,
    color: '#92400E',
  },
  scratchedRewardContent: {
    alignItems: 'center',
    gap: 6,
  },
  scratchedCongrats: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
  scratchedAmount: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0F766E',
  },
  scratchedSub: {
    fontSize: 11.5,
    color: '#047857',
  },

  // VOUCHER MODAL
  modalHeroBanner: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  modalDiscount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F766E',
  },
  modalCampTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  codeRevealBox: {
    backgroundColor: '#064E3B',
    borderRadius: 18,
    padding: 16,
    gap: 8,
    alignItems: 'center',
  },
  codeRevealLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#99F6E4',
    letterSpacing: 0.8,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  copyCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyCodeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  codeValidity: {
    fontSize: 10.5,
    color: '#CCFBF1',
    textAlign: 'center',
  },
  costBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
  },
  costVal: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  termsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  termsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
  },
  termsText: {
    fontSize: 11,
    color: V4_COLORS.textMuted,
    lineHeight: 16,
  },
});
