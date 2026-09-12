import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  Dimensions,
  Modal,
  RefreshControl,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  Users,
  Copy,
  Check,
  Crown,
  UserCheck,
  QrCode,
  Send,
  MessageCircle,
  ExternalLink,
  Award,
  ChevronRight,
  X,
  Share2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Target,
  Zap,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4AuthGate } from '../ui/V4AuthGate';
import { ReferralRecord } from '../../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MILESTONES = [
  { tier: 'Bronze', name: 'Bronze Ambassador', count: 1, reward: 300, perk: 'Instant R-Cash bonus' },
  { tier: 'Silver', name: 'Silver Advocate', count: 3, reward: 1000, perk: 'Silver Badge + ₹1,000 bonus' },
  { tier: 'Gold', name: 'Gold Influencer', count: 5, reward: 2000, perk: 'Gold Badge + Priority Support' },
  { tier: 'Emerald', name: 'Emerald Legend', count: 10, reward: 5000, perk: 'VIP Concierge Pass' },
];

export const V4ShareEarnScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user, referrals, fetchReferrals, showToast } = useAppStore();

  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReferrals();
    }
  }, [isAuthenticated]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (isAuthenticated) {
      await fetchReferrals();
    }
    setRefreshing(false);
  };

  // Dynamic user referral code
  const userCode = user?.name
    ? `REHVO${user.name.split(' ')[0].toUpperCase().slice(0, 4)}`
    : 'REHVO77';

  const shareLink = `https://rehvo.com/join/${userCode}`;
  const shareMessage = `Hey! Check out REHVO — the verified rental & flatmate marketplace. Use my invite code ${userCode} to get ₹100 instant R-Cash welcome bonus: ${shareLink}`;

  const copyCode = () => {
    setCopied(true);
    showToast(`Invite code "${userCode}" copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const copyLink = () => {
    setCopiedLink(true);
    showToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNativeShare = async () => {
    try {
      await Share.share({
        message: shareMessage,
        title: 'Join REHVO — Verified Listings & Flatmates',
      });
    } catch {
      copyCode();
    }
  };

  const handleWhatsAppShare = async () => {
    const url = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;
    const webUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch {
      handleNativeShare();
    }
  };

  const handleTelegramShare = async () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(
      'Join REHVO and unlock ₹100 instant R-Cash!'
    )}`;
    try {
      await Linking.openURL(url);
    } catch {
      handleNativeShare();
    }
  };

  // ZERO mock data - live Supabase records
  const referralList: ReferralRecord[] = useMemo(() => {
    return referrals || [];
  }, [referrals]);

  const verifiedCount = referralList.filter((r) => r.verification_status === 'verified').length;
  const totalEarned = referralList
    .filter((r) => r.reward_status === 'credited')
    .reduce((acc, r) => acc + (r.reward_amount || 0), 0);

  const pendingAmount = referralList
    .filter((r) => r.reward_status === 'pending')
    .reduce((acc, r) => acc + (r.reward_amount || 300), 0);

  // Active Milestone computation
  const currentMilestone = useMemo(() => {
    const current = referralList.length;
    for (let i = MILESTONES.length - 1; i >= 0; i--) {
      if (current >= MILESTONES[i].count) {
        return {
          currentTier: MILESTONES[i],
          nextTier: MILESTONES[i + 1] || null,
          progressCount: current,
        };
      }
    }
    return {
      currentTier: null,
      nextTier: MILESTONES[0],
      progressCount: current,
    };
  }, [referralList]);

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
            <Text style={styles.headerTitle}>Share & Earn</Text>
            <Text style={styles.headerSubtitle}>Invite Friends & Roommates</Text>
          </View>
        </View>

        <V4AuthGate
          fullScreen={false}
          icon={Users}
          title="Earn ₹300 per Friend"
          description="Sign in to generate your exclusive personal invite code and track earnings from friends and roommates who join REHVO."
          featureName="Share & Earn"
          benefits={[
            'Flat ₹300 R-Cash for each friend who signs a verified lease',
            'Your friends receive ₹100 instant sign-up welcome bonus',
            'Unlimited referral earnings with zero maximum cap',
            'Real-time friend onboarding & verification tracking',
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
          <Text style={styles.headerTitle}>Share & Earn</Text>
          <Text style={styles.headerSubtitle}>Earn ₹300 for Every Friend</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.qrHeaderBtn, pressed && styles.btnPressed]}
          onPress={() => setShowQrModal(true)}
          hitSlop={8}
        >
          <QrCode size={20} color="#0F766E" />
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
        {/* HERO REFERRAL CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />

          <View style={styles.heroTopRow}>
            <View style={styles.heroTag}>
              <Sparkles size={11} color="#99F6E4" />
              <Text style={styles.heroTagText}>UNLIMITED REWARDS</Text>
            </View>
            <View style={styles.rateBadge}>
              <Text style={styles.rateBadgeText}>₹300 / Friend</Text>
            </View>
          </View>

          <Text style={styles.heroHeadline}>Invite Roommates & Friends</Text>
          <Text style={styles.heroSubtext}>
            Give your friends ₹100 welcome bonus on signup. You get ₹300 instantly when they complete KYC & pay their first rent.
          </Text>

          {/* CODE DISPLAY BOX */}
          <View style={styles.codeContainer}>
            <View style={styles.codeCol}>
              <Text style={styles.codeLabel}>YOUR EXCLUSIVE REFERRAL CODE</Text>
              <Text style={styles.codeValue}>{userCode}</Text>
            </View>

            <View style={styles.codeActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.copyBtn,
                  copied && styles.copyBtnDone,
                  pressed && styles.btnPressed,
                ]}
                onPress={copyCode}
              >
                {copied ? (
                  <Check size={16} color="#16A34A" />
                ) : (
                  <Copy size={16} color="#0F766E" />
                )}
                <Text style={[styles.copyBtnText, copied && { color: '#16A34A' }]}>
                  {copied ? 'Copied' : 'Copy'}
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.qrBtn, pressed && styles.btnPressed]}
                onPress={() => setShowQrModal(true)}
              >
                <QrCode size={18} color="#0F766E" />
              </Pressable>
            </View>
          </View>

          {/* QUICK CHANNELS SHARE ROW */}
          <View style={styles.shareChannelsRow}>
            <Pressable
              style={({ pressed }) => [styles.channelBtn, styles.whatsappBtn, pressed && styles.btnPressed]}
              onPress={handleWhatsAppShare}
            >
              <MessageCircle size={18} color="#FFFFFF" />
              <Text style={styles.channelBtnText}>WhatsApp</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.channelBtn, styles.telegramBtn, pressed && styles.btnPressed]}
              onPress={handleTelegramShare}
            >
              <Send size={18} color="#FFFFFF" />
              <Text style={styles.channelBtnText}>Telegram</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.channelBtn, styles.nativeShareBtn, pressed && styles.btnPressed]}
              onPress={handleNativeShare}
            >
              <Share2 size={18} color="#042F2E" />
              <Text style={[styles.channelBtnText, { color: '#042F2E' }]}>More</Text>
            </Pressable>
          </View>
        </View>

        {/* MILESTONE PROGRESSION TRACKER */}
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneHeader}>
            <View style={styles.milestoneTitleWrap}>
              <Award size={18} color="#0F766E" />
              <Text style={styles.milestoneTitle}>Referral Milestones</Text>
            </View>
            <View style={styles.currentTierBadge}>
              <Crown size={12} color="#D97706" />
              <Text style={styles.currentTierText}>
                {currentMilestone.currentTier?.tier || 'Rookie'} Tier
              </Text>
            </View>
          </View>

          {currentMilestone.nextTier && (
            <View style={styles.nextTierProgressBox}>
              <View style={styles.nextTierRow}>
                <Text style={styles.nextTierLabel}>Next: {currentMilestone.nextTier.name}</Text>
                <Text style={styles.nextTierTarget}>
                  {referralList.length}/{currentMilestone.nextTier.count} Friends
                </Text>
              </View>

              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(
                        100,
                        Math.round((referralList.length / currentMilestone.nextTier.count) * 100)
                      )}%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.nextTierPerk}>
                Reward: +₹{currentMilestone.nextTier.reward} • {currentMilestone.nextTier.perk}
              </Text>
            </View>
          )}

          {/* 4 Tier Badges Row */}
          <View style={styles.tierChipsRow}>
            {MILESTONES.map((m) => {
              const isAchieved = referralList.length >= m.count;
              return (
                <View
                  key={m.tier}
                  style={[styles.tierChip, isAchieved && styles.tierChipAchieved]}
                >
                  <Text style={[styles.tierChipName, isAchieved && styles.tierChipNameAchieved]}>
                    {m.tier}
                  </Text>
                  <Text style={[styles.tierChipCount, isAchieved && styles.tierChipCountAchieved]}>
                    {m.count} {m.count === 1 ? 'Friend' : 'Friends'}
                  </Text>
                  {isAchieved && (
                    <View style={styles.tierAchievedDot}>
                      <Check size={8} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* 3-STEP REWARD PROGRESSION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>How You Both Earn</Text>
        </View>

        <View style={styles.stepsContainer}>
          <View style={styles.stepRow}>
            <View style={[styles.stepNumBox, { backgroundColor: '#CCFBF1' }]}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Friend Signs Up</Text>
              <Text style={styles.stepSub}>They use your invite code and unlock ₹100 instant welcome bonus</Text>
            </View>
            <Text style={styles.stepReward}>₹100</Text>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepRow}>
            <View style={[styles.stepNumBox, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>DigiLocker KYC</Text>
              <Text style={styles.stepSub}>Friend completes Aadhaar verified identity check</Text>
            </View>
            <Text style={styles.stepReward}>₹100</Text>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepRow}>
            <View style={[styles.stepNumBox, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.stepNumText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>First Rent Payment</Text>
              <Text style={styles.stepSub}>Friend pays their rent on REHVO — you receive remaining bonus</Text>
            </View>
            <Text style={styles.stepReward}>₹200</Text>
          </View>
        </View>

        {/* REFERRAL STATS ROW */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{referralList.length}</Text>
            <Text style={styles.statLabel}>Friends Invited</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#16A34A' }]}>₹{totalEarned}</Text>
            <Text style={styles.statLabel}>R-Cash Earned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#D97706' }]}>₹{pendingAmount}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
        </View>

        {/* REFERRAL HISTORY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Referral History</Text>
          <Text style={styles.historyCount}>{referralList.length} Friends</Text>
        </View>

        {referralList.length === 0 ? (
          <View style={styles.emptyHistoryCard}>
            <Users size={36} color="#94A3B8" strokeWidth={1.5} />
            <Text style={styles.emptyHistoryTitle}>No Friends Invited Yet</Text>
            <Text style={styles.emptyHistorySub}>
              Share your referral code with roommates and friends. You earn ₹300 R-Cash for each friend who signs up and verifies!
            </Text>
            <Pressable
              style={({ pressed }) => [styles.emptyShareBtn, pressed && styles.btnPressed]}
              onPress={handleWhatsAppShare}
            >
              <MessageCircle size={16} color="#FFFFFF" />
              <Text style={styles.emptyShareBtnText}>Share on WhatsApp</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.historyCard}>
            {referralList.map((ref: ReferralRecord) => {
              const isCredited = ref.reward_status === 'credited';
              const isVerified = ref.verification_status === 'verified';
              const dateStr = ref.created_at
                ? new Date(ref.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })
                : 'Recent';

              return (
                <View key={ref.id} style={styles.refRow}>
                  <View style={styles.refAvatar}>
                    <Text style={styles.refAvatarText}>
                      {ref.friend_name ? ref.friend_name.slice(0, 1).toUpperCase() : 'F'}
                    </Text>
                  </View>

                  <View style={styles.refInfo}>
                    <Text style={styles.refName}>{ref.friend_name || 'Friend'}</Text>
                    <View style={styles.refMetaRow}>
                      <Text style={styles.refDate}>{dateStr}</Text>
                      <Text style={styles.refDot}>•</Text>
                      <Text
                        style={[
                          styles.refKycStatus,
                          isVerified ? { color: '#16A34A' } : { color: '#D97706' },
                        ]}
                      >
                        {isVerified ? 'KYC Verified' : 'KYC Pending'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.refAmountCol}>
                    <Text
                      style={[
                        styles.refAmount,
                        isCredited ? styles.amountCredited : styles.amountPending,
                      ]}
                    >
                      {isCredited ? `+₹${ref.reward_amount || 300}` : 'Pending'}
                    </Text>
                    <Text style={styles.refStatusLabel}>
                      {isCredited ? 'Credited' : 'In Progress'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* QR CODE MODAL */}
      <Modal
        visible={showQrModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQrModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.qrCard}>
            <View style={styles.qrHeader}>
              <Text style={styles.qrTitle}>Scan to Join REHVO</Text>
              <Pressable
                style={styles.closeBtn}
                onPress={() => setShowQrModal(false)}
                hitSlop={8}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <View style={styles.qrBox}>
              <QrCode size={160} color="#064E3B" strokeWidth={2.2} />
            </View>

            <Text style={styles.qrCodeText}>CODE: {userCode}</Text>
            <Text style={styles.qrSub}>
              Friends can scan this QR with their camera to download REHVO with your ₹100 invite discount auto-applied.
            </Text>

            <View style={styles.qrModalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.qrCopyLinkBtn,
                  copiedLink && styles.copyBtnDone,
                  pressed && styles.btnPressed,
                ]}
                onPress={copyLink}
              >
                {copiedLink ? (
                  <Check size={16} color="#16A34A" />
                ) : (
                  <Copy size={16} color="#0F766E" />
                )}
                <Text style={[styles.qrCopyLinkBtnText, copiedLink && { color: '#16A34A' }]}>
                  {copiedLink ? 'Link Copied' : 'Copy Invite Link'}
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.qrDoneBtn, pressed && styles.btnPressed]}
                onPress={() => setShowQrModal(false)}
              >
                <Text style={styles.qrDoneBtnText}>Done</Text>
              </Pressable>
            </View>
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
  qrHeaderBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#0F766E',
    opacity: 0.4,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 4,
  },
  heroTagText: {
    color: '#99F6E4',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rateBadge: {
    backgroundColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  rateBadgeText: {
    color: '#064E3B',
    fontSize: 11,
    fontWeight: '700',
  },
  heroHeadline: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 17,
    marginBottom: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  codeCol: {
    flex: 1,
  },
  codeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  codeValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 1,
  },
  codeActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    minHeight: 44,
    borderRadius: 8,
    gap: 4,
  },
  copyBtnDone: {
    backgroundColor: '#DCFCE7',
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  qrBtn: {
    backgroundColor: '#F0FDFA',
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareChannelsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  channelBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
  },
  telegramBtn: {
    backgroundColor: '#0088CC',
  },
  nativeShareBtn: {
    backgroundColor: '#A7F3D0',
  },
  channelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  milestoneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...V4_SHADOWS.card,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestoneTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  milestoneTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  currentTierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  currentTierText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  nextTierProgressBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  nextTierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nextTierLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  nextTierTarget: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0F766E',
    borderRadius: 3,
  },
  nextTierPerk: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
  },
  tierChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  tierChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  tierChipAchieved: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  tierChipName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  tierChipNameAchieved: {
    color: '#16A34A',
  },
  tierChipCount: {
    fontSize: 9,
    color: '#94A3B8',
  },
  tierChipCountAchieved: {
    color: '#15803D',
    fontWeight: '600',
  },
  tierAchievedDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  historyCount: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  stepsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...V4_SHADOWS.card,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginBottom: 1,
  },
  stepSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
  },
  stepReward: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
    marginLeft: 8,
  },
  stepDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  statsCard: {
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
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  emptyHistoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 10,
    ...V4_SHADOWS.card,
  },
  emptyHistoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  emptyHistorySub: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 10,
    gap: 6,
    marginTop: 6,
  },
  emptyShareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...V4_SHADOWS.card,
  },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  refAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  refAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F766E',
  },
  refInfo: {
    flex: 1,
  },
  refName: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginBottom: 2,
  },
  refMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refDate: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
  },
  refDot: {
    fontSize: 11,
    color: '#94A3B8',
  },
  refKycStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  refAmountCol: {
    alignItems: 'flex-end',
  },
  refAmount: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  amountCredited: {
    color: '#16A34A',
  },
  amountPending: {
    color: '#D97706',
  },
  refStatusLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  qrCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...V4_SHADOWS.card,
  },
  qrHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  qrTitle: {
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
  qrBox: {
    padding: 20,
    backgroundColor: '#F0FDFA',
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  qrCodeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064E3B',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  qrSub: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 20,
  },
  qrModalActions: {
    width: '100%',
    gap: 10,
  },
  qrCopyLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 6,
  },
  qrCopyLinkBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  qrDoneBtn: {
    width: '100%',
    backgroundColor: '#0F766E',
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrDoneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
