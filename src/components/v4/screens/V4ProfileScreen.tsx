import React, { useState, useMemo } from 'react';
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
  Flame,
  Check,
  ArrowRight,
  Truck,
  FolderLock,
  IndianRupee,
  Camera,
  KeyRound,
  FileCheck,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4BrandLogo } from '../ui/V4BrandLogo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const V4ProfileScreenComponent: React.FC = () => {
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
  
  // Role modal & support modal state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportCategory, setSupportCategory] = useState<'General' | 'Payment' | 'Lease' | 'Visit' | 'Move-In'>('General');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  const isLoggedIn = Boolean(user?.id);
  const userName = user?.name || myFlatmateProfile?.name || 'Guest User';
  const userPhone = user?.phone || (isLoggedIn ? 'Add phone number' : 'Sign in to access profile');
  const userEmail = user?.email || (isLoggedIn ? 'Add email address' : 'Verified Community Member');
  const isKycVerified = Boolean(
    user?.verification_status === 'VERIFIED' || user?.kyc_verified || user?.digilocker_verified
  );
  const availableBalance = wallet?.balance ?? user?.walletBalance ?? 0;

  // Profile completion calculation
  const completionChecks = useMemo(
    () => [
      { label: 'Full Legal Name', completed: Boolean(user?.name && user.name !== 'Guest User') },
      { label: 'Verified Contact', completed: Boolean(user?.phone || user?.email) },
      { label: 'Profile Photo', completed: Boolean(user?.avatar || user?.profile_photo || (user as any)?.avatar_url) },
      { label: 'DigiLocker KYC', completed: Boolean(isKycVerified) },
      { label: 'Occupation & City', completed: Boolean(user?.occupation || user?.city) },
    ],
    [user, isKycVerified]
  );
  const completedChecksCount = completionChecks.filter((c) => c.completed).length;
  const profileCompletionScore = Math.round((completedChecksCount / completionChecks.length) * 100);

  const handleRoleSelect = async (mode: 'renter' | 'owner') => {
    setShowRoleModal(false);
    await switchRole(mode);
    if (mode === 'owner') {
      router.replace('/(owner)/dashboard' as any);
    } else {
      router.replace('/(renter)/home' as any);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your REHVO account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login' as any);
        },
      },
    ]);
  };

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
      {/* ── FIXED TOP BAR ──────────────────────────────────────────────────────── */}
      <View style={[styles.topNavBar, { paddingTop: Math.max(insets.top, 10) }]}>
        <View style={styles.topNavLeft}>
          <Text style={styles.topNavTitle}>My Profile</Text>
          <Pressable style={styles.roleSwitchChip} onPress={() => setShowRoleModal(true)}>
            <View style={styles.roleDot} />
            <Text style={styles.roleSwitchChipText}>
              {isHost ? 'Owner Mode' : 'Renter Mode'}
            </Text>
            <ChevronDown size={11} color="#0E8F73" strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={styles.topNavRight}>
          {isLoggedIn && (
            <Pressable
              style={styles.navIconBtn}
              onPress={() => router.push('/(renter)/notifications' as any)}
              accessibilityLabel="Notifications"
            >
              <Bell size={18} color="#031B2A" strokeWidth={2.2} />
              <View style={styles.navBadgeDot} />
            </Pressable>
          )}

          <Pressable
            style={styles.navIconBtn}
            onPress={() => router.push('/(renter)/settings' as any)}
            accessibilityLabel="Settings"
          >
            <Settings size={18} color="#031B2A" strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
      >
        {/* ── 1. PROFILE IDENTITY CARD ────────────────────────────────────────── */}
        {isLoggedIn ? (
          <View style={styles.identityCard}>
            <View style={styles.identityTopRow}>
              {/* Avatar & Verification Indicator */}
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
                <Pressable
                  style={styles.avatarCameraBadge}
                  onPress={() => router.push('/(renter)/profile/edit' as any)}
                  hitSlop={8}
                >
                  <Camera size={11} color="#FFFFFF" strokeWidth={2.6} />
                </Pressable>
                {isKycVerified && (
                  <View style={styles.avatarVerifiedBadge}>
                    <Check size={10} color="#FFFFFF" strokeWidth={3.5} />
                  </View>
                )}
              </View>

              {/* User Bio Information */}
              <View style={styles.identityInfoCol}>
                <View style={styles.nameRow}>
                  <Text style={styles.userFullName} numberOfLines={1}>
                    {userName}
                  </Text>
                  {isKycVerified && (
                    <ShieldCheck size={16} color="#0E8F73" strokeWidth={2.6} />
                  )}
                </View>

                {/* Contact Subtitle */}
                <View style={styles.contactDetailsRow}>
                  <Phone size={11} color="#64748B" />
                  <Text style={styles.contactText} numberOfLines={1}>
                    {userPhone}
                  </Text>
                </View>
                <View style={styles.contactDetailsRow}>
                  <Mail size={11} color="#64748B" />
                  <Text style={styles.contactText} numberOfLines={1}>
                    {userEmail}
                  </Text>
                </View>
              </View>

              {/* Quick Edit Profile Button */}
              <Pressable
                style={styles.editProfilePill}
                onPress={() => router.push('/(renter)/profile/edit' as any)}
              >
                <Edit3 size={12} color="#0E8F73" strokeWidth={2.4} />
                <Text style={styles.editProfilePillText}>Edit</Text>
              </Pressable>
            </View>

            {/* Profile Completion / Trust Bar */}
            <View style={styles.trustStatusBar}>
              <View style={styles.trustStatusLeft}>
                <View style={[styles.trustTag, isKycVerified ? styles.trustTagVerified : styles.trustTagPending]}>
                  {isKycVerified ? (
                    <CheckCircle2 size={12} color="#0E8F73" strokeWidth={2.4} />
                  ) : (
                    <Shield size={12} color="#D97706" strokeWidth={2.4} />
                  )}
                  <Text style={[styles.trustTagText, isKycVerified ? styles.trustTagTextVerified : styles.trustTagTextPending]}>
                    {isKycVerified ? 'DigiLocker KYC Verified' : 'KYC Pending'}
                  </Text>
                </View>
                <Text style={styles.completionLabel}>
                  {profileCompletionScore}% Complete
                </Text>
              </View>

              <Pressable
                style={styles.kycActionLink}
                onPress={() => router.push('/(renter)/kyc' as any)}
              >
                <Text style={styles.kycActionLinkText}>
                  {isKycVerified ? 'View Deed Vault' : 'Complete KYC'}
                </Text>
                <ChevronRight size={12} color="#0E8F73" strokeWidth={2.4} />
              </Pressable>
            </View>

            {/* Micro Progress Track */}
            <View style={styles.microProgressTrack}>
              <View style={[styles.microProgressFill, { width: `${profileCompletionScore}%` }]} />
            </View>
          </View>
        ) : (
          /* Guest Welcome Card */
          <View style={styles.guestCard}>
            <View style={styles.guestIconCircle}>
              <User size={28} color="#0E8F73" strokeWidth={2.2} />
            </View>
            <Text style={styles.guestTitle}>Welcome to REHVO</Text>
            <Text style={styles.guestSub}>
              India's 100% Verified Living Platform. Sign in to access verified homes, digital leases, and R-Cash rewards.
            </Text>
            <View style={styles.guestButtonsRow}>
              <Pressable
                style={styles.guestPrimaryBtn}
                onPress={() => router.push({ pathname: '/(auth)/login' as any, params: { mode: 'signin' } })}
              >
                <Text style={styles.guestPrimaryBtnText}>Sign In</Text>
              </Pressable>
              <Pressable
                style={styles.guestSecondaryBtn}
                onPress={() => router.push({ pathname: '/(auth)/login' as any, params: { mode: 'signup' } })}
              >
                <Text style={styles.guestSecondaryBtnText}>Create Account</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ── 2. ACTIVITY & ASSETS BENTO (4-UP CLEAN GRID) ────────────────────── */}
        {isLoggedIn && (
          <View style={styles.bentoSection}>
            <Text style={styles.sectionHeaderLabel}>ACTIVITY & ASSETS</Text>
            <View style={styles.bentoGrid}>
              {/* Saved Homes */}
              <Pressable
                style={styles.bentoCard}
                onPress={() => router.push('/(renter)/saved' as any)}
              >
                <View style={[styles.bentoIconBox, { backgroundColor: '#FFE4E6' }]}>
                  <Heart size={16} color="#E11D48" strokeWidth={2.4} />
                </View>
                <Text style={styles.bentoValue}>{savedPropertyIds?.length || 0}</Text>
                <Text style={styles.bentoLabel}>Saved Homes</Text>
              </Pressable>

              {/* Scheduled Visits */}
              <Pressable
                style={styles.bentoCard}
                onPress={() => router.push('/(renter)/bookings' as any)}
              >
                <View style={[styles.bentoIconBox, { backgroundColor: '#F0FDFA' }]}>
                  <Calendar size={16} color="#0E8F73" strokeWidth={2.4} />
                </View>
                <Text style={styles.bentoValue}>Tours</Text>
                <Text style={styles.bentoLabel}>Visit Bookings</Text>
              </Pressable>

              {/* Digital Leases */}
              <Pressable
                style={styles.bentoCard}
                onPress={() => router.push('/(renter)/rental-agreements' as any)}
              >
                <View style={[styles.bentoIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <FileCheck size={16} color="#2563EB" strokeWidth={2.4} />
                </View>
                <Text style={styles.bentoValue}>Leases</Text>
                <Text style={styles.bentoLabel}>Digital E-Sign</Text>
              </Pressable>

              {/* R-Cash Wallet */}
              <Pressable
                style={styles.bentoCard}
                onPress={() => router.push('/(renter)/wallet' as any)}
              >
                <View style={[styles.bentoIconBox, { backgroundColor: '#DCFCE7' }]}>
                  <Wallet size={16} color="#16A34A" strokeWidth={2.4} />
                </View>
                <Text style={styles.bentoValue}>₹{availableBalance.toLocaleString('en-IN')}</Text>
                <Text style={styles.bentoLabel}>R-Cash Wallet</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ── 3. TENANCY & HOME LIVING ────────────────────────────────────────── */}
        {isLoggedIn && (
          <View style={styles.groupCard}>
            <View style={styles.groupCardHeader}>
              <View style={styles.groupTitleRow}>
                <Building2 size={16} color="#0E8F73" strokeWidth={2.2} />
                <Text style={styles.groupCardTitle}>Tenancy & Home Services</Text>
              </View>
              <Text style={styles.groupCardSub}>Agreements, rent payment & move-in setup</Text>
            </View>

            {/* Pay Rent Online */}
            <Pressable
              style={styles.menuItemRow}
              onPress={() => router.push('/(renter)/pay-rent' as any)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#FAF5FF' }]}>
                <CreditCard size={17} color="#7C3AED" strokeWidth={2.2} />
              </View>
              <View style={styles.menuItemTextCol}>
                <View style={styles.titleWithBadge}>
                  <Text style={styles.menuItemTitle}>Pay Rent Online</Text>
                  <View style={styles.badgeGreen}>
                    <Text style={styles.badgeGreenText}>1% Cashback</Text>
                  </View>
                </View>
                <Text style={styles.menuItemDesc}>Instant UPI & credit card with 45-day cycle</Text>
              </View>
              <ChevronRight size={15} color="#94A3B8" />
            </Pressable>

            <View style={styles.itemDivider} />

            {/* Digital Rental Agreements */}
            <Pressable
              style={styles.menuItemRow}
              onPress={() => router.push('/(renter)/rental-agreements' as any)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#F0FDFA' }]}>
                <FileText size={17} color="#0E8F73" strokeWidth={2.2} />
              </View>
              <View style={styles.menuItemTextCol}>
                <Text style={styles.menuItemTitle}>Digital Rental Agreements</Text>
                <Text style={styles.menuItemDesc}>Government e-stamped leases & digital signatures</Text>
              </View>
              <ChevronRight size={15} color="#94A3B8" />
            </Pressable>

            <View style={styles.itemDivider} />

            {/* Document Vault */}
            <Pressable
              style={styles.menuItemRow}
              onPress={() => router.push('/(renter)/document-vault' as any)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#FFFBEB' }]}>
                <FolderLock size={17} color="#D97706" strokeWidth={2.2} />
              </View>
              <View style={styles.menuItemTextCol}>
                <Text style={styles.menuItemTitle}>Encrypted Document Vault</Text>
                <Text style={styles.menuItemDesc}>Aadhaar, PAN, leases & HRA rent receipts</Text>
              </View>
              <ChevronRight size={15} color="#94A3B8" />
            </Pressable>

            <View style={styles.itemDivider} />

            {/* Move-In & Relocation */}
            <Pressable
              style={styles.menuItemRow}
              onPress={() => router.push('/(renter)/move-in' as any)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#EFF6FF' }]}>
                <Truck size={17} color="#2563EB" strokeWidth={2.2} />
              </View>
              <View style={styles.menuItemTextCol}>
                <Text style={styles.menuItemTitle}>Move-In, Packers & Cleaning</Text>
                <Text style={styles.menuItemDesc}>Key handover, Porter movers & sanitization</Text>
              </View>
              <ChevronRight size={15} color="#94A3B8" />
            </Pressable>
          </View>
        )}

        {/* ── 4. ROOMMATE & CO-LIVING HUB ─────────────────────────────────────── */}
        {isLoggedIn && (
          <View style={styles.groupCard}>
            <View style={styles.groupCardHeader}>
              <View style={styles.groupTitleRow}>
                <Users size={16} color="#0E8F73" strokeWidth={2.2} />
                <Text style={styles.groupCardTitle}>Roommate & Flatmate Hub</Text>
              </View>
              <Text style={styles.groupCardSub}>Find compatible flatmates & manage your live persona</Text>
            </View>

            {/* Flatmate Quick Overview Banner */}
            <View style={styles.flatmateMiniBanner}>
              <View style={styles.flatmateBannerHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.flatmatePersonaTitle}>Active Roommate Card</Text>
                  <Text style={styles.flatmatePersonaSub}>
                    {myFlatmateProfile?.preferred_locations?.length
                      ? myFlatmateProfile.preferred_locations.slice(0, 2).join(', ')
                      : 'Mumbai'}{' '}
                    • ₹{((myFlatmateProfile?.budget_min || 15000) / 1000).toFixed(0)}k–₹{((myFlatmateProfile?.budget_max || 30000) / 1000).toFixed(0)}k/mo
                  </Text>
                </View>
                <View style={styles.liveIndicatorBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveIndicatorText}>LIVE</Text>
                </View>
              </View>

              {/* Counters */}
              <View style={styles.flatmateMetricsRow}>
                <View style={styles.flatmateMetricItem}>
                  <Eye size={12} color="#0E8F73" />
                  <Text style={styles.flatmateMetricVal}>48</Text>
                  <Text style={styles.flatmateMetricLbl}>Views</Text>
                </View>
                <View style={styles.flatmateMetricSep} />
                <View style={styles.flatmateMetricItem}>
                  <Heart size={12} color="#EF4444" />
                  <Text style={styles.flatmateMetricVal}>{matchedFlatmateIds?.length || 0}</Text>
                  <Text style={styles.flatmateMetricLbl}>Matches</Text>
                </View>
                <View style={styles.flatmateMetricSep} />
                <View style={styles.flatmateMetricItem}>
                  <Flame size={12} color="#D97706" />
                  <Text style={styles.flatmateMetricVal}>{incomingWaves?.length || 0}</Text>
                  <Text style={styles.flatmateMetricLbl}>Waves</Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.flatmateActionButtons}>
                <Pressable
                  style={styles.flatmateBtnSecondary}
                  onPress={() => router.push('/(renter)/flatmate/my-profile' as any)}
                >
                  <Eye size={12} color="#031B2A" strokeWidth={2.4} />
                  <Text style={styles.flatmateBtnSecondaryText}>View Card</Text>
                </Pressable>

                <Pressable
                  style={styles.flatmateBtnSecondary}
                  onPress={() => router.push('/(renter)/flatmate/create' as any)}
                >
                  <Edit3 size={12} color="#031B2A" strokeWidth={2.4} />
                  <Text style={styles.flatmateBtnSecondaryText}>Edit Vibe</Text>
                </Pressable>

                <Pressable
                  style={styles.flatmateBtnPrimary}
                  onPress={() => router.push('/(renter)/flatmate/discover' as any)}
                >
                  <Flame size={12} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.flatmateBtnPrimaryText}>Discover</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* ── 5. BENEFITS, PASSES & REWARDS ───────────────────────────────────── */}
        {isLoggedIn && (
          <View style={styles.groupCard}>
            <View style={styles.groupCardHeader}>
              <View style={styles.groupTitleRow}>
                <Gift size={16} color="#0E8F73" strokeWidth={2.2} />
                <Text style={styles.groupCardTitle}>Benefits, Passes & Rewards</Text>
              </View>
              <Text style={styles.groupCardSub}>Cashback, deposit passes & referral rewards</Text>
            </View>

            {/* Zero Deposit Pass */}
            <Pressable
              style={styles.menuItemRow}
              onPress={() => router.push('/(renter)/zero-deposit' as any)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#DCFCE7' }]}>
                <Shield size={17} color="#16A34A" strokeWidth={2.2} />
              </View>
              <View style={styles.menuItemTextCol}>
                <View style={styles.titleWithBadge}>
                  <Text style={styles.menuItemTitle}>Zero Deposit Rental Pass</Text>
                  <View style={styles.badgeGreen}>
                    <Text style={styles.badgeGreenText}>Up to ₹1.5L</Text>
                  </View>
                </View>
                <Text style={styles.menuItemDesc}>Move into top homes without heavy upfront security</Text>
              </View>
              <ChevronRight size={15} color="#94A3B8" />
            </Pressable>

            <View style={styles.itemDivider} />

            {/* Refer & Earn */}
            <Pressable
              style={styles.menuItemRow}
              onPress={() => router.push('/(renter)/share-earn' as any)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#FFFBEB' }]}>
                <Share2 size={17} color="#D97706" strokeWidth={2.2} />
              </View>
              <View style={styles.menuItemTextCol}>
                <View style={styles.titleWithBadge}>
                  <Text style={styles.menuItemTitle}>Share & Earn</Text>
                  <View style={[styles.badgeGreen, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.badgeGreenText, { color: '#B45309' }]}>₹500 / Friend</Text>
                  </View>
                </View>
                <Text style={styles.menuItemDesc}>Invite flatmates or friends & earn cash into wallet</Text>
              </View>
              <ChevronRight size={15} color="#94A3B8" />
            </Pressable>

            <View style={styles.itemDivider} />

            {/* Partner Deals */}
            <Pressable
              style={styles.menuItemRow}
              onPress={() => router.push('/(renter)/rewards' as any)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: '#FAF5FF' }]}>
                <Sparkles size={17} color="#7C3AED" strokeWidth={2.2} />
              </View>
              <View style={styles.menuItemTextCol}>
                <Text style={styles.menuItemTitle}>Partner Rewards & Perks</Text>
                <Text style={styles.menuItemDesc}>Urban Company, Cult.fit, Wakefit & Pepperfry</Text>
              </View>
              <ChevronRight size={15} color="#94A3B8" />
            </Pressable>
          </View>
        )}

        {/* ── 6. LIST YOUR PROPERTY BANNER (OWNER SHORTCUT) ──────────────────── */}
        {isLoggedIn && (
          <Pressable
            style={styles.ownerPromoCard}
            onPress={() => router.push('/(renter)/listing' as any)}
          >
            <View style={styles.ownerPromoContent}>
              <View style={styles.ownerPromoBadge}>
                <Building2 size={12} color="#0E8F73" />
                <Text style={styles.ownerPromoBadgeText}>OWNER DIRECT ZERO COMMISSION</Text>
              </View>
              <Text style={styles.ownerPromoTitle}>Have a Flat or Room in Mumbai?</Text>
              <Text style={styles.ownerPromoDesc}>
                List in 3 minutes. Connect directly with verified tenants with zero middleman commissions.
              </Text>
            </View>
            <View style={styles.ownerPromoBtn}>
              <PlusCircle size={14} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.ownerPromoBtnText}>Post Listing</Text>
            </View>
          </Pressable>
        )}

        {/* ── 7. SUPPORT, SECURITY & LEGAL ────────────────────────────────────── */}
        <View style={styles.groupCard}>
          <View style={styles.groupCardHeader}>
            <View style={styles.groupTitleRow}>
              <ShieldCheck size={16} color="#0E8F73" strokeWidth={2.2} />
              <Text style={styles.groupCardTitle}>Security & Support</Text>
            </View>
            <Text style={styles.groupCardSub}>Concierge desk, KYC verification & legal terms</Text>
          </View>

          {/* 24x7 Support Concierge */}
          <Pressable style={styles.menuItemRow} onPress={() => setShowSupportModal(true)}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#F0FDFA' }]}>
              <HelpCircle size={17} color="#0E8F73" strokeWidth={2.2} />
            </View>
            <View style={styles.menuItemTextCol}>
              <Text style={styles.menuItemTitle}>24x7 Support Concierge</Text>
              <Text style={styles.menuItemDesc}>Priority escalation desk with &lt; 15 min response</Text>
            </View>
            <ChevronRight size={15} color="#94A3B8" />
          </Pressable>

          <View style={styles.itemDivider} />

          {/* DigiLocker Identity Verification */}
          {isLoggedIn && (
            <>
              <Pressable
                style={styles.menuItemRow}
                onPress={() => router.push('/(renter)/kyc' as any)}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: '#F0FDF4' }]}>
                  <ShieldCheck size={17} color="#16A34A" strokeWidth={2.2} />
                </View>
                <View style={styles.menuItemTextCol}>
                  <View style={styles.titleWithBadge}>
                    <Text style={styles.menuItemTitle}>DigiLocker Identity Verification</Text>
                    <View
                      style={[
                        styles.badgeGreen,
                        !isKycVerified && { backgroundColor: '#FEF3C7' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeGreenText,
                          !isKycVerified && { color: '#B45309' },
                        ]}
                      >
                        {isKycVerified ? 'Verified' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.menuItemDesc}>Aadhaar, PAN & police background clearance</Text>
                </View>
                <ChevronRight size={15} color="#94A3B8" />
              </Pressable>
              <View style={styles.itemDivider} />
            </>
          )}

          {/* About REHVO */}
          <Pressable
            style={styles.menuItemRow}
            onPress={() => router.push('/(renter)/about' as any)}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <Info size={17} color="#475569" strokeWidth={2.2} />
            </View>
            <View style={styles.menuItemTextCol}>
              <Text style={styles.menuItemTitle}>About REHVO</Text>
              <Text style={styles.menuItemDesc}>Mumbai's 100% verified zero commission network</Text>
            </View>
            <ChevronRight size={15} color="#94A3B8" />
          </Pressable>

          <View style={styles.itemDivider} />

          {/* Terms & Privacy */}
          <Pressable
            style={styles.menuItemRow}
            onPress={() => router.push('/(renter)/terms' as any)}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <FileText size={17} color="#475569" strokeWidth={2.2} />
            </View>
            <View style={styles.menuItemTextCol}>
              <Text style={styles.menuItemTitle}>Terms of Service & Escrow</Text>
              <Text style={styles.menuItemDesc}>Tenant protection policies & escrow guarantees</Text>
            </View>
            <ChevronRight size={15} color="#94A3B8" />
          </Pressable>

          <View style={styles.itemDivider} />

          <Pressable
            style={styles.menuItemRow}
            onPress={() => router.push('/(renter)/privacy' as any)}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <Lock size={17} color="#475569" strokeWidth={2.2} />
            </View>
            <View style={styles.menuItemTextCol}>
              <Text style={styles.menuItemTitle}>Privacy & Data Protection</Text>
              <Text style={styles.menuItemDesc}>Encrypted storage & no unauthorized data sharing</Text>
            </View>
            <ChevronRight size={15} color="#94A3B8" />
          </Pressable>
        </View>

        {/* ── 8. SIGN OUT ACTION ──────────────────────────────────────────────── */}
        {isLoggedIn && (
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={16} color="#E11D48" strokeWidth={2.4} />
            <Text style={styles.logoutButtonText}>Sign Out of REHVO</Text>
          </Pressable>
        )}

        {/* ── 9. BRAND FOOTER ─────────────────────────────────────────────────── */}
        <View style={styles.footerContainer}>
          <V4BrandLogo variant="stacked" size="sm" showTagline={true} />
          <Text style={styles.footerVersionText}>REHVO V9.0 • 100% Verified Living</Text>
        </View>
      </ScrollView>

      {/* ── MODAL: MULTI-ROLE EXPERIENCE SWITCHER ────────────────────────────── */}
      <Modal visible={showRoleModal} transparent animationType="slide">
        <Pressable style={styles.modalBackdrop} onPress={() => setShowRoleModal(false)}>
          <Pressable style={styles.modalContentCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalHeading}>Switch Experience</Text>
                <Text style={styles.modalSubtitle}>Seamlessly toggle without separate logins</Text>
              </View>
              <Pressable
                onPress={() => setShowRoleModal(false)}
                hitSlop={8}
                style={styles.modalCloseButton}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <View style={styles.roleOptionsStack}>
              {/* Option 1: Renter */}
              <Pressable
                style={[styles.roleOptionCard, currentRole === 'RENTER' && styles.roleOptionCardActive]}
                onPress={() => handleRoleSelect('renter')}
              >
                <View style={[styles.roleOptionIcon, { backgroundColor: '#ECFDF5' }]}>
                  <Compass size={20} color="#0E8F73" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.roleOptionTitle}>Renter & Flatmates</Text>
                    {currentRole === 'RENTER' && (
                      <View style={styles.roleActiveBadge}>
                        <Text style={styles.roleActiveBadgeText}>Active</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.roleOptionDesc}>
                    Search verified flats, roommates, leases & pay rent
                  </Text>
                </View>
                {currentRole === 'RENTER' ? (
                  <CheckCircle2 size={18} color="#0E8F73" />
                ) : (
                  <ChevronRight size={18} color="#CBD5E1" />
                )}
              </Pressable>

              {/* Option 2: Owner */}
              <Pressable
                style={[styles.roleOptionCard, currentRole === 'OWNER' && styles.roleOptionCardActive]}
                onPress={() => handleRoleSelect('owner')}
              >
                <View style={[styles.roleOptionIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Building2 size={20} color="#B45309" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.roleOptionTitle}>Owner & Landlord Mode</Text>
                    {currentRole === 'OWNER' && (
                      <View style={[styles.roleActiveBadge, { backgroundColor: '#FEF3C7' }]}>
                        <Text style={[styles.roleActiveBadgeText, { color: '#B45309' }]}>Active</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.roleOptionDesc}>
                    List properties, screen tenant leads & auto-collect rent
                  </Text>
                </View>
                {currentRole === 'OWNER' ? (
                  <CheckCircle2 size={18} color="#B45309" />
                ) : (
                  <ChevronRight size={18} color="#CBD5E1" />
                )}
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── MODAL: 24x7 CONCIERGE SUPPORT TICKET ─────────────────────────────── */}
      <Modal
        visible={showSupportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSupportModal(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowSupportModal(false)}>
          <Pressable style={styles.modalContentCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.supportIconWrap}>
                  <HelpCircle size={18} color="#0E8F73" />
                </View>
                <Text style={styles.modalHeading}>Priority Concierge</Text>
              </View>
              <Pressable
                onPress={() => setShowSupportModal(false)}
                hitSlop={8}
                style={styles.modalCloseButton}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Direct escalation desk for rent payments, lease queries, inspections, and concierge requests. Reply time &lt; 15 mins.
            </Text>

            {/* Category Selector */}
            <Text style={styles.formInputLabel}>SELECT TOPIC</Text>
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
            <Text style={styles.formInputLabel}>SUBJECT</Text>
            <TextInput
              style={styles.formTextInput}
              value={supportSubject}
              onChangeText={setSupportSubject}
              placeholder="e.g. Rent payment confirmation / WiFi setup"
              placeholderTextColor="#94A3B8"
            />

            {/* Message Input */}
            <Text style={styles.formInputLabel}>DETAILS / MESSAGE</Text>
            <TextInput
              style={[styles.formTextInput, styles.formTextArea]}
              value={supportMessage}
              onChangeText={setSupportMessage}
              placeholder="Please describe how our team can help you..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />

            {/* Submit Button */}
            <Pressable
              style={[styles.submitSupportBtn, isSubmittingTicket && { opacity: 0.7 }]}
              onPress={handleSubmitSupportTicket}
              disabled={isSubmittingTicket}
            >
              {isSubmittingTicket ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitSupportBtnText}>Submit Priority Ticket</Text>
              )}
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },

  /* FIXED TOP BAR */
  topNavBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  topNavLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topNavTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#031B2A',
    letterSpacing: -0.3,
  },
  roleSwitchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 8.5,
    paddingVertical: 4,
    borderRadius: 14,
  },
  roleDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0E8F73',
  },
  roleSwitchChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0E8F73',
  },
  topNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  navBadgeDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },

  /* SCROLL CONTENT */
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 14,
  },

  /* IDENTITY CARD */
  identityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...V4_SHADOWS.card,
    gap: 12,
  },
  identityTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    position: 'relative',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#0E8F73',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarVerifiedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#0E8F73',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  identityInfoCol: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userFullName: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#031B2A',
  },
  contactDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  contactText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
  },
  editProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  editProfilePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0E8F73',
  },

  /* TRUST STATUS BAR */
  trustStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  trustStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trustTagVerified: {
    backgroundColor: '#ECFDF5',
  },
  trustTagPending: {
    backgroundColor: '#FEF3C7',
  },
  trustTagText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  trustTagTextVerified: {
    color: '#0E8F73',
  },
  trustTagTextPending: {
    color: '#B45309',
  },
  completionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  kycActionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  kycActionLinkText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0E8F73',
  },
  microProgressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  microProgressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0E8F73',
  },

  /* GUEST CARD */
  guestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...V4_SHADOWS.card,
  },
  guestIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#031B2A',
  },
  guestSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  guestButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    width: '100%',
  },
  guestPrimaryBtn: {
    flex: 1,
    backgroundColor: '#0E8F73',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  guestPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  guestSecondaryBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  guestSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#031B2A',
  },

  /* BENTO ACTIVITY GRID */
  bentoSection: {
    gap: 8,
  },
  sectionHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#94A3B8',
    paddingHorizontal: 2,
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    alignItems: 'center',
    gap: 4,
    ...V4_SHADOWS.soft,
  },
  bentoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  bentoValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#031B2A',
  },
  bentoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },

  /* GROUP CARD (SECTION CONTAINER) */
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...V4_SHADOWS.card,
  },
  groupCardHeader: {
    marginBottom: 12,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupCardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#031B2A',
  },
  groupCardSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },

  /* MENU ROWS */
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemTextCol: {
    flex: 1,
    gap: 2,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuItemTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#031B2A',
  },
  menuItemDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  badgeGreen: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeGreenText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0E8F73',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F8FAFC',
    marginLeft: 50,
  },

  /* FLATMATE BANNER */
  flatmateMiniBanner: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  flatmateBannerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  flatmatePersonaTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#031B2A',
  },
  flatmatePersonaSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  liveIndicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#16A34A',
  },
  liveIndicatorText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#16A34A',
  },
  flatmateMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  flatmateMetricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  flatmateMetricVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#031B2A',
  },
  flatmateMetricLbl: {
    fontSize: 10.5,
    color: '#64748B',
  },
  flatmateMetricSep: {
    width: 1,
    height: 14,
    backgroundColor: '#EEF2F6',
  },
  flatmateActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flatmateBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 7,
    borderRadius: 8,
  },
  flatmateBtnSecondaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#031B2A',
  },
  flatmateBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#0E8F73',
    paddingVertical: 7,
    borderRadius: 8,
  },
  flatmateBtnPrimaryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* OWNER PROMO CARD */
  ownerPromoCard: {
    backgroundColor: '#031B2A',
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  ownerPromoContent: {
    gap: 4,
  },
  ownerPromoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0E8F7320',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  ownerPromoBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0E8F73',
  },
  ownerPromoTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  ownerPromoDesc: {
    fontSize: 11.5,
    color: '#94A3B8',
    lineHeight: 16,
  },
  ownerPromoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0E8F73',
    paddingVertical: 9,
    borderRadius: 10,
  },
  ownerPromoBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* LOGOUT BUTTON */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  logoutButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E11D48',
  },

  /* BRAND FOOTER */
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  footerVersionText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },

  /* MODALS */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContentCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '900',
    color: '#031B2A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  modalCloseButton: {
    padding: 4,
  },
  roleOptionsStack: {
    gap: 8,
    marginTop: 4,
  },
  roleOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  roleOptionCardActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0E8F73',
  },
  roleOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleOptionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#031B2A',
  },
  roleOptionDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  roleActiveBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  roleActiveBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#16A34A',
  },

  /* CONCIERGE MODAL */
  supportIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formInputLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  categoryChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  categoryChipActive: {
    backgroundColor: '#0E8F73',
  },
  categoryChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  formTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#031B2A',
  },
  formTextArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  submitSupportBtn: {
    backgroundColor: '#0E8F73',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  submitSupportBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export const V4ProfileScreen = React.memo(V4ProfileScreenComponent);
export default V4ProfileScreen;
