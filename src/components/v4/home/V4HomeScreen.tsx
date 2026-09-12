import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Pressable,
  Image,
  Dimensions,
  Modal,
  TextInput,
  Platform,
  Linking,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MapPin,
  Bell,
  Plus,
  PlusCircle,
  Building2,
  Users,
  Home,
  Briefcase,
  Search,
  Mic,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Star,
  Zap,
  CheckCircle2,
  Calendar,
  Wallet,
  Gift,
  ArrowRight,
  TrendingUp,
  Award,
  Crown,
  Lock,
  Headphones,
  FileCheck,
  Video,
  X,
  Navigation,
  Globe,
  Share2,
  CreditCard,
  Heart,
  MessageCircle,
  Hand,
  UserCheck,
  Truck,
  FolderLock,
  CalendarCheck,
  BedDouble,
  Store,
  Layers,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { Property, FlatmateProfile } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS, V4_TYPOGRAPHY } from '../../../theme/v4Theme';
import { V4Badge } from '../ui/V4Badge';
import { V4Button } from '../ui/V4Button';
import { V4SectionHeader } from '../ui/V4SectionHeader';
import { V4PropertyCardLarge } from '../ui/V4PropertyCardLarge';
import { V4PropertyCardSmall } from '../ui/V4PropertyCardSmall';
import { V4PropertyCardSpotlight } from '../ui/V4PropertyCardSpotlight';
import { V4CategoryCard, V4CategoryItem } from '../ui/V4CategoryCard';
import { V4CategoryIntakeModal, IntakeCategoryType } from '../ui/V4CategoryIntakeModal';
import { V4OfferBanner } from '../ui/V4OfferBanner';
import { V4BenefitCard } from '../ui/V4BenefitCard';
import { V4StatsCard } from '../ui/V4StatsCard';
import { V4WalletCard } from '../ui/V4WalletCard';
import { V4BrandLogo } from '../ui/V4BrandLogo';
import { V4Image } from '../ui/V4Image';
import { V4HeroAdBanner, HERO_ADS } from './V4HeroAdBanner';
import { V4Skeleton } from '../ui/V4Skeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 330);



// Asymmetric Category Items
const ASYMMETRIC_CATEGORIES: V4CategoryItem[] = [
  {
    id: 'apartments',
    title: 'Property\nfor Rent',
    subtitle: '1, 2, 3+ BHK • Direct Owner',
    tag: 'RESIDENTIAL',
    icon: Building2,
    iconColor: '#0D9488',
    iconBg: '#F0FDFA',
  },
  {
    id: 'pg',
    title: 'PG & Hostel',
    subtitle: 'Furnished • Single/Shared Room',
    tag: 'PG & HOSTEL',
    icon: BedDouble,
    iconColor: '#8B5CF6',
    iconBg: '#F5F3FF',
  },
  {
    id: 'commercial',
    title: 'Commercial\n& Office',
    subtitle: 'Shops • Workspaces • Boutiques',
    tag: 'BUSINESS',
    icon: Store,
    iconColor: '#0EA5E9',
    iconBg: '#F0F9FF',
  },
  {
    id: 'villas',
    title: 'Luxury Villas',
    subtitle: 'Sea-Facing Penthouses & Towers',
    tag: 'VIP SELECTION',
    icon: Crown,
    iconColor: '#F59E0B',
    iconBg: '#FFFBEB',
  },
  {
    id: 'farmhouses',
    title: 'Farmhouses & Retreats',
    subtitle: 'Private Pool • Weekend Getaways',
    tag: 'WEEKEND STAY',
    icon: Home,
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
  },
];



// Explore Quick Services (8 Curated Rental & Moving Ecosystem Offerings)
interface ExploreServiceItem {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  tagColor?: string;
  tagBg?: string;
  iconName: 'FileCheck' | 'CreditCard' | 'ShieldCheck' | 'Lock' | 'Truck' | 'Sparkles' | 'FolderLock' | 'CalendarCheck';
  iconColor: string;
  iconBg: string;
  route: string;
}

const EXPLORE_SERVICES: ExploreServiceItem[] = [
  {
    id: 'rent_pay',
    title: 'Pay Rent Online',
    subtitle: 'Instant UPI & 1% R-Cash Back',
    tag: 'CASHBACK',
    tagColor: '#047857',
    tagBg: '#D1FAE5',
    iconName: 'CreditCard',
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    route: '/(renter)/pay-rent',
  },
  {
    id: 'agreement',
    title: 'Digital e-Lease',
    subtitle: 'Govt Stamp & Doorstep Biometrics',
    tag: 'GOVT VERIFIED',
    tagColor: '#0F766E',
    tagBg: '#CCFBF1',
    iconName: 'FileCheck',
    iconColor: '#0F766E',
    iconBg: '#F0FDFA',
    route: '/(renter)/rental-agreements',
  },
  {
    id: 'zero_deposit',
    title: 'Zero Deposit Pass',
    subtitle: 'Move In Without Heavy Deposit',
    tag: 'NO LOCK-IN',
    tagColor: '#4338CA',
    tagBg: '#E0E7FF',
    iconName: 'Lock',
    iconColor: '#4F46E5',
    iconBg: '#EEF2FF',
    route: '/(renter)/zero-deposit',
  },
  {
    id: 'verification',
    title: 'Tenant Verification',
    subtitle: 'DigiLocker & Police Background',
    tag: '100% SAFE',
    tagColor: '#0F766E',
    tagBg: '#CCFBF1',
    iconName: 'ShieldCheck',
    iconColor: '#0F766E',
    iconBg: '#F0FDFA',
    route: '/(renter)/kyc',
  },
  {
    id: 'move_in',
    title: 'Move-In Concierge',
    subtitle: 'Checklist, WiFi & Utility Transfer',
    tag: 'ALL-IN-ONE',
    tagColor: '#0F766E',
    tagBg: '#CCFBF1',
    iconName: 'CalendarCheck',
    iconColor: '#0F766E',
    iconBg: '#F0FDFA',
    route: '/(renter)/move-in',
  },
  {
    id: 'movers',
    title: 'Packers & Movers',
    subtitle: 'Porter & Agarwal Relocation',
    tag: 'TRANSIT COVER',
    tagColor: '#16A34A',
    tagBg: '#DCFCE7',
    iconName: 'Truck',
    iconColor: '#16A34A',
    iconBg: '#F0FDF4',
    route: '/(renter)/movers',
  },
  {
    id: 'cleaning',
    title: 'Deep Cleaning',
    subtitle: 'Mechanized Home & Kitchen Sanitization',
    tag: 'DEPOSIT SAFE',
    tagColor: '#0F766E',
    tagBg: '#CCFBF1',
    iconName: 'Sparkles',
    iconColor: '#0F766E',
    iconBg: '#F0FDFA',
    route: '/(renter)/cleaning',
  },
  {
    id: 'vault',
    title: 'Document Vault',
    subtitle: 'Encrypted Leases & HRA Receipts',
    tag: '256-BIT',
    tagColor: '#D97706',
    tagBg: '#FEF3C7',
    iconName: 'FolderLock',
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    route: '/(renter)/document-vault',
  },
];

const renderExploreServiceIcon = (iconName: string, color: string) => {
  const size = 22;
  switch (iconName) {
    case 'FileCheck':
      return <FileCheck size={size} color={color} strokeWidth={2.2} />;
    case 'CreditCard':
      return <CreditCard size={size} color={color} strokeWidth={2.2} />;
    case 'ShieldCheck':
      return <ShieldCheck size={size} color={color} strokeWidth={2.2} />;
    case 'Lock':
      return <Lock size={size} color={color} strokeWidth={2.2} />;
    case 'Truck':
      return <Truck size={size} color={color} strokeWidth={2.2} />;
    case 'Sparkles':
      return <Sparkles size={size} color={color} strokeWidth={2.2} />;
    case 'FolderLock':
      return <FolderLock size={size} color={color} strokeWidth={2.2} />;
    case 'CalendarCheck':
      return <CalendarCheck size={size} color={color} strokeWidth={2.2} />;
    default:
      return <ShieldCheck size={size} color={color} strokeWidth={2.2} />;
  }
};

export const V4HomeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    properties,
    savedPropertyIds,
    recentlyViewedIds,
    toggleSaveProperty,
    fetchProperties,
    fetchNotifications,
    unreadNotificationCount,
    flatmates,
    fetchPublishedFlatmates,
    wavedFlatmateIds,
    sendFlatmateWave,
    setFilter,
    showToast,
    isAuthenticated,
    user,
    wallet,
    recommendations,
    similarSavedProperties,
    nearOfficeProperties,
    trendingProperties,
    zeroDepositProperties,
    luxuryProperties,
    weekendPicks,
    recommendationLoading,
    refreshRecommendations,
    trackPropertyView,
    markRecommendationInterested,
    markRecommendationNotInterested,
  } = useAppStore();

  const savedPropertyIdSet = useMemo(() => new Set(savedPropertyIds || []), [savedPropertyIds]);

  const [heroBgColor, setHeroBgColor] = useState('#F6FBFA');
  const [selectedLocality, setSelectedLocality] = useState('Bandra West, Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [intakeCategory, setIntakeCategory] = useState<IntakeCategoryType | null>(null);

  const handleOpenSearch = useCallback(() => {
    router.push('/(renter)/search' as any);
  }, [router]);

  const handleOpenAi = useCallback(() => {
    router.push('/(renter)/ai' as any);
  }, [router]);

  const handleOpenSaved = useCallback(() => {
    router.push('/(renter)/saved' as any);
  }, [router]);

  const handleOpenWallet = useCallback(() => {
    router.push('/(renter)/wallet' as any);
  }, [router]);

  const handleOpenLocation = useCallback(() => {
    setLocationModalOpen(true);
  }, []);

  useEffect(() => {
    fetchProperties?.();
    fetchPublishedFlatmates?.();
    fetchNotifications?.();
    refreshRecommendations?.();
  }, [fetchProperties, fetchPublishedFlatmates, fetchNotifications, refreshRecommendations]);

  // Fast prefetch of visible properties and AI picks into memory cache
  useEffect(() => {
    const allRecs: (Property | undefined)[] = [
      ...(properties || []).slice(0, 6),
      ...(recommendations || []).slice(0, 6).map((r) => r.property),
      ...(similarSavedProperties || []).slice(0, 4).map((r) => r.property),
      ...(nearOfficeProperties || []).slice(0, 4).map((r) => r.property),
      ...(trendingProperties || []).slice(0, 4),
      ...(zeroDepositProperties || []).slice(0, 4),
    ];
    const urls = allRecs
      .map((p) => p?.images?.[0]?.url)
      .filter(Boolean) as string[];
    if (urls.length > 0) {
      V4Image.prefetch(urls);
    }
  }, [
    properties,
    recommendations,
    similarSavedProperties,
    nearOfficeProperties,
    trendingProperties,
  ]);

  // REHVO V6.3: AI Decision Sections
  const bestValueHomes = useMemo(() => {
    return [...(properties || [])]
      .sort((a, b) => {
        const ratioA = (a.rent || 40000) / Math.max(1, a.area_sqft || 800);
        const ratioB = (b.rent || 40000) / Math.max(1, b.area_sqft || 800);
        return ratioA - ratioB;
      })
      .slice(0, 8);
  }, [properties]);

  const bestInvestmentPicks = useMemo(() => {
    return [...(properties || [])]
      .filter((p) => (p.rent || 0) >= 35000)
      .slice(0, 8);
  }, [properties]);

  const nearMetroPicks = useMemo(() => {
    return [...(properties || [])]
      .filter(
        (p) =>
          (p.locality || '').toLowerCase().includes('andheri') ||
          (p.locality || '').toLowerCase().includes('bkc') ||
          (p.locality || '').toLowerCase().includes('bandra') ||
          (p.locality || '').toLowerCase().includes('malad')
      )
      .slice(0, 8);
  }, [properties]);

  const safeNeighborhoodPicks = useMemo(() => {
    return [...(properties || [])]
      .filter(
        (p) =>
          (p.locality || '').toLowerCase().includes('bkc') ||
          (p.locality || '').toLowerCase().includes('bandra') ||
          (p.locality || '').toLowerCase().includes('powai') ||
          (p.locality || '').toLowerCase().includes('worli')
      )
      .slice(0, 8);
  }, [properties]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchProperties?.(),
        fetchPublishedFlatmates?.(),
        fetchNotifications?.(),
        refreshRecommendations?.(),
      ]);
    } catch {
      // Refresh error handled silently
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchProperties, fetchPublishedFlatmates, fetchNotifications, refreshRecommendations]);

  const handleSelectProperty = useCallback((property: Property) => {
    trackPropertyView?.(property.id);
    router.push(`/(renter)/property/${property.id}` as any);
  }, [router, trackPropertyView]);

  const handleHeroAdPress = useCallback((route: string) => {
    router.push(route as any);
  }, [router]);

  const handleWaveFlatmate = useCallback((flatmate: FlatmateProfile) => {
    if (!isAuthenticated) {
      router.push('/(renter)/login' as any);
      return;
    }
    sendFlatmateWave(flatmate.id, flatmate.name, flatmate.avatar, flatmate.locality);
  }, [isAuthenticated, router, sendFlatmateWave]);

  // Real Categorized Feeds
  const zeroBrokerageHomes = useMemo(() => {
    return (properties || []).filter((p) => p.brokerage === 0).slice(0, 10);
  }, [properties]);

  const luxuryHomes = useMemo(() => {
    return (properties || []).filter((p) => (p.rent || 0) >= 75000).slice(0, 10);
  }, [properties]);

  const affordableHomes = useMemo(() => {
    return (properties || []).filter((p) => (p.rent || 0) <= 35000).slice(0, 10);
  }, [properties]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 90 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={V4_COLORS.primary}
            colors={[V4_COLORS.primary]}
          />
        }
      >
        {/* =====================================================================
            1-3. UNIFIED HEADER + HERO AD STAGE + SEARCH BAR
           ===================================================================== */}
        <View
          style={[
            styles.unifiedHeroHeaderContainer,
            {
              paddingTop: Math.max(insets.top, 14) + 6,
              backgroundColor: heroBgColor || '#F6FBFA',
            },
          ]}
        >
          {/* Top Search & Action Icons Row */}
          <View style={styles.topHeaderRow}>
            {/* Search Pill Input */}
            <Pressable
              style={styles.headerSearchPill}
              onPress={handleOpenSearch}
            >
              <Search size={17} color="#64748B" strokeWidth={2.4} />
              <Text style={styles.headerSearchPlaceholder} numberOfLines={1}>
                Search for "2 BHK in Bandra West, PG..."
              </Text>
            </Pressable>

            {/* Right Action Icons: AI, Saved & Wallet */}
            <View style={styles.topRightActions}>
              {/* REHVO AI Assistant Icon Button */}
              <Pressable
                style={[styles.topHeaderIconBtn, { backgroundColor: '#CCFBF1' }]}
                onPress={handleOpenAi}
                hitSlop={8}
              >
                <Sparkles size={17} color={V4_COLORS.primary} strokeWidth={2.4} />
              </Pressable>

              {/* Saved Items Icon Button */}
              <Pressable
                style={styles.topHeaderIconBtn}
                onPress={handleOpenSaved}
                hitSlop={8}
              >
                <Heart
                  size={18}
                  color={isAuthenticated && savedPropertyIds.length > 0 ? '#EF4444' : '#031B2A'}
                  fill={isAuthenticated && savedPropertyIds.length > 0 ? '#EF4444' : 'transparent'}
                  strokeWidth={2.2}
                />
                {isAuthenticated && savedPropertyIds.length > 0 && (
                  <View style={styles.topHeaderBadge}>
                    <Text style={styles.topHeaderBadgeText}>
                      {savedPropertyIds.length}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Wallet Hub Icon Button */}
              <Pressable
                style={styles.topHeaderIconBtn}
                onPress={handleOpenWallet}
                hitSlop={8}
              >
                <Wallet size={18} color="#0F766E" strokeWidth={2.4} />
                <View style={styles.topHeaderWalletDot} />
              </Pressable>
            </View>
          </View>

          {/* Location Dropdown Row */}
          <Pressable
            style={styles.localitySelectorRow}
            onPress={handleOpenLocation}
          >
            <View style={styles.localityPulseDot} />
            <MapPin size={11} color="#0F766E" strokeWidth={2.6} />
            <Text style={styles.localityText} numberOfLines={1}>
              {selectedLocality}
            </Text>
            <ChevronDown size={11} color="#64748B" strokeWidth={2.4} />
          </Pressable>

          {/* Hero Banner Ad Content */}
          <V4HeroAdBanner
            onPressAd={handleHeroAdPress}
            onBgColorChange={setHeroBgColor}
          />
        </View>

        {/* =====================================================================
            4. QUICK CATEGORIES (RENT PROPERTIES: 3 ASYMMETRIC CARDS)
           ===================================================================== */}
        <V4SectionHeader
          title="Rent Properties"
          subtitle="Direct owner rentals across Mumbai & metro cities"
          actionText="See All →"
          onActionPress={() => router.push('/(renter)/search' as any)}
        />

        <View style={styles.categoryGridWrapper}>
          {/* Left Large Tall Card: Property for Rent */}
          <V4CategoryCard
            item={ASYMMETRIC_CATEGORIES[0]}
            variant="tall"
            onPress={() => setIntakeCategory('rental')}
          />

          {/* Right Stacked 2 Cards: PG & Hostel & Commercial */}
          <View style={styles.rightCategoryStack}>
            <V4CategoryCard
              item={ASYMMETRIC_CATEGORIES[1]}
              variant="compact"
              onPress={() => setIntakeCategory('pg')}
            />
            <V4CategoryCard
              item={ASYMMETRIC_CATEGORIES[2]}
              variant="compact"
              onPress={() => setIntakeCategory('commercial')}
            />
          </View>
        </View>

        {/* =====================================================================
            FLATMATES (VERIFIED FLATMATES & ROOMMATE BANNER)
           ===================================================================== */}
        <V4SectionHeader
          title="Find Your Ideal Flatmate"
          subtitle="Match by lifestyle, vibe, diet & work schedule in Mumbai"
          actionText="See All →"
          onActionPress={() => router.push('/(renter)/flatmates' as any)}
        />

        {/* Horizontal Flatmates Carousel */}
        {flatmates && flatmates.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatmateCardsScroll}
          >
            {flatmates.map((fm) => {
              const hasWaved = wavedFlatmateIds.includes(fm.id);
              return (
                <View key={fm.id} style={styles.flatmateCard}>
                  {/* Top Row: Avatar & Match Badge */}
                  <View style={styles.fmTopRow}>
                    <View style={styles.fmAvatarWrapper}>
                      <Image
                        source={{
                          uri:
                            fm.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
                        }}
                        style={styles.fmAvatar}
                      />
                      <View style={styles.fmOnlineDot} />
                    </View>

                    <View style={styles.fmMatchPill}>
                      <Sparkles size={11} color="#0F766E" strokeWidth={2.6} />
                      <Text style={styles.fmMatchText}>{fm.match_score || 92}% Match</Text>
                    </View>
                  </View>

                  {/* Name & Occupation */}
                  <View style={styles.fmDetailsCol}>
                    <View style={styles.fmNameRow}>
                      <Text style={styles.fmName}>{fm.name}</Text>
                      {fm.age ? <Text style={styles.fmAge}>, {fm.age}</Text> : null}
                      {(fm.is_kyc_verified || fm.kyc_status === 'verified') && (
                        <ShieldCheck
                          size={13}
                          color="#16A34A"
                          strokeWidth={2.6}
                          style={{ marginLeft: 4 }}
                        />
                      )}
                    </View>
                    <Text style={styles.fmOccupation} numberOfLines={1}>
                      {fm.occupation || 'Professional'}
                    </Text>
                  </View>

                  {/* Preferred Area & Budget */}
                  <View style={styles.fmBudgetRow}>
                    <View style={styles.fmLocalityPill}>
                      <MapPin size={10} color="#64748B" />
                      <Text style={styles.fmLocalityText} numberOfLines={1}>
                        {fm.locality || fm.city || 'Mumbai'}
                      </Text>
                    </View>
                    <Text style={styles.fmBudgetText}>
                      ₹{((fm.budget_min || 0) / 1000).toFixed(0)}k–₹{((fm.budget_max || 35000) / 1000).toFixed(0)}k/mo
                    </Text>
                  </View>

                  {/* Lifestyle Habit Tags */}
                  <View style={styles.fmTagsWrap}>
                    {(fm.lifestyle_preferences || ['🚭 Non-Smoker', '💻 Hybrid WFH']).slice(0, 3).map((tag, tIdx) => (
                      <View key={tIdx} style={styles.fmTagPill}>
                        <Text style={styles.fmTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.fmActionsRow}>
                    <Pressable
                      style={[styles.fmWaveBtn, hasWaved && styles.fmWaveBtnActive]}
                      onPress={() => handleWaveFlatmate(fm)}
                    >
                      <Text style={[styles.fmWaveBtnText, hasWaved && styles.fmWaveBtnTextActive]}>
                        {hasWaved ? '✓ Waved' : '👋 Wave & Say Hi'}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={styles.fmProfileBtn}
                      onPress={() => router.push(`/(renter)/flatmate/${fm.id}` as any)}
                    >
                      <ChevronRight size={16} color="#0F766E" strokeWidth={2.4} />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: '#F8FAFC',
              borderRadius: 16,
              padding: 18,
              alignItems: 'center',
              gap: 10,
              borderWidth: 1,
              borderColor: '#E2E8F0',
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={24} color="#059669" />
            </View>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F172A' }}>
              Looking for a Flatmate in Mumbai?
            </Text>
            <Text style={{ fontSize: 12.5, color: '#64748B', textAlign: 'center', lineHeight: 17 }}>
              Create your verified flatmate profile to match with compatible roommates and receive waves with verified listing.
            </Text>
            <Pressable
              style={{
                backgroundColor: '#059669',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginTop: 4,
              }}
              onPress={() => router.push('/(renter)/flatmate/create' as any)}
            >
              <PlusCircle size={14} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>
                Create Roommate Profile
              </Text>
            </Pressable>
          </View>
        )}

        {/* AI Roommate Matchmaker Banner Card */}
        <View style={styles.flatmateMatchmakerCard}>
          <View style={styles.fmBannerBadge}>
            <Sparkles size={11} color="#FFFFFF" strokeWidth={2.8} />
            <Text style={styles.fmBannerBadgeText}>VERIFIED ROOMMATES</Text>
          </View>
          <Text style={styles.fmBannerTitle}>Looking for a Room or Flatmate?</Text>
          <Text style={styles.fmBannerDesc}>
            Match with verified working pros & students in Mumbai based on sleeping habits, diet, smoking, and budget compatibility.
          </Text>

          <View style={styles.fmBannerBtnRow}>
            <Pressable
              style={styles.fmBannerPrimaryBtn}
              onPress={() => router.push('/(renter)/flatmates' as any)}
            >
              <Text style={styles.fmBannerPrimaryBtnText}>Explore Flatmates</Text>
              <ArrowRight size={13} color="#0F766E" strokeWidth={2.8} />
            </Pressable>

            <Pressable
              style={styles.fmBannerSecondaryBtn}
              onPress={() => router.push('/(renter)/flatmate/create' as any)}
            >
              <Text style={styles.fmBannerSecondaryBtnText}>Create Profile</Text>
            </Pressable>
          </View>
        </View>

        {/* =====================================================================
            9. COMMERCIAL (COMMERCIAL & OFFICE QUICK ACTION / INTAKE)
           ===================================================================== */}
        <V4SectionHeader
          title="Commercial & Office"
          subtitle="Direct owner shops, corporate desks, studios & retail"
          actionText="See All →"
          onActionPress={() => router.push('/(renter)/commercial' as any)}
        />
        <View style={{ paddingHorizontal: 16 }}>
          <Pressable
            style={styles.commercialBannerCard}
            onPress={() => setIntakeCategory('commercial')}
          >
            <View style={styles.commercialBannerLeft}>
              <View style={styles.commercialBannerBadge}>
                <Briefcase size={11} color="#0EA5E9" strokeWidth={2.4} />
                <Text style={styles.commercialBannerBadgeText}>COMMERCIAL INTAKE</Text>
              </View>
              <Text style={styles.commercialBannerTitle}>Commercial & Office Spaces</Text>
              <Text style={styles.commercialBannerSub}>
                Find verified boutique retail, shared workspaces, and private offices with verified marketplace.
              </Text>
              <View style={styles.commercialBannerCta}>
                <Text style={styles.commercialBannerCtaText}>Start Custom Intake</Text>
                <ArrowRight size={13} color="#0EA5E9" strokeWidth={2.6} />
              </View>
            </View>
            <View style={styles.commercialGraphicBox}>
              <Store size={38} color="#0EA5E9" strokeWidth={1.8} />
            </View>
          </Pressable>
        </View>

        {/* =====================================================================
            10. SERVICES (EXPLORE SERVICES)
           ===================================================================== */}
        <V4SectionHeader
          title="Explore Services"
          subtitle="Essential tools & perks for tenants and owners"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exploreServicesScroll}
        >
          {EXPLORE_SERVICES.map((srv) => (
            <Pressable
              key={srv.id}
              style={styles.exploreCard}
              onPress={() => router.push(srv.route as any)}
            >
              {/* Top Row: Icon Container + Badge Tag */}
              <View style={styles.exploreTopRow}>
                <View style={[styles.exploreIconBox, { backgroundColor: srv.iconBg }]}>
                  {renderExploreServiceIcon(srv.iconName, srv.iconColor)}
                </View>
                {srv.tag && (
                  <View style={[styles.exploreTag, { backgroundColor: srv.tagBg }]}>
                    <Text style={[styles.exploreTagText, { color: srv.tagColor }]}>
                      {srv.tag}
                    </Text>
                  </View>
                )}
              </View>

              {/* Text Body */}
              <View style={styles.exploreBody}>
                <Text style={styles.exploreTitle} numberOfLines={1}>
                  {srv.title}
                </Text>
                <Text style={styles.exploreSubtitle} numberOfLines={2}>
                  {srv.subtitle}
                </Text>
              </View>

              {/* Footer Action */}
              <View style={styles.exploreFooter}>
                <Text style={styles.exploreFooterText}>Explore</Text>
                <ArrowRight size={12} color={V4_COLORS.primary} strokeWidth={2.5} />
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* =====================================================================
            11. WALLET / REWARDS (BENEFITS)
           ===================================================================== */}
        <V4SectionHeader
          title="Benefits"
          subtitle="Your active rewards, cashback & invite bonuses"
        />

        <View style={styles.benefitsRowContainer}>
          <Pressable
            style={styles.benefitCardPill}
            onPress={() => router.push('/(renter)/wallet' as any)}
          >
            <View style={styles.benefitIconBox}>
              <Text style={{ fontSize: 15 }}>💵</Text>
            </View>
            <View style={styles.benefitTextCol}>
              <Text style={styles.benefitTitle} numberOfLines={1}>R-Cash</Text>
              <Text style={styles.benefitVal}>
                {isAuthenticated ? `₹${Number(wallet?.balance ?? (user as any)?.walletBalance ?? 550).toLocaleString('en-IN')}` : 'Earn 1%'}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.benefitCardPill}
            onPress={() => router.push('/(renter)/rewards' as any)}
          >
            <View style={[styles.benefitIconBox, { backgroundColor: '#E6FFFA' }]}>
              <Text style={{ fontSize: 15 }}>🎁</Text>
            </View>
            <View style={styles.benefitTextCol}>
              <Text style={styles.benefitTitle} numberOfLines={1}>Rewards</Text>
              <Text style={styles.benefitVal}>
                {isAuthenticated ? 'Rewards Hub' : 'Vouchers'}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.benefitCardPill}
            onPress={() => router.push('/(renter)/share-earn' as any)}
          >
            <View style={[styles.benefitIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Text style={{ fontSize: 15 }}>👥</Text>
            </View>
            <View style={styles.benefitTextCol}>
              <Text style={styles.benefitTitle} numberOfLines={1}>Share & Earn</Text>
              <Text style={styles.benefitVal}>
                {isAuthenticated ? '₹300 Bonus' : 'Invite Perks'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* =====================================================================
            12. HOST & EARN (HOST AND EARN 3 CARDS + YIELD ESTIMATOR)
           ===================================================================== */}
        <View style={styles.hostSectionHeader}>
          <Text style={styles.hostSectionTitle}>Host and Earn</Text>
          <Pressable onPress={() => router.push('/(renter)/listing' as any)}>
            <Text style={styles.registerNowLink}>Register now →</Text>
          </Pressable>
        </View>

        <View style={styles.hostCardsRow}>
          {/* Card 1 */}
          <Pressable
            style={styles.hostVerticalCard}
            onPress={() => router.push('/(renter)/listing' as any)}
          >
            <Text style={styles.hostCardTitle}>Earn from your Property</Text>
            <View style={styles.hostCardGraphicBox}>
              <Building2 size={36} color="#0F766E" strokeWidth={2.2} />
              <View style={styles.rupeeTag}>
                <Text style={styles.rupeeTagText}>₹</Text>
              </View>
            </View>
          </Pressable>

          {/* Card 2 */}
          <Pressable
            style={styles.hostVerticalCard}
            onPress={() => router.push('/(renter)/rental-agreements' as any)}
          >
            <Text style={styles.hostCardTitle}>Hassle-free tenant lease</Text>
            <View style={styles.hostCardGraphicBox}>
              <FileCheck size={36} color="#10B981" strokeWidth={2.2} />
            </View>
          </Pressable>

          {/* Card 3 */}
          <Pressable
            style={styles.hostVerticalCard}
            onPress={() => router.push('/(renter)/manage-properties' as any)}
          >
            <Text style={styles.hostCardTitle}>Calculate future yield</Text>
            <View style={styles.hostCardGraphicBox}>
              <TrendingUp size={36} color="#F59E0B" strokeWidth={2.2} />
            </View>
          </Pressable>
        </View>

        {/* REHVO AI Rental Income Estimator Teaser (Compact Promotional Card) */}
        <Pressable
          style={styles.estimatorTeaserCard}
          onPress={() => router.push('/(renter)/rental-estimator' as any)}
        >
          <View style={styles.estimatorTeaserLeft}>
            <View style={styles.estimatorBadge}>
              <Sparkles size={11} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.estimatorBadgeText}>🏡 Own a Property?</Text>
            </View>
            <Text style={styles.estimatorTitle}>Estimate Your Rental Income</Text>
            <Text style={styles.estimatorSubtitle}>
              Know how much your flat could earn in Mumbai, Pune, Bangalore and more.
            </Text>
            <View style={styles.estimatorCtaRow}>
              <Text style={styles.estimatorCtaText}>Estimate Now</Text>
              <ArrowRight size={13} color="#0F766E" strokeWidth={2.6} />
            </View>
          </View>

          <View style={styles.estimatorGraphicBox}>
            <View style={styles.estimatorIconCircle}>
              <TrendingUp size={24} color="#0F766E" strokeWidth={2.2} />
            </View>
            <View style={styles.estimatorYieldBadge}>
              <Text style={styles.estimatorYieldText}>Up to 6.2% Yield</Text>
            </View>
          </View>
        </Pressable>

        {/* =====================================================================
            AI OPERATING SYSTEM BANNERS & RECOMMENDATIONS (STRICTLY AFTER HOST & EARN)
           ===================================================================== */}
        {/* REHVO V6.3: AI Property Compare & Decision Banner */}
        <Pressable
          onPress={() => router.push('/(renter)/compare' as any)}
          style={styles.aiCompareBanner}
        >
          <View style={styles.aiCompareIconCol}>
            <Layers size={22} color="#FFFFFF" />
          </View>
          <View style={styles.aiCompareTextCol}>
            <Text style={styles.aiCompareTitle}>Compare Homes Side-by-Side</Text>
            <Text style={styles.aiCompareSub}>
              Full matrix, hidden cost breakdown & rent vs buy analytics
            </Text>
          </View>
          <ChevronRight size={20} color="#2DD4BF" />
        </Pressable>

        {/* REHVO V6.4: REHVO AI Flagship Operating System Banner */}
        <Pressable
          onPress={() => router.push('/(renter)/ai' as any)}
          style={styles.rehvoAIBanner}
        >
          <View style={styles.rehvoAIIconCol}>
            <Sparkles size={22} color="#FFFFFF" />
          </View>
          <View style={styles.rehvoAITextCol}>
            <Text style={styles.rehvoAITitle}>Ask REHVO AI Property Concierge</Text>
            <Text style={styles.rehvoAISub}>
              Rent negotiations, lease clause scanner & Mumbai commute intelligence
            </Text>
          </View>
          <ChevronRight size={20} color="#2DD4BF" />
        </Pressable>

        {/* Skeleton Shimmer State while AI is generating recommendations */}
        {recommendationLoading && (!recommendations || recommendations.length === 0) && (
          <View style={styles.recommendationSection}>
            <V4SectionHeader
              title="Curating Your AI Picks..."
              subtitle="Analyzing budget, commute and aesthetic preferences"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {[1, 2, 3].map((idx) => (
                <V4Skeleton.Card
                  key={idx}
                  style={{ width: CAROUSEL_CARD_WIDTH, marginHorizontal: 8 }}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 13. ✨ Recommended For You */}
        {recommendations && recommendations.length > 0 && (
          <View style={styles.recommendationSection}>
            <V4SectionHeader
              title="Recommended For You"
              subtitle="AI-scored homes tailored to your lifestyle & budget"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/search' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {recommendations.map((item) => (
                <V4PropertyCardLarge
                  key={`rec-${item.property.id}`}
                  property={item.property}
                  aiMatchScore={item.score}
                  whyThisBadge={item.matchReasons?.[0] || 'Top AI Match'}
                  isZeroDeposit={item.isZeroDeposit}
                  cardWidth={CAROUSEL_CARD_WIDTH}
                  isSaved={savedPropertyIdSet.has(item.property.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                  onNotInterested={markRecommendationNotInterested}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 14. 💎 Best Value Homes */}
        {bestValueHomes && bestValueHomes.length > 0 && (
          <View style={styles.recommendationSection}>
            <V4SectionHeader
              title="Best Value Homes"
              subtitle="Maximum living area & premium amenities per rupee"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/compare' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {bestValueHomes.map((prop) => (
                <V4PropertyCardLarge
                  key={`val-${prop.id}`}
                  property={prop}
                  whyThisBadge="High Space Value"
                  cardWidth={CAROUSEL_CARD_WIDTH}
                  isSaved={savedPropertyIdSet.has(prop.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                  onNotInterested={markRecommendationNotInterested}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 15. 📈 Best Investment Homes */}
        {bestInvestmentPicks && bestInvestmentPicks.length > 0 && (
          <View style={styles.recommendationSection}>
            <V4SectionHeader
              title="Best Investment Homes"
              subtitle="Top rental yields, tenant velocity & capital appreciation"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/compare' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {bestInvestmentPicks.map((prop) => (
                <V4PropertyCardLarge
                  key={`inv-${prop.id}`}
                  property={prop}
                  whyThisBadge="Top Yield Pick"
                  cardWidth={CAROUSEL_CARD_WIDTH}
                  isSaved={savedPropertyIdSet.has(prop.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                  onNotInterested={markRecommendationNotInterested}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 16. 🚇 Near Metro */}
        {nearMetroPicks && nearMetroPicks.length > 0 && (
          <View style={styles.recommendationSection}>
            <V4SectionHeader
              title="Near Metro"
              subtitle="Under 800m walk to Metro Line 2A, 3 & 7 corridors"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/map' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {nearMetroPicks.map((prop) => (
                <V4PropertyCardLarge
                  key={`metro-${prop.id}`}
                  property={prop}
                  whyThisBadge="Near Metro Station"
                  cardWidth={CAROUSEL_CARD_WIDTH}
                  isSaved={savedPropertyIdSet.has(prop.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                  onNotInterested={markRecommendationNotInterested}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 17. 🛡️ Safe Neighborhoods */}
        {safeNeighborhoodPicks && safeNeighborhoodPicks.length > 0 && (
          <View style={styles.recommendationSection}>
            <V4SectionHeader
              title="Safe Neighborhoods"
              subtitle="A+ rated safety zones with active 24x7 police beats & low crime"
              actionText="See All →"
              onActionPress={() =>
                router.push(
                  `/(renter)/neighborhood/${encodeURIComponent(
                    safeNeighborhoodPicks[0]?.locality || 'BKC'
                  )}` as any
                )
              }
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {safeNeighborhoodPicks.map((prop) => (
                <V4PropertyCardLarge
                  key={`safe-${prop.id}`}
                  property={prop}
                  whyThisBadge="Safety Grade A+"
                  cardWidth={CAROUSEL_CARD_WIDTH}
                  isSaved={savedPropertyIdSet.has(prop.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                  onNotInterested={markRecommendationNotInterested}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 18. ❤️ Similar to Saved */}
        {similarSavedProperties && similarSavedProperties.length > 0 && (
          <View style={styles.recommendationSection}>
            <V4SectionHeader
              title="Similar To Saved"
              subtitle="Homes matching the floor plan & vibe of your wishlist"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/saved' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {similarSavedProperties.map((item) => (
                <V4PropertyCardLarge
                  key={`sim-${item.property.id}`}
                  property={item.property}
                  aiMatchScore={item.score}
                  whyThisBadge={item.matchReasons?.[0] || 'Matches Wishlist'}
                  isZeroDeposit={item.isZeroDeposit}
                  cardWidth={CAROUSEL_CARD_WIDTH}
                  isSaved={savedPropertyIdSet.has(item.property.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                  onNotInterested={markRecommendationNotInterested}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 19. 📍 Near Your Office */}
        {nearOfficeProperties && nearOfficeProperties.length > 0 && (
          <View style={styles.recommendationSection}>
            <V4SectionHeader
              title="Near Your Office"
              subtitle="Direct 15-20 min commute to BKC, Lower Parel & Goregaon"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/map' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {nearOfficeProperties.map((item) => (
                <V4PropertyCardLarge
                  key={`office-${item.property.id}`}
                  property={item.property}
                  aiMatchScore={item.score}
                  whyThisBadge={item.matchReasons?.[0] || 'Easy Commute'}
                  isZeroDeposit={item.isZeroDeposit}
                  cardWidth={CAROUSEL_CARD_WIDTH}
                  isSaved={savedPropertyIdSet.has(item.property.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                  onNotInterested={markRecommendationNotInterested}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 20. 🔥 Trending Right Now */}
        {trendingProperties && trendingProperties.length > 0 && (
          <View style={styles.recommendationSection}>
            <V4SectionHeader
              title="Trending Right Now"
              subtitle="Most enquired & viewed homes across Mumbai this week"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/search' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {trendingProperties.map((prop) => (
                <V4PropertyCardLarge
                  key={`trend-${prop.id}`}
                  property={prop}
                  whyThisBadge="Trending 🔥"
                  cardWidth={CAROUSEL_CARD_WIDTH}
                  isSaved={savedPropertyIdSet.has(prop.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                  onNotInterested={markRecommendationNotInterested}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Zero Deposit Picks */}
        {zeroDepositProperties && zeroDepositProperties.length > 0 && (
          <View style={styles.recommendationSection}>
            <V4SectionHeader
              title="Zero Deposit Picks"
              subtitle="Move in without heavy lock-in deposits • Zero fee"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/zero-deposit' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {zeroDepositProperties.map((prop) => (
                <V4PropertyCardLarge
                  key={`zero-${prop.id}`}
                  property={prop}
                  isZeroDeposit={true}
                  whyThisBadge="0 Deposit Pass"
                  cardWidth={CAROUSEL_CARD_WIDTH}
                  isSaved={savedPropertyIdSet.has(prop.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                  onNotInterested={markRecommendationNotInterested}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 21. 🌿 Luxury Emerald Collection & Luxury Residences */}
        {luxuryProperties && luxuryProperties.length > 0 && (
          <View style={styles.recommendationSection}>
            <V4SectionHeader
              title="Luxury Emerald Collection"
              subtitle="Penthouses, sea-facing suites & gated high-rises"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/search' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {luxuryProperties.map((prop) => (
                <V4PropertyCardLarge
                  key={`lux-rec-${prop.id}`}
                  property={prop}
                  whyThisBadge="Emerald Collection 🌿"
                  cardWidth={CAROUSEL_CARD_WIDTH}
                  isSaved={savedPropertyIdSet.has(prop.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                  onNotInterested={markRecommendationNotInterested}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {luxuryHomes.length > 0 && (
          <>
            <V4SectionHeader
              title="Luxury Residences"
              subtitle="Premium penthouses, sea-facing suites & private villas"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/search' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingScroll}
            >
              {luxuryHomes.map((property) => (
                <V4PropertyCardSmall
                  key={`lux-${property.id}`}
                  property={property}
                  isSaved={savedPropertyIdSet.has(property.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* 22. 🏡 Weekend Picks & Pocket-Friendly Homes */}
        {weekendPicks && weekendPicks.length > 0 && (
          <View style={styles.recommendationSection}>
            <V4SectionHeader
              title="Weekend Tour Picks"
              subtitle="Instant key handover & verified physical inspection slots"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/visits' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {weekendPicks.map((prop) => (
                <V4PropertyCardLarge
                  key={`wknd-${prop.id}`}
                  property={prop}
                  whyThisBadge="Weekend Slot Open"
                  cardWidth={CAROUSEL_CARD_WIDTH}
                  isSaved={savedPropertyIdSet.has(prop.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                  onNotInterested={markRecommendationNotInterested}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {affordableHomes.length > 0 && (
          <>
            <V4SectionHeader
              title="Pocket-Friendly Homes"
              subtitle="High quality budget rentals under ₹35,000/mo"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/search' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingScroll}
            >
              {affordableHomes.map((property) => (
                <V4PropertyCardSmall
                  key={`aff-${property.id}`}
                  property={property}
                  isSaved={savedPropertyIdSet.has(property.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                />
              ))}
            </ScrollView>
          </>
        )}

        {zeroBrokerageHomes.length > 0 && (
          <>
            <V4SectionHeader
              title="100% Verified Marketplace Homes"
              subtitle="Direct landlord connect with verified property experts commissions"
              actionText="See All →"
              onActionPress={() => router.push('/(renter)/flats' as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingScroll}
            >
              {zeroBrokerageHomes.map((property) => (
                <V4PropertyCardSmall
                  key={`zb-${property.id}`}
                  property={property}
                  isSaved={savedPropertyIdSet.has(property.id)}
                  onToggleSave={toggleSaveProperty}
                  onSelect={handleSelectProperty}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* LUXURY SPOTLIGHT */}
        <View style={{ paddingHorizontal: 16 }}>
          <V4PropertyCardSpotlight
            title="Lodha Altamount Sea-Facing Sky Villa"
            developer="Lodha Luxury Living"
            locality="Altamount Road, South Mumbai"
            price="₹1,85,000/mo"
            badge="VIP LAUNCH • VERIFIED LISTING"
            offer="1 Month Free Club & Spa Membership"
            onPress={() => router.push('/(renter)/search' as any)}
          />
        </View>

        {/* RATE US BANNER */}
        <View style={styles.rateUsCard}>
          <View style={styles.rateUsLeft}>
            <Text style={styles.rateUsHeading}>Loving the REHVO App experience?</Text>
            <Pressable onPress={() => showToast?.('Thank you for rating REHVO! ⭐⭐⭐⭐⭐', 'success')}>
              <Text style={styles.rateUsLink}>RATE US ↗</Text>
            </Pressable>
          </View>
          <View style={styles.rateUsStars}>
            <Text style={{ fontSize: 16 }}>⭐⭐⭐⭐⭐</Text>
          </View>
        </View>

        {/* 4 TRUST PILLARS */}
        <View style={styles.fourTrustCard}>
          <View style={styles.trustGridRow}>
            <View style={styles.trustPillar}>
              <ShieldCheck size={22} color="#0F766E" strokeWidth={2.4} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.trustPillarTitle}>100% Secured Deposit</Text>
                <Text style={styles.trustPillarSub}>Hassle Free</Text>
              </View>
            </View>

            <View style={styles.trustPillar}>
              <MapPin size={22} color="#10B981" strokeWidth={2.4} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.trustPillarTitle}>Verified Location</Text>
                <Text style={styles.trustPillarSub}>Anywhere Anytime</Text>
              </View>
            </View>
          </View>

          <View style={[styles.trustGridRow, { marginTop: 16 }]}>
            <View style={styles.trustPillar}>
              <Award size={22} color="#F59E0B" strokeWidth={2.4} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.trustPillarTitle}>25k+ Top Rated</Text>
                <Text style={styles.trustPillarSub}>Properties in India</Text>
              </View>
            </View>

            <View style={styles.trustPillar}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F766E' }}>₹</Text>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.trustPillarTitle}>Best Value</Text>
                <Text style={styles.trustPillarSub}>Verified Listing</Text>
              </View>
            </View>
          </View>
        </View>

        {/* =====================================================================
            23. BRANDING & SOCIAL FOOTER
           ===================================================================== */}
        <View style={styles.footerContainer}>
          <V4BrandLogo
            variant="stacked"
            size="lg"
            theme="dark"
            showTagline={true}
            taglineText="DRIVING INDIA'S RENTAL REVOLUTION"
          />
          <Text style={styles.footerCrafted}>Crafted with 💚 in India</Text>

          <Text style={styles.footerFollowHeading}>Follow Us On Social</Text>
          <View style={styles.socialIconsRow}>
            {/* Instagram */}
            <Pressable
              style={styles.socialBtn}
              onPress={() => Linking.openURL('https://instagram.com').catch(() => {})}
              hitSlop={8}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  ry="5"
                  stroke="#E1306C"
                  strokeWidth="2"
                  fill="none"
                />
                <Circle cx="12" cy="12" r="4" stroke="#E1306C" strokeWidth="2" fill="none" />
                <Circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C" />
              </Svg>
            </Pressable>

            {/* X / Twitter */}
            <Pressable
              style={styles.socialBtn}
              onPress={() => Linking.openURL('https://twitter.com').catch(() => {})}
              hitSlop={8}
            >
              <Svg width={15} height={15} viewBox="0 0 24 24">
                <Path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  fill="#031B2A"
                />
              </Svg>
            </Pressable>

            {/* LinkedIn */}
            <Pressable
              style={styles.socialBtn}
              onPress={() => Linking.openURL('https://linkedin.com').catch(() => {})}
              hitSlop={8}
            >
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Path
                  d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                  stroke="#0A66C2"
                  strokeWidth="2"
                  fill="none"
                />
                <Rect x="2" y="9" width="4" height="12" stroke="#0A66C2" strokeWidth="2" fill="none" />
                <Circle cx="4" cy="4" r="2" fill="#0A66C2" />
              </Svg>
            </Pressable>

            {/* YouTube */}
            <Pressable
              style={styles.socialBtn}
              onPress={() => Linking.openURL('https://youtube.com').catch(() => {})}
              hitSlop={8}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path
                  d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
                  stroke="#FF0000"
                  strokeWidth="1.8"
                  fill="none"
                />
                <Path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54z" fill="#FF0000" />
              </Svg>
            </Pressable>
          </View>
        </View>

      </ScrollView>

      {/* LOCALITY SELECTOR MODAL */}
      <Modal
        visible={locationModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLocationModalOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setLocationModalOpen(false)}>
          <Pressable style={styles.locationSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <View style={styles.locationHeader}>
              <Text style={styles.locationSheetTitle}>Select Location</Text>
              <Pressable style={styles.closeBtn} onPress={() => setLocationModalOpen(false)}>
                <X size={16} color="#031B2A" />
              </Pressable>
            </View>

            {/* GPS Shortcut */}
            <Pressable
              style={styles.gpsRow}
              onPress={() => {
                setSelectedLocality('Bandra West, Mumbai (GPS)');
                setLocationModalOpen(false);
                showToast?.('📍 Live GPS location detected: Bandra West', 'success');
              }}
            >
              <View style={styles.gpsIconCircle}>
                <Navigation size={15} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View style={styles.gpsTextCol}>
                <Text style={styles.gpsTitle}>Use Current Location</Text>
                <Text style={styles.gpsSub}>Detect automatically via GPS</Text>
              </View>
              <ChevronRight size={14} color="#94A3B8" />
            </Pressable>

            {/* Localities List */}
            <Text style={styles.localitiesHeading}>Popular Mumbai Localities</Text>
            {['Bandra West', 'Powai Hiranandani', 'Andheri West', 'Worli Sea Face', 'Juhu', 'Lower Parel', 'Thane West', 'BKC G-Block', 'South Mumbai'].map((loc) => (
              <Pressable
                key={loc}
                style={styles.localityItem}
                onPress={() => {
                  setSelectedLocality(`${loc}, Mumbai`);
                  setLocationModalOpen(false);
                }}
              >
                <Building2 size={15} color="#64748B" />
                <Text style={styles.localityItemText}>{loc}</Text>
                <ChevronRight size={13} color="#CBD5E1" style={{ marginLeft: 'auto' }} />
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* CATEGORY INTAKE FILTER POPUP MODAL */}
      <V4CategoryIntakeModal
        visible={!!intakeCategory}
        category={intakeCategory || 'rental'}
        onClose={() => setIntakeCategory(null)}
        onApply={(filters) => {
          const cat = intakeCategory;
          setIntakeCategory(null);
          if (cat === 'rental') {
            router.push({
              pathname: '/(renter)/flats',
              params: filters,
            } as any);
          } else if (cat === 'pg') {
            router.push({
              pathname: '/(renter)/pg',
              params: filters,
            } as any);
          } else if (cat === 'commercial') {
            router.push({
              pathname: '/(renter)/commercial',
              params: filters,
            } as any);
          }
        }}
        onSkip={() => {
          const cat = intakeCategory;
          setIntakeCategory(null);
          if (cat === 'rental') {
            router.push('/(renter)/flats' as any);
          } else if (cat === 'pg') {
            router.push('/(renter)/pg' as any);
          } else if (cat === 'commercial') {
            router.push('/(renter)/commercial' as any);
          }
        }}
      />
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

  // =========================================================================
  // 1. UNIFIED HEADER + HERO AD STAGE (ZOOMCAR STYLE)
  // =========================================================================
  unifiedHeroHeaderContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#E2ECEF',
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  headerSearchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 32,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#031B2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
    gap: 8,
  },
  headerSearchPlaceholder: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    flex: 1,
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
    shadowColor: '#031B2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
  topHeaderWalletDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  localitySelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5.5,
    borderRadius: 16,
    marginTop: 8,
    gap: 4,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#031B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  localityPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 2,
  },
  localityText: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },

  // HERO AD CARD
  heroAdCard: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 4,
  },
  heroSuperTag: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroMainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#031B2A',
    letterSpacing: 1,
    textAlign: 'center',
  },
  heroSubTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.5,
    marginTop: 1,
    marginBottom: 10,
  },
  heroPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 14,
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  heroDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  heroDotActive: {
    width: 18,
    borderRadius: 3,
  },

  // =========================================================================
  // 2. CATEGORY GRID
  // =========================================================================
  categoryGridWrapper: {
    flexDirection: 'row',
    gap: 10,
    height: 250,
    paddingHorizontal: 16,
  },
  rightCategoryStack: {
    flex: 1,
    gap: 10,
  },

  // =========================================================================
  // 3. FLATMATE SECTION STYLES
  // =========================================================================
  flatmateCardsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  flatmateCard: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    ...V4_SHADOWS.soft,
    gap: 8,
  },
  fmTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fmAvatarWrapper: {
    position: 'relative',
  },
  fmAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  fmOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  fmMatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 3,
  },
  fmMatchText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  fmDetailsCol: {
    gap: 2,
  },
  fmNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fmName: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  fmAge: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  fmOccupation: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  fmBudgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFB',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  fmLocalityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  fmLocalityText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  fmBudgetText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  fmTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  fmTagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fmTagText: {
    fontSize: 9.5,
    color: '#475569',
    fontWeight: '600',
  },
  fmActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  fmWaveBtn: {
    flex: 1,
    backgroundColor: '#0F766E',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fmWaveBtnActive: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  fmWaveBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  fmWaveBtnTextActive: {
    color: '#16A34A',
  },
  fmProfileBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E6FFFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },

  // MATCHMAKER BANNER
  flatmateMatchmakerCard: {
    backgroundColor: '#8B5CF6',
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 16,
    ...V4_SHADOWS.card,
    gap: 8,
  },
  fmBannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  fmBannerBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  fmBannerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  fmBannerDesc: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
  },
  fmBannerBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  fmBannerPrimaryBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 4,
  },
  fmBannerPrimaryBtnText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  fmBannerSecondaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  fmBannerSecondaryBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Continue Searching Chips
  continueSearchScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 14,
  },
  continueSearchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  continueSearchChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Commercial Banner Card
  commercialBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...V4_SHADOWS.soft,
    marginBottom: 8,
  },
  commercialBannerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  commercialBannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
    marginBottom: 6,
  },
  commercialBannerBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0EA5E9',
    letterSpacing: 0.5,
  },
  commercialBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  commercialBannerSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  commercialBannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commercialBannerCtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0EA5E9',
  },
  commercialGraphicBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // =========================================================================
  // 4. EXPLORE SERVICES
  // =========================================================================
  exploreServicesScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  exploreCard: {
    width: 172,
    minHeight: 164,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    justifyContent: 'space-between',
    ...V4_SHADOWS.soft,
  },
  exploreTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  exploreIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  exploreTag: {
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  exploreTagText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  exploreBody: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 4,
  },
  exploreTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  exploreSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
  },
  exploreFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  exploreFooterText: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },

  // =========================================================================
  // 5. BENEFITS 3-PILL ROW
  // =========================================================================
  benefitsRowContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 6,
  },
  benefitCardPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    gap: 5,
    ...V4_SHADOWS.soft,
  },
  benefitIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTextCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  benefitTitle: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '700',
  },
  benefitVal: {
    fontSize: 12,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },

  // =========================================================================
  // 6. HOST AND EARN SECTION
  // =========================================================================
  hostSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  hostSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  registerNowLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  hostCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  hostVerticalCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    ...V4_SHADOWS.soft,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  hostCardTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    lineHeight: 16,
  },
  hostCardGraphicBox: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 10,
  },
  rupeeTag: {
    position: 'absolute',
    top: -4,
    right: 12,
    backgroundColor: '#10B981',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rupeeTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  estimatorTeaserCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...V4_SHADOWS.soft,
  },
  estimatorTeaserLeft: {
    flex: 1,
    paddingRight: 12,
  },
  estimatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  estimatorBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  estimatorTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    lineHeight: 18,
  },
  estimatorSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 3,
  },
  estimatorCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  estimatorCtaText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  estimatorGraphicBox: {
    alignItems: 'center',
    gap: 6,
  },
  estimatorIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  estimatorYieldBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  estimatorYieldText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#16A34A',
  },


  // =========================================================================
  // 7. RATE US CARD
  // =========================================================================
  rateUsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  rateUsLeft: {
    flex: 1,
    gap: 4,
  },
  rateUsHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  rateUsLink: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F766E',
    marginTop: 2,
  },
  rateUsStars: {
    marginLeft: 10,
  },

  // =========================================================================
  // 8. 4 TRUST PILLARS
  // =========================================================================
  fourTrustCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    ...V4_SHADOWS.soft,
  },
  trustGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  trustPillar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustPillarTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  trustPillarSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },

  recommendationSection: {
    marginBottom: 8,
  },
  recommendationsScroll: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

  // =========================================================================
  // 9. TRENDING
  // =========================================================================
  trendingScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },

  // =========================================================================
  // 10. FOOTER
  // =========================================================================
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerBrandName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 1,
  },
  footerTagline: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  footerCrafted: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  footerFollowHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 6,
  },
  socialIconsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  socialBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2ECEF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#031B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  // MODAL / LOCATION SHEET
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  locationSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '70%',
    gap: 12,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationSheetTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFFA',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#99F6E4',
    gap: 10,
  },
  gpsIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsTextCol: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  gpsSub: {
    fontSize: 11,
    color: '#115E59',
  },
  localitiesHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  localityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  localityItemText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  emptyFeedBox: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.soft,
  },
  emptyFeedTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
  },
  emptyFeedSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
    maxWidth: 280,
  },
  emptyFeedBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
  },
  emptyFeedBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  localityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  localityChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  localityChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  localityChipTextActive: {
    color: '#FFFFFF',
  },
  localityChipBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  localityChipBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  localityChipBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
  },
  localityChipBadgeTextActive: {
    color: '#FFFFFF',
  },
  aiCompareBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#031B2A',
    borderRadius: 18,
    padding: 16,
    gap: 14,
    ...V4_SHADOWS.card,
  },
  aiCompareIconCol: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCompareTextCol: {
    flex: 1,
    gap: 2,
  },
  aiCompareBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  aiCompareBadge: {
    backgroundColor: '#2DD4BF',
    color: '#031B2A',
    fontSize: 9.5,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  aiCompareTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  aiCompareTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  aiCompareSub: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
  rehvoAIBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    borderRadius: 18,
    padding: 16,
    gap: 14,
    ...V4_SHADOWS.card,
  },
  rehvoAIIconCol: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rehvoAITextCol: {
    flex: 1,
    gap: 2,
  },
  rehvoAIBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  rehvoAIBadge: {
    backgroundColor: '#CCFBF1',
    color: '#064E3B',
    fontSize: 9.5,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  rehvoAITag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A7F3D0',
    letterSpacing: 0.5,
  },
  rehvoAITitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rehvoAISub: {
    fontSize: 11,
    color: '#CCFBF1',
    lineHeight: 15,
  },

});
