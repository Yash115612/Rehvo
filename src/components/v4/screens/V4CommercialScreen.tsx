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
  Calendar,
  Home,
  Star,
  Heart,
  Briefcase,
  Layers,
  FileText,
  CheckCircle2,
  Users,
  Car,
  Zap,
  Clock,
  Maximize2,
  BadgePercent,
  Warehouse,
  Store,
  Compass,
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

// 1. COMMERCIAL CATEGORIES
const COMMERCIAL_TABS = [
  'All Commercial',
  'Office Space',
  'Commercial Plots',
  'Studios & Workspaces',
  'Retail & Shops',
  'Showrooms',
  'Warehouses & Logistics',
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Budgets', min: 0, max: Infinity },
  { id: 'under_50k', label: 'Under ₹50k', min: 0, max: 50000 },
  { id: '50k_1.5L', label: '₹50k - ₹1.5L', min: 50000, max: 150000 },
  { id: '1.5L_5L', label: '₹1.5L - ₹5L', min: 150000, max: 500000 },
  { id: 'enterprise_5L', label: 'Enterprise ₹5L+', min: 500000, max: Infinity },
];

const QUICK_COMMERCIAL_FILTERS = [
  '🏢 Grade-A Tower',
  '🛋️ Fully Furnished',
  '⚡ 100% Power Backup',
  '🚗 Reserved Parking',
  '🚇 Near Metro Station',
  '📜 RERA / OC Approved',
  '🔒 24x7 Biometric Security',
];

const COMMERCIAL_CORRIDORS = [
  {
    id: 'corridor_1',
    name: 'BKC Financial Hub',
    locality: 'G-Block & Platinum District',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    propCount: '24 Available',
    startRate: '₹220/sq.ft',
    tag: 'Fortune 500 Hub',
  },
  {
    id: 'corridor_2',
    name: 'Lower Parel & Worli',
    locality: 'Kamala Mills & One World Center',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    propCount: '18 Available',
    startRate: '₹185/sq.ft',
    tag: 'Creative & FinTech',
  },
  {
    id: 'corridor_3',
    name: 'Andheri East MIDC / Chakala',
    locality: 'Near Line 1 & Line 7 Metro',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
    propCount: '32 Available',
    startRate: '₹95/sq.ft',
    tag: 'IT & Corporate',
  },
  {
    id: 'corridor_4',
    name: 'Navi Mumbai & Thane',
    locality: 'Airoli Mindspace & Majiwada',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    propCount: '20 Available',
    startRate: '₹65/sq.ft',
    tag: 'Large Campus / SEZ',
  },
];

const MUMBAI_LOCALITIES = [
  'All Localities',
  'BKC (Bandra Kurla Complex)',
  'Lower Parel',
  'Andheri East (MIDC/Chakala)',
  'Bandra West',
  'Powai Commercial',
  'Worli',
  'Goregaon West / Nesco',
  'Navi Mumbai (Airoli/Vashi)',
  'Thane West (Wagle Estate)',
  'Nariman Point',
  'Pune (Hinjewadi / Kharadi)',
  'Bangalore (Indiranagar / Whitefield)',
  'Delhi NCR (Cyber Hub / Noida)',
];

interface CommercialListing {
  id: string;
  name: string;
  buildingName: string;
  category: 'office' | 'plot' | 'studio' | 'shop' | 'showroom' | 'warehouse';
  locality: string;
  address: string;
  carpetArea: number;
  superBuiltupArea: number;
  monthlyRent: number;
  ratePerSqft: number;
  furnishing: 'Fully Furnished' | 'Warm Shell' | 'Bare Shell' | 'Plug & Play';
  seatsCount?: number;
  cabinsCount?: number;
  conferenceCount?: number;
  parkingSlots: number;
  images: string[];
  amenities: string[];
  isVerified: boolean;
  depositMonths: number;
  reraNumber?: string;
  tag?: string;
  idealFor?: string;
}

function mapPropertyToCommercialListing(p: Property): CommercialListing {
  const images =
    p.images && p.images.length > 0
      ? p.images.map((img) => (typeof img === 'string' ? img : img.url))
      : ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80'];

  const pType = (p.property_type || (p as any).commercial_type || '').toLowerCase();
  const category = (
    pType.includes('office')
      ? 'office'
      : pType.includes('plot')
      ? 'plot'
      : pType.includes('studio')
      ? 'studio'
      : pType.includes('shop')
      ? 'shop'
      : pType.includes('showroom')
      ? 'showroom'
      : pType.includes('warehouse')
      ? 'warehouse'
      : 'office'
  ) as CommercialListing['category'];

  const furnishing: CommercialListing['furnishing'] =
    p.furnishing === 'FULLY_FURNISHED'
      ? 'Fully Furnished'
      : p.furnishing === 'UNFURNISHED'
      ? 'Bare Shell'
      : 'Warm Shell';

  const isVerified = p.verification_status === 'VERIFIED';

  return {
    id: p.id,
    name: p.title,
    buildingName: (p as any).society_name || p.title,
    category,
    locality: p.locality,
    address: p.address || `${p.locality}, ${p.city}`,
    carpetArea: (p as any).carpet_area || p.area_sqft || 1000,
    superBuiltupArea: p.area_sqft || 1200,
    monthlyRent: p.rent || 0,
    ratePerSqft: p.area_sqft ? Math.round((p.rent || 0) / p.area_sqft) : 0,
    furnishing,
    parkingSlots: (p as any).parking_spaces ? parseInt(String((p as any).parking_spaces), 10) || 1 : 1,
    images,
    amenities: p.amenities || [],
    isVerified,
    depositMonths: p.deposit ? Math.round(p.deposit / (p.rent || 1)) : 2,
    reraNumber: (p as any).rera_number,
    tag: isVerified ? 'GRADE-A PRIME' : undefined,
    idealFor: (p as any).ideal_for,
  };
}

export const V4CommercialScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    commType?: string;
    carpetArea?: string;
    priceId?: string;
    locality?: string;
    furnishing?: string;
  }>();
  const { properties, savedPropertyIds, toggleSaveProperty } = useAppStore();

  const commercialListings: CommercialListing[] = useMemo(() => {
    return (properties || [])
      .filter((p) => {
        const typeStr = String(p.property_type || '').toLowerCase();
        return (
          p.category === 'commercial' ||
          [
            'office',
            'shop',
            'showroom',
            'warehouse',
            'coworking',
            'commercial_plot',
            'commercial_building',
            'other_commercial',
          ].includes(typeStr)
        );
      })
      .map(mapPropertyToCommercialListing);
  }, [properties]);

  const getInitialTab = () => {
    if (params.commType === 'office') return 'Office Space';
    if (params.commType === 'plot') return 'Commercial Plots';
    if (params.commType === 'studio') return 'Studios & Workspaces';
    if (params.commType === 'shop') return 'Retail & Shops';
    if (params.commType === 'warehouse') return 'Warehouses & Logistics';
    return 'All Commercial';
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(getInitialTab());
  const [selectedPriceId, setSelectedPriceId] = useState(params.priceId || 'all');
  const [selectedLocality, setSelectedLocality] = useState(
    params.locality && params.locality !== 'All Business Hubs' ? params.locality : 'All Localities'
  );
  const [localitySearchText, setLocalitySearchText] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    '🏢 Grade-A Tower',
    ...(params.furnishing ? ['🛋️ ' + params.furnishing] : []),
  ]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [localityModalOpen, setLocalityModalOpen] = useState(false);
  const [selectedSpecProperty, setSelectedSpecProperty] = useState<CommercialListing | null>(null);

  // Toggle quick amenity filter
  const toggleFilter = (f: string) => {
    setSelectedFilters((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  // Filter listings
  const filteredProperties = useMemo(() => {
    return commercialListings.filter((prop) => {
      // 1. Category Tab Filter
      if (selectedCategoryTab === 'Office Space' && prop.category !== 'office') return false;
      if (selectedCategoryTab === 'Commercial Plots' && prop.category !== 'plot') return false;
      if (selectedCategoryTab === 'Studios & Workspaces' && prop.category !== 'studio') return false;
      if (selectedCategoryTab === 'Retail & Shops' && prop.category !== 'shop') return false;
      if (selectedCategoryTab === 'Showrooms' && prop.category !== 'showroom' && prop.category !== 'shop') return false;
      if (selectedCategoryTab === 'Warehouses & Logistics' && prop.category !== 'warehouse') return false;

      // 2. Budget Filter
      const currentPriceRange = PRICE_RANGES.find((r) => r.id === selectedPriceId);
      if (currentPriceRange) {
        if (prop.monthlyRent < currentPriceRange.min || prop.monthlyRent > currentPriceRange.max) {
          return false;
        }
      }

      // 3. Locality Filter
      if (selectedLocality !== 'All Localities') {
        const loc = selectedLocality.toLowerCase();
        if (
          !prop.locality.toLowerCase().includes(loc) &&
          !prop.address.toLowerCase().includes(loc)
        ) {
          return false;
        }
      }

      // 4. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          prop.name.toLowerCase().includes(q) ||
          prop.buildingName.toLowerCase().includes(q) ||
          prop.locality.toLowerCase().includes(q) ||
          prop.address.toLowerCase().includes(q) ||
          prop.idealFor?.toLowerCase().includes(q) ||
          prop.amenities.some((a) => a.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // 5. Amenity Filters
      if (
        selectedFilters.includes('🛋️ Fully Furnished') &&
        prop.furnishing !== 'Fully Furnished' &&
        prop.furnishing !== 'Plug & Play'
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
            <Text style={styles.screenTitle}>Commercial & Workspaces</Text>

            <Pressable
              style={styles.locationPill}
              onPress={() => setLocalityModalOpen(true)}
            >
              <MapPin size={11} color="#0F766E" strokeWidth={2.6} />
              <Text style={styles.locationPillText} numberOfLines={1}>
                {selectedLocality === 'All Localities' ? 'All Mumbai Business Hubs' : selectedLocality}
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
                selectedCategoryTab !== 'All Commercial' ||
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
            placeholder="Search BKC Office, Studio, Retail, Plots, Warehouse..."
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

        {/* Category Tabs Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsCarousel}
        >
          {COMMERCIAL_TABS.map((tab) => {
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
          {QUICK_COMMERCIAL_FILTERS.map((f) => (
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

        {/* Commercial Hubs Spotlight Rail */}
        <View style={styles.corridorSection}>
          <View style={styles.corridorSectionHeader}>
            <View>
              <Text style={styles.corridorHeading}>Top Mumbai Commercial Corridors</Text>
              <Text style={styles.corridorSub}>
                Grade-A certified corporate towers, retail promenades & tech parks
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.corridorScroll}
          >
            {COMMERCIAL_CORRIDORS.map((corridor) => (
              <Pressable
                key={corridor.id}
                style={styles.corridorCard}
                onPress={() => {
                  if (corridor.id === 'corridor_1') setSelectedLocality('BKC (Bandra Kurla Complex)');
                  else if (corridor.id === 'corridor_2') setSelectedLocality('Lower Parel');
                  else if (corridor.id === 'corridor_3') setSelectedLocality('Andheri East (MIDC/Chakala)');
                  else if (corridor.id === 'corridor_4') setSelectedLocality('Navi Mumbai (Airoli/Vashi)');
                }}
              >
                <Image source={{ uri: corridor.image }} style={styles.corridorImg} />
                <View style={styles.corridorGradientOverlay} />
                <View style={styles.corridorTag}>
                  <Text style={styles.corridorTagText}>{corridor.tag}</Text>
                </View>

                <View style={styles.corridorInfo}>
                  <Text style={styles.corridorName}>{corridor.name}</Text>
                  <Text style={styles.corridorLoc}>{corridor.locality}</Text>
                  <View style={styles.corridorBottomRow}>
                    <Text style={styles.corridorCount}>{corridor.propCount}</Text>
                    <Text style={styles.corridorPrice}>Avg {corridor.startRate}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Verified Marketplace Commercial Guarantee Banner */}
        <View style={styles.benefitBanner}>
          <View style={styles.benefitIconBox}>
            <Building2 size={20} color="#0F766E" strokeWidth={2.4} />
          </View>
          <View style={styles.benefitTextCol}>
            <Text style={styles.benefitTitle}>Direct Landlord & Builder Deals • Verified Listing</Text>
            <Text style={styles.benefitSub}>
              Save with transparent commercial pricing. Verified RERA approvals, OC ready & direct lease drafting.
            </Text>
          </View>
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeaderRow}>
          <View style={styles.resultsLeft}>
            <Text style={styles.resultsCountText}>
              {filteredProperties.length} Commercial Spaces Available
            </Text>
            <Text style={styles.resultsSubText}>Direct Landlord Verified Properties</Text>
          </View>

          <Pressable style={styles.sortBtn} onPress={() => setFilterSheetOpen(true)}>
            <Text style={styles.sortBtnText}>Sort: Area / Rate</Text>
            <ChevronDown size={11} color="#64748B" />
          </Pressable>
        </View>

        {/* Commercial Property Cards Feed */}
        {filteredProperties.length > 0 ? (
          filteredProperties.map((prop) => (
            <CommercialCard
              key={prop.id}
              property={prop}
              isSaved={savedPropertyIds.includes(prop.id)}
              onToggleSave={toggleSaveProperty}
              onBookVisit={() => router.push('/(renter)/booking/tour' as any)}
              onViewSpecs={() => setSelectedSpecProperty(prop)}
            />
          ))
        ) : (
          <V4EmptyState
            icon={<Briefcase size={32} color={V4_COLORS.primary} />}
            title="No Commercial Spaces Found"
            description="Try adjusting your category selection, budget range, or locality to discover more verified commercial listings."
            actionLabel="Reset All Filters"
            onActionPress={() => {
              setSelectedCategoryTab('All Commercial');
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
                <Text style={styles.modalTitle}>Select or Enter Business Hub</Text>
                <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                  Search commercial district, SEZ or type city
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
                placeholder="Search or enter city/hub manually..."
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

      {/* 4. SPECIFICATIONS & FLOOR PLAN MODAL */}
      <Modal
        visible={!!selectedSpecProperty}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedSpecProperty(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSelectedSpecProperty(null)}
        >
          <View style={styles.specModalCard}>
            <View style={styles.specModalHeader}>
              <View style={styles.specIconCircle}>
                <Building2 size={20} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.specModalTitle}>{selectedSpecProperty?.name}</Text>
                <Text style={styles.specModalSub}>
                  {selectedSpecProperty?.buildingName} • {selectedSpecProperty?.locality}
                </Text>
              </View>
              <Pressable onPress={() => setSelectedSpecProperty(null)}>
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <View style={styles.specModalBody}>
              <View style={styles.specGrid}>
                <View style={styles.specBox}>
                  <Text style={styles.specBoxLabel}>Carpet Area</Text>
                  <Text style={styles.specBoxVal}>{selectedSpecProperty?.carpetArea} sq.ft</Text>
                </View>
                <View style={styles.specBox}>
                  <Text style={styles.specBoxLabel}>Monthly Rent</Text>
                  <Text style={styles.specBoxVal}>₹{selectedSpecProperty?.monthlyRent.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.specBox}>
                  <Text style={styles.specBoxLabel}>Rate / Sq.Ft</Text>
                  <Text style={styles.specBoxVal}>₹{selectedSpecProperty?.ratePerSqft}/sq.ft</Text>
                </View>
                <View style={styles.specBox}>
                  <Text style={styles.specBoxLabel}>Furnishing</Text>
                  <Text style={styles.specBoxVal}>{selectedSpecProperty?.furnishing}</Text>
                </View>
              </View>

              {selectedSpecProperty?.idealFor && (
                <View style={styles.idealForBox}>
                  <Sparkles size={13} color="#0F766E" strokeWidth={2.6} />
                  <Text style={styles.idealForText}>
                    Ideal For: {selectedSpecProperty.idealFor}
                  </Text>
                </View>
              )}

              <View style={styles.amenitiesList}>
                <Text style={styles.amenitiesTitle}>Fittings & Specifications:</Text>
                {selectedSpecProperty?.amenities.map((item, idx) => (
                  <View key={idx} style={styles.specAmenityRow}>
                    <CheckCircle2 size={13} color="#16A34A" strokeWidth={2.6} />
                    <Text style={styles.specAmenityText}>{item}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                style={styles.closeSpecBtn}
                onPress={() => {
                  setSelectedSpecProperty(null);
                  router.push('/(renter)/booking/tour' as any);
                }}
              >
                <Calendar size={14} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.closeSpecBtnText}>Schedule Site Inspection</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* 5. FILTER INTAKE POPUP MODAL */}
      <V4CategoryIntakeModal
        visible={filterSheetOpen}
        category="commercial"
        onClose={() => setFilterSheetOpen(false)}
        onApply={(filters) => {
          if (filters.commType === 'office') setSelectedCategoryTab('Office Space');
          else if (filters.commType === 'plot') setSelectedCategoryTab('Commercial Plots');
          else if (filters.commType === 'studio') setSelectedCategoryTab('Studios & Workspaces');
          else if (filters.commType === 'shop') setSelectedCategoryTab('Retail & Shops');
          else if (filters.commType === 'warehouse') setSelectedCategoryTab('Warehouses & Logistics');

          if (filters.priceId) setSelectedPriceId(filters.priceId);
          if (filters.locality && filters.locality !== 'All Business Hubs') {
            setSelectedLocality(filters.locality);
          } else {
            setSelectedLocality('All Localities');
          }
          if (filters.furnishing) {
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

// -----------------------------------------------------------------------------
// COMMERCIAL CARD COMPONENT
// -----------------------------------------------------------------------------
interface CommercialCardProps {
  property: CommercialListing;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onBookVisit?: () => void;
  onViewSpecs?: () => void;
}

const CommercialCard: React.FC<CommercialCardProps> = ({
  property,
  isSaved = false,
  onToggleSave,
  onBookVisit,
  onViewSpecs,
}) => {
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleImageScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    if (index !== activeImageIndex && index >= 0 && index < property.images.length) {
      setActiveImageIndex(index);
    }
  };

  const getCategoryBadge = () => {
    if (property.category === 'office') return { label: '🏢 Corporate Office', bg: '#F0FDFA', color: '#0F766E' };
    if (property.category === 'plot') return { label: '📐 Commercial Plot', bg: '#FEF3C7', color: '#D97706' };
    if (property.category === 'studio') return { label: '🎨 Creator Studio', bg: '#F3E8FF', color: '#7C3AED' };
    if (property.category === 'shop') return { label: '🛍️ Retail Showroom', bg: '#FFE4E6', color: '#E11D48' };
    return { label: '📦 Logistics Warehouse', bg: '#EFF6FF', color: '#2563EB' };
  };

  const catBadge = getCategoryBadge();

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
          {property.images.map((imgUrl, idx) => (
            <Image
              key={idx}
              source={{ uri: imgUrl }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View style={styles.imageGradientBottom} />

        {/* Top Badges */}
        <View style={styles.topLeftBadges}>
          <View style={styles.badgeZero}>
            <Sparkles size={11} color="#0F766E" />
            <Text style={styles.badgeZeroText}>VERIFIED LISTING</Text>
          </View>
          <View style={[styles.categoryPill, { backgroundColor: catBadge.bg }]}>
            <Text style={[styles.categoryPillText, { color: catBadge.color }]}>
              {catBadge.label}
            </Text>
          </View>
        </View>

        {/* Save Wishlist Button */}
        <Pressable
          style={[styles.heartButton, isSaved && styles.heartButtonActive]}
          onPress={() => onToggleSave?.(property.id)}
        >
          <Heart
            size={18}
            color={isSaved ? '#EF4444' : '#031B2A'}
            fill={isSaved ? '#EF4444' : 'none'}
            strokeWidth={2.4}
          />
        </Pressable>

        {/* Bottom Image Indicators & RERA Tag */}
        <View style={styles.imageBottomRow}>
          <View style={styles.reraPill}>
            <ShieldCheck size={11} color="#16A34A" strokeWidth={2.6} />
            <Text style={styles.reraText}>RERA & OC VERIFIED</Text>
          </View>

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {property.images.map((_, idx) => (
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
        {/* Title & Rent Price */}
        <View style={styles.titlePriceRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.propName} numberOfLines={1}>
              {property.name}
            </Text>
            <Text style={styles.buildingNameText}>{property.buildingName}</Text>
          </View>

          <View style={styles.priceCol}>
            <Text style={styles.priceVal}>
              ₹{(property.monthlyRent / 100000).toFixed(2)}L
              <Text style={styles.pricePerMo}> /mo</Text>
            </Text>
            <Text style={styles.rateSqftText}>₹{property.ratePerSqft}/sq.ft</Text>
          </View>
        </View>

        {/* Location & Corridor */}
        <View style={styles.locationRow}>
          <MapPin size={13} color="#0F766E" strokeWidth={2.4} style={{ marginTop: 1 }} />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.locality}
          </Text>
        </View>

        {/* Specs Strip */}
        <View style={styles.specsRow}>
          <View style={styles.specChip}>
            <Maximize2 size={11} color="#475569" strokeWidth={2.4} />
            <Text style={styles.specChipText}>{property.carpetArea} sq.ft Carpet</Text>
          </View>

          <View style={styles.specChip}>
            <Layers size={11} color="#475569" strokeWidth={2.4} />
            <Text style={styles.specChipText}>{property.furnishing}</Text>
          </View>

          {property.seatsCount && (
            <View style={styles.specChip}>
              <Users size={11} color="#475569" strokeWidth={2.4} />
              <Text style={styles.specChipText}>{property.seatsCount} Seats</Text>
            </View>
          )}

          <View style={styles.specChip}>
            <Car size={11} color="#475569" strokeWidth={2.4} />
            <Text style={styles.specChipText}>{property.parkingSlots} Parking</Text>
          </View>
        </View>

        {/* Ideal For / Tag Banner */}
        {property.idealFor && (
          <Pressable style={styles.idealForRow} onPress={onViewSpecs}>
            <Sparkles size={11} color="#0F766E" strokeWidth={2.6} />
            <Text style={styles.idealForLabel} numberOfLines={1}>
              Ideal: {property.idealFor}
            </Text>
            <Text style={styles.viewSpecsText}>Specs →</Text>
          </Pressable>
        )}

        {/* Amenities Highlights */}
        <View style={styles.amenityRow}>
          {property.amenities.slice(0, 4).map((amenity, idx) => (
            <View key={idx} style={styles.amenityPill}>
              <CheckCircle2 size={10} color="#16A34A" strokeWidth={2.6} />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>

        {/* Bottom Actions Row */}
        <View style={styles.actionBottomRow}>
          <View style={styles.depositInfo}>
            <Text style={styles.depositTag}>{property.depositMonths} Months Deposit</Text>
            <Text style={styles.zeroCommissionSaveText}>
              💰 Save ₹{(property.monthlyRent / 100000).toFixed(1)}L Commission
            </Text>
          </View>

          <Pressable style={styles.scheduleVisitBtn} onPress={onBookVisit}>
            <Calendar size={13} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.scheduleVisitBtnText}>Site Inspection</Text>
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
  corridorSection: {
    marginBottom: 16,
  },
  corridorSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  corridorHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  corridorSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  corridorScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  corridorCard: {
    width: 210,
    height: 145,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...V4_SHADOWS.card,
  },
  corridorImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  corridorGradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(3, 27, 42, 0.55)',
  },
  corridorTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 118, 110, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  corridorTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  corridorInfo: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
  },
  corridorName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  corridorLoc: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 1,
  },
  corridorBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  corridorCount: {
    fontSize: 10,
    fontWeight: '700',
    color: '#14B8A6',
  },
  corridorPrice: {
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
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    ...V4_SHADOWS.soft,
  },
  categoryPillText: {
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
  reraPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  reraText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 0.4,
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
  propName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  buildingNameText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F766E',
    marginTop: 2,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F766E',
  },
  pricePerMo: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  rateSqftText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 11.5,
    color: '#64748B',
    flex: 1,
  },
  specsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 2,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
  },
  idealForRow: {
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
  idealForLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
    flex: 1,
    marginLeft: 4,
  },
  viewSpecsText: {
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
  zeroCommissionSaveText: {
    fontSize: 10,
    fontWeight: '700',
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
  specModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    margin: 20,
    padding: 20,
    ...V4_SHADOWS.card,
  },
  specModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  specIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  specModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  specModalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  specModalBody: {
    gap: 12,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specBox: {
    width: (SCREEN_WIDTH - 88) / 2,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  specBoxLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  specBoxVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  idealForBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  idealForText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
    flex: 1,
  },
  amenitiesList: {
    gap: 6,
  },
  amenitiesTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  specAmenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  specAmenityText: {
    fontSize: 11.5,
    color: '#475569',
  },
  closeSpecBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 6,
  },
  closeSpecBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
