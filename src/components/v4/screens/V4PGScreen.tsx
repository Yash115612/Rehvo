import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ShieldCheck,
  Building2,
  Check,
  ChevronDown,
  X,
  Map,
  List,
  Flame,
  Award,
  Calendar,
  Home,
  Star,
  Heart,
  Utensils,
  Wifi,
  Wind,
  Tv,
  Coffee,
  CheckCircle2,
  Users,
  User,
  Zap,
  Clock,
  Phone,
  MessageSquare,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import type { Property } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS, V4_TYPOGRAPHY } from '../../../theme/v4Theme';
import { V4FilterChip } from '../ui/V4FilterChip';
import { V4FilterSheet } from './V4FilterSheet';
import { V4CategoryIntakeModal } from '../ui/V4CategoryIntakeModal';
import { V4EmptyState } from '../ui/V4EmptyState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

// 1. FILTER CATEGORIES & OPTIONS
const PG_CATEGORY_TABS = [
  'All PG & Hostel',
  'Private Single',
  'Double Sharing',
  'Triple Sharing',
  'Girls Only',
  'Boys Only',
  'Unisex Co-Living',
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Budgets', min: 0, max: Infinity },
  { id: 'under_12k', label: 'Under ₹12k', min: 0, max: 12000 },
  { id: '12k_20k', label: '₹12k - ₹20k', min: 12000, max: 20000 },
  { id: '20k_30k', label: '₹20k - ₹30k', min: 20000, max: 30000 },
  { id: 'luxury_30k', label: 'Luxury ₹30k+', min: 30000, max: Infinity },
];

const QUICK_AMENITY_FILTERS = [
  '🍲 3 Meals Included',
  '❄️ AC Included',
  '⚡ High Speed WiFi',
  '🧹 Daily Housekeeping',
  '🚿 Attached Washroom',
  '🏋️ Gym & Lounge',
  '🔒 Biometric Entry',
];

const MUMBAI_LOCALITIES = [
  'All Localities',
  'Powai',
  'Bandra West',
  'Andheri West',
  'BKC / Bandra East',
  'Lower Parel',
  'Juhu',
  'Goregaon West',
  'Malad West',
  'Vile Parle West',
  'Thane West',
  'Navi Mumbai',
  'Pune',
  'Bangalore',
  'Delhi NCR',
];

const CO_LIVING_HUBS = [
  {
    id: 'hub_1',
    name: 'Powai Silicon Hub',
    locality: 'Near IIT Bombay & Hiranandani Tech',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
    pgCount: '18 Verified PGs',
    startPrice: '₹11,500/mo',
    tag: 'Tech & Student Fav',
  },
  {
    id: 'hub_2',
    name: 'Bandra Coastal Hub',
    locality: 'Near Carter Rd & St. Andrews',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=80',
    pgCount: '12 Verified PGs',
    startPrice: '₹16,000/mo',
    tag: 'Premium Living',
  },
  {
    id: 'hub_3',
    name: 'BKC Corporate Hub',
    locality: 'Near Diamond Bourse & Metro Line 3',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
    pgCount: '14 Verified PGs',
    startPrice: '₹14,000/mo',
    tag: 'Near Offices',
  },
  {
    id: 'hub_4',
    name: 'Andheri Metro Corridor',
    locality: 'Near Lokhandwala & Line 1 / 2A',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
    pgCount: '22 Verified PGs',
    startPrice: '₹9,800/mo',
    tag: 'Best Transit',
  },
];

interface PGListing {
  id: string;
  name: string;
  operator: string;
  gender: 'Gents' | 'Ladies' | 'Unisex';
  locality: string;
  address: string;
  landmark: string;
  rating: number;
  reviewCount: number;
  images: string[];
  startPrice: number;
  sharingPrices: {
    single?: number;
    double?: number;
    triple?: number;
    fourSharing?: number;
  };
  depositMonths: number;
  foodIncluded: boolean;
  foodDetails: string;
  amenities: string[];
  noticePeriod: string;
  isVerified: boolean;
  availableBeds: number;
  tag?: string;
}

function mapPropertyToPGListing(p: Property): PGListing {
  const images =
    p.images && p.images.length > 0
      ? p.images.map((img) => (typeof img === 'string' ? img : img.url))
      : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&auto=format&fit=crop&q=80'];

  const rent = p.rent || 12000;
  const genderPref = ((p as any).gender_preference || p.pg_gender_allowed || '').toLowerCase();
  const gender =
    genderPref === 'female' || genderPref === 'ladies'
      ? 'Ladies'
      : genderPref === 'male' || genderPref === 'gents'
      ? 'Gents'
      : 'Unisex';

  const isVerified = p.verification_status === 'VERIFIED';

  return {
    id: p.id,
    name: p.title,
    operator: (p as any).society_name || 'Verified Co-Living Host',
    gender: gender as PGListing['gender'],
    locality: p.locality,
    address: p.address || `${p.locality}, ${p.city}`,
    landmark: (p as any).landmark || `Near ${p.locality}`,
    rating: 4.8,
    reviewCount: 24,
    images,
    startPrice: rent,
    sharingPrices: {
      single: Math.round(rent * 1.5),
      double: rent,
      triple: Math.round(rent * 0.75),
    },
    depositMonths: p.deposit ? Math.max(1, Math.round(p.deposit / (p.rent || 1))) : 1,
    foodIncluded:
      p.pg_food_included ||
      p.amenities?.some((a) => a.toLowerCase().includes('food') || a.toLowerCase().includes('meal')) ||
      false,
    foodDetails: '3 Homely Meals Daily + Evening Tea & Snacks',
    amenities: p.amenities && p.amenities.length > 0 ? p.amenities : ['WiFi', 'Power Backup', 'AC', 'Housekeeping'],
    noticePeriod: '30 Days',
    isVerified,
    availableBeds: (p as any).available_beds || 2,
    tag: isVerified ? 'VERIFIED' : undefined,
  };
}

export const V4PGScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    gender?: string;
    sharing?: string;
    priceId?: string;
    locality?: string;
    food?: string;
  }>();
  const { properties, savedPropertyIds, toggleSaveProperty } = useAppStore();

  const pgListings: PGListing[] = useMemo(() => {
    return (properties || [])
      .filter((p) => {
        const typeStr = String(p.property_type || '').toLowerCase();
        return (
          typeStr === 'pg' ||
          typeStr.includes('co-living') ||
          (p.category as any) === 'pg' ||
          Boolean(p.pg_food_included)
        );
      })
      .map(mapPropertyToPGListing);
  }, [properties]);

  const getInitialTab = () => {
    if (params.sharing) return params.sharing;
    if (params.gender === 'girls') return 'Girls Only';
    if (params.gender === 'boys') return 'Boys Only';
    if (params.gender === 'unisex') return 'Unisex Co-Living';
    return 'All PG & Hostel';
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(getInitialTab());
  const [selectedPriceId, setSelectedPriceId] = useState(params.priceId || 'all');
  const [selectedLocality, setSelectedLocality] = useState(
    params.locality && params.locality !== 'All Mumbai' ? params.locality : 'All Localities'
  );
  const [localitySearchText, setLocalitySearchText] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    params.food || '🍲 3 Meals Included',
  ]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [localityModalOpen, setLocalityModalOpen] = useState(false);
  const [selectedFoodPG, setSelectedFoodPG] = useState<PGListing | null>(null);

  // Toggle quick amenity filter
  const toggleFilter = (f: string) => {
    setSelectedFilters((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  // Filter listings
  const filteredPGs = useMemo(() => {
    return pgListings.filter((pg) => {
      // 1. Category / Gender Tab Filter
      if (selectedCategoryTab === 'Private Single' && !pg.sharingPrices.single) return false;
      if (selectedCategoryTab === 'Double Sharing' && !pg.sharingPrices.double) return false;
      if (selectedCategoryTab === 'Triple Sharing' && !pg.sharingPrices.triple) return false;
      if (selectedCategoryTab === 'Girls Only' && pg.gender !== 'Ladies') return false;
      if (selectedCategoryTab === 'Boys Only' && pg.gender !== 'Gents') return false;
      if (selectedCategoryTab === 'Unisex Co-Living' && pg.gender !== 'Unisex') return false;

      // 2. Budget Filter
      const currentPriceRange = PRICE_RANGES.find((r) => r.id === selectedPriceId);
      if (currentPriceRange) {
        if (pg.startPrice < currentPriceRange.min || pg.startPrice > currentPriceRange.max) {
          return false;
        }
      }

      // 3. Locality Filter
      if (selectedLocality !== 'All Localities') {
        const loc = selectedLocality.toLowerCase();
        if (
          !pg.locality.toLowerCase().includes(loc) &&
          !pg.address.toLowerCase().includes(loc) &&
          !pg.landmark.toLowerCase().includes(loc)
        ) {
          return false;
        }
      }

      // 4. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          pg.name.toLowerCase().includes(q) ||
          pg.locality.toLowerCase().includes(q) ||
          pg.address.toLowerCase().includes(q) ||
          pg.landmark.toLowerCase().includes(q) ||
          pg.amenities.some((a) => a.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // 5. Amenity Filters
      if (selectedFilters.includes('🍲 3 Meals Included') && !pg.foodIncluded) return false;
      if (
        selectedFilters.includes('❄️ AC Included') &&
        !pg.amenities.some((a) => a.toLowerCase().includes('ac'))
      )
        return false;

      return true;
    });
  }, [selectedCategoryTab, selectedPriceId, selectedLocality, searchQuery, selectedFilters]);

  return (
    <View style={styles.root}>
      {/* 1. TOP APP BAR */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) }]}>
        {/* Navigation & Title Row */}
        <View style={styles.topNavRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={18} color="#0F172A" strokeWidth={2.4} />
          </Pressable>

          <View style={styles.topTitleCol}>
            <Text style={styles.screenTitle}>PG & Hostel</Text>

            <Pressable
              style={styles.locationPill}
              onPress={() => setLocalityModalOpen(true)}
            >
              <MapPin size={11} color="#0F766E" strokeWidth={2.6} />
              <Text style={styles.locationPillText} numberOfLines={1}>
                {selectedLocality === 'All Localities' ? 'All Mumbai Metro' : selectedLocality}
              </Text>
              <ChevronDown size={11} color="#64748B" strokeWidth={2.4} />
            </Pressable>
          </View>

          {/* Action Icons */}
          <View style={styles.topActions}>
            <Pressable
              style={styles.actionBtn}
              onPress={() => setFilterSheetOpen(true)}
            >
              <SlidersHorizontal size={15} color="#0F172A" strokeWidth={2.3} />
              {(selectedFilters.length > 0 ||
                selectedCategoryTab !== 'All PG & Hostel' ||
                selectedPriceId !== 'all') && <View style={styles.filterActiveDot} />}
            </Pressable>

            <Pressable
              style={[styles.actionBtn, viewMode === 'map' && styles.actionBtnActive]}
              onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            >
              {viewMode === 'list' ? (
                <Map size={15} color="#0F172A" strokeWidth={2.3} />
              ) : (
                <List size={15} color="#FFFFFF" strokeWidth={2.3} />
              )}
            </Pressable>
          </View>
        </View>

        {/* Search Bar Input */}
        <View style={styles.searchBarWrapper}>
          <Search size={16} color="#0F766E" strokeWidth={2.4} />
          <TextInput
            placeholder="Search Powai, Bandra, Girls PG, Food Included..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
              <X size={14} color="#64748B" />
            </Pressable>
          )}
        </View>

        {/* Category & Gender Tabs Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsCarousel}
        >
          {PG_CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategoryTab === tab;
            return (
              <Pressable
                key={tab}
                style={[styles.tabChip, isSelected && styles.tabChipActive]}
                onPress={() => setSelectedCategoryTab(tab)}
              >
                <Text style={[styles.tabChipText, isSelected && styles.tabChipTextActive]}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: Math.max(insets.bottom, 24) + 90 },
        ]}
      >
        {/* Quick Filter Chips Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFiltersScroll}
        >
          {QUICK_AMENITY_FILTERS.map((f) => (
            <V4FilterChip
              key={f}
              label={f}
              isSelected={selectedFilters.includes(f)}
              onPress={() => toggleFilter(f)}
            />
          ))}
        </ScrollView>

        {/* Budget Pills Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.budgetPillsScroll}
        >
          {PRICE_RANGES.map((r) => {
            const isSelected = selectedPriceId === r.id;
            return (
              <Pressable
                key={r.id}
                style={[styles.budgetPill, isSelected && styles.budgetPillActive]}
                onPress={() => setSelectedPriceId(r.id)}
              >
                <Text
                  style={[styles.budgetPillText, isSelected && styles.budgetPillTextActive]}
                >
                  {r.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Co-Living Hubs Spotlight Rail */}
        <View style={styles.hubSection}>
          <View style={styles.hubSectionHeader}>
            <View>
              <Text style={styles.hubHeading}>Top Co-Living & Student Hubs</Text>
              <Text style={styles.hubSub}>
                Verified accommodations near colleges, tech parks & metro lines
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hubScroll}
          >
            {CO_LIVING_HUBS.map((hub) => (
              <Pressable
                key={hub.id}
                style={styles.hubCard}
                onPress={() => {
                  if (hub.id === 'hub_1') setSelectedLocality('Powai');
                  else if (hub.id === 'hub_2') setSelectedLocality('Bandra West');
                  else if (hub.id === 'hub_3') setSelectedLocality('BKC / Bandra East');
                  else if (hub.id === 'hub_4') setSelectedLocality('Andheri West');
                }}
              >
                <Image source={{ uri: hub.image }} style={styles.hubImg} />
                <View style={styles.hubGradientOverlay} />
                <View style={styles.hubTag}>
                  <Text style={styles.hubTagText}>{hub.tag}</Text>
                </View>

                <View style={styles.hubInfo}>
                  <Text style={styles.hubName}>{hub.name}</Text>
                  <Text style={styles.hubLoc}>{hub.locality}</Text>
                  <View style={styles.hubBottomRow}>
                    <Text style={styles.hubCount}>{hub.pgCount}</Text>
                    <Text style={styles.hubPrice}>From {hub.startPrice}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Verified Marketplace Food Included Benefit Banner */}
        <View style={styles.benefitBanner}>
          <View style={styles.benefitIconBox}>
            <Utensils size={20} color="#0F766E" strokeWidth={2.4} />
          </View>
          <View style={styles.benefitTextCol}>
            <Text style={styles.benefitTitle}>Daily Homely Meals + Verified Marketplace</Text>
            <Text style={styles.benefitSub}>
              All listed hostels include hygienic food options, WiFi, housekeeping & 1-month deposit only.
            </Text>
          </View>
        </View>

        {/* Results Count & Sort Bar */}
        <View style={styles.resultsHeaderRow}>
          <View style={styles.resultsLeft}>
            <Text style={styles.resultsCountText}>
              {filteredPGs.length} Verified PGs & Hostels
            </Text>
            <Text style={styles.resultsSubText}>Verified Listing Direct Host Deals</Text>
          </View>

          <Pressable style={styles.sortBtn} onPress={() => setFilterSheetOpen(true)}>
            <Text style={styles.sortBtnText}>Best Match</Text>
            <ChevronDown size={11} color="#64748B" />
          </Pressable>
        </View>

        {/* PG & Hostel Cards Feed */}
        {filteredPGs.length > 0 ? (
          filteredPGs.map((pg) => (
            <PGCard
              key={pg.id}
              pg={pg}
              isSaved={savedPropertyIds.includes(pg.id)}
              onToggleSave={toggleSaveProperty}
              onBookVisit={() => router.push('/(renter)/booking/tour' as any)}
              onViewFoodMenu={() => setSelectedFoodPG(pg)}
            />
          ))
        ) : (
          <V4EmptyState
            icon={<Home size={32} color={V4_COLORS.primary} />}
            title="No PG / Hostels Found"
            description="Try adjusting your sharing type, budget range, or locality to discover more verified accommodations."
            actionLabel="Reset All Filters"
            onActionPress={() => {
              setSelectedCategoryTab('All PG & Hostel');
              setSelectedPriceId('all');
              setSelectedLocality('All Localities');
              setSearchQuery('');
            }}
          />
        )}
      </ScrollView>

      {/* 3. LOCALITY PICKER MODAL */}
      <Modal
        visible={localityModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setLocalityModalOpen(false);
          setLocalitySearchText('');
        }}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => {
            setLocalityModalOpen(false);
            setLocalitySearchText('');
          }}
        >
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select or Enter Area</Text>
                <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                  Search student hub, office corridor or type city
                </Text>
              </View>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => {
                  setLocalityModalOpen(false);
                  setLocalitySearchText('');
                }}
              >
                <X size={16} color="#64748B" />
              </Pressable>
            </View>

            {/* Search / Manual Input */}
            <View style={styles.modalSearchRow}>
              <Search size={15} color="#0F766E" strokeWidth={2.4} />
              <TextInput
                placeholder="Search or enter city/area manually..."
                placeholderTextColor="#94A3B8"
                value={localitySearchText}
                onChangeText={setLocalitySearchText}
                style={styles.modalSearchInput}
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (localitySearchText.trim()) {
                    setSelectedLocality(localitySearchText.trim());
                    setLocalityModalOpen(false);
                    setLocalitySearchText('');
                  }
                }}
              />
              {localitySearchText.length > 0 && (
                <Pressable onPress={() => setLocalitySearchText('')} style={{ padding: 4 }}>
                  <X size={14} color="#64748B" />
                </Pressable>
              )}
            </View>

            {/* Custom typed city quick action button */}
            {localitySearchText.trim().length > 0 && (
              <Pressable
                style={styles.customCityModalBtn}
                onPress={() => {
                  setSelectedLocality(localitySearchText.trim());
                  setLocalityModalOpen(false);
                  setLocalitySearchText('');
                }}
              >
                <MapPin size={14} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.customCityModalBtnText} numberOfLines={1}>
                  Use "{localitySearchText.trim()}"
                </Text>
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </Pressable>
            )}

            <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
              {MUMBAI_LOCALITIES.filter((loc) =>
                loc.toLowerCase().includes(localitySearchText.toLowerCase())
              ).map((loc) => {
                const isSelected = selectedLocality === loc;
                return (
                  <Pressable
                    key={loc}
                    style={[styles.modalLocItem, isSelected && styles.modalLocItemActive]}
                    onPress={() => {
                      setSelectedLocality(loc);
                      setLocalityModalOpen(false);
                      setLocalitySearchText('');
                    }}
                  >
                    <MapPin
                      size={15}
                      color={isSelected ? '#0F766E' : '#94A3B8'}
                      strokeWidth={2.4}
                    />
                    <Text
                      style={[
                        styles.modalLocText,
                        isSelected && styles.modalLocTextActive,
                      ]}
                    >
                      {loc}
                    </Text>
                    {isSelected && <Check size={16} color="#0F766E" strokeWidth={2.8} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 4. FOOD MENU & MEAL DETAILS MODAL */}
      <Modal
        visible={!!selectedFoodPG}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedFoodPG(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setSelectedFoodPG(null)}>
          <View style={styles.foodModalCard}>
            <View style={styles.foodModalHeader}>
              <View style={styles.foodIconCircle}>
                <Utensils size={20} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.foodModalTitle}>{selectedFoodPG?.name}</Text>
                <Text style={styles.foodModalSub}>Meal Plan & Kitchen Standards</Text>
              </View>
              <Pressable onPress={() => setSelectedFoodPG(null)}>
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <View style={styles.foodModalBody}>
              <View style={styles.foodHighlightTag}>
                <Sparkles size={13} color="#0F766E" strokeWidth={2.6} />
                <Text style={styles.foodHighlightText}>
                  {selectedFoodPG?.foodDetails}
                </Text>
              </View>

              <View style={styles.mealScheduleGrid}>
                <View style={styles.mealItem}>
                  <Text style={styles.mealItemTitle}>🍳 Breakfast (7:30 - 10:00 AM)</Text>
                  <Text style={styles.mealItemDesc}>Poha, Idli-Sambar, Paratha, Eggs, Tea/Coffee</Text>
                </View>
                <View style={styles.mealItem}>
                  <Text style={styles.mealItemTitle}>🍱 Lunch / Dabba (12:30 - 2:30 PM)</Text>
                  <Text style={styles.mealItemDesc}>Roti, 2 Veg Sabzi, Dal Tadka, Steamed Rice, Salad</Text>
                </View>
                <View style={styles.mealItem}>
                  <Text style={styles.mealItemTitle}>☕ Evening Tea (5:00 - 6:30 PM)</Text>
                  <Text style={styles.mealItemDesc}>Fresh Chai & Crispy Snacks</Text>
                </View>
                <View style={styles.mealItem}>
                  <Text style={styles.mealItemTitle}>🍛 Dinner (8:00 - 10:30 PM)</Text>
                  <Text style={styles.mealItemDesc}>Special Paneer/Chicken, Rotis, Dal Makhani, Sweet</Text>
                </View>
              </View>

              <Pressable
                style={styles.closeFoodBtn}
                onPress={() => setSelectedFoodPG(null)}
              >
                <Text style={styles.closeFoodBtnText}>Got It</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* 5. FILTER INTAKE POPUP MODAL */}
      <V4CategoryIntakeModal
        visible={filterSheetOpen}
        category="pg"
        onClose={() => setFilterSheetOpen(false)}
        onApply={(filters) => {
          if (filters.sharing) {
            setSelectedCategoryTab(filters.sharing);
          } else if (filters.gender === 'girls') {
            setSelectedCategoryTab('Girls Only');
          } else if (filters.gender === 'boys') {
            setSelectedCategoryTab('Boys Only');
          } else if (filters.gender === 'unisex') {
            setSelectedCategoryTab('Unisex Co-Living');
          }
          if (filters.priceId) setSelectedPriceId(filters.priceId);
          if (filters.locality && filters.locality !== 'All Mumbai') {
            setSelectedLocality(filters.locality);
          } else {
            setSelectedLocality('All Localities');
          }
          if (filters.food) {
            setSelectedFilters((prev) => [
              ...prev.filter((f) => !f.includes('Meals') && !f.includes('Food')),
              filters.food,
            ]);
          }
          setFilterSheetOpen(false);
        }}
        onSkip={() => setFilterSheetOpen(false)}
      />
    </View>
  );
};

// -----------------------------------------------------------------------------
// PG & HOSTEL LUXURY CARD COMPONENT
// -----------------------------------------------------------------------------
interface PGCardProps {
  pg: PGListing;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onBookVisit?: () => void;
  onViewFoodMenu?: () => void;
}

const PGCard: React.FC<PGCardProps> = ({
  pg,
  isSaved = false,
  onToggleSave,
  onBookVisit,
  onViewFoodMenu,
}) => {
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleImageScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    if (index !== activeImageIndex && index >= 0 && index < pg.images.length) {
      setActiveImageIndex(index);
    }
  };

  const getGenderBadge = () => {
    if (pg.gender === 'Ladies') {
      return { label: '👩 Girls PG', bg: '#FDF2F8', color: '#DB2777' };
    }
    if (pg.gender === 'Gents') {
      return { label: '👨 Boys PG', bg: '#EFF6FF', color: '#2563EB' };
    }
    return { label: '👥 Unisex Co-Living', bg: '#F5F3FF', color: '#7C3AED' };
  };

  const genderInfo = getGenderBadge();

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push('/(renter)/booking/tour' as any)}
    >
      {/* 1. IMAGE CAROUSEL WITH OVERLAYS */}
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleImageScroll}
          scrollEventThrottle={16}
          style={styles.imageScroll}
        >
          {pg.images.map((imgUrl, idx) => (
            <Image
              key={idx}
              source={{ uri: imgUrl }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View style={styles.imageGradientBottom} />

        {/* Top Floating Left Badges */}
        <View style={styles.topLeftBadges}>
          <View style={styles.badgeZero}>
            <Sparkles size={11} color="#0F766E" />
            <Text style={styles.badgeZeroText}>VERIFIED LISTING</Text>
          </View>
          <View style={[styles.genderPill, { backgroundColor: genderInfo.bg }]}>
            <Text style={[styles.genderPillText, { color: genderInfo.color }]}>
              {genderInfo.label}
            </Text>
          </View>
        </View>

        {/* Top Floating Right: Save Heart */}
        <Pressable
          style={[styles.heartButton, isSaved && styles.heartButtonActive]}
          onPress={() => onToggleSave?.(pg.id)}
        >
          <Heart
            size={18}
            color={isSaved ? '#EF4444' : '#031B2A'}
            fill={isSaved ? '#EF4444' : 'none'}
            strokeWidth={2.4}
          />
        </Pressable>

        {/* Bottom Image Indicators & Rating */}
        <View style={styles.imageBottomRow}>
          <View style={styles.ratingPill}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{pg.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({pg.reviewCount})</Text>
          </View>

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {pg.images.map((_, idx) => (
              <View
                key={idx}
                style={[styles.dot, idx === activeImageIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* 2. CARD CONTENT BODY */}
      <View style={styles.cardContent}>
        {/* Title & Operator */}
        <View style={styles.titlePriceRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.pgName} numberOfLines={1}>
              {pg.name}
            </Text>
            <Text style={styles.operatorText}>{pg.operator}</Text>
          </View>

          <View style={styles.priceCol}>
            <Text style={styles.priceStartLabel}>Starts from</Text>
            <Text style={styles.priceStartVal}>₹{pg.startPrice.toLocaleString('en-IN')}</Text>
            <Text style={styles.pricePerMo}>/ month</Text>
          </View>
        </View>

        {/* Location & Landmark */}
        <View style={styles.locationRow}>
          <MapPin size={13} color="#0F766E" strokeWidth={2.4} style={{ marginTop: 1 }} />
          <Text style={styles.landmarkText} numberOfLines={1}>
            {pg.locality} • {pg.landmark}
          </Text>
        </View>

        {/* Sharing Options Available Bar */}
        <View style={styles.sharingOptionsRow}>
          {pg.sharingPrices.single && (
            <View style={styles.sharingChip}>
              <User size={11} color="#475569" strokeWidth={2.4} />
              <Text style={styles.sharingChipText}>
                Single: ₹{pg.sharingPrices.single.toLocaleString('en-IN')}
              </Text>
            </View>
          )}
          {pg.sharingPrices.double && (
            <View style={styles.sharingChip}>
              <Users size={11} color="#475569" strokeWidth={2.4} />
              <Text style={styles.sharingChipText}>
                Double: ₹{pg.sharingPrices.double.toLocaleString('en-IN')}
              </Text>
            </View>
          )}
          {pg.sharingPrices.triple && (
            <View style={styles.sharingChip}>
              <Users size={11} color="#475569" strokeWidth={2.4} />
              <Text style={styles.sharingChipText}>
                Triple: ₹{pg.sharingPrices.triple.toLocaleString('en-IN')}
              </Text>
            </View>
          )}
        </View>

        {/* Food Included Preview Banner */}
        {pg.foodIncluded && (
          <Pressable style={styles.foodTagRow} onPress={onViewFoodMenu}>
            <View style={styles.foodTagLeft}>
              <Utensils size={12} color="#0F766E" strokeWidth={2.6} />
              <Text style={styles.foodTagLabel} numberOfLines={1}>
                {pg.foodDetails}
              </Text>
            </View>
            <Text style={styles.viewMenuText}>View Menu →</Text>
          </Pressable>
        )}

        {/* Amenities Highlights */}
        <View style={styles.amenityRow}>
          {pg.amenities.slice(0, 4).map((amenity, idx) => (
            <View key={idx} style={styles.amenityPill}>
              <CheckCircle2 size={10} color="#16A34A" strokeWidth={2.6} />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>

        {/* Bottom Actions Row */}
        <View style={styles.actionBottomRow}>
          <View style={styles.depositInfo}>
            <Text style={styles.depositTag}>1 Month Deposit • Verified Listings</Text>
            <Text style={styles.bedsLeftText}>🟢 {pg.availableBeds} beds available</Text>
          </View>

          <Pressable style={styles.scheduleVisitBtn} onPress={onBookVisit}>
            <Calendar size={13} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.scheduleVisitBtnText}>Book Visit</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAF8F5', // Signature Warm Ivory
  },
  topBar: {
    backgroundColor: '#FAF8F5',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(15, 23, 42, 0.06)',
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 10,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  topTitleCol: {
    flex: 1,
    marginLeft: 12,
    gap: 3,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    ...V4_SHADOWS.soft,
  },
  actionBtnActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  filterActiveDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0F766E',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    ...V4_SHADOWS.soft,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  clearSearchBtn: {
    padding: 4,
  },
  categoryTabsCarousel: {
    gap: 6,
    paddingVertical: 2,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  tabChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  scrollContainer: {
    paddingTop: 12,
  },
  quickFiltersScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 10,
  },
  budgetPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  budgetPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  budgetPillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  budgetPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  budgetPillTextActive: {
    color: '#FFFFFF',
  },
  hubSection: {
    marginBottom: 16,
  },
  hubSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  hubHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  hubSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  hubScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  hubCard: {
    width: 200,
    height: 145,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...V4_SHADOWS.card,
  },
  hubImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hubGradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(3, 27, 42, 0.55)',
  },
  hubTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 118, 110, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  hubTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  hubInfo: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
  },
  hubName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  hubLoc: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 1,
  },
  hubBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  hubCount: {
    fontSize: 10,
    fontWeight: '700',
    color: '#14B8A6',
  },
  hubPrice: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  benefitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 12,
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    ...V4_SHADOWS.soft,
  },
  benefitIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  benefitTextCol: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  benefitSub: {
    fontSize: 10.5,
    color: '#475569',
    marginTop: 2,
    lineHeight: 14,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  resultsLeft: {
    gap: 1,
  },
  resultsCountText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  resultsSubText: {
    fontSize: 11,
    color: '#64748B',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  sortBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
    ...V4_SHADOWS.card,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  imageScroll: {
    width: '100%',
    height: '100%',
  },
  propertyImage: {
    width: CARD_WIDTH,
    height: 200,
  },
  imageGradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: 'rgba(3, 27, 42, 0.45)',
  },
  topLeftBadges: {
    position: 'absolute',
    top: 10,
    left: 10,
    gap: 6,
    flexDirection: 'row',
  },
  badgeZero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    ...V4_SHADOWS.soft,
  },
  badgeZeroText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  genderPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    ...V4_SHADOWS.soft,
  },
  genderPillText: {
    fontSize: 9,
    fontWeight: '900',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.soft,
  },
  heartButtonActive: {
    backgroundColor: '#FFF1F2',
  },
  imageBottomRow: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ratingCount: {
    fontSize: 10,
    color: '#CBD5E1',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  dotActive: {
    width: 14,
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    padding: 14,
    gap: 8,
  },
  titlePriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  pgName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  operatorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F766E',
    marginTop: 2,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceStartLabel: {
    fontSize: 9.5,
    color: '#64748B',
  },
  priceStartVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F766E',
  },
  pricePerMo: {
    fontSize: 9.5,
    color: '#64748B',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  landmarkText: {
    fontSize: 11.5,
    color: '#64748B',
    flex: 1,
  },
  sharingOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 2,
  },
  sharingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sharingChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
  },
  foodTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  foodTagLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 6,
  },
  foodTagLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
    flex: 1,
  },
  viewMenuText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  amenityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  amenityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  amenityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  actionBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  depositInfo: {
    gap: 2,
  },
  depositTag: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  bedsLeftText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16A34A',
  },
  scheduleVisitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0F766E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    ...V4_SHADOWS.soft,
  },
  scheduleVisitBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 10,
    gap: 8,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  customCityModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F766E',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  customCityModalBtnText: {
    flex: 1,
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalScroll: {
    marginBottom: 10,
  },
  modalLocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 10,
  },
  modalLocItemActive: {
    backgroundColor: '#F0FDFA',
  },
  modalLocText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },
  modalLocTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  foodModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    margin: 20,
    padding: 20,
    ...V4_SHADOWS.card,
  },
  foodModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  foodIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  foodModalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  foodModalBody: {
    gap: 12,
  },
  foodHighlightTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  foodHighlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
    flex: 1,
  },
  mealScheduleGrid: {
    gap: 8,
  },
  mealItem: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mealItemTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  mealItemDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  closeFoodBtn: {
    backgroundColor: '#0F766E',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  closeFoodBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
