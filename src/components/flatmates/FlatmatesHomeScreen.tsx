import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  PanResponder,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Search,
  SlidersHorizontal,
  Bell,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageCircle,
  Building2,
  Heart,
  Flame,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  MapPin,
  Users,
  Compass,
  PlusCircle,
  RotateCcw,
  Star,
  X,
  Info,
  Bookmark,
  TrendingUp,
  Check,
  Briefcase,
  Moon,
  Sun,
  Utensils,
  PawPrint,
  Cigarette,
  Laptop,
  Smile,
  Eye,
} from 'lucide-react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
} from 'react-native-svg';
import { useAppStore } from '../../store/useAppStore';
import { FlatmateProfile } from '../../types';
import { V4FlatmateCard } from './ui/V4FlatmateCard';
import { V4CompatibilityRing } from './ui/V4CompatibilityRing';
import { V4FilterBottomSheet, V4FlatmateFilterState } from './ui/V4FilterBottomSheet';
import { MatchCelebrationModal } from './MatchCelebrationModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 110;

type DiscoveryMode = 'swipe' | 'feed' | 'hubs';

// Gen-Z Rotating Top Stage Ads (Matching Main Home Page Aesthetic)
const HERO_GENZ_ADS = [
  {
    id: 'genz-ad-1',
    superTag: '⚡ AI SYNERGY MATCHING',
    superColor: '#059669',
    title: 'FIND YOUR CO-LIVING TWIN',
    titleSub: 'VERIFIED MARKETPLACE • DIRECT ROOMIES',
    pillText: 'Match on budget, cleanliness, work style & sleep routine',
    pillBg: '#ECFDF5',
    pillColor: '#059669',
    bgGradient: '#F0FDF4',
  },
  {
    id: 'genz-ad-2',
    superTag: '🛡️ 100% DIGILOCKER VERIFIED',
    superColor: '#0F766E',
    title: 'SAFE & VERIFIED CO-LIVING',
    titleSub: 'ZERO STRANGER ANXIETY',
    pillText: 'Govt Aadhaar KYC • Work Email • 0 Police Visits',
    pillBg: '#CCFBF1',
    pillColor: '#0F766E',
    bgGradient: '#F0FDFA',
  },
  {
    id: 'genz-ad-3',
    superTag: '🏙️ TECH & CREATIVE HUBS',
    superColor: '#6366F1',
    title: 'LIVE WITH STARTUP FOUNDERS',
    titleSub: 'BANDRA • KORAMANGALA • CYBER CITY',
    pillText: 'Curated flats near top tech parks, cafes & metro stations',
    pillBg: '#EEF2FF',
    pillColor: '#4F46E5',
    bgGradient: '#F5F3FF',
  },
];

const GENZ_LIFESTYLE_PILLS = [
  { id: 'all', label: 'All Roomies', icon: '✨' },
  { id: 'tech', label: 'Tech & Founders', icon: '🚀' },
  { id: 'creatives', label: 'Design & Art', icon: '🎨' },
  { id: 'girls', label: 'Girls Hub', icon: '👩' },
  { id: 'boys', label: 'Boys Hub', icon: '👨' },
  { id: 'pets', label: 'Pet Friendly', icon: '🐶' },
  { id: 'veg', label: 'Pure Veg', icon: '🌱' },
  { id: 'remote', label: 'WFH / Remote', icon: '💻' },
  { id: 'fitness', label: 'Gym & Fitness', icon: '🏋️' },
  { id: 'quiet', label: 'Zen & Quiet', icon: '🧘' },
  { id: 'early', label: 'Early Birds', icon: '🌅' },
  { id: 'night', label: 'Night Owls', icon: '🌙' },
];

const POPULAR_LOCALITIES = [
  { name: 'Bandra West, Mumbai', count: 142 },
  { name: 'Koramangala, Bangalore', count: 120 },
  { name: 'Cyber City, Gurgaon', count: 85 },
  { name: 'Powai Hiranandani, Mumbai', count: 64 },
  { name: 'Indiranagar 100ft, Bangalore', count: 94 },
  { name: 'BKC / Kalina, Mumbai', count: 78 },
  { name: 'HSR Layout, Bangalore', count: 110 },
  { name: 'Andheri West, Mumbai', count: 98 },
];

const TOP_CO_LIVING_HUBS = [
  {
    id: 'bandra',
    name: 'Bandra West',
    city: 'Mumbai',
    count: 142,
    avgRent: '₹25k–₹45k',
    vibe: 'Founders, Creators & Cafe Culture',
    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
    tag: '🔥 Top Tech Hub',
  },
  {
    id: 'koramangala',
    name: 'Koramangala',
    city: 'Bangalore',
    count: 120,
    avgRent: '₹18k–₹32k',
    vibe: 'Startup Engineers & Venture Capitalists',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80',
    tag: '⚡ Startup Silicon',
  },
  {
    id: 'cybercity',
    name: 'Cyber City / DLF',
    city: 'Gurgaon',
    count: 85,
    avgRent: '₹20k–₹38k',
    vibe: 'Consultants, PMs & Finance Pros',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    tag: '🏢 Metro Connected',
  },
  {
    id: 'powai',
    name: 'Hiranandani, Powai',
    city: 'Mumbai',
    count: 64,
    avgRent: '₹22k–₹40k',
    vibe: 'IIT Founders & Global Banks',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    tag: '🌿 Lake City Vibe',
  },
  {
    id: 'indiranagar',
    name: 'Indiranagar 100ft',
    city: 'Bangalore',
    count: 94,
    avgRent: '₹22k–₹36k',
    vibe: 'Designers, Product & Craft Breweries',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    tag: '🍸 Nightlife Hotspot',
  },
  {
    id: 'bkc',
    name: 'BKC / Kalina',
    city: 'Mumbai',
    count: 78,
    avgRent: '₹28k–₹55k',
    vibe: 'Finance, PE & Legal Professionals',
    img: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&auto=format&fit=crop&q=80',
    tag: '💼 Financial District',
  },
];

export const FlatmatesHomeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    flatmates,
    myFlatmateProfile,
    savedFlatmateIds,
    toggleSaveFlatmate,
    wavedFlatmateIds,
    sendFlatmateWave,
    startOrGetFlatmateConversation,
    showToast,
  } = useAppStore();

  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>('swipe');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocality, setSelectedLocality] = useState('Bandra West, Mumbai');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<V4FlatmateFilterState>({});
  const [celebrationFlatmate, setCelebrationFlatmate] = useState<FlatmateProfile | null>(null);
  const [wavingIds, setWavingIds] = useState<{ [id: string]: boolean }>({});

  // Hero Ad Auto Rotation
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAdIndex((prev) => (prev + 1) % HERO_GENZ_ADS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);
  const currentHeroAd = HERO_GENZ_ADS[activeAdIndex];

  // Swipe Deck State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<number[]>([]);
  const [quickPeekFlatmate, setQuickPeekFlatmate] = useState<FlatmateProfile | null>(null);

  const userName = user?.name ? user.name.split(' ')[0] : 'Explorer';
  const userAvatar =
    user?.avatar_url ||
    myFlatmateProfile?.avatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

  // Filter flatmates list
  const filteredFlatmates = useMemo(() => {
    return flatmates.filter((fm) => {
      if (myFlatmateProfile && fm.id === myFlatmateProfile.id) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = fm.name.toLowerCase().includes(q);
        const matchesLoc =
          fm.locality?.toLowerCase().includes(q) ||
          fm.city?.toLowerCase().includes(q) ||
          fm.preferred_locations?.some((loc) => loc.toLowerCase().includes(q));
        const matchesCol = fm.company_or_college?.toLowerCase().includes(q);
        const matchesOcc = fm.occupation?.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesCol && !matchesOcc) return false;
      }

      // Category Pill filter
      if (selectedCategory !== 'all') {
        switch (selectedCategory) {
          case 'tech':
            if (
              !fm.occupation?.toLowerCase().includes('engineer') &&
              !fm.occupation?.toLowerCase().includes('dev') &&
              !fm.occupation?.toLowerCase().includes('tech') &&
              !fm.occupation?.toLowerCase().includes('founder') &&
              !fm.occupation?.toLowerCase().includes('product')
            )
              return false;
            break;
          case 'creatives':
            if (
              !fm.occupation?.toLowerCase().includes('design') &&
              !fm.occupation?.toLowerCase().includes('art') &&
              !fm.occupation?.toLowerCase().includes('brand') &&
              !fm.occupation?.toLowerCase().includes('content') &&
              !fm.occupation?.toLowerCase().includes('writer')
            )
              return false;
            break;
          case 'girls':
            if (fm.gender?.toLowerCase() !== 'female') return false;
            break;
          case 'boys':
            if (fm.gender?.toLowerCase() !== 'male') return false;
            break;
          case 'pets':
            if (
              fm.pets?.toLowerCase() === 'no pets' ||
              fm.pets?.toLowerCase() === 'not_allowed'
            )
              return false;
            break;
          case 'veg':
            if (
              fm.food_preference &&
              !fm.food_preference.toLowerCase().includes('veg')
            )
              return false;
            break;
          case 'remote':
            if (
              fm.work_style?.toLowerCase() !== 'work from home' &&
              fm.work_style?.toLowerCase() !== 'wfh' &&
              fm.work_style?.toLowerCase() !== 'hybrid'
            )
              return false;
            break;
          case 'early':
            if (
              fm.sleep_habit?.toLowerCase() !== 'early riser' &&
              fm.sleep_habit?.toLowerCase() !== 'early_bird'
            )
              return false;
            break;
          case 'night':
            if (
              fm.sleep_habit?.toLowerCase() !== 'night owl' &&
              fm.sleep_habit?.toLowerCase() !== 'night_owl'
            )
              return false;
            break;
        }
      }

      // Filter Bottom Sheet attributes
      if (filters.verifiedOnly && !fm.is_kyc_verified) return false;
      if (
        filters.gender &&
        filters.gender !== 'Any' &&
        fm.gender?.toLowerCase() !== filters.gender.toLowerCase()
      )
        return false;
      if (
        filters.roomType &&
        fm.room_preference &&
        !fm.room_preference.toLowerCase().includes(filters.roomType.toLowerCase())
      )
        return false;
      if (filters.budgetMin !== undefined && fm.budget_max < filters.budgetMin) return false;
      if (filters.budgetMax !== undefined && fm.budget_min > filters.budgetMax) return false;
      if (
        filters.foodPreference &&
        fm.food_preference &&
        !fm.food_preference.toLowerCase().includes(filters.foodPreference.toLowerCase())
      )
        return false;
      if (
        filters.smoking &&
        fm.smoking &&
        !fm.smoking.toLowerCase().includes(filters.smoking.toLowerCase())
      )
        return false;
      if (
        filters.pets &&
        fm.pets &&
        !fm.pets.toLowerCase().includes(filters.pets.toLowerCase())
      )
        return false;

      return true;
    });
  }, [flatmates, myFlatmateProfile, searchQuery, selectedCategory, filters]);

  const deck = filteredFlatmates;
  const currentCard = deck[currentIndex];
  const nextCard = deck[currentIndex + 1];

  const currentPhotos = useMemo(() => {
    if (!currentCard) return [];
    if (currentCard.photos && currentCard.photos.length > 0) {
      return currentCard.photos;
    }
    return [
      currentCard.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    ];
  }, [currentCard]);

  // =========================================================================
  // SILKY-SMOOTH PAN RESPONDER GESTURE ENGINE
  // =========================================================================
  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [15, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const skipOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -15],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const superOpacity = position.y.interpolate({
    inputRange: [-SWIPE_THRESHOLD * 1.4, -15],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.94, 1],
    extrapolate: 'clamp',
  });

  const handleWave = async (profile: FlatmateProfile) => {
    if (wavingIds[profile.id]) return;
    setWavingIds((prev) => ({ ...prev, [profile.id]: true }));

    try {
      const res = await sendFlatmateWave(
        profile.id,
        profile.name,
        profile.avatar,
        profile.locality
      );

      if (res.isMatched) {
        setCelebrationFlatmate(profile);
      } else {
        showToast(`Wave sent to ${profile.name}! 👋`, 'success');
      }
    } catch {
      showToast('Could not send wave. Please try again.', 'error');
    } finally {
      setWavingIds((prev) => ({ ...prev, [profile.id]: false }));
    }
  };

  const handleSwipe = useCallback(
    async (action: 'like' | 'skip' | 'superlike') => {
      if (!currentCard) return;

      const targetX =
        action === 'like' || action === 'superlike'
          ? SCREEN_WIDTH + 120
          : -SCREEN_WIDTH - 120;
      const targetY = action === 'superlike' ? -SCREEN_HEIGHT : 0;

      Animated.timing(position, {
        toValue: { x: targetX, y: targetY },
        duration: 220,
        useNativeDriver: Platform.OS !== 'web',
      }).start(async () => {
        position.setValue({ x: 0, y: 0 });
        setPhotoIndex(0);
        setSwipeHistory((prev) => [...prev, currentIndex]);

        if (action === 'skip') {
          showToast(`Skipped ${currentCard.name}`, 'info');
        } else {
          await handleWave(currentCard);
        }

        setCurrentIndex((prev) => prev + 1);
      });
    },
    [currentCard, currentIndex, position, handleWave]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10;
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          handleSwipe('like');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          handleSwipe('skip');
        } else if (gesture.dy < -SWIPE_THRESHOLD * 1.5) {
          handleSwipe('superlike');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: Platform.OS !== 'web',
          }).start();
        }
      },
    })
  ).current;

  const handleUndo = () => {
    if (swipeHistory.length === 0) {
      showToast('No swipes to undo', 'info');
      return;
    }
    const prevIdx = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, prev.length - 1));
    setCurrentIndex(prevIdx);
    setPhotoIndex(0);
    position.setValue({ x: 0, y: 0 });
    showToast('Reverted to previous roommate 🔄', 'success');
  };

  const handleNextPhoto = () => {
    if (photoIndex < currentPhotos.length - 1) {
      setPhotoIndex((prev) => prev + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex((prev) => prev - 1);
    }
  };

  const isCurrentSaved = currentCard
    ? savedFlatmateIds.includes(currentCard.id)
    : false;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* =====================================================================
          1. MINIMAL TOP HEADER (UNIFIED WITH MAIN REHVO HOME DESIGN)
         ===================================================================== */}
      <View style={[styles.unifiedTopHeader, { paddingTop: Math.max(insets.top, 12) + 4 }]}>
        {/* Top Search Pill & Action Icons */}
        <View style={styles.topSearchRow}>
          {/* Search Pill */}
          <Pressable
            style={styles.searchPill}
            onPress={() => router.push('/(renter)/flatmate/explore')}
          >
            <Search size={16} color="#059669" strokeWidth={2.4} />
            <Text style={styles.searchPillPlaceholder} numberOfLines={1}>
              Search flatmates by area, college, company...
            </Text>
          </Pressable>

          {/* Right Actions: Waves, Saved, Profile */}
          <View style={styles.topRightActionGroup}>
            {/* Waves Inbox */}
            <Pressable
              style={styles.headerIconBtn}
              onPress={() => router.push('/(renter)/flatmate/waves')}
              accessibilityLabel="Waves Inbox"
            >
              <Flame size={18} color="#0F172A" strokeWidth={2.2} />
              {wavedFlatmateIds.length > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{wavedFlatmateIds.length}</Text>
                </View>
              )}
            </Pressable>

            {/* Saved Flatmates */}
            <Pressable
              style={styles.headerIconBtn}
              onPress={() => router.push('/(renter)/flatmate/saved')}
              accessibilityLabel="Saved Flatmates"
            >
              <Heart
                size={18}
                color={savedFlatmateIds.length > 0 ? '#EF4444' : '#0F172A'}
                fill={savedFlatmateIds.length > 0 ? '#EF4444' : 'transparent'}
                strokeWidth={2.2}
              />
              {savedFlatmateIds.length > 0 && (
                <View style={[styles.headerBadge, { backgroundColor: '#EF4444' }]}>
                  <Text style={styles.headerBadgeText}>{savedFlatmateIds.length}</Text>
                </View>
              )}
            </Pressable>

            {/* User Avatar */}
            <Pressable
              style={styles.avatarPill}
              onPress={() =>
                myFlatmateProfile
                  ? router.push('/(renter)/flatmate/my-profile')
                  : router.push('/(renter)/flatmate/create')
              }
              accessibilityLabel="My Flatmate Profile"
            >
              <Image source={{ uri: userAvatar }} style={styles.avatarImg} />
              <View style={styles.avatarOnlineDot} />
            </Pressable>
          </View>
        </View>

        {/* Locality Selector Row with Green Pulse Dot */}
        <Pressable
          style={styles.localitySelectorRow}
          onPress={() => setLocationModalOpen(true)}
        >
          <View style={styles.localityPulseDot} />
          <MapPin size={11} color="#059669" strokeWidth={2.6} />
          <Text style={styles.localityText} numberOfLines={1}>
            {selectedLocality}
          </Text>
          <ChevronDown size={11} color="#64748B" strokeWidth={2.4} />
          <View style={styles.zeroBrokeragePill}>
            <Text style={styles.zeroBrokeragePillText}>VERIFIED LISTING</Text>
          </View>
        </Pressable>
      </View>

      {/* =====================================================================
          2. 3-MODE SEGMENTED SWITCHER
         ===================================================================== */}
      <View style={styles.modeSwitcherWrap}>
        <View style={styles.modeSwitcherContainer}>
          <Pressable
            style={[styles.modeTab, discoveryMode === 'swipe' && styles.modeTabActive]}
            onPress={() => setDiscoveryMode('swipe')}
          >
            <Flame
              size={14}
              color={discoveryMode === 'swipe' ? '#059669' : '#64748B'}
              strokeWidth={2.4}
            />
            <Text
              style={[
                styles.modeTabText,
                discoveryMode === 'swipe' && styles.modeTabTextActive,
              ]}
            >
              Swipe Deck
            </Text>
            <View style={styles.genzHotBadge}>
              <Text style={styles.genzHotBadgeText}>HOT</Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.modeTab, discoveryMode === 'feed' && styles.modeTabActive]}
            onPress={() => setDiscoveryMode('feed')}
          >
            <Sparkles
              size={14}
              color={discoveryMode === 'feed' ? '#059669' : '#64748B'}
              strokeWidth={2.4}
            />
            <Text
              style={[
                styles.modeTabText,
                discoveryMode === 'feed' && styles.modeTabTextActive,
              ]}
            >
              Curated Feed
            </Text>
          </Pressable>

          <Pressable
            style={[styles.modeTab, discoveryMode === 'hubs' && styles.modeTabActive]}
            onPress={() => setDiscoveryMode('hubs')}
          >
            <Building2
              size={14}
              color={discoveryMode === 'hubs' ? '#059669' : '#64748B'}
              strokeWidth={2.4}
            />
            <Text
              style={[
                styles.modeTabText,
                discoveryMode === 'hubs' && styles.modeTabTextActive,
              ]}
            >
              Top Hubs
            </Text>
          </Pressable>
        </View>
      </View>

      {/* =====================================================================
          MODE 1: FULL-SCREEN PROPER SILKY SWIPE DECK
         ===================================================================== */}
      {discoveryMode === 'swipe' && (
        <View style={styles.swipeDeckRoot}>
          {currentIndex >= deck.length || !currentCard ? (
            <View style={styles.allCaughtUpContainer}>
              <View style={styles.allCaughtUpIconWrap}>
                <Sparkles size={36} color="#059669" />
              </View>
              <Text style={styles.allCaughtUpTitle}>You're All Caught Up!</Text>
              <Text style={styles.allCaughtUpSub}>
                You have reviewed all roommate profiles matching your current filters in {selectedLocality}.
              </Text>
              <Pressable
                style={styles.restartDeckBtn}
                onPress={() => {
                  setCurrentIndex(0);
                  setPhotoIndex(0);
                  setSelectedCategory('all');
                  setFilters({});
                }}
              >
                <RotateCcw size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.restartDeckBtnText}>Restart Deck</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.deckStackStage}>
              {/* Underneath Next Card Preview */}
              {nextCard && (
                <Animated.View
                  style={[
                    styles.cardUnderneath,
                    {
                      transform: [{ scale: nextCardScale }],
                      opacity: 0.88,
                    },
                  ]}
                >
                  <Image
                    source={{
                      uri:
                        (nextCard.photos && nextCard.photos[0]) ||
                        nextCard.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                    }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.cardUnderneathGlassOverlay} />
                </Animated.View>
              )}

              {/* Active Gesture-Controlled Top Card */}
              {currentCard && (
                <Animated.View
                  {...panResponder.panHandlers}
                  style={[
                    styles.cardTopActive,
                    {
                      transform: [
                        { translateX: position.x },
                        { translateY: position.y },
                        { rotate: rotate },
                      ],
                    },
                  ]}
                >
                  {/* Image */}
                  <Image
                    source={{ uri: currentPhotos[photoIndex] }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />

                  {/* Story Progress Dashes */}
                  {currentPhotos.length > 1 && (
                    <View style={styles.storyDashesRow}>
                      {currentPhotos.map((_, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.storyDash,
                            idx === photoIndex && styles.storyDashActive,
                          ]}
                        />
                      ))}
                    </View>
                  )}

                  {/* Left / Right Touch Zones for Photo Flip */}
                  {currentPhotos.length > 1 && (
                    <View style={styles.tapZonesRow}>
                      <Pressable style={styles.tapZone} onPress={handlePrevPhoto} />
                      <Pressable style={styles.tapZone} onPress={handleNextPhoto} />
                    </View>
                  )}

                  {/* Real-Time Stamp Overlays */}
                  <Animated.View
                    style={[styles.stampLikeBadge, { opacity: likeOpacity }]}
                  >
                    <Text style={styles.stampLikeText}>WAVE 👋</Text>
                  </Animated.View>

                  <Animated.View
                    style={[styles.stampSkipBadge, { opacity: skipOpacity }]}
                  >
                    <Text style={styles.stampSkipText}>PASS ❌</Text>
                  </Animated.View>

                  <Animated.View
                    style={[styles.stampSuperBadge, { opacity: superOpacity }]}
                  >
                    <Text style={styles.stampSuperText}>SUPER WAVE ⭐</Text>
                  </Animated.View>

                  {/* Top Badges */}
                  <View style={styles.cardTopBadges}>
                    <View style={styles.synergyBadge}>
                      <Sparkles size={11} color="#059669" strokeWidth={2.6} />
                      <Text style={styles.synergyBadgeText}>
                        {currentCard.match_score || 98}% SYNERGY
                      </Text>
                    </View>

                    {currentCard.is_kyc_verified && (
                      <View style={styles.kycBadge}>
                        <ShieldCheck size={12} color="#10B981" strokeWidth={2.6} />
                        <Text style={styles.kycBadgeText}>DigiLocker KYC</Text>
                      </View>
                    )}
                  </View>

                  {/* Bottom Gradient Overlay */}
                  <Svg
                    height="240"
                    width="100%"
                    style={styles.cardBottomSvg}
                  >
                    <Defs>
                      <SvgLinearGradient id="cardGrd" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#031B2A" stopOpacity="0" />
                        <Stop offset="0.35" stopColor="#031B2A" stopOpacity="0.75" />
                        <Stop offset="1" stopColor="#031B2A" stopOpacity="0.96" />
                      </SvgLinearGradient>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#cardGrd)" />
                  </Svg>

                  {/* Bottom Card Identity Details */}
                  <View style={styles.cardInfoWrap}>
                    <View style={styles.cardNameRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardNameText} numberOfLines={1}>
                          {currentCard.name}, {currentCard.age || 24}
                        </Text>
                        <Text style={styles.cardOccupationText} numberOfLines={1}>
                          {currentCard.occupation || 'Professional'}
                          {currentCard.company_or_college
                            ? ` at ${currentCard.company_or_college}`
                            : ''}
                        </Text>
                      </View>

                      <View style={styles.budgetPill}>
                        <Text style={styles.budgetPillLabel}>BUDGET</Text>
                        <Text style={styles.budgetPillVal}>
                          ₹{((currentCard.budget_min || 15000) / 1000).toFixed(0)}k–₹
                          {((currentCard.budget_max || 30000) / 1000).toFixed(0)}k
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardLocRow}>
                      <MapPin size={12} color="#6EE7B7" />
                      <Text style={styles.cardLocText} numberOfLines={1}>
                        {currentCard.locality || currentCard.city || 'Bandra West'} • 2.4 km away
                      </Text>
                    </View>

                    {currentCard.bio ? (
                      <Text style={styles.cardBioText} numberOfLines={2}>
                        "{currentCard.bio}"
                      </Text>
                    ) : null}

                    {/* Quick Lifestyle Habit Chips */}
                    <View style={styles.cardHabitsRow}>
                      {currentCard.food_preference && (
                        <View style={styles.cardHabitTag}>
                          <Text style={styles.cardHabitTagText}>🌱 {currentCard.food_preference}</Text>
                        </View>
                      )}
                      {currentCard.sleep_habit && (
                        <View style={styles.cardHabitTag}>
                          <Text style={styles.cardHabitTagText}>🌙 {currentCard.sleep_habit}</Text>
                        </View>
                      )}
                      {currentCard.work_style && (
                        <View style={styles.cardHabitTag}>
                          <Text style={styles.cardHabitTagText}>💻 {currentCard.work_style}</Text>
                        </View>
                      )}
                      {currentCard.pets && (
                        <View style={styles.cardHabitTag}>
                          <Text style={styles.cardHabitTagText}>🐾 {currentCard.pets}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Animated.View>
              )}

              {/* Bottom Tactile Action Buttons Dock */}
              <View
                style={[
                  styles.deckActionDock,
                  { paddingBottom: Math.max(insets.bottom, 12) + 6 },
                ]}
              >
                {/* Undo */}
                <Pressable
                  style={styles.dockBtnMini}
                  onPress={handleUndo}
                  accessibilityLabel="Undo last swipe"
                >
                  <RotateCcw size={18} color="#64748B" strokeWidth={2.4} />
                </Pressable>

                {/* Pass */}
                <Pressable
                  style={[styles.dockBtnBig, styles.dockBtnPass]}
                  onPress={() => handleSwipe('skip')}
                  accessibilityLabel="Pass roommate"
                >
                  <X size={26} color="#EF4444" strokeWidth={2.8} />
                </Pressable>

                {/* Super Wave */}
                <Pressable
                  style={[styles.dockBtnMini, styles.dockBtnSuper]}
                  onPress={() => handleSwipe('superlike')}
                  accessibilityLabel="Super Wave"
                >
                  <Star size={20} color="#0284C7" fill="#0284C7" strokeWidth={2} />
                </Pressable>

                {/* Wave / Match */}
                <Pressable
                  style={[styles.dockBtnBig, styles.dockBtnWave]}
                  onPress={() => handleSwipe('like')}
                  accessibilityLabel="Wave to roommate"
                >
                  <Flame size={28} color="#FFFFFF" strokeWidth={2.4} />
                </Pressable>

                {/* Info / Quick-Peek */}
                <Pressable
                  style={styles.dockBtnMini}
                  onPress={() => setQuickPeekFlatmate(currentCard)}
                  accessibilityLabel="View roommate details"
                >
                  <Info size={19} color="#059669" strokeWidth={2.4} />
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}

      {/* =====================================================================
          MODE 2: MINIMAL CURATED FEED
         ===================================================================== */}
      {discoveryMode === 'feed' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.feedScrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 80 },
          ]}
        >
          {/* Rotating Gen-Z Banner */}
          <View style={[styles.heroStageContainer, { backgroundColor: currentHeroAd.bgGradient }]}>
            <View style={styles.heroStageTopRow}>
              <Text style={[styles.heroStageSuperTag, { color: currentHeroAd.superColor }]}>
                {currentHeroAd.superTag}
              </Text>
              <View style={styles.heroLiveActiveWrap}>
                <View style={styles.heroLiveDot} />
                <Text style={styles.heroLiveText}>1,420 Active</Text>
              </View>
            </View>

            <Text style={styles.heroStageTitle}>{currentHeroAd.title}</Text>
            <Text style={styles.heroStageSubTitle}>{currentHeroAd.titleSub}</Text>

            <View style={[styles.heroStagePill, { backgroundColor: currentHeroAd.pillBg }]}>
              <Text style={[styles.heroStagePillText, { color: currentHeroAd.pillColor }]}>
                {currentHeroAd.pillText}
              </Text>
            </View>
          </View>

          {/* Quick Gen-Z Lifestyle Filters */}
          <View style={styles.categoriesRailWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesRail}
            >
              {GENZ_LIFESTYLE_PILLS.map((pill) => {
                const isSelected = selectedCategory === pill.id;
                return (
                  <Pressable
                    key={pill.id}
                    style={[styles.pillChip, isSelected && styles.pillChipSelected]}
                    onPress={() => setSelectedCategory(pill.id)}
                  >
                    <Text style={styles.pillChipIcon}>{pill.icon}</Text>
                    <Text
                      style={[
                        styles.pillChipLabel,
                        isSelected && styles.pillChipLabelSelected,
                      ]}
                    >
                      {pill.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* AI Lifestyle Radar Card */}
          <View style={styles.synergyCardSection}>
            <View style={styles.synergyRadarCard}>
              <View style={styles.synergyRadarLeft}>
                <V4CompatibilityRing
                  score={98}
                  size={54}
                  strokeWidth={4.5}
                  showLabel
                  labelText="RADAR"
                  showSparkle
                />
              </View>
              <View style={styles.synergyRadarCenter}>
                <View style={styles.synergyTagBadge}>
                  <Sparkles size={10} color="#059669" />
                  <Text style={styles.synergyTagBadgeText}>AI LIFESTYLE RADAR</Text>
                </View>
                <Text style={styles.synergyRadarHeading}>98% Match in Bandra West</Text>
                <Text style={styles.synergyRadarSub}>
                  Optimal fit on budget, non-smoking & peaceful hybrid routine.
                </Text>
              </View>
              <Pressable
                style={styles.synergyBoostBtn}
                onPress={() =>
                  myFlatmateProfile
                    ? router.push('/(renter)/flatmate/insights')
                    : router.push('/(renter)/flatmate/create')
                }
              >
                <Text style={styles.synergyBoostBtnText}>
                  {myFlatmateProfile ? 'Insights' : 'Boost'}
                </Text>
                <ChevronRight size={11} color="#059669" strokeWidth={2.6} />
              </Pressable>
            </View>
          </View>

          {/* Flatmate List Header */}
          <View style={styles.feedHeaderRow}>
            <View>
              <Text style={styles.feedSectionTitle}>Recommended Roommates</Text>
              <Text style={styles.feedSectionSub}>
                {filteredFlatmates.length} verified co-living profiles in {selectedLocality}
              </Text>
            </View>
            <Pressable
              style={styles.filterBtn}
              onPress={() => setIsFilterModalOpen(true)}
            >
              <SlidersHorizontal size={14} color="#059669" strokeWidth={2.4} />
              <Text style={styles.filterBtnText}>Filters</Text>
            </Pressable>
          </View>

          {/* Flatmates Feed Cards */}
          <View style={styles.feedCardsList}>
            {filteredFlatmates.length === 0 ? (
              <View style={styles.feedEmptyCard}>
                <Users size={36} color="#94A3B8" />
                <Text style={styles.feedEmptyTitle}>No Matching Roommates</Text>
                <Text style={styles.feedEmptySub}>
                  Try loosening your category filter to discover more co-living companions.
                </Text>
                <Pressable
                  style={styles.feedEmptyResetBtn}
                  onPress={() => {
                    setSelectedCategory('all');
                    setFilters({});
                  }}
                >
                  <Text style={styles.feedEmptyResetBtnText}>Show All Roommates</Text>
                </Pressable>
              </View>
            ) : (
              filteredFlatmates.map((profile) => (
                <V4FlatmateCard
                  key={profile.id}
                  profile={profile}
                  isSaved={savedFlatmateIds.includes(profile.id)}
                  isWaved={wavedFlatmateIds.includes(profile.id)}
                  isWaving={Boolean(wavingIds[profile.id])}
                  onSelect={() => router.push(`/(renter)/flatmate/${profile.id}`)}
                  onToggleSave={() => toggleSaveFlatmate(profile.id)}
                  onWave={() => handleWave(profile)}
                  onPass={() => showToast(`Passed on ${profile.name}`, 'info')}
                />
              ))
            )}
          </View>
        </ScrollView>
      )}

      {/* =====================================================================
          MODE 3: TOP CO-LIVING HUBS
         ===================================================================== */}
      {discoveryMode === 'hubs' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.feedScrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 80 },
          ]}
        >
          <View style={styles.hubsGridSection}>
            <View style={styles.feedHeaderRow}>
              <View>
                <Text style={styles.feedSectionTitle}>Top Co-Living Hotspots</Text>
                <Text style={styles.feedSectionSub}>
                  India's highest demand tech & lifestyle roommate clusters
                </Text>
              </View>
            </View>

            <View style={styles.hubsGrid}>
              {TOP_CO_LIVING_HUBS.map((hub) => (
                <Pressable
                  key={hub.id}
                  style={styles.hubGridCard}
                  onPress={() => {
                    setSelectedLocality(`${hub.name}, ${hub.city}`);
                    setDiscoveryMode('swipe');
                    showToast(`Loaded deck for ${hub.name}! 🔥`, 'info');
                  }}
                >
                  <Image source={{ uri: hub.img }} style={styles.hubGridImg} resizeMode="cover" />
                  <View style={styles.hubGridOverlay} />

                  <View style={styles.hubTagPill}>
                    <Text style={styles.hubTagText}>{hub.tag}</Text>
                  </View>

                  <View style={styles.hubGridDetails}>
                    <Text style={styles.hubCityText}>{hub.city.toUpperCase()}</Text>
                    <Text style={styles.hubNameText}>{hub.name}</Text>
                    <Text style={styles.hubVibeText} numberOfLines={1}>
                      {hub.vibe}
                    </Text>
                    <View style={styles.hubFooterRow}>
                      <Text style={styles.hubCountText}>👥 {hub.count} Roommates</Text>
                      <Text style={styles.hubRentText}>{hub.avgRent}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {/* =====================================================================
          QUICK-PEEK GEN-Z PROFILE VIBE MODAL
         ===================================================================== */}
      <Modal
        visible={Boolean(quickPeekFlatmate)}
        transparent
        animationType="slide"
        onRequestClose={() => setQuickPeekFlatmate(null)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.modalDismissArea}
            onPress={() => setQuickPeekFlatmate(null)}
          />
          {quickPeekFlatmate && (
            <View
              style={[
                styles.quickPeekSheet,
                { paddingBottom: Math.max(insets.bottom, 20) + 12 },
              ]}
            >
              <View style={styles.quickPeekHandle} />

              <View style={styles.quickPeekHeader}>
                <Image
                  source={{
                    uri:
                      quickPeekFlatmate.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
                  }}
                  style={styles.quickPeekAvatar}
                />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.quickPeekName}>
                      {quickPeekFlatmate.name}, {quickPeekFlatmate.age || 24}
                    </Text>
                    {quickPeekFlatmate.is_kyc_verified && (
                      <CheckCircle2 size={16} color="#059669" fill="#ECFDF5" />
                    )}
                  </View>
                  <Text style={styles.quickPeekOccupation} numberOfLines={1}>
                    {quickPeekFlatmate.occupation} • {quickPeekFlatmate.company_or_college}
                  </Text>
                </View>

                <Pressable
                  style={styles.quickPeekCloseBtn}
                  onPress={() => setQuickPeekFlatmate(null)}
                >
                  <X size={18} color="#64748B" />
                </Pressable>
              </View>

              {/* Bio & Vibe Quote */}
              {quickPeekFlatmate.bio ? (
                <View style={styles.quickPeekBioCard}>
                  <Text style={styles.quickPeekBioTitle}>ABOUT ME & CO-LIVING VIBE</Text>
                  <Text style={styles.quickPeekBioText}>"{quickPeekFlatmate.bio}"</Text>
                </View>
              ) : null}

              {/* Habits & House Rules Grid */}
              <View style={styles.quickPeekHabitsGrid}>
                <View style={styles.quickPeekHabitTile}>
                  <Utensils size={14} color="#059669" />
                  <Text style={styles.quickPeekHabitLabel}>Diet</Text>
                  <Text style={styles.quickPeekHabitVal}>
                    {quickPeekFlatmate.food_preference || 'Flexible'}
                  </Text>
                </View>

                <View style={styles.quickPeekHabitTile}>
                  <Moon size={14} color="#059669" />
                  <Text style={styles.quickPeekHabitLabel}>Sleep</Text>
                  <Text style={styles.quickPeekHabitVal}>
                    {quickPeekFlatmate.sleep_habit || 'Flexible'}
                  </Text>
                </View>

                <View style={styles.quickPeekHabitTile}>
                  <Laptop size={14} color="#059669" />
                  <Text style={styles.quickPeekHabitLabel}>Work</Text>
                  <Text style={styles.quickPeekHabitVal}>
                    {quickPeekFlatmate.work_style || 'Hybrid'}
                  </Text>
                </View>

                <View style={styles.quickPeekHabitTile}>
                  <PawPrint size={14} color="#059669" />
                  <Text style={styles.quickPeekHabitLabel}>Pets</Text>
                  <Text style={styles.quickPeekHabitVal}>
                    {quickPeekFlatmate.pets || 'Friendly'}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.quickPeekCTARow}>
                <Pressable
                  style={styles.quickPeekDetailBtn}
                  onPress={() => {
                    const id = quickPeekFlatmate.id;
                    setQuickPeekFlatmate(null);
                    router.push(`/(renter)/flatmate/${id}`);
                  }}
                >
                  <Eye size={16} color="#059669" strokeWidth={2.4} />
                  <Text style={styles.quickPeekDetailBtnText}>Full Profile</Text>
                </Pressable>

                <Pressable
                  style={styles.quickPeekWaveBtn}
                  onPress={async () => {
                    const target = quickPeekFlatmate;
                    setQuickPeekFlatmate(null);
                    await handleWave(target);
                  }}
                >
                  <Flame size={16} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.quickPeekWaveBtnText}>Wave to Roommate</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* =====================================================================
          LOCATION SELECTION MODAL
         ===================================================================== */}
      <Modal
        visible={locationModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setLocationModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.modalDismissArea}
            onPress={() => setLocationModalOpen(false)}
          />
          <View style={styles.locationModalContent}>
            <View style={styles.locationModalHeader}>
              <Text style={styles.locationModalTitle}>Select Target Hub</Text>
              <Pressable
                onPress={() => setLocationModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 340 }}>
              {POPULAR_LOCALITIES.map((loc) => {
                const isSelected = selectedLocality === loc.name;
                return (
                  <Pressable
                    key={loc.name}
                    style={[
                      styles.locationOptionRow,
                      isSelected && styles.locationOptionRowSelected,
                    ]}
                    onPress={() => {
                      setSelectedLocality(loc.name);
                      setLocationModalOpen(false);
                      showToast(`Updated location to ${loc.name}`, 'info');
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <MapPin
                        size={16}
                        color={isSelected ? '#059669' : '#94A3B8'}
                        strokeWidth={2.2}
                      />
                      <Text
                        style={[
                          styles.locationOptionName,
                          isSelected && styles.locationOptionNameSelected,
                        ]}
                      >
                        {loc.name}
                      </Text>
                    </View>
                    <Text style={styles.locationOptionCount}>{loc.count} Roomies</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Filter Bottom Sheet Modal */}
      <V4FilterBottomSheet
        visible={isFilterModalOpen}
        filters={filters}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
        onReset={() => setFilters({})}
      />

      {/* Mutual Wave Match Celebration Modal */}
      <MatchCelebrationModal
        visible={Boolean(celebrationFlatmate)}
        flatmate={celebrationFlatmate}
        myAvatar={userAvatar}
        onClose={() => setCelebrationFlatmate(null)}
        onStartChat={async (fm) => {
          try {
            const convId = await startOrGetFlatmateConversation(fm);
            router.push(`/(renter)/chat/${convId}`);
          } catch {
            showToast('Could not open chat room.', 'error');
          }
        }}
        onViewProfile={(fm) => router.push(`/(renter)/flatmate/${fm.id}`)}
      />
    </View>
  );
};

const styles: any = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFCFB',
  },

  /* 1. TOP HEADER */
  unifiedTopHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
    zIndex: 30,
  },
  topSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchPill: {
    flex: 1,
    height: 42,
    backgroundColor: '#F8FAFC',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  searchPillPlaceholder: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    flex: 1,
  },
  topRightActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  headerBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  avatarPill: {
    position: 'relative',
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.8,
    borderColor: '#059669',
  },
  avatarOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  localitySelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 2,
  },
  localityPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  localityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  zeroBrokeragePill: {
    marginLeft: 'auto',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: '#A7F3D0',
  },
  zeroBrokeragePillText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.4,
  },

  /* 2. MODE SWITCHER */
  modeSwitcherWrap: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    zIndex: 25,
  },
  modeSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 3,
    gap: 3,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 11,
    gap: 5,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  modeTabTextActive: {
    color: '#059669',
    fontWeight: '800',
  },
  genzHotBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: '#A7F3D0',
  },
  genzHotBadgeText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#059669',
  },

  /* =========================================================================
     SWIPE DECK ENGINE STYLES (FULL-SCREEN EXPERIENCE)
     ========================================================================= */
  swipeDeckRoot: {
    flex: 1,
    paddingHorizontal: 14,
    paddingBottom: 4,
  },
  deckStackStage: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardUnderneath: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 68,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  cardUnderneathGlassOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
  },
  cardTopActive: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 68,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
    zIndex: 20,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  storyDashesRow: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 4,
    zIndex: 30,
  },
  storyDash: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  storyDashActive: {
    backgroundColor: '#FFFFFF',
  },
  tapZonesRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '65%',
    flexDirection: 'row',
    zIndex: 15,
  },
  tapZone: {
    flex: 1,
  },
  stampLikeBadge: {
    position: 'absolute',
    top: 40,
    left: 18,
    zIndex: 35,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    transform: [{ rotate: '-14deg' }],
  },
  stampLikeText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 1,
  },
  stampSkipBadge: {
    position: 'absolute',
    top: 40,
    right: 18,
    zIndex: 35,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    transform: [{ rotate: '14deg' }],
  },
  stampSkipText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: 1,
  },
  stampSuperBadge: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    zIndex: 35,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  stampSuperText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#3B82F6',
    letterSpacing: 1,
  },
  cardTopBadges: {
    position: 'absolute',
    top: 20,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 25,
  },
  synergyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  synergyBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  kycBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  cardBottomSvg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  cardInfoWrap: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
    gap: 3,
    zIndex: 25,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardNameText: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  cardOccupationText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#99F6E4',
    marginTop: 1,
  },
  budgetPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  budgetPillLabel: {
    fontSize: 7,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },
  budgetPillVal: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F766E',
  },
  cardLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardLocText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  cardBioText: {
    fontSize: 11.5,
    color: '#FFFFFF',
    lineHeight: 15,
    fontStyle: 'italic',
    marginTop: 2,
  },
  cardHabitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 4,
  },
  cardHabitTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardHabitTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* BOTTOM DOCK */
  deckActionDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    zIndex: 40,
  },
  dockBtnMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dockBtnBig: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  dockBtnPass: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  dockBtnSuper: {
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  dockBtnWave: {
    backgroundColor: '#059669',
  },
  allCaughtUpContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    marginVertical: 40,
  },
  allCaughtUpIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allCaughtUpTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  allCaughtUpSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  restartDeckBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  restartDeckBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* FEED STYLES */
  feedScrollContent: {
    paddingTop: 4,
  },
  heroStageContainer: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 3,
  },
  heroStageTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroStageSuperTag: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  heroLiveActiveWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  heroLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  heroLiveText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  heroStageTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  heroStageSubTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.2,
  },
  heroStagePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    marginTop: 3,
  },
  heroStagePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  categoriesRailWrap: {
    marginBottom: 10,
  },
  categoriesRail: {
    paddingHorizontal: 16,
    gap: 7,
  },
  pillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  pillChipSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  pillChipIcon: {
    fontSize: 13,
  },
  pillChipLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  pillChipLabelSelected: {
    color: '#059669',
    fontWeight: '800',
  },
  synergyCardSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  synergyRadarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.2,
    borderColor: '#CCFBF1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  synergyRadarLeft: {},
  synergyRadarCenter: {
    flex: 1,
    gap: 2,
  },
  synergyTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  synergyTagBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.4,
  },
  synergyRadarHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  synergyRadarSub: {
    fontSize: 10.5,
    color: '#64748B',
    lineHeight: 14,
  },
  synergyBoostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  synergyBoostBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  feedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  feedSectionTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  feedSectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  filterBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#059669',
  },
  feedCardsList: {
    paddingHorizontal: 16,
  },
  feedEmptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  feedEmptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  feedEmptySub: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  feedEmptyResetBtn: {
    marginTop: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  feedEmptyResetBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },

  /* HUBS SECTION */
  hubsGridSection: {
    paddingTop: 4,
  },
  hubsGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hubGridCard: {
    width: (SCREEN_WIDTH - 32 - 12) / 2,
    height: 190,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  hubGridImg: {
    width: '100%',
    height: '100%',
  },
  hubGridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 27, 42, 0.62)',
  },
  hubTagPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  hubTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  hubGridDetails: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    gap: 2,
  },
  hubCityText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#99F6E4',
    letterSpacing: 0.6,
  },
  hubNameText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  hubVibeText: {
    fontSize: 9.5,
    color: '#E2E8F0',
    marginBottom: 2,
  },
  hubFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 0.8,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
  },
  hubCountText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hubRentText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6EE7B7',
  },

  /* MODALS */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalDismissArea: {
    flex: 1,
  },
  quickPeekSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
    gap: 12,
  },
  quickPeekHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 4,
  },
  quickPeekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickPeekAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#059669',
  },
  quickPeekName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  quickPeekOccupation: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  quickPeekCloseBtn: {
    padding: 6,
  },
  quickPeekBioCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickPeekBioTitle: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },
  quickPeekBioText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
    fontStyle: 'italic',
  },
  quickPeekHabitsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  quickPeekHabitTile: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    gap: 2,
    borderWidth: 0.8,
    borderColor: '#CCFBF1',
  },
  quickPeekHabitLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  quickPeekHabitVal: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
  },
  quickPeekCTARow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  quickPeekDetailBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#059669',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickPeekDetailBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#059669',
  },
  quickPeekWaveBtn: {
    flex: 1.4,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  quickPeekWaveBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* LOCATION MODAL */
  locationModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    gap: 12,
  },
  locationModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  locationModalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 4,
  },
  locationOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  locationOptionRowSelected: {
    backgroundColor: '#ECFDF5',
  },
  locationOptionName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  locationOptionNameSelected: {
    color: '#059669',
    fontWeight: '800',
  },
  locationOptionCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
});



