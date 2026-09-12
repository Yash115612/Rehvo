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
  Filter,
  Layers,
  Map,
  List,
  Flame,
  Award,
  Calendar,
  Home,
  Star,
  Info,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { Property } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS, V4_TYPOGRAPHY } from '../../../theme/v4Theme';
import { V4PropertyCardLarge } from '../ui/V4PropertyCardLarge';
import { V4FilterChip } from '../ui/V4FilterChip';
import { V4FilterSheet } from './V4FilterSheet';
import { V4CategoryIntakeModal } from '../ui/V4CategoryIntakeModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BHK_TABS = [
  'All Flats',
  '1 BHK',
  '2 BHK',
  '3 BHK',
  '4+ BHK',
  'Studio',
  'Penthouse',
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Budgets', min: 0, max: 1000000 },
  { id: 'u35k', label: 'Under ₹35k', min: 0, max: 35000 },
  { id: '35_60k', label: '₹35k - ₹60k', min: 35000, max: 60000 },
  { id: '60_100k', label: '₹60k - ₹1.0L', min: 60000, max: 100000 },
  { id: '100_180k', label: '₹1.0L - ₹1.8L', min: 100000, max: 180000 },
  { id: 'luxury', label: 'Luxury ₹1.8L+', min: 180000, max: 1000000 },
];

const QUICK_AMENITY_FILTERS = [
  '✨ Verified Listing',
  '🏢 Gated High-Rise',
  '🛋️ Fully Furnished',
  '🌊 Sea Facing',
  '⚡ Move-in Ready',
  '🐾 Pet Friendly',
  '🚗 Covered Parking',
  '🏊 Pool & Gym',
  '🚆 Near Metro',
];

const POPULAR_SOCIETIES = [
  {
    id: 'soc_1',
    name: 'Lodha Park',
    locality: 'Worli, South Mumbai',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    units: '8 Units Available',
    startPrice: '₹1.4L/mo',
    tag: 'Ultra Luxury',
  },
  {
    id: 'soc_2',
    name: 'Hiranandani Gardens',
    locality: 'Powai, Central Mumbai',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    units: '14 Units Available',
    startPrice: '₹55k/mo',
    tag: 'Green Township',
  },
  {
    id: 'soc_3',
    name: 'Rustomjee Elements',
    locality: 'Juhu / Andheri West',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    units: '6 Units Available',
    startPrice: '₹1.1L/mo',
    tag: 'Celeb Preferred',
  },
  {
    id: 'soc_4',
    name: 'Kalpataru Sparkle',
    locality: 'Bandra East / BKC',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    units: '9 Units Available',
    startPrice: '₹85k/mo',
    tag: 'Near BKC Hub',
  },
];

const MUMBAI_LOCALITIES = [
  'All Localities',
  'Bandra West',
  'Andheri West',
  'Powai',
  'Juhu',
  'Worli',
  'Lower Parel',
  'Goregaon West',
  'Thane West',
  'Navi Mumbai',
  'BKC',
  'Pune',
  'Bangalore',
  'Delhi NCR',
];

export const V4FlatsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    bhk?: string;
    priceId?: string;
    locality?: string;
    furnishing?: string;
  }>();
  const { properties, savedPropertyIds, toggleSaveProperty } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBhk, setSelectedBhk] = useState(params.bhk || 'All Flats');
  const [selectedPriceId, setSelectedPriceId] = useState(params.priceId || 'all');
  const [selectedLocality, setSelectedLocality] = useState(
    params.locality && params.locality !== 'All Mumbai Metro' ? params.locality : 'All Localities'
  );
  const [localitySearchText, setLocalitySearchText] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    '✨ Verified Listing',
    ...(params.furnishing && params.furnishing !== 'Any Furnishing' ? ['🛋️ ' + params.furnishing] : []),
  ]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [localityModalOpen, setLocalityModalOpen] = useState(false);

  // Master property list (Store)
  const allProperties = useMemo(() => {
    return properties || [];
  }, [properties]);

  // Toggle filter chip
  const toggleFilter = (f: string) => {
    setSelectedFilters((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  // Filter properties
  const filteredFlats = useMemo(() => {
    return allProperties.filter((p) => {
      // BHK filter
      if (selectedBhk !== 'All Flats') {
        if (selectedBhk === 'Studio' && !p.bhk?.toLowerCase().includes('1 rk') && !p.bhk?.toLowerCase().includes('studio') && !p.title?.toLowerCase().includes('studio')) {
          return false;
        }
        if (selectedBhk === 'Penthouse' && !p.title?.toLowerCase().includes('penthouse') && !p.bhk?.toLowerCase().includes('penthouse')) {
          return false;
        }
        if (selectedBhk === '4+ BHK' && !p.bhk?.toLowerCase().includes('4') && !p.bhk?.toLowerCase().includes('5')) {
          return false;
        }
        if (selectedBhk === '1 BHK' && !p.bhk?.toLowerCase().includes('1 bhk')) {
          return false;
        }
        if (selectedBhk === '2 BHK' && !p.bhk?.toLowerCase().includes('2 bhk')) {
          return false;
        }
        if (selectedBhk === '3 BHK' && !p.bhk?.toLowerCase().includes('3 bhk')) {
          return false;
        }
      }

      // Price filter
      const currentPriceRange = PRICE_RANGES.find((r) => r.id === selectedPriceId);
      if (currentPriceRange) {
        const rent = p.rent || 35000;
        if (rent < currentPriceRange.min || rent > currentPriceRange.max) {
          return false;
        }
      }

      // Locality filter
      if (selectedLocality !== 'All Localities') {
        const loc = selectedLocality.toLowerCase();
        if (
          !p.locality?.toLowerCase().includes(loc) &&
          !p.address?.toLowerCase().includes(loc) &&
          !p.title?.toLowerCase().includes(loc)
        ) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.title?.toLowerCase().includes(q) ||
          p.locality?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q) ||
          p.bhk?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Quick amenity filters
      if (selectedFilters.includes('🛋️ Fully Furnished') && p.furnishing !== 'FULLY_FURNISHED') {
        return false;
      }
      if (selectedFilters.includes('🌊 Sea Facing') && !p.title?.toLowerCase().includes('sea') && !p.description?.toLowerCase().includes('sea')) {
        return false;
      }

      return true;
    });
  }, [allProperties, selectedBhk, selectedPriceId, selectedLocality, searchQuery, selectedFilters]);

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
            <Text style={styles.screenTitle}>Property for Rent</Text>

            <Pressable
              style={styles.locationPill}
              onPress={() => setLocalityModalOpen(true)}
            >
              <MapPin size={11} color="#0F766E" strokeWidth={2.6} />
              <Text style={styles.locationPillText} numberOfLines={1}>
                {selectedLocality === 'All Localities' ? 'Mumbai Metro (All)' : selectedLocality}
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
              {(selectedFilters.length > 0 || selectedBhk !== 'All Flats' || selectedPriceId !== 'all') && (
                <View style={styles.filterActiveDot} />
              )}
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
            placeholder="Search 1/2/3 BHK, Bandra, Sea View, Furnished..."
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

        {/* BHK Tabs Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bhkCarousel}
        >
          {BHK_TABS.map((bhk) => {
            const isSelected = selectedBhk === bhk;
            return (
              <Pressable
                key={bhk}
                style={[styles.bhkChip, isSelected && styles.bhkChipActive]}
                onPress={() => setSelectedBhk(bhk)}
              >
                <Text style={[styles.bhkChipText, isSelected && styles.bhkChipTextActive]}>
                  {bhk}
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
        {/* Quick Filter Chips */}
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
                <Text style={[styles.budgetPillText, isSelected && styles.budgetPillTextActive]}>
                  {r.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Gated Society Spotlight Rail */}
        <View style={styles.societySection}>
          <View style={styles.societySectionHeader}>
            <View>
              <Text style={styles.societyHeading}>Top Gated Societies</Text>
              <Text style={styles.societySub}>Curated luxury high-rises with 24/7 security & clubhouses</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.societyCardsScroll}
          >
            {POPULAR_SOCIETIES.map((soc) => (
              <Pressable
                key={soc.id}
                style={styles.socCard}
                onPress={() => setSearchQuery(soc.name)}
              >
                <Image source={{ uri: soc.image }} style={styles.socImage} />
                <View style={styles.socTagPill}>
                  <Text style={styles.socTagText}>{soc.tag}</Text>
                </View>

                <View style={styles.socDetails}>
                  <Text style={styles.socTitle} numberOfLines={1}>{soc.name}</Text>
                  <Text style={styles.socLoc} numberOfLines={1}>{soc.locality}</Text>
                  <View style={styles.socBottomRow}>
                    <Text style={styles.socUnits}>{soc.units}</Text>
                    <Text style={styles.socPrice}>From {soc.startPrice}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Verified Listings Counter Header */}
        <View style={styles.resultsCounterRow}>
          <View>
            <Text style={styles.resultsCount}>
              {filteredFlats.length} Verified Flats Found
            </Text>
            <Text style={styles.resultsSub}>
              {selectedLocality === 'All Localities' ? 'Across Mumbai Metro' : `In ${selectedLocality}`} • Direct Owners
            </Text>
          </View>

          <Pressable
            style={styles.sortSelector}
            onPress={() => setFilterSheetOpen(true)}
          >
            <Sparkles size={11} color={V4_COLORS.primary} />
            <Text style={styles.sortSelectorText}>Best Match</Text>
            <ChevronDown size={11} color="#64748B" />
          </Pressable>
        </View>

        {/* Flats Feed */}
        {filteredFlats.length > 0 ? (
          filteredFlats.map((property) => (
            <V4PropertyCardLarge
              key={property.id}
              property={property}
              isSaved={savedPropertyIds.includes(property.id)}
              onToggleSave={toggleSaveProperty}
              onSelect={(p) => router.push(`/(renter)/property/${p.id}` as any)}
              onBookVisit={() => router.push('/(renter)/booking/tour' as any)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Home size={32} color={V4_COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No Flats Match Selected Filters</Text>
            <Text style={styles.emptySub}>
              Try adjusting your BHK selection, budget range, or locality to see more available verified properties.
            </Text>
            <Pressable
              style={styles.resetBtn}
              onPress={() => {
                setSelectedBhk('All Flats');
                setSelectedPriceId('all');
                setSelectedLocality('All Localities');
                setSelectedFilters(['✨ Verified Listing']);
                setSearchQuery('');
              }}
            >
              <Text style={styles.resetBtnText}>Reset All Filters</Text>
            </Pressable>
          </View>
        )}

        {/* Renter Trust & Escrow Guarantee Strip */}
        <View style={styles.trustBannerCard}>
          <View style={styles.trustBannerTop}>
            <ShieldCheck size={20} color="#16A34A" strokeWidth={2.4} />
            <Text style={styles.trustBannerTitle}>REHVO 100% Escrow Protection</Text>
          </View>
          <Text style={styles.trustBannerBody}>
            Transparent pricing, Model Tenancy Act compliant digital lease agreements, and ₹10,000 security token refund guarantee on all apartments.
          </Text>
        </View>

        {/* List Your Flat CTA for Landlords */}
        <Pressable
          style={styles.hostBanner}
          onPress={() => router.push('/(renter)/listing' as any)}
        >
          <View style={styles.hostBannerLeft}>
            <View style={styles.hostTag}>
              <Sparkles size={11} color="#FFFFFF" strokeWidth={2.8} />
              <Text style={styles.hostTagText}>OWNERS RENT FREE</Text>
            </View>
            <Text style={styles.hostTitle}>Own a Flat or Apartment?</Text>
            <Text style={styles.hostSub}>
              List in 3 minutes. Get verified tenants with DigiLocker background check and verified listing.
            </Text>
          </View>
          <View style={styles.hostBtn}>
            <Text style={styles.hostBtnText}>List Flat →</Text>
          </View>
        </Pressable>
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
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select or Enter City</Text>
                <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                  Choose popular area or type any custom location
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  setLocalityModalOpen(false);
                  setLocalitySearchText('');
                }}
                style={{ padding: 4 }}
              >
                <X size={18} color="#031B2A" />
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

            <ScrollView style={{ maxHeight: 300 }} keyboardShouldPersistTaps="handled">
              {MUMBAI_LOCALITIES.filter((loc) =>
                loc.toLowerCase().includes(localitySearchText.toLowerCase())
              ).map((loc) => {
                const isSelected = selectedLocality === loc;
                return (
                  <Pressable
                    key={loc}
                    style={[styles.localityItem, isSelected && styles.localityItemActive]}
                    onPress={() => {
                      setSelectedLocality(loc);
                      setLocalityModalOpen(false);
                      setLocalitySearchText('');
                    }}
                  >
                    <MapPin size={15} color={isSelected ? V4_COLORS.primary : '#64748B'} />
                    <Text style={[styles.localityItemText, isSelected && styles.localityItemTextActive]}>
                      {loc}
                    </Text>
                    {isSelected && <Check size={16} color={V4_COLORS.primary} strokeWidth={2.6} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 4. FILTER INTAKE POPUP MODAL */}
      <V4CategoryIntakeModal
        visible={filterSheetOpen}
        category="rental"
        onClose={() => setFilterSheetOpen(false)}
        onApply={(filters) => {
          if (filters.bhk) setSelectedBhk(filters.bhk);
          if (filters.priceId) setSelectedPriceId(filters.priceId);
          if (filters.locality && filters.locality !== 'All Mumbai Metro') {
            setSelectedLocality(filters.locality);
          } else {
            setSelectedLocality('All Localities');
          }
          if (filters.furnishing && filters.furnishing !== 'Any Furnishing') {
            setSelectedFilters((prev) => [
              ...prev.filter((f) => !f.includes('Furnished')),
              '🛋️ ' + filters.furnishing,
            ]);
          }
          setFilterSheetOpen(false);
        }}
        onSkip={() => setFilterSheetOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  zeroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  zeroPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.4,
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
  bhkCarousel: {
    gap: 6,
    paddingVertical: 2,
  },
  bhkChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  bhkChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  bhkChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  bhkChipTextActive: {
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
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  budgetPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  budgetPillTextActive: {
    color: '#FFFFFF',
  },
  societySection: {
    marginBottom: 18,
  },
  societySectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  societyHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  societySub: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  societyCardsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  socCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  socImage: {
    width: '100%',
    height: 110,
    backgroundColor: '#E2E8F0',
  },
  socTagPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  socTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  socDetails: {
    padding: 10,
  },
  socTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  socLoc: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  socBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  socUnits: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16A34A',
  },
  socPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  resultsCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  resultsSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  sortSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortSelectorText: {
    fontSize: 11,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(15, 118, 110, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetBtn: {
    marginTop: 16,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  trustBannerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  trustBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  trustBannerBody: {
    fontSize: 12,
    color: '#166534',
    marginTop: 4,
    lineHeight: 16,
  },
  hostBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...V4_SHADOWS.card,
  },
  hostBannerLeft: {
    flex: 1,
    marginRight: 10,
  },
  hostTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  hostTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hostTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  hostSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 3,
    lineHeight: 15,
  },
  hostBtn: {
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  hostBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    ...V4_SHADOWS.floating,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
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
  localityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  localityItemActive: {
    backgroundColor: 'rgba(15, 118, 110, 0.08)',
  },
  localityItemText: {
    fontSize: 14,
    color: V4_COLORS.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
  localityItemTextActive: {
    color: V4_COLORS.primary,
    fontWeight: '700',
  },
});
