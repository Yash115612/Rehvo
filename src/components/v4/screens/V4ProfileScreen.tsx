import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Dimensions,
  Platform,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  ShieldCheck,
  Wallet,
  Calendar,
  CreditCard,
  Building2,
  Bell,
  Settings,
  HelpCircle,
  Info,
  FileText,
  Lock,
  LogOut,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  Edit3,
  Heart,
  Users,
  Eye,
  PlusCircle,
  Share2,
  Gift,
  Briefcase,
  Compass,
  X,
  Shield,
  Zap,
  Flame,
  Award,
  Check,
  Star,
  Layers,
  ArrowRight,
  Truck,
  FolderLock,
  BarChart3,
  IndianRupee,
  Camera,
  KeyRound,
  FileCheck,
  Store,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS, V4_TYPOGRAPHY } from '../../../theme/v4Theme';
import { V4SectionHeader } from '../ui/V4SectionHeader';
import { V4BrandLogo } from '../ui/V4BrandLogo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const V4ProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    currentRole,
    switchRole,
    logout,
    savedPropertyIds,
    matchedFlatmateIds,
    incomingWaves,
    myFlatmateProfile,
    wallet,
    showToast,
  } = useAppStore();

  const isHost = currentRole === 'OWNER';
  const isBroker = currentRole === 'BROKER';
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Support ticket modal state
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportCategory, setSupportCategory] = useState<'Payment' | 'Lease' | 'Visit' | 'Move-In' | 'General'>('General');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  const handleRoleSelect = async (mode: 'renter' | 'owner' | 'broker') => {
    setShowRoleModal(false);
    await switchRole(mode);
    if (mode === 'owner') {
      router.replace('/(owner)/dashboard' as any);
    } else if (mode === 'broker') {
      router.replace('/(broker)/dashboard' as any);
    } else {
      router.replace('/(renter)/home' as any);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your REHVO account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login' as any);
          },
        },
      ]
    );
  };

  const isLoggedIn = Boolean(user?.id);
  const userName = user?.name || myFlatmateProfile?.name || 'Guest User';
  const userPhone = user?.phone || (isLoggedIn ? 'Add phone number' : 'Sign in to access profile');
  const userEmail = user?.email || (isLoggedIn ? 'Add email address' : 'Verified Listing Community');
  const isKycVerified = user?.verification_status === 'VERIFIED' || user?.kyc_verified || user?.digilocker_verified;
  const availableBalance = wallet?.balance ?? user?.walletBalance ?? 0;

  // Profile completion score calculation
  const completionChecks = [
    { label: 'Full Legal Name', completed: Boolean(user?.name && user.name !== 'Guest User') },
    { label: 'Verified Contact', completed: Boolean(user?.phone || user?.email) },
    { label: 'Profile Photo', completed: Boolean(user?.avatar || user?.profile_photo || (user as any)?.avatar_url) },
    { label: 'DigiLocker KYC', completed: Boolean(isKycVerified) },
    { label: 'Occupation & City', completed: Boolean(user?.occupation || user?.city) },
  ];
  const completedChecksCount = completionChecks.filter((c) => c.completed).length;
  const profileCompletionScore = Math.round((completedChecksCount / completionChecks.length) * 100);

  const handleSubmitSupportTicket = () => {
    if (!supportSubject.trim() && !supportMessage.trim()) {
      Alert.alert('Incomplete Request', 'Please enter your message or query so our concierge can assist you.');
      return;
    }
    setIsSubmittingTicket(true);
    setTimeout(() => {
      setIsSubmittingTicket(false);
      setShowSupportModal(false);
      const ticketId = `RHV-${Math.floor(100000 + Math.random() * 900000)}`;
      setSupportSubject('');
      setSupportMessage('');
      showToast?.(`🎫 Priority Ticket ${ticketId} created! Our 24x7 team has received your request.`, 'success');
    }, 500);
  };

  const userAvatar =
    user?.avatar ||
    user?.profile_photo ||
    myFlatmateProfile?.photos?.[0] ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80';

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 90 },
        ]}
      >
        {/* =====================================================================
            1. UNIFIED HERO STAGE (EDITORIAL CELEBRATED IDENTITY STAGE)
           ===================================================================== */}
        <View
          style={[
            styles.unifiedHeroHeaderContainer,
            { paddingTop: Math.max(insets.top, 14) + 6 },
          ]}
        >
          {/* Top Brand Bar & Action Buttons */}
          <View style={styles.topHeaderRow}>
            {/* Official REHVO Brand Logo */}
            <View style={styles.logoCol}>
              <V4BrandLogo variant="horizontal" size="sm" showTagline={false} />
            </View>

            {/* Right Action Icons: Notification Bell & Settings Gear */}
            <View style={styles.topRightActions}>
              {isLoggedIn ? (
                <Pressable
                  style={styles.topHeaderIconBtn}
                  onPress={() => router.push('/(renter)/notifications' as any)}
                  accessibilityLabel="Notifications"
                >
                  <Bell size={18} color={V4_COLORS.textPrimary} strokeWidth={2.2} />
                  <View style={styles.topHeaderBadge}>
                    <Text style={styles.topHeaderBadgeText}>1</Text>
                  </View>
                </Pressable>
              ) : null}

              <Pressable
                style={styles.topHeaderIconBtn}
                onPress={() => router.push('/(renter)/settings' as any)}
                accessibilityLabel="Settings"
              >
                <Settings size={18} color={V4_COLORS.textPrimary} strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>

          {/* =====================================================================
              LOGGED IN: CENTERED EDITORIAL PROFILE IDENTITY SHOWCASE
             ===================================================================== */}
          {isLoggedIn ? (
            <View style={styles.heroCenterStage}>
              {/* Centered Avatar with luxury emerald ring & camera trigger */}
              <View style={styles.heroAvatarContainer}>
                <Image source={{ uri: userAvatar }} style={styles.heroAvatarImg} />
                <Pressable
                  style={styles.heroCameraBtn}
                  onPress={() => router.push('/(renter)/profile/edit' as any)}
                  hitSlop={8}
                >
                  <Camera size={13} color="#FFFFFF" strokeWidth={2.5} />
                </Pressable>
                {isKycVerified ? (
                  <View style={styles.heroVerifiedBadge}>
                    <Check size={11} color="#FFFFFF" strokeWidth={3.5} />
                  </View>
                ) : null}
              </View>

              {/* User Name & Verified Icon */}
              <View style={styles.heroNameRow}>
                <Text style={styles.heroUserName}>{userName}</Text>
                {isKycVerified ? (
                  <ShieldCheck size={18} color="#0F766E" strokeWidth={2.6} />
                ) : null}
              </View>

              {/* Contact line */}
              <Text style={styles.heroContactLine}>
                {userPhone}  •  {userEmail}
              </Text>

              {/* Brand Member Pill & Mode Selector Duo */}
              <View style={styles.heroActionPillsRow}>
                {/* Member Status Tag */}
                <View style={styles.heroMemberPill}>
                  <Sparkles size={12} color="#0F766E" strokeWidth={2.4} />
                  <Text style={styles.heroMemberPillText}>
                    {isHost ? 'VERIFIED OWNER' : isBroker ? 'BROKER PRO' : 'VERIFIED LISTING MEMBER'}
                  </Text>
                </View>

                {/* Mode Switcher Pill */}
                <Pressable
                  style={styles.heroModePill}
                  onPress={() => setShowRoleModal(true)}
                >
                  <View style={styles.modePulseDot} />
                  <Text style={styles.heroModePillText}>
                    {isHost ? 'Host Mode' : isBroker ? 'Broker Pro' : 'Renter Mode'}
                  </Text>
                  <ChevronDown size={11} color="#64748B" strokeWidth={2.4} />
                </Pressable>

                {/* Quick Edit Profile Button */}
                <Pressable
                  style={styles.heroEditPill}
                  onPress={() => router.push('/(renter)/profile/edit' as any)}
                >
                  <Edit3 size={12} color="#0F766E" strokeWidth={2.4} />
                  <Text style={styles.heroEditPillText}>Edit</Text>
                </Pressable>
              </View>

              {/* Tenant Trust & Reliability Index Card */}
              <View style={styles.heroTrustCard}>
                <View style={styles.heroTrustTop}>
                  <View style={styles.heroTrustLeft}>
                    <View style={styles.trustShieldBox}>
                      <ShieldCheck size={16} color="#0F766E" strokeWidth={2.4} />
                    </View>
                    <View>
                      <Text style={styles.heroTrustTitle}>
                        {isKycVerified ? '98 / 100 • A+ Tenant Score' : '75 / 100 • Tier 2'}
                      </Text>
                      <Text style={styles.heroTrustSub}>Tenant Reliability Index</Text>
                    </View>
                  </View>

                  <Pressable
                    style={styles.heroKycBtn}
                    onPress={() => router.push('/(renter)/kyc' as any)}
                  >
                    <CheckCircle2
                      size={13}
                      color={isKycVerified ? '#0F766E' : '#D97706'}
                      strokeWidth={2.4}
                    />
                    <Text
                      style={[
                        styles.heroKycBtnText,
                        !isKycVerified && { color: '#D97706' },
                      ]}
                    >
                      {isKycVerified ? 'DigiLocker KYC' : 'Complete KYC'}
                    </Text>
                    <ChevronRight size={11} color={isKycVerified ? '#0F766E' : '#D97706'} />
                  </Pressable>
                </View>

                {/* Progress bar */}
                <View style={styles.heroProgressTrack}>
                  <View style={[styles.heroProgressFill, { width: `${profileCompletionScore}%` }]} />
                </View>
                <View style={styles.heroProgressSub}>
                  <Text style={styles.heroProgressSubLeft}>
                    Profile {profileCompletionScore}% Complete
                  </Text>
                  <Text style={styles.heroProgressSubRight}>
                    {profileCompletionScore === 100
                      ? 'Instant Landlord Approval'
                      : 'Complete for priority tour access'}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            /* GUEST WELCOME STAGE */
            <View style={styles.guestHeroStage}>
              <View style={styles.guestAvatarCircle}>
                <User size={32} color="#0F766E" strokeWidth={2.2} />
              </View>
              <Text style={styles.guestHeroTitle}>Welcome to REHVO</Text>
              <Text style={styles.guestHeroSub}>
                India's 100% Verified Living Platform. Sign in to unlock verified homes, digital leases & R-Cash rewards.
              </Text>

              <View style={styles.guestBtnRow}>
                <Pressable
                  style={styles.guestPrimaryBtn}
                  onPress={() =>
                    router.push({ pathname: '/(auth)/login' as any, params: { mode: 'signin' } })
                  }
                >
                  <Text style={styles.guestPrimaryBtnText}>Sign In</Text>
                </Pressable>

                <Pressable
                  style={styles.guestSecondaryBtn}
                  onPress={() =>
                    router.push({ pathname: '/(auth)/login' as any, params: { mode: 'signup' } })
                  }
                >
                  <Text style={styles.guestSecondaryBtnText}>Create Account</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* =====================================================================
            2. CORE SHORTCUT BENTO ROW (MATCHING BENEFITS PILLS ON HOME SCREEN)
           ===================================================================== */}
        {isLoggedIn ? (
          <View style={styles.shortcutBentoRow}>
            {/* 1. Saved Homes */}
            <Pressable
              style={styles.shortcutCard}
              onPress={() => router.push('/(renter)/saved' as any)}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: '#FFE4E6' }]}>
                <Heart size={18} color="#E11D48" strokeWidth={2.4} />
              </View>
              <Text style={styles.shortcutValue}>{savedPropertyIds?.length || 0}</Text>
              <Text style={styles.shortcutLabel}>Saved</Text>
            </Pressable>

            {/* 2. Scheduled Visits */}
            <Pressable
              style={styles.shortcutCard}
              onPress={() => router.push('/(renter)/bookings' as any)}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: '#F0FDFA' }]}>
                <Calendar size={18} color="#0F766E" strokeWidth={2.4} />
              </View>
              <Text style={styles.shortcutValue}>Visits</Text>
              <Text style={styles.shortcutLabel}>Tours</Text>
            </Pressable>

            {/* 3. Digital Leases */}
            <Pressable
              style={styles.shortcutCard}
              onPress={() => router.push('/(renter)/rental-agreements' as any)}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: '#EFF6FF' }]}>
                <FileCheck size={18} color="#2563EB" strokeWidth={2.4} />
              </View>
              <Text style={styles.shortcutValue}>Leases</Text>
              <Text style={styles.shortcutLabel}>E-Sign</Text>
            </Pressable>

            {/* 4. R-Cash Wallet */}
            <Pressable
              style={styles.shortcutCard}
              onPress={() => router.push('/(renter)/wallet' as any)}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: '#DCFCE7' }]}>
                <Wallet size={18} color="#16A34A" strokeWidth={2.4} />
              </View>
              <Text style={styles.shortcutValue}>₹{availableBalance.toLocaleString('en-IN')}</Text>
              <Text style={styles.shortcutLabel}>R-Cash</Text>
            </Pressable>
          </View>
        ) : null}

        {/* =====================================================================
            3. TENANCY & LIVING SECTION
           ===================================================================== */}
        {isLoggedIn ? (
          <View style={styles.sectionContainer}>
            <V4SectionHeader
              title="Tenancy & Living"
              subtitle="Active digital leases, rent payments & move-in concierge"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/rental-agreements' as any)}
            />

            <View style={styles.brandCard}>
              {/* Digital Rental Agreements */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(renter)/rental-agreements' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDFA' }]}>
                  <FileText size={18} color="#0F766E" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>Digital Rental Agreements</Text>
                  <Text style={styles.menuSub}>
                    Legally binding e-stamped leases & digital signatures
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>

              <View style={styles.rowDivider} />

              {/* Pay Rent */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(renter)/pay-rent' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#FAF5FF' }]}>
                  <CreditCard size={18} color="#7C3AED" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.menuTitle}>Pay Rent Online</Text>
                    <View style={styles.tagPillGreen}>
                      <Text style={styles.tagPillGreenText}>1% Cashback</Text>
                    </View>
                  </View>
                  <Text style={styles.menuSub}>
                    Instant UPI & cards with 45-day interest-free credit
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>

              <View style={styles.rowDivider} />

              {/* Move-In Concierge */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(renter)/move-in' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#EFF6FF' }]}>
                  <KeyRound size={18} color="#2563EB" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>Move-In Concierge</Text>
                  <Text style={styles.menuSub}>
                    Key handover checklist, WiFi setup & inventory report
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>

              <View style={styles.rowDivider} />

              {/* Document Vault */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(renter)/document-vault' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#FFFBEB' }]}>
                  <FolderLock size={18} color="#D97706" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>Encrypted Document Vault</Text>
                  <Text style={styles.menuSub}>
                    Aadhaar, PAN, registered leases & HRA rent receipts
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>

              <View style={styles.rowDivider} />

              {/* Packers & Movers */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(renter)/movers' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDF4' }]}>
                  <Truck size={18} color="#16A34A" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>Packers & Movers</Text>
                  <Text style={styles.menuSub}>
                    Verified Porter & Agarwal relocation partners
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>

              <View style={styles.rowDivider} />

              {/* Deep Cleaning */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(renter)/cleaning' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDFA' }]}>
                  <Sparkles size={18} color="#0F766E" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>Deep Cleaning & Sanitization</Text>
                  <Text style={styles.menuSub}>
                    Mechanized move-in & deposit-guarantee sanitization
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* =====================================================================
            4. CO-LIVING & FLATMATE PERSONA
           ===================================================================== */}
        {isLoggedIn ? (
          <View style={styles.sectionContainer}>
            <V4SectionHeader
              title="Find Your Ideal Flatmate"
              subtitle="Your active roommate persona, lifestyle vibe & waves"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/flatmates' as any)}
            />

            <View style={styles.brandCard}>
              {/* Flatmate Header with Live status */}
              <View style={styles.flatmateHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.flatmateHeading}>Roommate Persona</Text>
                  <Text style={styles.flatmateSub}>
                    {myFlatmateProfile?.preferred_locations?.length
                      ? `Looking in ${myFlatmateProfile.preferred_locations.slice(0, 2).join(', ')}`
                      : user?.locality
                      ? `Looking in ${user.locality}`
                      : 'Looking in Mumbai'}{' '}
                    • ₹{((myFlatmateProfile?.budget_min || 15000) / 1000).toFixed(0)}k–₹{((myFlatmateProfile?.budget_max || 30000) / 1000).toFixed(0)}k/mo •{' '}
                    {myFlatmateProfile?.work_style || 'Hybrid WFH'}
                  </Text>
                </View>

                <View style={styles.liveTagPill}>
                  <View style={styles.liveGreenDot} />
                  <Text style={styles.liveTagText}>LIVE</Text>
                </View>
              </View>

              {/* Real-time counters */}
              <View style={styles.flatmateStatsBox}>
                <View style={styles.flatmateStatItem}>
                  <Eye size={14} color="#0F766E" />
                  <Text style={styles.flatmateStatVal}>48</Text>
                  <Text style={styles.flatmateStatLbl}>Views</Text>
                </View>

                <View style={styles.flatmateStatDivider} />

                <View style={styles.flatmateStatItem}>
                  <Heart size={14} color="#EF4444" />
                  <Text style={styles.flatmateStatVal}>{matchedFlatmateIds?.length || 0}</Text>
                  <Text style={styles.flatmateStatLbl}>Matches</Text>
                </View>

                <View style={styles.flatmateStatDivider} />

                <View style={styles.flatmateStatItem}>
                  <Flame size={14} color="#D97706" />
                  <Text style={styles.flatmateStatVal}>{incomingWaves?.length || 0}</Text>
                  <Text style={styles.flatmateStatLbl}>Waves</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.flatmateBtnRow}>
                <Pressable
                  style={styles.flatmateActionBtn}
                  onPress={() => router.push('/(renter)/flatmate/my-profile' as any)}
                >
                  <Eye size={13} color="#0F766E" strokeWidth={2.4} />
                  <Text style={styles.flatmateActionBtnText}>Preview Card</Text>
                </Pressable>

                <Pressable
                  style={styles.flatmateActionBtn}
                  onPress={() => router.push('/(renter)/flatmate/create' as any)}
                >
                  <Edit3 size={13} color="#0F766E" strokeWidth={2.4} />
                  <Text style={styles.flatmateActionBtnText}>Edit Details</Text>
                </Pressable>

                <Pressable
                  style={[styles.flatmateActionBtn, { backgroundColor: '#CCFBF1' }]}
                  onPress={() => router.push('/(renter)/flatmate/discover' as any)}
                >
                  <Flame size={13} color="#0F766E" strokeWidth={2.4} />
                  <Text style={[styles.flatmateActionBtnText, { color: '#0F766E' }]}>Swipe Deck</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}

        {/* =====================================================================
            5. WALLET, PASSES & REWARDS
           ===================================================================== */}
        {isLoggedIn ? (
          <View style={styles.sectionContainer}>
            <V4SectionHeader
              title="Benefits & Rewards"
              subtitle="Your active rewards, cashback, deposit pass & invite bonuses"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/wallet' as any)}
            />

            <View style={styles.brandCard}>
              {/* Zero Deposit Pass */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(renter)/zero-deposit' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#DCFCE7' }]}>
                  <Shield size={18} color="#16A34A" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.menuTitle}>Zero Deposit Rental Pass</Text>
                    <View style={styles.tagPillGreen}>
                      <Text style={styles.tagPillGreenText}>Pre-Approved</Text>
                    </View>
                  </View>
                  <Text style={styles.menuSub}>
                    Move in without heavy deposit lock-in • Up to ₹1.5 Lakhs limit
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>

              <View style={styles.rowDivider} />

              {/* R-Cash Wallet */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(renter)/wallet' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDFA' }]}>
                  <Wallet size={18} color="#0F766E" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>R-Cash Wallet & Cashback</Text>
                  <Text style={styles.menuSub}>
                    Redeem on rent payments, cleaning & concierge services
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>

              <View style={styles.rowDivider} />

              {/* Share & Earn */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(renter)/share-earn' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#FFFBEB' }]}>
                  <Share2 size={18} color="#D97706" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.menuTitle}>Share & Earn</Text>
                    <View style={[styles.tagPillGreen, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.tagPillGreenText, { color: '#B45309' }]}>₹500 / Ref</Text>
                    </View>
                  </View>
                  <Text style={styles.menuSub}>
                    Invite friends or colleagues & earn cash directly into wallet
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>

              <View style={styles.rowDivider} />

              {/* Partner Deals */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(renter)/rewards' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#FAF5FF' }]}>
                  <Gift size={18} color="#7C3AED" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>Partner Rewards & Vouchers</Text>
                  <Text style={styles.menuSub}>
                    Urban Company, Pepperfry, Wakefit & Cult.fit partner discounts
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* =====================================================================
            6. HOST & LANDLORD SUITE
           ===================================================================== */}
        {isLoggedIn ? (
          <View style={styles.sectionContainer}>
            <V4SectionHeader
              title="Host & Earn"
              subtitle="Direct owner tools, tenant screening CRM & rent collection"
              actionText="See All →"
              onActionPress={() => router.push('/(owner)/dashboard' as any)}
            />

            <View style={styles.brandCard}>
              {/* Owner Dashboard */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(owner)/dashboard' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDFA' }]}>
                  <Building2 size={18} color="#0F766E" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>Owner Dashboard & Portfolio</Text>
                  <Text style={styles.menuSub}>
                    Live portfolio yield, views, leads & scheduled visits
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>

              <View style={styles.rowDivider} />

              {/* Post New Property */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(renter)/listing' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDF4' }]}>
                  <PlusCircle size={18} color="#16A34A" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.menuTitle}>Post Property / Room</Text>
                    <View style={styles.tagPillGreen}>
                      <Text style={styles.tagPillGreenText}>Verified Listing</Text>
                    </View>
                  </View>
                  <Text style={styles.menuSub}>
                    List in 3 minutes with direct landlord-to-tenant connect
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>

              <View style={styles.rowDivider} />

              {/* Tenant Leads CRM */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(owner)/leads' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#FEF3C7' }]}>
                  <Users size={18} color="#D97706" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>Tenant Leads CRM</Text>
                  <Text style={styles.menuSub}>
                    Screen verified tenant profiles & approve digital leases
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>

              <View style={styles.rowDivider} />

              {/* Rent Collection */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(owner)/rent-collection' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#DCFCE7' }]}>
                  <IndianRupee size={18} color="#16A34A" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>Automated Rent Collection</Text>
                  <Text style={styles.menuSub}>
                    Bank settlements, 3-day notices & tax receipts
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>

              <View style={styles.rowDivider} />

              {/* Property Analytics */}
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push('/(owner)/analytics' as any)}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: '#F3E8FF' }]}>
                  <BarChart3 size={18} color="#9333EA" strokeWidth={2.2} />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>Property Analytics & Yield</Text>
                  <Text style={styles.menuSub}>
                    Views, saves, occupancy & locality trends
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* =====================================================================
            7. TRUST, SECURITY & SUPPORT
           ===================================================================== */}
        <View style={styles.sectionContainer}>
          <V4SectionHeader
            title="Security & Support"
            subtitle="DigiLocker verification, 24x7 concierge & legal guarantees"
          />

          <View style={styles.brandCard}>
            {/* DigiLocker Identity Verification */}
            {isLoggedIn ? (
              <>
                <Pressable
                  style={styles.menuRow}
                  onPress={() => router.push('/(renter)/kyc' as any)}
                >
                  <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDF4' }]}>
                    <ShieldCheck size={18} color="#16A34A" strokeWidth={2.2} />
                  </View>
                  <View style={styles.menuTextCol}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.menuTitle}>DigiLocker Identity Verification</Text>
                      {isKycVerified ? (
                        <View style={styles.tagPillGreen}>
                          <Text style={styles.tagPillGreenText}>Verified</Text>
                        </View>
                      ) : (
                        <View style={[styles.tagPillGreen, { backgroundColor: '#FEF3C7' }]}>
                          <Text style={[styles.tagPillGreenText, { color: '#B45309' }]}>Pending</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.menuSub}>
                      Aadhaar, PAN & police background verification
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#94A3B8" />
                </Pressable>

                <View style={styles.rowDivider} />
              </>
            ) : null}

            {/* 24x7 Support Concierge */}
            <Pressable
              style={styles.menuRow}
              onPress={() => setShowSupportModal(true)}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDFA' }]}>
                <HelpCircle size={18} color="#0F766E" strokeWidth={2.2} />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>24x7 Support Concierge</Text>
                <Text style={styles.menuSub}>
                  Priority escalation desk & ticket resolution in &lt; 15 mins
                </Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </Pressable>

            <View style={styles.rowDivider} />

            {/* About REHVO */}
            <Pressable
              style={styles.menuRow}
              onPress={() => router.push('/(renter)/about' as any)}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
                <Info size={18} color="#475569" strokeWidth={2.2} />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>About REHVO</Text>
                <Text style={styles.menuSub}>
                  India's 100% Verified Living Platform
                </Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </Pressable>

            <View style={styles.rowDivider} />

            {/* Terms & Escrow Guarantees */}
            <Pressable
              style={styles.menuRow}
              onPress={() => router.push('/(renter)/terms' as any)}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
                <FileText size={18} color="#475569" strokeWidth={2.2} />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Terms & Escrow Guarantees</Text>
                <Text style={styles.menuSub}>
                  Legal protection & verified listing rules
                </Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </Pressable>

            <View style={styles.rowDivider} />

            {/* Privacy Policy */}
            <Pressable
              style={styles.menuRow}
              onPress={() => router.push('/(renter)/privacy' as any)}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
                <Lock size={18} color="#475569" strokeWidth={2.2} />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Privacy & Data Protection</Text>
                <Text style={styles.menuSub}>
                  Encrypted tenant records & privacy guarantees
                </Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </Pressable>
          </View>
        </View>

        {/* =====================================================================
            8. SIGN OUT BUTTON (LOGGED IN ONLY)
           ===================================================================== */}
        {isLoggedIn ? (
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={17} color="#E11D48" strokeWidth={2.4} />
            <Text style={styles.logoutBtnText}>Sign Out of REHVO</Text>
          </Pressable>
        ) : null}

        {/* =====================================================================
            9. OFFICIAL BRAND FOOTER (MATCHING HOME SCREEN)
           ===================================================================== */}
        <View style={styles.brandFooter}>
          <V4BrandLogo
            variant="stacked"
            size="sm"
            showTagline={true}
            taglineText="VERIFIED LISTING • DIRECT HOMES"
            showZeroBadge={true}
          />
          <Text style={styles.versionSub}>
            REHVO V9.0 • 100% Verified Living
          </Text>
        </View>
      </ScrollView>

      {/* MULTI-ROLE EXPERIENCE SWITCHER MODAL */}
      <Modal visible={showRoleModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Switch Experience</Text>
                <Text style={styles.modalSub}>
                  Seamlessly toggle without creating multiple accounts
                </Text>
              </View>
              <Pressable
                onPress={() => setShowRoleModal(false)}
                hitSlop={8}
                style={styles.modalCloseBtn}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <View style={styles.modalOptionsList}>
              {/* Option 1: Renter */}
              <Pressable
                style={[
                  styles.switchOptionItem,
                  currentRole === 'RENTER' && styles.switchOptionItemActive,
                ]}
                onPress={() => handleRoleSelect('renter')}
              >
                <View style={[styles.switchOptionIconBox, { backgroundColor: '#ECFDF5' }]}>
                  <Compass size={22} color="#059669" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.switchOptionName}>Renter & Flatmates</Text>
                    {currentRole === 'RENTER' ? (
                      <View style={styles.activePill}>
                        <Text style={styles.activePillText}>Active</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.switchOptionDetail}>
                    Search verified listing flats, roommates, leases & pay rent
                  </Text>
                </View>
                {currentRole === 'RENTER' ? (
                  <CheckCircle2 size={18} color="#059669" />
                ) : (
                  <ChevronRight size={18} color="#CBD5E1" />
                )}
              </Pressable>

              {/* Option 2: Owner */}
              <Pressable
                style={[
                  styles.switchOptionItem,
                  currentRole === 'OWNER' && styles.switchOptionItemActive,
                ]}
                onPress={() => handleRoleSelect('owner')}
              >
                <View style={[styles.switchOptionIconBox, { backgroundColor: '#FEF3C7' }]}>
                  <Building2 size={22} color="#B45309" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.switchOptionName}>Owner & Landlord Mode</Text>
                    {currentRole === 'OWNER' ? (
                      <View style={[styles.activePill, { backgroundColor: '#FEF3C7' }]}>
                        <Text style={[styles.activePillText, { color: '#B45309' }]}>Active</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.switchOptionDetail}>
                    List properties, screen tenant leads & auto-collect rent
                  </Text>
                </View>
                {currentRole === 'OWNER' ? (
                  <CheckCircle2 size={18} color="#B45309" />
                ) : (
                  <ChevronRight size={18} color="#CBD5E1" />
                )}
              </Pressable>

              {/* Option 3: Broker */}
              <Pressable
                style={[
                  styles.switchOptionItem,
                  currentRole === 'BROKER' && styles.switchOptionItemActive,
                ]}
                onPress={() => handleRoleSelect('broker')}
              >
                <View style={[styles.switchOptionIconBox, { backgroundColor: '#EDE9FE' }]}>
                  <Briefcase size={22} color="#6D28D9" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.switchOptionName}>Broker Pro Mode</Text>
                    {currentRole === 'BROKER' ? (
                      <View style={[styles.activePill, { backgroundColor: '#EDE9FE' }]}>
                        <Text style={[styles.activePillText, { color: '#6D28D9' }]}>Active</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.switchOptionDetail}>
                    Verified agency inventory, client CRM & partner commissions
                  </Text>
                </View>
                {currentRole === 'BROKER' ? (
                  <CheckCircle2 size={18} color="#6D28D9" />
                ) : (
                  <ChevronRight size={18} color="#CBD5E1" />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 24x7 CONCIERGE SUPPORT TICKET MODAL */}
      <Modal
        visible={showSupportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSupportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.modalHeaderIconWrap}>
                  <HelpCircle size={18} color="#0F766E" />
                </View>
                <Text style={styles.modalTitle}>Priority Concierge</Text>
              </View>
              <Pressable
                onPress={() => setShowSupportModal(false)}
                hitSlop={8}
                style={styles.modalCloseBtn}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              Direct escalation desk for rent payments, lease queries, inspections, and concierge requests. Average reply time: &lt; 15 mins.
            </Text>

            {/* Category Selector */}
            <Text style={styles.modalInputLabel}>SELECT QUERY TOPIC</Text>
            <View style={styles.categoryChipsRow}>
              {(['General', 'Payment', 'Lease', 'Visit', 'Move-In'] as const).map((cat) => (
                <Pressable
                  key={cat}
                  style={[styles.categoryChip, supportCategory === cat && styles.categoryChipActive]}
                  onPress={() => setSupportCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      supportCategory === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Subject Input */}
            <Text style={styles.modalInputLabel}>SUBJECT</Text>
            <TextInput
              style={styles.modalInput}
              value={supportSubject}
              onChangeText={setSupportSubject}
              placeholder="e.g. Rent payment confirmation / WiFi setup"
              placeholderTextColor="#94A3B8"
            />

            {/* Message Input */}
            <Text style={styles.modalInputLabel}>MESSAGE / DETAILS</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              value={supportMessage}
              onChangeText={setSupportMessage}
              placeholder="Please describe how our team can help..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />

            {/* Submit Button */}
            <Pressable
              style={[styles.primaryModalBtn, isSubmittingTicket && { opacity: 0.7 }]}
              onPress={handleSubmitSupportTicket}
              disabled={isSubmittingTicket}
            >
              {isSubmittingTicket ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryModalBtnText}>Submit Priority Ticket</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  scrollContent: {
    paddingTop: 0,
    gap: 16,
  },

  /* UNIFIED HERO HEADER CONTAINER (EXACT MATCH TO HOME SCREEN) */
  unifiedHeroHeaderContainer: {
    backgroundColor: '#F6FBFA',
    paddingHorizontal: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#E2ECEF',
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  logoCol: {
    justifyContent: 'center',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topHeaderIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    position: 'relative',
    ...V4_SHADOWS.soft,
  },
  topHeaderBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  topHeaderBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  /* HERO CENTERED IDENTITY SHOWCASE */
  heroCenterStage: {
    alignItems: 'center',
    paddingTop: 4,
  },
  heroAvatarContainer: {
    width: 86,
    height: 86,
    borderRadius: 43,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarImg: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2.5,
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  heroCameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0F766E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.soft,
  },
  heroVerifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  heroUserName: {
    fontSize: 21,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  heroContactLine: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 3,
    textAlign: 'center',
  },
  heroActionPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  heroMemberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 118, 110, 0.08)',
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.16)',
  },
  heroMemberPillText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.3,
  },
  heroModePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.soft,
  },
  modePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  heroModePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  heroEditPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5.5,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.soft,
  },
  heroEditPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },

  /* TRUST & RELIABILITY INDEX CARD INSIDE HERO */
  heroTrustCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.soft,
  },
  heroTrustTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroTrustLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustShieldBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTrustTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  heroTrustSub: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#0F766E',
  },
  heroKycBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  heroKycBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  heroProgressTrack: {
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: '#0F766E',
    borderRadius: 3,
  },
  heroProgressSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  heroProgressSubLeft: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  heroProgressSubRight: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0F766E',
  },

  /* GUEST HERO STAGE */
  guestHeroStage: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  guestAvatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CCFBF1',
    marginBottom: 10,
    ...V4_SHADOWS.soft,
  },
  guestHeroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
  },
  guestHeroSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  guestBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  guestPrimaryBtn: {
    flex: 1,
    backgroundColor: '#0F766E',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.soft,
  },
  guestPrimaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13.5,
  },
  guestSecondaryBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0F766E',
    ...V4_SHADOWS.soft,
  },
  guestSecondaryBtnText: {
    color: '#0F766E',
    fontWeight: '800',
    fontSize: 13.5,
  },

  /* SHORTCUT BENTO ROW (4 PILLS) */
  shortcutBentoRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E6EEF0',
    ...V4_SHADOWS.soft,
  },
  shortcutIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  shortcutValue: {
    fontSize: 12.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
  },
  shortcutLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 1,
    textAlign: 'center',
  },

  /* SECTION CONTAINER & BRAND CARD */
  sectionContainer: {
    gap: 8,
  },
  brandCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    ...V4_SHADOWS.soft,
  },

  /* MENU ROWS */
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  menuSub: {
    fontSize: 11,
    fontWeight: '500',
    color: V4_COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 52,
  },

  /* PILL TAGS */
  tagPillGreen: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  tagPillGreenText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#16A34A',
  },

  /* FLATMATE SPECIFIC STYLES */
  flatmateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  flatmateHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  flatmateSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  liveTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveTagText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.4,
  },
  flatmateStatsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFB',
    borderRadius: 14,
    paddingVertical: 9,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E6EEF0',
  },
  flatmateStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  flatmateStatVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#031B2A',
  },
  flatmateStatLbl: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  flatmateStatDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E2ECEF',
  },
  flatmateBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  flatmateActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  flatmateActionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },

  /* LOGOUT BUTTON */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 16,
    paddingVertical: 13,
    marginHorizontal: 16,
    marginTop: 4,
  },
  logoutBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#E11D48',
  },

  /* BRAND FOOTER (MATCHING HOME) */
  brandFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  versionSub: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 8,
    letterSpacing: 0.5,
  },

  /* MODALS */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalHeaderIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#031B2A',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 16,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionsList: {
    gap: 10,
    marginTop: 6,
  },
  switchOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    backgroundColor: '#FFFFFF',
  },
  switchOptionItemActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  switchOptionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchOptionName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#031B2A',
  },
  switchOptionDetail: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  activePill: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#0F766E',
  },

  /* SUPPORT FORM */
  modalInputLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  categoryChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  categoryChipText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  modalInput: {
    backgroundColor: '#F8FAFB',
    borderWidth: 1,
    borderColor: '#E2ECEF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#031B2A',
    marginBottom: 12,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  primaryModalBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryModalBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13.5,
  },
});
