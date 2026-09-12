import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  Flame,
  Heart,
  Bookmark,
  Plus,
  ShieldCheck,
  MapPin,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Edit3,
  Eye,
  Check,
  X,
  ChevronRight,
  Shield,
  Zap,
  Building2,
  Compass,
  Star,
  MessageCircle,
  Hand,
  Briefcase,
  Layers,
  Crown,
  Home,
  RefreshCw,
  Send,
  Lock,
  Calendar,
  DollarSign,
  Coffee,
  CheckCheck,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS, V4_RADIUS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import { FlatmateProfile, FlatmateFilter } from '../../../types';
import { V4FlatmatesFilterModal } from '../flatmates/V4FlatmatesFilterModal';
import { V4FlatmateCard } from '../flatmates/V4FlatmateCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 1. Lifestyle Vibe Channels (10 instant filter categories)
const LIFESTYLE_CHANNELS = [
  { id: 'all', label: 'All Flatmates', icon: '✨' },
  { id: 'professionals', label: 'Working Professionals', icon: '💼' },
  { id: 'students', label: 'Students', icon: '🎓' },
  { id: 'girls', label: 'Girls Only', icon: '👩' },
  { id: 'boys', label: 'Boys Only', icon: '👨' },
  { id: 'couples', label: 'Couples Friendly', icon: '👫' },
  { id: 'pets', label: 'Pet Lovers', icon: '🐶' },
  { id: 'veg', label: 'Vegetarian', icon: '🥗' },
  { id: 'night_owls', label: 'Night Owls', icon: '🌙' },
  { id: 'early_birds', label: 'Early Birds', icon: '🌅' },
  { id: 'premium', label: 'Premium Members', icon: '👑' },
];

// 2. Locality Quick Shortcut Chips
const LOCALITY_SHORTCUTS = [
  'Bandra West',
  'Khar West',
  'Santacruz',
  'Pali Hill',
  'Andheri West',
  'Powai',
  'Juhu',
  'BKC',
  'Worli',
  'Lower Parel',
];

// 3. Segmented Mode Types
type SearchMode = 'all' | 'have_room' | 'need_room';

// 4. Hero Promotional / Ad Campaigns
interface HeroAdItem {
  id: string;
  sponsorBadge: string;
  tag: string;
  tagIcon?: string;
  title: string;
  subtitle: string;
  image: string;
  primaryBtn: {
    label: string;
    icon: 'plus' | 'home' | 'building' | 'layers';
    route: string;
    isProfileRoute?: boolean;
  };
  secondaryBtn: {
    label: string;
    icon: 'flame' | 'calendar' | 'plus' | 'search';
    route: string;
  };
}

const FLATMATE_HERO_ADS: HeroAdItem[] = [
  {
    id: 'ad_flatmate_profile',
    sponsorBadge: 'SPONSORED',
    tag: 'REHVO CO-LIVING',
    title: 'Find Your Next Flatmate • Verified Listing',
    subtitle: 'Connect with verified roommates in Bandra, Powai & BKC. 50/50 rent split & instant chats.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
    primaryBtn: {
      label: 'Create Profile',
      icon: 'plus',
      route: '/(renter)/flatmate/create',
      isProfileRoute: true,
    },
    secondaryBtn: {
      label: 'Swipe Deck',
      icon: 'flame',
      route: '/(renter)/flatmate/discover',
    },
  },
  {
    id: 'ad_featured_property',
    sponsorBadge: 'FEATURED HOME',
    tag: 'EXCLUSIVE 3 BHK • BANDRA',
    title: 'Sea-Facing Luxury Penthouse Flat',
    subtitle: 'Fully furnished master suite available for shared rent. Verified listing & instant tour bookings.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    primaryBtn: {
      label: 'View Property',
      icon: 'home',
      route: '/(renter)/property/prop_bandra_sea',
    },
    secondaryBtn: {
      label: 'Schedule Visit',
      icon: 'calendar',
      route: '/(renter)/booking/tour',
    },
  },
  {
    id: 'ad_list_property',
    sponsorBadge: 'OWNER & HOST',
    tag: 'POST FOR FREE',
    title: 'Have a Flat or Spare Room to Rent?',
    subtitle: 'List for 0 fees. Get genuine inquiries from verified working professionals in 24 hours.',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
    primaryBtn: {
      label: 'List Property Free',
      icon: 'building',
      route: '/(renter)/add',
    },
    secondaryBtn: {
      label: 'Post Room',
      icon: 'plus',
      route: '/(renter)/flatmate/create',
    },
  },
  {
    id: 'ad_managed_pg',
    sponsorBadge: 'MANAGED PG',
    tag: 'ALL-INCLUSIVE STAYS',
    title: 'Modern Co-Living from ₹14,999/mo',
    subtitle: 'Private & shared AC rooms with daily meals, high-speed WiFi, gym & housekeeping included.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=85',
    primaryBtn: {
      label: 'Explore PGs',
      icon: 'layers',
      route: '/(renter)/pg',
    },
    secondaryBtn: {
      label: 'Search Homes',
      icon: 'search',
      route: '/(renter)/search',
    },
  },
];

export const V4FlatmatesHomeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    flatmates,
    user,
    myFlatmateProfile,
    savedFlatmateIds,
    matchedFlatmateIds,
    incomingWaves,
    saveFlatmate,
    unsaveFlatmate,
    isFlatmateSaved,
    sendFlatmateWave,
    startOrGetFlatmateConversation,
    fetchFlatmates,
    showToast,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannel, setActiveChannel] = useState('all');
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>('all');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<FlatmateFilter>({});
  const [refreshing, setRefreshing] = useState(false);
  const [wavingMap, setWavingMap] = useState<Record<string, boolean>>({});
  const [activePhotoMap, setActivePhotoMap] = useState<Record<string, number>>({});
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const adScrollRef = React.useRef<ScrollView>(null);

  // Auto-advance promotional ad banner
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveAdIndex((prev) => {
        const nextIndex = (prev + 1) % FLATMATE_HERO_ADS.length;
        adScrollRef.current?.scrollTo({
          x: nextIndex * (SCREEN_WIDTH - 32),
          animated: true,
        });
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.gender && filters.gender !== 'any') count++;
    if (filters.food_preference && filters.food_preference !== 'any') count++;
    if (filters.smoking && filters.smoking !== 'any') count++;
    if (filters.drinking && filters.drinking !== 'any') count++;
    if (filters.pets && filters.pets !== 'any') count++;
    if (filters.verified_only) count++;
    if (filters.budget_min || filters.budget_max) count++;
    return count;
  }, [filters]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFlatmates();
    setRefreshing(false);
  };

  // Filtered Flatmates Logic
  const filteredFlatmates = useMemo(() => {
    return flatmates.filter((fm) => {
      // Locality shortcut filter
      if (selectedLocality) {
        const matchSelectedLoc =
          (fm.locality || '').toLowerCase().includes(selectedLocality.toLowerCase()) ||
          (fm.preferred_localities || fm.preferred_locations || []).some((l) =>
            l.toLowerCase().includes(selectedLocality.toLowerCase())
          );
        if (!matchSelectedLoc) return false;
      }

      // Search query (name, locality, company, college, occupation, city)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = fm.name.toLowerCase().includes(q);
        const matchLoc = (fm.locality || '').toLowerCase().includes(q);
        const matchCity = (fm.city || '').toLowerCase().includes(q);
        const matchPrefLocs = (fm.preferred_localities || fm.preferred_locations || []).some((l) =>
          l.toLowerCase().includes(q)
        );
        const matchProf = (fm.profession || fm.occupation || '').toLowerCase().includes(q);
        const matchCompany = (fm.company_or_college || '').toLowerCase().includes(q);
        if (!matchName && !matchLoc && !matchCity && !matchPrefLocs && !matchProf && !matchCompany) {
          return false;
        }
      }

      // 10 Quick Instant Filter Channels
      if (activeChannel === 'professionals') {
        const occ = (fm.profession || fm.occupation || '').toLowerCase();
        if (occ.includes('student') || occ.includes('intern')) return false;
      } else if (activeChannel === 'students') {
        const occ = (fm.profession || fm.occupation || '').toLowerCase();
        const comp = (fm.company_or_college || '').toLowerCase();
        if (!occ.includes('student') && !comp.includes('college') && !comp.includes('university') && !comp.includes('institute')) {
          return false;
        }
      } else if (activeChannel === 'girls') {
        if (fm.gender?.toLowerCase() !== 'female') return false;
      } else if (activeChannel === 'boys') {
        if (fm.gender?.toLowerCase() !== 'male') return false;
      } else if (activeChannel === 'couples') {
        if (!fm.lifestyle_tags?.some((t) => t.toLowerCase().includes('couple')) && !fm.lifestyle_preferences?.some((t) => t.toLowerCase().includes('couple'))) {
          return false;
        }
      } else if (activeChannel === 'pets') {
        if (
          fm.pets === 'not_allowed' &&
          !fm.lifestyle_tags?.some((t) => t.toLowerCase().includes('pet')) &&
          !fm.lifestyle_preferences?.some((t) => t.toLowerCase().includes('pet'))
        ) {
          return false;
        }
      } else if (activeChannel === 'veg') {
        if (
          fm.food_preference !== 'veg' &&
          fm.food_preference !== 'Vegetarian' &&
          !fm.lifestyle_tags?.some((t) => t.toLowerCase().includes('veg')) &&
          !fm.lifestyle_preferences?.some((t) => t.toLowerCase().includes('veg'))
        ) {
          return false;
        }
      } else if (activeChannel === 'night_owls') {
        if (
          fm.sleep_habit !== 'night_owl' &&
          fm.sleep_habit !== 'Night Owl' &&
          !fm.lifestyle_tags?.some((t) => t.toLowerCase().includes('night')) &&
          !fm.lifestyle_preferences?.some((t) => t.toLowerCase().includes('night'))
        ) {
          return false;
        }
      } else if (activeChannel === 'early_birds') {
        if (
          fm.sleep_habit !== 'early_bird' &&
          fm.sleep_habit !== 'Early Riser' &&
          !fm.lifestyle_tags?.some((t) => t.toLowerCase().includes('early')) &&
          !fm.lifestyle_preferences?.some((t) => t.toLowerCase().includes('early'))
        ) {
          return false;
        }
      } else if (activeChannel === 'premium') {
        if (!fm.is_kyc_verified && !fm.verifications?.is_identity_verified) {
          return false;
        }
      }

      // Advanced filters
      if (filters.gender && filters.gender !== 'any' && filters.gender !== 'All' && fm.gender?.toLowerCase() !== filters.gender.toLowerCase()) {
        return false;
      }
      if (filters.food_preference && filters.food_preference !== 'any' && filters.food_preference !== 'All') {
        const fp = (fm.food_preference || '').toLowerCase();
        const targetFp = filters.food_preference.toLowerCase();
        if (!fp.includes(targetFp) && !targetFp.includes(fp)) return false;
      }
      if (filters.smoking && filters.smoking !== 'any' && filters.smoking !== 'All') {
        if (filters.smoking === 'never' || filters.smoking === 'Non-smoker') {
          if (fm.smoking === 'regular' || fm.smoking === 'occasional' || fm.smoking === 'Regular Smoker') return false;
        }
      }
      if (filters.pets && filters.pets !== 'any' && filters.pets !== 'All') {
        if (filters.pets === 'pet_friendly' || filters.pets === 'Pet Friendly') {
          if (fm.pets === 'not_allowed') return false;
        }
      }
      if (filters.verified_only && !fm.verifications?.is_identity_verified && !fm.is_kyc_verified) {
        return false;
      }
      if (filters.budget_max && fm.budget_max && fm.budget_max > filters.budget_max) {
        return false;
      }
      if (filters.budget_min && fm.budget_min && fm.budget_min < filters.budget_min) {
        return false;
      }

      return true;
    });
  }, [flatmates, searchQuery, activeChannel, selectedLocality, filters]);

  // VIP Recommended Top Synergy Flatmates
  const topSynergyFlatmates = useMemo(() => {
    return flatmates.slice(0, 6);
  }, [flatmates]);

  const handleStartChat = async (flatmate: FlatmateProfile) => {
    const convoId = await startOrGetFlatmateConversation(flatmate);
    router.push(`/(renter)/chat/${convoId}` as any);
  };

  const handleToggleSave = async (flatmateId: string) => {
    if (isFlatmateSaved(flatmateId)) {
      await unsaveFlatmate(flatmateId);
      showToast('Removed from wishlist', 'info');
    } else {
      await saveFlatmate(flatmateId);
      showToast('Saved to your wishlist ❤️', 'success');
    }
  };

  const handleWave = async (flatmate: FlatmateProfile) => {
    if (wavingMap[flatmate.id]) return;
    setWavingMap((prev) => ({ ...prev, [flatmate.id]: true }));
    await sendFlatmateWave(
      flatmate.id,
      flatmate.name,
      flatmate.photos?.[0] || flatmate.avatar_url || flatmate.avatar,
      flatmate.preferred_localities?.[0] || flatmate.locality
    );
    showToast(`👋 Wave sent to ${flatmate.name.split(' ')[0]}!`, 'success');
  };

  const handleNextPhoto = (flatmateId: string, totalPhotos: number, e: any) => {
    e?.stopPropagation?.();
    if (totalPhotos <= 1) return;
    setActivePhotoMap((prev) => ({
      ...prev,
      [flatmateId]: ((prev[flatmateId] || 0) + 1) % totalPhotos,
    }));
  };

  const hasActiveProfile = !!myFlatmateProfile;

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* ========================================================= */}
      {/* 1. LUXURY BALANCED NAVIGATION BAR                         */}
      {/* ========================================================= */}
      <View style={styles.header}>
        {/* Left: Back Button + Title Column */}
        <View style={styles.headerLeftCluster}>
          <Pressable
            style={styles.backBtn}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(renter)/home' as any);
              }
            }}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={19} color="#0F172A" strokeWidth={2.4} />
          </Pressable>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Flatmates</Text>
            <View style={styles.headerLivePill}>
              <View style={styles.headerLiveDot} />
              <Text style={styles.headerLiveText}>Verified Listing • Verified</Text>
            </View>
          </View>
        </View>

        {/* Right Action Cluster */}
        <View style={styles.headerRightBtns}>
          {/* Saved Wishlist Hub */}
          <Pressable
            style={styles.headerIconBtn}
            onPress={() =>
              router.push({
                pathname: '/(renter)/saved',
                params: { tab: 'Flatmates' },
              } as any)
            }
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Saved flatmates"
          >
            <Bookmark size={17} color="#059669" strokeWidth={2.4} />
            {savedFlatmateIds.length > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>
                  {savedFlatmateIds.length}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Waves / Matches Hub */}
          <Pressable
            style={styles.headerIconBtn}
            onPress={() => router.push('/(renter)/flatmate/matches' as any)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Waves and matches"
          >
            <Hand size={17} color="#059669" strokeWidth={2.4} />
            {(matchedFlatmateIds.length > 0 || incomingWaves.length > 0) && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>
                  {matchedFlatmateIds.length + incomingWaves.length}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Profile Section: + Create Profile button if no profile, Avatar if profile exists */}
          {hasActiveProfile ? (
            <Pressable
              style={styles.headerProfileBtn}
              onPress={() => router.push('/(renter)/flatmate/my-profile' as any)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="My flatmate profile"
            >
              <Image
                source={{
                  uri:
                    myFlatmateProfile?.photos?.[0] ||
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                }}
                style={styles.headerAvatar}
              />
              <View style={styles.headerAvatarBadge}>
                <Check size={7} color="#FFFFFF" strokeWidth={3.2} />
              </View>
            </Pressable>
          ) : (
            <Pressable
              style={styles.headerCreateProfileBtn}
              onPress={() => router.push('/(renter)/flatmate/create' as any)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Create flatmate profile"
            >
              <Plus size={13} color="#FFFFFF" strokeWidth={3} />
              <Text style={styles.headerCreateProfileText}>+ Profile</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0F766E" />
        }
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 95 },
        ]}
      >
        {/* ========================================================= */}
        {/* 2. PROMOTIONAL / ADS HERO BANNER CAROUSEL                 */}
        {/* ========================================================= */}
        <View style={styles.adHeroContainer}>
          <ScrollView
            ref={adScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(
                e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32)
              );
              setActiveAdIndex(idx);
            }}
            style={styles.adScroll}
          >
            {FLATMATE_HERO_ADS.map((ad, idx) => (
              <View key={ad.id} style={styles.adCard}>
                <Image source={{ uri: ad.image }} style={styles.adImage} />
                <View style={styles.adGradientOverlay} />

                <View style={styles.adContent}>
                  {/* Top Row: Sponsor Tag & Dots */}
                  <View style={styles.adTopRow}>
                    <View style={styles.adBadgeCluster}>
                      <View style={styles.adSponsorBadge}>
                        <Text style={styles.adSponsorText}>{ad.sponsorBadge}</Text>
                      </View>
                      <View style={styles.adTagPill}>
                        <Sparkles size={11} color="#5EEAD4" />
                        <Text style={styles.adTagText}>{ad.tag}</Text>
                      </View>
                    </View>

                    {/* Pagination Dots */}
                    <View style={styles.adDotsRow}>
                      {FLATMATE_HERO_ADS.map((_, dotIdx) => (
                        <View
                          key={dotIdx}
                          style={[
                            styles.adDot,
                            activeAdIndex === dotIdx && styles.adDotActive,
                          ]}
                        />
                      ))}
                    </View>
                  </View>

                  {/* Title & Description */}
                  <View style={styles.adTitleWrap}>
                    <Text style={styles.adTitle}>{ad.title}</Text>
                    <Text style={styles.adSubtitle} numberOfLines={2}>
                      {ad.subtitle}
                    </Text>
                  </View>

                  {/* Action Buttons Row */}
                  <View style={styles.adActionsRow}>
                    <Pressable
                      style={styles.adCreateProfileBtn}
                      onPress={() => {
                        if (ad.primaryBtn.isProfileRoute) {
                          router.push(
                            hasActiveProfile
                              ? ('/(renter)/flatmate/my-profile' as any)
                              : ('/(renter)/flatmate/create' as any)
                          );
                        } else {
                          router.push(ad.primaryBtn.route as any);
                        }
                      }}
                    >
                      {ad.primaryBtn.icon === 'home' ? (
                        <Home size={15} color="#FFFFFF" strokeWidth={2.4} />
                      ) : ad.primaryBtn.icon === 'building' ? (
                        <Building2 size={15} color="#FFFFFF" strokeWidth={2.4} />
                      ) : ad.primaryBtn.icon === 'layers' ? (
                        <Layers size={15} color="#FFFFFF" strokeWidth={2.4} />
                      ) : (
                        <Plus size={15} color="#FFFFFF" strokeWidth={2.8} />
                      )}
                      <Text style={styles.adCreateProfileBtnText}>
                        {ad.primaryBtn.isProfileRoute && hasActiveProfile
                          ? 'My Co-Living Hub'
                          : ad.primaryBtn.label}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={styles.adSwipeBtn}
                      onPress={() => router.push(ad.secondaryBtn.route as any)}
                    >
                      {ad.secondaryBtn.icon === 'calendar' ? (
                        <Calendar size={14} color="#5EEAD4" strokeWidth={2.4} />
                      ) : ad.secondaryBtn.icon === 'plus' ? (
                        <Plus size={14} color="#5EEAD4" strokeWidth={2.6} />
                      ) : ad.secondaryBtn.icon === 'search' ? (
                        <Search size={14} color="#5EEAD4" strokeWidth={2.4} />
                      ) : (
                        <Flame size={14} color="#5EEAD4" strokeWidth={2.4} />
                      )}
                      <Text style={styles.adSwipeBtnText}>{ad.secondaryBtn.label}</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ========================================================= */}
        {/* 4. SEGMENTED ROOMMATE EXPERIENCE SWITCHER                 */}
        {/* ========================================================= */}
        <View style={styles.searchModeTabsRow}>
          <Pressable
            style={[styles.searchModeTab, searchMode === 'all' && styles.searchModeTabActive]}
            onPress={() => setSearchMode('all')}
          >
            <Text style={[styles.searchModeTabText, searchMode === 'all' && styles.searchModeTabTextActive]}>
              🔥 All Flatmates
            </Text>
          </Pressable>

          <Pressable
            style={[styles.searchModeTab, searchMode === 'have_room' && styles.searchModeTabActive]}
            onPress={() => setSearchMode('have_room')}
          >
            <Text style={[styles.searchModeTabText, searchMode === 'have_room' && styles.searchModeTabTextActive]}>
              🏠 Have a Room
            </Text>
          </Pressable>

          <Pressable
            style={[styles.searchModeTab, searchMode === 'need_room' && styles.searchModeTabActive]}
            onPress={() => setSearchMode('need_room')}
          >
            <Text style={[styles.searchModeTabText, searchMode === 'need_room' && styles.searchModeTabTextActive]}>
              🧳 Need a Room
            </Text>
          </Pressable>
        </View>

        {/* ========================================================= */}
        {/* 5. LIQUID GLASS SEARCH & INTELLIGENT FILTER BAR           */}
        {/* ========================================================= */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={16} color="#0F766E" strokeWidth={2.4} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search area, college (IIT/NMIMS), company, name..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {!!searchQuery && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
                <X size={15} color="#94A3B8" />
              </Pressable>
            )}
          </View>

          <Pressable
            style={[
              styles.filterBtn,
              activeFiltersCount > 0 && styles.filterBtnActive,
            ]}
            onPress={() => setIsFilterVisible(true)}
          >
            <SlidersHorizontal
              size={17}
              color={activeFiltersCount > 0 ? '#FFFFFF' : '#0F766E'}
              strokeWidth={2.4}
            />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Locality Quick Shortcuts */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.localityScroll}
        >
          {LOCALITY_SHORTCUTS.map((loc) => {
            const isSelected = selectedLocality === loc;
            return (
              <Pressable
                key={loc}
                style={[styles.localityChip, isSelected && styles.localityChipActive]}
                onPress={() => setSelectedLocality(isSelected ? null : loc)}
              >
                <MapPin size={11} color={isSelected ? '#FFFFFF' : '#0F766E'} />
                <Text style={[styles.localityChipText, isSelected && styles.localityChipTextActive]}>
                  {loc}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ========================================================= */}
        {/* 7. VIP SPOTLIGHT: DAILY TOP SYNERGY MATCHES CAROUSEL      */}
        {/* ========================================================= */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleCluster}>
              <Crown size={18} color="#D97706" strokeWidth={2.4} />
              <Text style={styles.sectionHeading}>VIP Daily Top Synergy</Text>
            </View>
            <Pressable onPress={() => router.push('/(renter)/flatmate/discover' as any)}>
              <Text style={styles.seeAllLink}>Swipe Mode →</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedScroll}
          >
            {topSynergyFlatmates.map((fm) => (
              <V4FlatmateCard
                key={fm.id}
                flatmate={fm}
                variant="carousel"
              />
            ))}
          </ScrollView>
        </View>

        {/* ========================================================= */}
        {/* 8. LIFESTYLE & HABIT VIBE CHANNELS CAROUSEL               */}
        {/* ========================================================= */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeading}>Explore by Lifestyle Channel</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.channelsScroll}
          >
            {LIFESTYLE_CHANNELS.map((ch) => {
              const isSelected = activeChannel === ch.id;
              return (
                <Pressable
                  key={ch.id}
                  style={[styles.channelChip, isSelected && styles.channelChipActive]}
                  onPress={() => setActiveChannel(ch.id)}
                >
                  <Text style={styles.channelEmoji}>{ch.icon}</Text>
                  <Text style={[styles.channelLabel, isSelected && styles.channelLabelActive]}>
                    {ch.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ========================================================= */}
        {/* 9. VERIFIED ROOMMATES NEARBY FEED (MAIN DISCOVERY)        */}
        {/* ========================================================= */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleCluster}>
              <ShieldCheck size={18} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.sectionHeading}>
                Verified Flatmates ({filteredFlatmates.length})
              </Text>
            </View>
            <Pressable onPress={() => setIsFilterVisible(true)}>
              <Text style={styles.seeAllLink}>Filters ({activeFiltersCount})</Text>
            </Pressable>
          </View>

          {filteredFlatmates.length === 0 ? (
            <View style={styles.emptyCard}>
              <Users size={36} color="#94A3B8" strokeWidth={1.8} />
              <Text style={styles.emptyTitle}>No flatmates found</Text>
              <Text style={styles.emptyDesc}>
                Try adjusting your search query, locality chips, or filter parameters.
              </Text>
              <Pressable
                style={styles.emptyResetBtn}
                onPress={() => {
                  setSearchQuery('');
                  setActiveChannel('all');
                  setSelectedLocality(null);
                  setSearchMode('all');
                  setFilters({});
                }}
              >
                <Text style={styles.emptyResetBtnText}>Reset All Filters</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.feedList}>
              {filteredFlatmates.map((flatmate) => (
                <V4FlatmateCard
                  key={flatmate.id}
                  flatmate={flatmate}
                  variant="feed"
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter Bottom Sheet Modal */}
      <V4FlatmatesFilterModal
        visible={isFilterVisible}
        filters={filters}
        onClose={() => setIsFilterVisible(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setIsFilterVisible(false);
        }}
        onReset={() => {
          setFilters({});
          setIsFilterVisible(false);
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
  /* 1. TOP HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 20,
    ...V4_SHADOWS.soft,
  },
  headerLeftCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  headerLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1.5,
  },
  headerLiveDot: {
    width: 5.5,
    height: 5.5,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  headerLiveText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#059669',
  },
  headerRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#EF4444',
    paddingHorizontal: 4.5,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notifBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerProfileBtn: {
    position: 'relative',
    marginLeft: 2,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#059669',
  },
  headerAvatarBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    backgroundColor: '#059669',
    width: 13,
    height: 13,
    borderRadius: 6.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  headerCreateProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 11,
    paddingVertical: 7.5,
    borderRadius: 12,
    marginLeft: 2,
    ...V4_SHADOWS.soft,
  },
  headerCreateProfileText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 16,
  },

  /* 2. PROMOTIONAL / ADS HERO BANNER */
  adHeroContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    ...V4_SHADOWS.card,
  },
  adScroll: {
    width: SCREEN_WIDTH - 32,
  },
  adCard: {
    width: SCREEN_WIDTH - 32,
    height: 230,
    position: 'relative',
    backgroundColor: '#031B2A',
    borderRadius: 24,
    overflow: 'hidden',
  },
  adImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  adGradientOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(3, 27, 42, 0.72)',
  },
  adContent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    justifyContent: 'space-between',
  },
  adTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adBadgeCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adSponsorBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  adSponsorText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.8,
  },
  adTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(5, 150, 105, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  adTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#5EEAD4',
    letterSpacing: 0.5,
  },
  adDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
  },
  adDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  adDotActive: {
    width: 14,
    backgroundColor: '#5EEAD4',
  },
  adTitleWrap: {
    gap: 4,
  },
  adTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 24,
  },
  adSubtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  adActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  adCreateProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669', // Brand Emerald
    paddingHorizontal: 15,
    paddingVertical: 9.5,
    borderRadius: 14,
    ...V4_SHADOWS.soft,
  },
  adCreateProfileBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  adSwipeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 13,
    paddingVertical: 9.5,
    borderRadius: 14,
  },
  adSwipeBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },


  /* 4. SEARCH MODE TABS */
  searchModeTabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchModeTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchModeTabActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  searchModeTabText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
  },
  searchModeTabTextActive: {
    color: '#FFFFFF',
  },

  /* 5. SEARCH & LOCALITY */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 11 : 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    ...V4_SHADOWS.soft,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...V4_SHADOWS.soft,
  },
  filterBtnActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  filterBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#EF4444',
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  filterBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  localityScroll: {
    gap: 7,
    paddingVertical: 2,
  },
  localityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  localityChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  localityChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  localityChipTextActive: {
    color: '#FFFFFF',
  },


  /* 7. VIP SPOTLIGHT CAROUSEL */
  sectionWrap: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: '#031B2A',
    letterSpacing: -0.3,
  },
  seeAllLink: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  recommendedScroll: {
    gap: 12,
    paddingRight: 10,
  },
  vipCard: {
    width: SCREEN_WIDTH * 0.72,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  vipImageWrap: {
    height: 220,
    backgroundColor: '#031B2A',
    position: 'relative',
  },
  vipImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  vipImageGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(3, 27, 42, 0.45)',
  },
  vipMatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  vipTopBadgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  vipMatchText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
  },
  vipSaveBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vipSaveBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  vipBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(3, 27, 42, 0.72)',
  },
  vipNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vipName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    flex: 1,
  },
  vipVerifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipProfession: {
    fontSize: 11.5,
    color: '#E2ECEF',
    fontWeight: '500',
    marginTop: 2,
  },
  vipBody: {
    padding: 12,
    gap: 8,
  },
  vipMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vipLocChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  vipLocText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  vipBudgetText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#031B2A',
  },
  vipBudgetUnit: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
  },
  vipTagsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  vipTagChip: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vipTagChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  vipActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  vipWaveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 7,
    borderRadius: 10,
  },
  vipWaveBtnDone: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  vipWaveBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#059669',
  },
  vipWaveBtnDoneText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  vipChatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingVertical: 7,
    borderRadius: 10,
  },
  vipChatBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* 8. LIFESTYLE CHANNELS */
  channelsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  channelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  channelChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  channelEmoji: {
    fontSize: 13,
  },
  channelLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  channelLabelActive: {
    color: '#FFFFFF',
  },

  /* 9. MAIN FEED */
  feedList: {
    gap: 16,
  },
  feedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    ...V4_SHADOWS.card,
  },
  feedImageWrap: {
    height: 330,
    backgroundColor: '#031B2A',
    position: 'relative',
  },
  feedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  feedImageGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(3, 27, 42, 0.25)',
  },
  feedPhotoTapOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  feedPhotoDotsRow: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
    zIndex: 10,
  },
  feedPhotoDot: {
    width: 6,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  feedPhotoDotActive: {
    width: 20,
    backgroundColor: '#FFFFFF',
  },
  feedTopBadgeRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  feedMatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  feedMatchText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#059669',
  },
  feedBookmarkBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  feedBookmarkBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  feedBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(3, 27, 42, 0.72)',
  },
  feedNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedName: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  feedVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  feedVerifiedText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  feedProfessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  feedProfessionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E2ECEF',
  },
  feedCardBody: {
    padding: 16,
    gap: 12,
  },
  feedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedLocChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  feedLocText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  feedRoomChip: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  feedRoomText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  feedBudgetPill: {
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAE5D9',
  },
  feedBudgetValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#031B2A',
  },
  feedBudgetUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  feedTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  feedLifestyleTag: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  feedLifestyleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  feedBioCard: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3.5,
    borderLeftColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  feedBioSnippet: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  feedCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  feedProfileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedProfileLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  feedBtnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedWaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  feedWaveBtnDone: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  feedWaveBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#059669',
  },
  feedWaveBtnDoneText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  feedChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  feedChatBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* EMPTY STATE */
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#031B2A',
    marginTop: 4,
  },
  emptyDesc: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
  },
  emptyResetBtn: {
    marginTop: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  emptyResetBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* 10. SAFETY CHARTER CARD */
  safetyGuaranteeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    ...V4_SHADOWS.soft,
  },
  safetyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  safetyIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyGuaranteeTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#031B2A',
  },
  safetyGuaranteeDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 2,
  },
});

