import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  RefreshControl,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Plus,
  Building2,
  Users,
  Calendar,
  IndianRupee,
  BarChart3,
  Crown,
  FileText,
  Bell,
  ChevronRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Eye,
  Heart,
  Clock,
  Sparkles,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
  Lock,
  Phone,
  Settings,
  Share2,
  Layers,
  HelpCircle,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface V4OwnerDashboardScreenProps {
  hideHeader?: boolean;
}

export const V4OwnerDashboardScreen: React.FC<V4OwnerDashboardScreenProps> = ({
  hideHeader = false,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    isAuthenticated,
    myProperties,
    fetchMyProperties,
    ownerProfile,
    ownerPlan,
    ownerDashboardSummary,
    tenantLeads,
    ownerVisits,
    rentCollections,
    unreadOwnerNotificationsCount,
    fetchOwnerEcosystemData,
  } = useAppStore();

  const [refreshing, setRefreshing] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const loadData = useCallback(async () => {
    await Promise.all([fetchMyProperties(), fetchOwnerEcosystemData()]);
  }, [fetchMyProperties, fetchOwnerEcosystemData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // ---------------------------------------------------------------------------
  // GUEST / UNAUTHENTICATED PROTECTION MODE
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
          </Pressable>
          <Text style={styles.topNavTitle}>Owner & Landlord Hub</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.guestScrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Guest Hero Banner */}
          <View style={styles.guestHeroCard}>
            <View style={styles.guestBadge}>
              <Sparkles size={13} color="#065F46" />
              <Text style={styles.guestBadgeText}>VERIFIED LISTING DIRECT HOST</Text>
            </View>
            <Text style={styles.guestHeroTitle}>
              Turn Your Property Into A High-Yield Luxury Asset
            </Text>
            <Text style={styles.guestHeroSubtitle}>
              Join over 14,000+ elite landlords using REHVO’s automated rental ecosystem, DigiLocker verified tenants, and instant UPI AutoPay.
            </Text>

            <View style={styles.guestStatsRow}>
              <View style={styles.guestStatCol}>
                <Text style={styles.guestStatNum}>₹0</Text>
                <Text style={styles.guestStatLabel}>Brokerage</Text>
              </View>
              <View style={styles.guestStatDivider} />
              <View style={styles.guestStatCol}>
                <Text style={styles.guestStatNum}>4.8x</Text>
                <Text style={styles.guestStatLabel}>Faster Tenant Match</Text>
              </View>
              <View style={styles.guestStatDivider} />
              <View style={styles.guestStatCol}>
                <Text style={styles.guestStatNum}>100%</Text>
                <Text style={styles.guestStatLabel}>Digital E-Lease</Text>
              </View>
            </View>

            <View style={{ gap: 10, width: '100%', marginTop: 8 }}>
              <V4Button
                title="Become a Host / Sign In"
                variant="primary"
                onPress={() => router.push('/(renter)/login' as any)}
              />
              <V4Button
                title="Explore Subscription Plans"
                variant="outline"
                onPress={() => router.push('/(renter)/host-plans' as any)}
              />
            </View>
          </View>

          {/* Value Props */}
          <View style={styles.guestFeaturesWrap}>
            <Text style={styles.guestFeaturesTitle}>Why Host with REHVO?</Text>

            {[
              {
                icon: ShieldCheck,
                title: 'Government DigiLocker Verified Tenants',
                desc: 'Every tenant passes Aadhaar biometric, PAN OCR, and police verification.',
              },
              {
                icon: IndianRupee,
                title: 'Guaranteed Rent AutoPay',
                desc: 'Rent auto-settles directly into your bank on the 1st of every month.',
              },
              {
                icon: FileText,
                title: 'Legally Binding Digital E-Lease',
                desc: 'Instant 11-month state-stamped agreements generated right from your phone.',
              },
              {
                icon: Users,
                title: 'Comprehensive CRM & Lead Waves',
                desc: 'Screen profiles, schedule QR-verified visits, and approve leases in 1-tap.',
              },
            ].map((f, i) => (
              <View key={i} style={styles.guestFeatureCard}>
                <View style={styles.guestFeatureIconBox}>
                  <f.icon size={22} color="#0F766E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.guestFeatureCardTitle}>{f.title}</Text>
                  <Text style={styles.guestFeatureCardDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATED OWNER DASHBOARD
  // ---------------------------------------------------------------------------
  const activeListingsCount = myProperties.filter((p) => {
    const s = (p.status || '').toUpperCase();
    return s === 'PUBLISHED' || s === 'ACTIVE';
  }).length;

  const rentedCount = myProperties.filter((p) => {
    const s = (p.status || '').toUpperCase();
    return s === 'RENTED';
  }).length;

  const totalRentCollected = rentCollections
    .filter((r) => r.status === 'COLLECTED')
    .reduce((sum, r) => sum + (r.rent_amount || 0), 0);

  const projectedMonthlyEarnings = totalRentCollected > 0
    ? totalRentCollected
    : myProperties.filter((p) => (p.status || '').toUpperCase() === 'RENTED').reduce((sum, p) => sum + (p.rent || 0), 0);

  const occupancyRate = myProperties.length > 0 ? Math.round((rentedCount / myProperties.length) * 100) : 0;
  const realViews = myProperties.reduce((sum, p) => sum + (p.views_count || 0), 0);
  const upcomingVisitsCount = ownerVisits.filter((v) => v.checkin_status === 'SCHEDULED' || (v as any).status === 'CONFIRMED').length;
  const pendingLeadsCount = tenantLeads.filter((l) => l.status === 'NEW' || l.status === 'INTERESTED' || l.status === 'CONTACTED').length;

  const summary = ownerDashboardSummary || {
    totalProperties: myProperties.length,
    activeListings: activeListingsCount,
    monthlyEarnings: projectedMonthlyEarnings,
    occupancyRate,
    totalViews: realViews,
    savedByUsers: myProperties.reduce((sum, p) => sum + (p.saves_count || 0), 0),
    upcomingVisits: upcomingVisitsCount,
    pendingLeads: pendingLeadsCount,
    viewsThisWeek: Math.round(realViews * 0.25),
    newLeadsThisWeek: tenantLeads.filter((l) => {
      const d = new Date(l.created_at || Date.now());
      return Date.now() - d.getTime() <= 7 * 86400000;
    }).length,
    savedHomesThisWeek: Math.round(myProperties.reduce((sum, p) => sum + (p.saves_count || 0), 0) * 0.3),
    visitRequestsThisWeek: ownerVisits.length,
    rentedPropertiesCount: rentedCount,
    cancelledVisitsCount: ownerVisits.filter((v) => v.checkin_status === 'CANCELLED' || v.checkin_status === 'RESCHEDULED').length,
  };

  const planTier = ownerPlan?.plan_tier || 'pro';
  const planName = ownerPlan?.plan_name || 'Pro Plan';

  return (
    <View style={[styles.container, !hideHeader && { paddingTop: insets.top }]}>
      {/* Top App Bar */}
      {!hideHeader && (
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
          </Pressable>
          <View style={styles.topNavCenter}>
            <Text style={styles.topNavTitle}>Owner Dashboard</Text>
            <View style={styles.topNavSubRow}>
              <View style={styles.livePulseDot} />
              <Text style={styles.topNavSubText}>Live Property Management</Text>
            </View>
          </View>
          <View style={styles.topNavRight}>
            <Pressable
              style={styles.navIconBtn}
              onPress={() => router.push('/(renter)/owner-notifications' as any)}
            >
              <Bell size={20} color="#0F766E" />
              {unreadOwnerNotificationsCount > 0 && (
                <View style={styles.navNotifBadge}>
                  <Text style={styles.navNotifText}>{unreadOwnerNotificationsCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable
              style={styles.navProfileBtn}
              onPress={() => setProfileModalVisible(true)}
            >
              <Image
                source={{
                  uri:
                    ownerProfile?.profile_photo ||
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                }}
                style={styles.navAvatar}
              />
            </Pressable>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0F766E" />
        }
      >
        {/* ===================================================================
            1. HERO OWNER ANALYTICS CARD (AIRBNB + APPLE WALLET)
           =================================================================== */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroSubGreeting}>
                {ownerProfile?.business_name || 'Portfolio Overview'}
              </Text>
              <View style={styles.heroBadgeRow}>
                <View style={styles.planBadgePill}>
                  <Crown size={12} color="#D97706" />
                  <Text style={styles.planBadgeText}>{planName.toUpperCase()}</Text>
                </View>
                <View style={styles.verifiedBadgePill}>
                  <ShieldCheck size={12} color="#065F46" />
                  <Text style={styles.verifiedBadgeText}>VERIFIED OWNER</Text>
                </View>
              </View>
            </View>

            <Pressable
              style={styles.upgradePlanBtn}
              onPress={() => router.push('/(owner)/subscription' as any)}
            >
              <Sparkles size={13} color="#FFFFFF" />
              <Text style={styles.upgradePlanText}>Plans</Text>
            </Pressable>
          </View>

          {/* Primary Monthly Earnings Counter */}
          <View style={styles.heroYieldWrap}>
            <Text style={styles.heroYieldLabel}>Monthly Portfolio Rent</Text>
            <View style={styles.heroYieldMainRow}>
              <Text style={styles.heroYieldCurrency}>₹</Text>
              <Text style={styles.heroYieldAmount}>
                {summary.monthlyEarnings.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.heroYieldPeriod}>/month</Text>
            </View>
            <View style={styles.occupancyBarRow}>
              <View style={styles.occupancyBarTrack}>
                <View style={[styles.occupancyBarFill, { width: `${summary.occupancyRate}%` }]} />
              </View>
              <Text style={styles.occupancyRateText}>
                {summary.occupancyRate}% Occupancy
              </Text>
            </View>
          </View>

          {/* 6 Hero Metrics Grid */}
          <View style={styles.heroMetricsGrid}>
            <View style={styles.heroMetricItem}>
              <Text style={styles.heroMetricVal}>{summary.totalProperties}</Text>
              <Text style={styles.heroMetricLbl}>Total Homes</Text>
            </View>
            <View style={styles.heroMetricItem}>
              <Text style={[styles.heroMetricVal, { color: '#059669' }]}>
                {summary.activeListings}
              </Text>
              <Text style={styles.heroMetricLbl}>Active Live</Text>
            </View>
            <View style={styles.heroMetricItem}>
              <Text style={styles.heroMetricVal}>{summary.totalViews.toLocaleString('en-IN')}</Text>
              <Text style={styles.heroMetricLbl}>Total Views</Text>
            </View>
            <View style={styles.heroMetricItem}>
              <Text style={styles.heroMetricVal}>{summary.savedByUsers}</Text>
              <Text style={styles.heroMetricLbl}>Saved Homes</Text>
            </View>
            <View style={styles.heroMetricItem}>
              <Text style={[styles.heroMetricVal, { color: '#2563EB' }]}>
                {summary.upcomingVisits}
              </Text>
              <Text style={styles.heroMetricLbl}>Upcoming Visits</Text>
            </View>
            <View style={styles.heroMetricItem}>
              <Text style={[styles.heroMetricVal, { color: '#D97706' }]}>
                {summary.pendingLeads}
              </Text>
              <Text style={styles.heroMetricLbl}>Pending Leads</Text>
            </View>
          </View>
        </View>

        {/* ===================================================================
            2. QUICK ACTIONS BAR
           =================================================================== */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsScroll}
        >
          <Pressable
            style={styles.quickActionCard}
            onPress={() => router.push('/(renter)/listing' as any)}
          >
            <View style={[styles.quickActionIconBox, { backgroundColor: '#064E3B' }]}>
              <Plus size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.quickActionTitle}>Add Property</Text>
            <Text style={styles.quickActionSub}>Post in 3 mins</Text>
          </Pressable>

          <Pressable
            style={styles.quickActionCard}
            onPress={() => router.push('/(owner)/rental-estimator' as any)}
          >
            <View style={[styles.quickActionIconBox, { backgroundColor: '#CCFBF1' }]}>
              <Sparkles size={20} color="#0F766E" />
            </View>
            <Text style={styles.quickActionTitle}>AI Estimator</Text>
            <Text style={styles.quickActionSub}>Calculate Yield</Text>
          </Pressable>

          <Pressable
            style={styles.quickActionCard}
            onPress={() => router.push('/(owner)/leads' as any)}
          >
            <View style={[styles.quickActionIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Users size={20} color="#D97706" />
            </View>
            <Text style={styles.quickActionTitle}>View Leads</Text>
            <Text style={styles.quickActionSub}>
              {summary.pendingLeads} Pending
            </Text>
          </Pressable>

          <Pressable
            style={styles.quickActionCard}
            onPress={() => router.push('/(owner)/visits' as any)}
          >
            <View style={[styles.quickActionIconBox, { backgroundColor: '#DBEAFE' }]}>
              <Calendar size={20} color="#2563EB" />
            </View>
            <Text style={styles.quickActionTitle}>Visits Calendar</Text>
            <Text style={styles.quickActionSub}>QR Check-in</Text>
          </Pressable>

          <Pressable
            style={styles.quickActionCard}
            onPress={() => router.push('/(owner)/rent-collection' as any)}
          >
            <View style={[styles.quickActionIconBox, { backgroundColor: '#DCFCE7' }]}>
              <IndianRupee size={20} color="#16A34A" />
            </View>
            <Text style={styles.quickActionTitle}>Rent Collection</Text>
            <Text style={styles.quickActionSub}>Reminders & AutoPay</Text>
          </Pressable>

          <Pressable
            style={styles.quickActionCard}
            onPress={() => router.push('/(renter)/rental-agreements' as any)}
          >
            <View style={[styles.quickActionIconBox, { backgroundColor: '#F3E8FF' }]}>
              <FileText size={20} color="#9333EA" />
            </View>
            <Text style={styles.quickActionTitle}>Digital Lease</Text>
            <Text style={styles.quickActionSub}>E-Stamp Ready</Text>
          </Pressable>

          <Pressable
            style={styles.quickActionCard}
            onPress={() => router.push('/(owner)/wallet' as any)}
          >
            <View style={[styles.quickActionIconBox, { backgroundColor: '#E0F2FE' }]}>
              <TrendingUp size={20} color="#0284C7" />
            </View>
            <Text style={styles.quickActionTitle}>Wallet & Yield</Text>
            <Text style={styles.quickActionSub}>Cashback Balance</Text>
          </Pressable>
        </ScrollView>

        {/* ===================================================================
            3. PERFORMANCE SUMMARY THIS WEEK
           =================================================================== */}
        <Text style={styles.sectionTitle}>PERFORMANCE THIS WEEK</Text>
        <View style={styles.performanceGrid}>
          <View style={styles.performanceCard}>
            <View style={styles.perfIconRow}>
              <View style={[styles.perfIconBox, { backgroundColor: '#F0FDFA' }]}>
                <Eye size={16} color="#0F766E" />
              </View>
              <Text style={styles.perfTrend}>+18.4%</Text>
            </View>
            <Text style={styles.perfVal}>{summary.viewsThisWeek}</Text>
            <Text style={styles.perfLabel}>Views This Week</Text>
          </View>

          <View style={styles.performanceCard}>
            <View style={styles.perfIconRow}>
              <View style={[styles.perfIconBox, { backgroundColor: '#FEF3C7' }]}>
                <UserCheck size={16} color="#D97706" />
              </View>
              <Text style={styles.perfTrend}>+4 New</Text>
            </View>
            <Text style={styles.perfVal}>{summary.newLeadsThisWeek}</Text>
            <Text style={styles.perfLabel}>Tenant Inquiries</Text>
          </View>

          <View style={styles.performanceCard}>
            <View style={styles.perfIconRow}>
              <View style={[styles.perfIconBox, { backgroundColor: '#FEE2E2' }]}>
                <Heart size={16} color="#DC2626" />
              </View>
              <Text style={styles.perfTrend}>+12</Text>
            </View>
            <Text style={styles.perfVal}>{summary.savedHomesThisWeek}</Text>
            <Text style={styles.perfLabel}>Saved By Users</Text>
          </View>

          <View style={styles.performanceCard}>
            <View style={styles.perfIconRow}>
              <View style={[styles.perfIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Calendar size={16} color="#2563EB" />
              </View>
              <Text style={styles.perfTrend}>High</Text>
            </View>
            <Text style={styles.perfVal}>{summary.visitRequestsThisWeek}</Text>
            <Text style={styles.perfLabel}>Visit Requests</Text>
          </View>
        </View>

        {/* ===================================================================
            4. OWNER ECOSYSTEM NAVIGATION TILES (AIRBNB HOST SUITE)
           =================================================================== */}
        <Text style={styles.sectionTitle}>MANAGEMENT ECOSYSTEM</Text>

        <View style={styles.modulesCard}>
          {/* 1. My Properties */}
          <Pressable
            style={styles.moduleRow}
            onPress={() => router.push('/(owner)/listings' as any)}
          >
            <View style={[styles.moduleIconBox, { backgroundColor: '#F0FDFA' }]}>
              <Building2 size={20} color="#0F766E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.moduleRowTitle}>My Properties & Listings</Text>
              <Text style={styles.moduleRowSub}>
                Grid/List view, pause, edit, status badges & pagination
              </Text>
            </View>
            <View style={styles.moduleRightCol}>
              <Text style={styles.moduleBadgeCount}>{summary.totalProperties}</Text>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </Pressable>

          <View style={styles.moduleDivider} />

          {/* 2. Tenant Leads CRM */}
          <Pressable
            style={styles.moduleRow}
            onPress={() => router.push('/(owner)/leads' as any)}
          >
            <View style={[styles.moduleIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Users size={20} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.moduleRowTitle}>Tenant Leads CRM</Text>
              <Text style={styles.moduleRowSub}>
                Filter by New, Interested, Scheduled, Negotiation & Approved
              </Text>
            </View>
            <View style={styles.moduleRightCol}>
              <View style={styles.pillAlert}>
                <Text style={styles.pillAlertText}>{summary.pendingLeads} New</Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </Pressable>

          <View style={styles.moduleDivider} />

          {/* 3. Visit Management */}
          <Pressable
            style={styles.moduleRow}
            onPress={() => router.push('/(owner)/visits' as any)}
          >
            <View style={[styles.moduleIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Calendar size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.moduleRowTitle}>Visit Calendar & Attendance</Text>
              <Text style={styles.moduleRowSub}>
                Day/Week/Month calendar, QR pass scan, and history
              </Text>
            </View>
            <View style={styles.moduleRightCol}>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </Pressable>

          <View style={styles.moduleDivider} />

          {/* 4. Rent Collection Dashboard */}
          <Pressable
            style={styles.moduleRow}
            onPress={() => router.push('/(owner)/rent-collection' as any)}
          >
            <View style={[styles.moduleIconBox, { backgroundColor: '#DCFCE7' }]}>
              <IndianRupee size={20} color="#16A34A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.moduleRowTitle}>Rent Collection & Reminders</Text>
              <Text style={styles.moduleRowSub}>
                Automated 3-day notices, AutoPay tracking & receipts
              </Text>
            </View>
            <View style={styles.moduleRightCol}>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </Pressable>

          <View style={styles.moduleDivider} />

          {/* 5. Property Analytics */}
          <Pressable
            style={styles.moduleRow}
            onPress={() => router.push('/(owner)/analytics' as any)}
          >
            <View style={[styles.moduleIconBox, { backgroundColor: '#F3E8FF' }]}>
              <BarChart3 size={20} color="#9333EA" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.moduleRowTitle}>Portfolio Analytics & Trends</Text>
              <Text style={styles.moduleRowSub}>
                Views, saves, conversion funnel, 7d/30d/90d charts
              </Text>
            </View>
            <View style={styles.moduleRightCol}>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </Pressable>

          <View style={styles.moduleDivider} />

          {/* 6. Subscription Plans */}
          <Pressable
            style={styles.moduleRow}
            onPress={() => router.push('/(owner)/subscription' as any)}
          >
            <View style={[styles.moduleIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Crown size={20} color="#DC2626" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.moduleRowTitle}>Subscription Plans</Text>
              <Text style={styles.moduleRowSub}>
                Free, Starter ₹299, Pro ₹599, Premium ₹999, Broker & Enterprise
              </Text>
            </View>
            <View style={styles.moduleRightCol}>
              <Text style={styles.activePlanTag}>{planName}</Text>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </Pressable>

          <View style={styles.moduleDivider} />

          {/* 7. Owner Document Center */}
          <Pressable
            style={styles.moduleRow}
            onPress={() => router.push('/(renter)/owner-documents' as any)}
          >
            <View style={[styles.moduleIconBox, { backgroundColor: '#F1F5F9' }]}>
              <FileText size={20} color="#475569" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.moduleRowTitle}>Owner Document Vault</Text>
              <Text style={styles.moduleRowSub}>
                Sale deeds, registered E-Leases, tenant KYC, tax & NOCs
              </Text>
            </View>
            <View style={styles.moduleRightCol}>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </Pressable>

          <View style={styles.moduleDivider} />

          {/* 8. Resident & Society Operations */}
          <Pressable
            style={styles.moduleRow}
            onPress={() => router.push('/(renter)/society' as any)}
          >
            <View style={[styles.moduleIconBox, { backgroundColor: '#F0FDFA' }]}>
              <ShieldCheck size={20} color="#0F766E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.moduleRowTitle}>Resident & Society Operations</Text>
              <Text style={styles.moduleRowSub}>
                Society maintenance dues, gate passes, complaints & services
              </Text>
            </View>
            <View style={styles.moduleRightCol}>
              <View style={[styles.pillAlert, { backgroundColor: '#CCFBF1' }]}>
                <Text style={[styles.pillAlertText, { color: '#0F766E' }]}>Active Hub</Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </Pressable>
        </View>

        {/* Resident & Society Operations Widget Card */}
        <Text style={styles.sectionTitle}>SOCIETY & RESIDENT OPERATIONS</Text>
        <View style={styles.modulesCard}>
          <View style={{ padding: 16, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Building2 size={18} color="#0F766E" />
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F172A' }}>
                  Property Society Status
                </Text>
              </View>
              <View style={[styles.pillAlert, { backgroundColor: '#DCFCE7' }]}>
                <Text style={[styles.pillAlertText, { color: '#15803D' }]}>Verified</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: '#F8FAFC',
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                }}
                onPress={() => router.push('/(renter)/society/maintenance' as any)}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B' }}>
                  SOCIETY DUES
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A', marginTop: 4 }}>
                  ₹4,850
                </Text>
                <Text style={{ fontSize: 10, color: '#0F766E', fontWeight: '700', marginTop: 2 }}>
                  Pay / Track →
                </Text>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: '#F8FAFC',
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                }}
                onPress={() => router.push('/(renter)/society/complaints' as any)}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B' }}>
                  TENANT TICKETS
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A', marginTop: 4 }}>
                  0 Pending
                </Text>
                <Text style={{ fontSize: 10, color: '#15803D', fontWeight: '700', marginTop: 2 }}>
                  All Resolved ✓
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* =====================================================================
          OWNER PROFILE MODAL / BUSINESS IDENTITY
         ===================================================================== */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalBox}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Owner Business Identity</Text>
              <Pressable onPress={() => setProfileModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#64748B' }}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.profileCardInModal}>
              <Image
                source={{
                  uri:
                    ownerProfile?.profile_photo ||
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                }}
                style={styles.profileModalAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.profileModalName}>
                  {ownerProfile?.business_name || user?.name || 'Luxury Landlord'}
                </Text>
                <View style={styles.modalBadgeRow}>
                  <ShieldCheck size={14} color="#059669" />
                  <Text style={styles.modalVerifiedTxt}>REHVO Verified Landlord</Text>
                </View>
              </View>
            </View>

            <View style={styles.profileSpecsList}>
              <View style={styles.profileSpecItem}>
                <Text style={styles.specLabel}>GST Identification</Text>
                <Text style={styles.specValue}>{ownerProfile?.gst_number || '27AABCE1234F1Z5'}</Text>
              </View>
              <View style={styles.profileSpecItem}>
                <Text style={styles.specLabel}>Response Rate</Text>
                <Text style={styles.specValue}>{ownerProfile?.response_rate || 98.5}%</Text>
              </View>
              <View style={styles.profileSpecItem}>
                <Text style={styles.specLabel}>Average Reply Time</Text>
                <Text style={styles.specValue}>{ownerProfile?.avg_reply_time || '15 mins'}</Text>
              </View>
              <View style={styles.profileSpecItem}>
                <Text style={styles.specLabel}>Years on REHVO</Text>
                <Text style={styles.specValue}>{ownerProfile?.years_on_rehvo || 2.5} Years</Text>
              </View>
              <View style={styles.profileSpecItem}>
                <Text style={styles.specLabel}>KYC Status</Text>
                <Text style={[styles.specValue, { color: '#059669' }]}>
                  {ownerProfile?.kyc_status || 'VERIFIED'}
                </Text>
              </View>
            </View>

            <V4Button
              title="Close Profile"
              variant="primary"
              onPress={() => setProfileModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavCenter: {
    alignItems: 'center',
  },
  topNavTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  topNavSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  topNavSubText: {
    fontSize: 11,
    color: '#0F766E',
    fontWeight: '700',
  },
  topNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  navNotifBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  navNotifText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  navProfileBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#0F766E',
    overflow: 'hidden',
  },
  navAvatar: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingTop: 16,
  },

  // ---------------------------------------------------------------------------
  // HERO CARD
  // ---------------------------------------------------------------------------
  heroCard: {
    marginHorizontal: 16,
    backgroundColor: '#064E3B',
    borderRadius: 24,
    padding: 20,
    ...V4_SHADOWS.card,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroSubGreeting: {
    fontSize: 14,
    color: '#A7F3D0',
    fontWeight: '700',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  planBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  verifiedBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  upgradePlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  upgradePlanText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Portfolio Rent Counter
  heroYieldWrap: {
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroYieldLabel: {
    fontSize: 12,
    color: '#A7F3D0',
    fontWeight: '600',
  },
  heroYieldMainRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  heroYieldCurrency: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 2,
  },
  heroYieldAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroYieldPeriod: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1FAE5',
    marginLeft: 4,
  },
  occupancyBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  occupancyBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  occupancyBarFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 3,
  },
  occupancyRateText: {
    fontSize: 11,
    color: '#D1FAE5',
    fontWeight: '700',
  },

  // 6 Metrics Grid
  heroMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    gap: 8,
  },
  heroMetricItem: {
    width: '31%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  heroMetricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  heroMetricLbl: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },

  // ---------------------------------------------------------------------------
  // SECTION HEADERS
  // ---------------------------------------------------------------------------
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
  },

  // ---------------------------------------------------------------------------
  // QUICK ACTIONS
  // ---------------------------------------------------------------------------
  quickActionsScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  quickActionCard: {
    width: 122,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  quickActionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  quickActionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },

  // ---------------------------------------------------------------------------
  // PERFORMANCE THIS WEEK
  // ---------------------------------------------------------------------------
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  performanceCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  perfIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  perfIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfTrend: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  perfVal: {
    fontSize: 22,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    marginTop: 10,
  },
  perfLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },

  // ---------------------------------------------------------------------------
  // MODULES LIST
  // ---------------------------------------------------------------------------
  modulesCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...V4_SHADOWS.soft,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  moduleIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleRowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  moduleRowSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  moduleRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moduleBadgeCount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pillAlert: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pillAlertText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B45309',
  },
  activePlanTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  moduleDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 68,
  },

  // ---------------------------------------------------------------------------
  // GUEST MODE STYLES
  // ---------------------------------------------------------------------------
  guestScrollContent: {
    padding: 16,
  },
  guestHeroCard: {
    backgroundColor: '#064E3B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...V4_SHADOWS.card,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 12,
  },
  guestBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  guestHeroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
  },
  guestHeroSubtitle: {
    fontSize: 13,
    color: '#A7F3D0',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    marginBottom: 18,
  },
  guestStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  guestStatCol: {
    alignItems: 'center',
  },
  guestStatNum: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  guestStatLabel: {
    fontSize: 10,
    color: '#D1FAE5',
    fontWeight: '600',
    marginTop: 2,
  },
  guestStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  guestFeaturesWrap: {
    marginTop: 24,
  },
  guestFeaturesTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginBottom: 12,
  },
  guestFeatureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  guestFeatureIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestFeatureCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  guestFeatureCardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },

  // ---------------------------------------------------------------------------
  // PROFILE MODAL
  // ---------------------------------------------------------------------------
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  profileModalBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  modalCloseBtn: {
    padding: 6,
  },
  profileCardInModal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileModalAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  profileModalName: {
    fontSize: 16,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  modalBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  modalVerifiedTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  profileSpecsList: {
    marginVertical: 16,
    gap: 10,
  },
  profileSpecItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  specLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
});
