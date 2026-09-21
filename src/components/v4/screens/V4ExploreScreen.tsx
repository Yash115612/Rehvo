import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  RefreshControl,
  Share,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Map,
  Sparkles,
  MapPin,
  Check,
  ChevronDown,
  X,
  Search,
  SlidersHorizontal,
  Mic,
  ArrowRight,
  TrendingUp,
  Share2,
  Scale,
  ShieldCheck,
  Compass,
  Building2,
  Home,
  CheckCircle2,
  Flame,
  Award,
  Zap,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { Property, AdvancedFilterPayload, SearchSuggestionItem } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4PropertyCardLarge } from '../ui/V4PropertyCardLarge';
import { V4EmptyState } from '../ui/V4EmptyState';
import { V4FilterSheet } from './V4FilterSheet';
import { V4VoiceAssistantModal } from '../ai/V4VoiceAssistantModal';
import { V4SearchSuggestions } from '../search/V4SearchSuggestions';
import {
  getSearchSuggestions,
  correctQueryTypos,
  parseNaturalLanguageQuery,
  getTrendingSearches,
  saveUserSearch,
} from '../../../services/smartSearch';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── LIFESTYLE / CATEGORY FILTERS ─────────────────────────────────────────────
const LIFESTYLE_CATEGORIES = [
  { id: 'all', label: 'All Homes', icon: Home, query: '' },
  { id: 'verified', label: 'Verified Only', icon: ShieldCheck, filterKey: 'zero_commission_only' },
  { id: 'zero_deposit', label: '0 Deposit Pass', icon: Zap, filterKey: 'zero_deposit_only' },
  { id: 'bhk2', label: '2+ BHK', icon: Building2, bhk: ['2 BHK', '3 BHK', '4+ BHK'] },
  { id: 'luxury', label: 'Sea-Facing / Luxury', icon: Award, rentMin: 65000 },
  { id: 'budget', label: 'Under ₹40k', icon: Flame, rentMax: 40000 },
  { id: 'furnished', label: 'Fully Furnished', icon: Sparkles, furnishing: 'FULLY_FURNISHED' },
];

const QUICK_LOCALITIES = [
  'Bandra West',
  'Andheri West',
  'Powai',
  'Worli',
  'Lower Parel',
  'Juhu',
  'Khar West',
  'Goregaon East',
];

export type SortOption =
  | 'RECOMMENDED'
  | 'PRICE_ASC'
  | 'PRICE_DESC'
  | 'NEWEST'
  | 'VERIFIED';

const SORT_OPTIONS: { key: SortOption; label: string; desc: string }[] = [
  { key: 'RECOMMENDED', label: 'AI Best Match', desc: 'Personalized recommendation score' },
  { key: 'PRICE_ASC', label: 'Price: Low to High', desc: 'Budget-friendly rentals first' },
  { key: 'PRICE_DESC', label: 'Price: High to Low', desc: 'Premium luxury homes first' },
  { key: 'NEWEST', label: 'Newly Listed', desc: 'Freshly posted direct-owner properties' },
  { key: 'VERIFIED', label: 'Verified Landlords', desc: 'Deed-inspected & physical visited first' },
];

export const V4ExploreScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<TextInput>(null);

  const {
    properties,
    savedPropertyIds,
    toggleSaveProperty,
    fetchProperties,
    showToast,
    user,
  } = useAppStore();

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [suggestions, setSuggestions] = useState<SearchSuggestionItem[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<Partial<AdvancedFilterPayload>>({});
  const [sortBy, setSortBy] = useState<SortOption>('RECOMMENDED');
  const [sortModalOpen, setSortModalOpen] = useState(false);

  // Pagination & Loading
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dismissedPropertyIds, setDismissedPropertyIds] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);

  const trendingSearches = useMemo(() => getTrendingSearches(), []);

  // Update suggestions when typing
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const sugs = getSearchSuggestions(searchQuery);
      setSuggestions(sugs);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const typoInfo = useMemo(() => {
    return correctQueryTypos(searchQuery);
  }, [searchQuery]);

  const handleSelectSuggestion = (item: SearchSuggestionItem) => {
    setSearchQuery(item.title);
    setSuggestions([]);
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
    setPage(1);
  };

  const handleSelectQuickLocality = (loc: string) => {
    setSearchQuery(loc);
    setSuggestions([]);
    setPage(1);
  };

  const handleApplyFilterSheet = (filters: AdvancedFilterPayload) => {
    setAdvancedFilters(filters);
    setPage(1);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.rent_min !== undefined || advancedFilters.rent_max !== undefined) count++;
    if (advancedFilters.bhk && advancedFilters.bhk.length > 0) count++;
    if (advancedFilters.furnishing && advancedFilters.furnishing !== 'ALL') count++;
    if (advancedFilters.zero_deposit_only) count++;
    if (advancedFilters.zero_commission_only) count++;
    if (advancedFilters.pet_friendly) count++;
    if (advancedFilters.covered_car_parking) count++;
    if (activeCategory !== 'all') count++;
    return count;
  }, [advancedFilters, activeCategory]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProperties?.();
    setIsRefreshing(false);
  };

  // Merge Category Filters & Advanced Filters
  const effectiveFilters = useMemo(() => {
    const filters: Partial<AdvancedFilterPayload> = { ...advancedFilters };
    const cat = LIFESTYLE_CATEGORIES.find((c) => c.id === activeCategory);

    if (cat) {
      if (cat.filterKey === 'zero_commission_only') filters.zero_commission_only = true;
      if (cat.filterKey === 'zero_deposit_only') filters.zero_deposit_only = true;
      if (cat.bhk) filters.bhk = cat.bhk;
      if (cat.rentMin) filters.rent_min = cat.rentMin;
      if (cat.rentMax) filters.rent_max = cat.rentMax;
      if (cat.furnishing) filters.furnishing = cat.furnishing;
    }

    return filters;
  }, [advancedFilters, activeCategory]);

  // Execute smart search with AI Match scoring
  const searchResults = useMemo(() => {
    const nlp = parseNaturalLanguageQuery(searchQuery);
    let list = (properties || []).filter((p) => !dismissedPropertyIds.includes(p.id));

    // Rent bounds
    if (effectiveFilters.rent_min !== undefined) {
      list = list.filter((p) => (p.rent || 0) >= effectiveFilters.rent_min!);
    }
    if (effectiveFilters.rent_max !== undefined) {
      list = list.filter((p) => (p.rent || 0) <= effectiveFilters.rent_max!);
    }
    if (effectiveFilters.zero_deposit_only) {
      list = list.filter((p) => (p.deposit || 0) <= (p.rent || 0));
    }
    if (effectiveFilters.zero_commission_only) {
      list = list.filter((p) => ((p as any).commission || 0) === 0);
    }
    if (effectiveFilters.bhk && effectiveFilters.bhk.length > 0) {
      list = list.filter((p) =>
        effectiveFilters.bhk!.some((b) => (p.bhk || '').toLowerCase().includes(b.toLowerCase()))
      );
    }
    if (effectiveFilters.furnishing && effectiveFilters.furnishing !== 'ALL') {
      list = list.filter((p) => (p.furnishing || '').toUpperCase().includes(effectiveFilters.furnishing!));
    }
    if (effectiveFilters.pet_friendly) {
      list = list.filter(
        (p) =>
          p.amenities?.some((a) => a.toLowerCase().includes('pet')) ||
          p.description?.toLowerCase().includes('pet')
      );
    }
    if (effectiveFilters.covered_car_parking) {
      list = list.filter((p) => p.amenities?.some((a) => /parking/i.test(a)));
    }
    if (effectiveFilters.owner_verified_only) {
      list = list.filter((p) => p.verification_status === 'VERIFIED');
    }

    // Text & Locality Matching
    if (nlp.detectedLocality) {
      const loc = nlp.detectedLocality.toLowerCase();
      list = list.filter((p) => `${p.locality} ${p.address}`.toLowerCase().includes(loc));
    } else if (searchQuery.trim()) {
      const clean = nlp.cleanQuery.toLowerCase();
      list = list.filter((p) =>
        `${p.title} ${p.locality} ${p.address} ${p.description}`.toLowerCase().includes(clean)
      );
    }

    // AI Scoring
    const scored = list.map((prop) => {
      let score = 82;
      let why = 'Verified Match';

      if (prop.verification_status === 'VERIFIED') score += 6;
      if ((prop.deposit || 0) <= prop.rent) {
        score += 7;
        why = '0 Deposit Deal';
      }
      if (nlp.detectedLocality && prop.locality?.toLowerCase().includes(nlp.detectedLocality.toLowerCase())) {
        score += 8;
        why = `Prime ${nlp.detectedLocality}`;
      }

      return {
        ...prop,
        aiMatchScore: Math.min(score, 99),
        whyThisBadge: why,
      };
    });

    // Sorting
    scored.sort((a, b) => {
      switch (sortBy) {
        case 'PRICE_ASC':
          return (a.rent || 0) - (b.rent || 0);
        case 'PRICE_DESC':
          return (b.rent || 0) - (a.rent || 0);
        case 'NEWEST':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'VERIFIED':
          return (b.verification_status === 'VERIFIED' ? 1 : 0) - (a.verification_status === 'VERIFIED' ? 1 : 0);
        case 'RECOMMENDED':
        default:
          return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
      }
    });

    return scored;
  }, [properties, searchQuery, effectiveFilters, sortBy, dismissedPropertyIds]);

  const visibleList = useMemo(() => {
    return searchResults.slice(0, page * pageSize);
  }, [searchResults, page]);

  const hasMore = visibleList.length < searchResults.length;
  const savedPropertyIdSet = useMemo(() => new Set(savedPropertyIds || []), [savedPropertyIds]);

  // Property Actions
  const handleShareProperty = useCallback(async (prop: Property) => {
    try {
      await Share.share({
        title: `REHVO: ${prop.title}`,
        message: `Check out this verified ${prop.bhk} in ${prop.locality}, Mumbai for ₹${(prop.rent || 0).toLocaleString('en-IN')}/mo with zero commission on REHVO: https://rehvo.in/property/${prop.id}`,
      });
    } catch {
      // User cancelled
    }
  }, []);

  const handleToggleCompare = useCallback((propId: string) => {
    setCompareList((prev) => {
      if (prev.includes(propId)) {
        showToast('Removed from compare', 'info');
        return prev.filter((id) => id !== propId);
      } else {
        if (prev.length >= 4) {
          showToast('Maximum 4 properties can be compared', 'info');
          return prev;
        }
        showToast('Added to compare list', 'success');
        return [...prev, propId];
      }
    });
  }, [showToast]);

  const handleDismissProperty = useCallback((propId: string) => {
    setDismissedPropertyIds((prev) => [...prev, propId]);
    showToast('Property hidden from your feed', 'info');
  }, [showToast]);

  const handleBookVisit = useCallback((prop: Property) => {
    router.push(`/(renter)/property/${prop.id}` as any);
  }, [router]);

  const renderPropertyItem = useCallback(({ item: property }: { item: Property & { aiMatchScore?: number; whyThisBadge?: string } }) => {
    const isComparing = compareList.includes(property.id);

    return (
      <View style={styles.cardContainer}>
        <V4PropertyCardLarge
          property={property}
          aiMatchScore={property.aiMatchScore}
          whyThisBadge={property.whyThisBadge}
          isZeroDeposit={(property.deposit || 0) <= property.rent}
          isSaved={savedPropertyIdSet.has(property.id)}
          onToggleSave={toggleSaveProperty}
          onSelect={() => router.push(`/(renter)/property/${property.id}` as any)}
          onBookVisit={handleBookVisit}
          onNotInterested={handleDismissProperty}
        />

        {/* Card Utility Actions Bar */}
        <View style={styles.cardQuickBar}>
          <View style={styles.trustSignalsRow}>
            <View style={styles.trustSignal}>
              <CheckCircle2 size={11} color="#0E8F73" />
              <Text style={styles.trustSignalText}>Index-II Deed Verified</Text>
            </View>
            <View style={styles.trustSignal}>
              <Text style={styles.trustSignalText}>⚡ Direct Owner</Text>
            </View>
          </View>

          <View style={styles.cardQuickActions}>
            <Pressable
              style={[styles.quickActionButton, isComparing && styles.quickActionButtonActive]}
              onPress={() => handleToggleCompare(property.id)}
            >
              <Scale size={13} color={isComparing ? '#0E8F73' : '#64748B'} />
              <Text style={[styles.quickActionText, isComparing && styles.quickActionTextActive]}>
                {isComparing ? 'Comparing' : 'Compare'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.quickActionButton}
              onPress={() => handleShareProperty(property)}
            >
              <Share2 size={13} color="#64748B" />
              <Text style={styles.quickActionText}>Share</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }, [compareList, savedPropertyIdSet, toggleSaveProperty, router, handleBookVisit, handleDismissProperty, handleToggleCompare, handleShareProperty]);

  const keyExtractor = useCallback((item: Property) => item.id, []);

  const listHeaderComponent = useMemo(() => {
    return (
      <View style={styles.feedHeaderWrapper}>
        {/* Action Row: Filters, Map View, Active Filter Indicator */}
        <View style={styles.headerControlBar}>
          <Pressable
            style={[styles.filterIconButton, activeFiltersCount > 0 && styles.filterIconButtonActive]}
            onPress={() => setFilterSheetOpen(true)}
          >
            <SlidersHorizontal size={14} color={activeFiltersCount > 0 ? '#FFFFFF' : '#031B2A'} strokeWidth={2.2} />
            <Text style={[styles.filterIconButtonText, activeFiltersCount > 0 && styles.filterIconButtonTextActive]}>
              Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
            </Text>
          </Pressable>

          <Pressable
            style={styles.mapIconButton}
            onPress={() => router.push('/(renter)/map' as any)}
          >
            <Map size={14} color="#0E8F73" strokeWidth={2.2} />
            <Text style={styles.mapIconButtonText}>Map View</Text>
          </Pressable>
        </View>

        {/* Typo Correction Bar */}
        {typoInfo.hasCorrection && typoInfo.suggestionPill && (
          <Pressable
            style={styles.typoAlert}
            onPress={() => setSearchQuery(typoInfo.correctedQuery)}
          >
            <Text style={styles.typoAlertText}>
              Showing results for <Text style={styles.typoAlertBold}>{typoInfo.correctedQuery}</Text>
            </Text>
          </Pressable>
        )}

        {/* Lifestyle Category Tabs */}
        <View style={styles.categoryBarContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {LIFESTYLE_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              const IconComp = cat.icon;
              return (
                <Pressable
                  key={cat.id}
                  style={[styles.categoryTab, isSelected && styles.categoryTabActive]}
                  onPress={() => {
                    setActiveCategory(cat.id);
                    setPage(1);
                  }}
                >
                  <IconComp
                    size={13}
                    color={isSelected ? '#FFFFFF' : '#475569'}
                    strokeWidth={2.2}
                  />
                  <Text style={[styles.categoryTabText, isSelected && styles.categoryTabTextActive]}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Locality Quick Selector Pills */}
        <View style={styles.quickLocalitiesSection}>
          <Text style={styles.quickLocalitiesTitle}>Trending Mumbai Localities</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickLocalitiesScroll}
          >
            {QUICK_LOCALITIES.map((loc) => {
              const isActive = searchQuery.toLowerCase().includes(loc.toLowerCase());
              return (
                <Pressable
                  key={loc}
                  style={[styles.localityPill, isActive && styles.localityPillActive]}
                  onPress={() => handleSelectQuickLocality(loc)}
                >
                  <MapPin size={11} color={isActive ? '#FFFFFF' : '#0E8F73'} />
                  <Text style={[styles.localityPillText, isActive && styles.localityPillTextActive]}>
                    {loc}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Results Metadata Bar */}
        <View style={styles.resultsBar}>
          <View>
            <Text style={styles.resultsCountHeading}>
              {searchResults.length} Verified Homes
            </Text>
            <Text style={styles.resultsCountSub}>
              Zero Commission • Direct Owner Deals in Mumbai
            </Text>
          </View>

          <Pressable
            style={styles.sortTriggerPill}
            onPress={() => setSortModalOpen(true)}
          >
            <Text style={styles.sortTriggerText}>
              {SORT_OPTIONS.find((s) => s.key === sortBy)?.label}
            </Text>
            <ChevronDown size={13} color="#031B2A" strokeWidth={2.4} />
          </Pressable>
        </View>
      </View>
    );
  }, [
    activeFiltersCount,
    router,
    typoInfo,
    activeCategory,
    searchQuery,
    handleSelectQuickLocality,
    searchResults.length,
    sortBy,
  ]);

  const listFooterComponent = useMemo(() => {
    if (!hasMore) return null;
    return (
      <Pressable style={styles.loadMoreButton} onPress={() => setPage((p) => p + 1)}>
        <Text style={styles.loadMoreButtonText}>
          Show More Homes ({searchResults.length - visibleList.length} remaining)
        </Text>
      </Pressable>
    );
  }, [hasMore, searchResults.length, visibleList.length]);

  const listEmptyComponent = useMemo(() => {
    return (
      <V4EmptyState
        title="No Matching Homes Found"
        description="Try expanding your search radius, adjusting budget limits, or clearing selected filters."
        actionLabel="Clear All Filters"
        onActionPress={() => {
          setSearchQuery('');
          setActiveCategory('all');
          setAdvancedFilters({});
        }}
      />
    );
  }, []);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* ── 1. REFINED EDITORIAL HEADER ────────────────────────────────────── */}
      <View style={styles.topHeader}>
        {/* City & Live Status */}
        <View style={styles.cityLocationRow}>
          <View style={styles.cityBadge}>
            <MapPin size={12} color="#0E8F73" />
            <Text style={styles.cityName}>Mumbai</Text>
            <View style={styles.cityDot} />
            <Text style={styles.cityVerifiedText}>Zero Commission</Text>
          </View>

          <Pressable
            style={styles.aiConciergePill}
            onPress={() =>
              router.push({
                pathname: '/(renter)/ai',
                params: {
                  prompt: searchQuery
                    ? `Find verified homes matching: ${searchQuery}`
                    : 'Find me verified 2 BHK apartments in Bandra or Powai',
                  context: 'explore',
                },
              } as any)
            }
          >
            <Sparkles size={12} color="#0E8F73" />
            <Text style={styles.aiConciergePillText}>AI Concierge</Text>
          </Pressable>
        </View>

        {/* Search Bar with Native Keyboard Input */}
        <View style={[styles.searchBox, isSearchFocused && styles.searchBoxFocused]}>
          <Search size={18} color="#0E8F73" strokeWidth={2.4} />
          
          <TextInput
            ref={searchInputRef}
            style={styles.searchTextInput}
            placeholder='Search "2 BHK Bandra under 60k" or locality...'
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            returnKeyType="search"
            clearButtonMode="never"
          />

          {searchQuery.length > 0 ? (
            <Pressable
              style={styles.searchClearBtn}
              onPress={() => {
                setSearchQuery('');
                setSuggestions([]);
              }}
              hitSlop={8}
            >
              <X size={14} color="#64748B" />
            </Pressable>
          ) : (
            <Pressable
              style={styles.voiceSearchBtn}
              onPress={() => setVoiceModalOpen(true)}
              hitSlop={8}
            >
              <Mic size={17} color="#0E8F73" strokeWidth={2.4} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <V4SearchSuggestions
            suggestions={suggestions}
            onSelectSuggestion={handleSelectSuggestion}
          />
        </View>
      )}

      {/* ── 3. MAIN HOMES FEED (FLATLIST) ────────────────────────────────────── */}
      <FlatList
        data={visibleList}
        renderItem={renderPropertyItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeaderComponent}
        ListFooterComponent={listFooterComponent}
        ListEmptyComponent={listEmptyComponent}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.feedContentContainer,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#0E8F73"
          />
        }
      />

      {/* ── 4. MODERN SORT SELECTION MODAL ───────────────────────────────────── */}
      <Modal
        visible={sortModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setSortModalOpen(false)}>
          <View style={[styles.sortModalSheet, { paddingBottom: Math.max(insets.bottom, 20) + 10 }]}>
            <View style={styles.sortModalHeader}>
              <View>
                <Text style={styles.sortModalTitle}>Sort Properties</Text>
                <Text style={styles.sortModalSubtitle}>Choose your preferred discovery order</Text>
              </View>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setSortModalOpen(false)}
                hitSlop={8}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <View style={styles.sortOptionsList}>
              {SORT_OPTIONS.map((opt) => {
                const isSelected = sortBy === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    style={[styles.sortItemRow, isSelected && styles.sortItemRowActive]}
                    onPress={() => {
                      setSortBy(opt.key);
                      setSortModalOpen(false);
                      setPage(1);
                    }}
                  >
                    <View style={styles.sortItemInfo}>
                      <Text style={[styles.sortItemTitle, isSelected && styles.sortItemTitleActive]}>
                        {opt.label}
                      </Text>
                      <Text style={styles.sortItemDesc}>{opt.desc}</Text>
                    </View>
                    {isSelected && (
                      <View style={styles.sortItemCheck}>
                        <Check size={14} color="#0E8F73" strokeWidth={3} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Voice Assistant Modal */}
      <V4VoiceAssistantModal
        visible={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onActionTrigger={(intent) => {
          if (intent.intent === 'SEARCH_PROPERTIES' && intent.entities.locality) {
            setSearchQuery(`${intent.entities.bhk || ''} in ${intent.entities.locality}`);
            setPage(1);
          }
        }}
        onTranscriptReady={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
      />

      {/* Advanced Filter Sheet */}
      <V4FilterSheet
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        initialFilters={advancedFilters}
        onApply={handleApplyFilterSheet}
      />

      {/* Floating Compare Action Bar */}
      {compareList.length > 0 && (
        <View style={[styles.compareFloatingBar, { bottom: insets.bottom + 14 }]}>
          <View style={styles.compareCountTag}>
            <Text style={styles.compareCountText}>{compareList.length}/4</Text>
          </View>
          <Text style={styles.compareBarText}>Properties selected to compare</Text>
          <Pressable
            style={styles.compareSubmitBtn}
            onPress={() => router.push(`/(renter)/compare?ids=${compareList.join(',')}` as any)}
          >
            <Text style={styles.compareSubmitText}>Compare</Text>
            <ArrowRight size={13} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    gap: 10,
  },
  cityLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 20,
  },
  cityName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#031B2A',
  },
  cityDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#0E8F73',
  },
  cityVerifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0E8F73',
  },
  aiConciergePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  aiConciergePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0E8F73',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 48,
  },
  searchBoxFocused: {
    borderColor: '#0E8F73',
    backgroundColor: '#FFFFFF',
    ...V4_SHADOWS.soft,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#031B2A',
    paddingVertical: 0,
  },
  searchClearBtn: {
    padding: 6,
  },
  voiceSearchBtn: {
    padding: 6,
  },
  headerControlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  filterIconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    height: 38,
    borderRadius: 12,
  },
  filterIconButtonActive: {
    backgroundColor: '#031B2A',
  },
  filterIconButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#031B2A',
  },
  filterIconButtonTextActive: {
    color: '#FFFFFF',
  },
  mapIconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    height: 38,
    borderRadius: 12,
  },
  mapIconButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0E8F73',
  },
  categoryBarContainer: {
    paddingVertical: 8,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  categoryTabActive: {
    backgroundColor: '#0E8F73',
    borderColor: '#0E8F73',
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  typoAlert: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#CCFBF1',
  },
  typoAlertText: {
    fontSize: 11.5,
    color: '#0E8F73',
  },
  typoAlertBold: {
    fontWeight: '800',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 106,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  feedHeaderWrapper: {
    paddingTop: 4,
  },
  quickLocalitiesSection: {
    marginBottom: 14,
  },
  quickLocalitiesTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#94A3B8',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  quickLocalitiesScroll: {
    paddingHorizontal: 16,
    gap: 7,
  },
  localityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5.5,
    borderRadius: 14,
  },
  localityPillActive: {
    backgroundColor: '#0E8F73',
    borderColor: '#0E8F73',
  },
  localityPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  localityPillTextActive: {
    color: '#FFFFFF',
  },
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 4,
  },
  resultsCountHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#031B2A',
  },
  resultsCountSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  sortTriggerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sortTriggerText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#031B2A',
  },
  feedContentContainer: {
    paddingBottom: 110,
  },
  cardContainer: {
    marginBottom: 14,
  },
  cardQuickBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: -8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  trustSignalsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustSignal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  trustSignalText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  cardQuickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 8,
  },
  quickActionButtonActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0E8F73',
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  quickActionTextActive: {
    color: '#0E8F73',
  },
  loadMoreButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 16,
    marginVertical: 14,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  loadMoreButtonText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#031B2A',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sortModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    gap: 16,
  },
  sortModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  sortModalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#031B2A',
  },
  sortModalSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  sortOptionsList: {
    gap: 8,
  },
  sortItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  sortItemRowActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0E8F73',
  },
  sortItemInfo: {
    gap: 2,
  },
  sortItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  sortItemTitleActive: {
    color: '#0E8F73',
  },
  sortItemDesc: {
    fontSize: 11,
    color: '#94A3B8',
  },
  sortItemCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareFloatingBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#031B2A',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...V4_SHADOWS.card,
    zIndex: 999,
  },
  compareCountTag: {
    backgroundColor: '#0E8F73',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  compareCountText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  compareBarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  compareSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0E8F73',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  compareSubmitText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
