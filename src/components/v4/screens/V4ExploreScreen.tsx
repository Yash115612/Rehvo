import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  RefreshControl,
  Share,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Map,
  List,
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
  History,
  RotateCcw,
  Sliders,
  AlertCircle,
  Share2,
  Scale,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { Property, AdvancedFilterPayload, SearchSuggestionItem, LocalityScoreRecord } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS, V4_TYPOGRAPHY } from '../../../theme/v4Theme';
import { V4PropertyCardLarge } from '../ui/V4PropertyCardLarge';
import { V4EmptyState } from '../ui/V4EmptyState';
import { V4FilterSheet } from './V4FilterSheet';
import { V4VoiceAssistantModal } from '../ai/V4VoiceAssistantModal';
import { V4SearchSuggestions } from '../search/V4SearchSuggestions';
import { V4NeighborhoodCard } from '../ui/V4NeighborhoodCard';
import {
  executeSmartSearch,
  getSearchSuggestions,
  correctQueryTypos,
  parseNaturalLanguageQuery,
  getTrendingSearches,
  saveUserSearch,
} from '../../../services/smartSearch';
import { getLocalityScores } from '../../../services/smartMaps';
import { V4Skeleton } from '../ui/V4Skeleton';

const QUICK_FILTERS = [
  'Verified Listing',
  '0 Deposit Pass',
  'Under ₹40k',
  '2+ BHK',
  'Fully Furnished',
  'Verified Landlord',
  'Pet Friendly',
  'Covered Parking',
  'Near Metro',
  'Immediate Move-in',
];

export type SortOption =
  | 'RECOMMENDED'
  | 'PRICE_ASC'
  | 'PRICE_DESC'
  | 'NEWEST'
  | 'VERIFIED';

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'RECOMMENDED', label: 'AI Best Match' },
  { key: 'PRICE_ASC', label: 'Price: Low to High' },
  { key: 'PRICE_DESC', label: 'Price: High to Low' },
  { key: 'NEWEST', label: 'Newly Listed' },
  { key: 'VERIFIED', label: 'Verified Landlords First' },
];

export const V4ExploreScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestionItem[]>([]);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<Partial<AdvancedFilterPayload>>({});
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<string[]>(['Verified Listing']);
  const [sortBy, setSortBy] = useState<SortOption>('RECOMMENDED');
  const [sortModalOpen, setSortModalOpen] = useState(false);

  // Pagination & Loading
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dismissedPropertyIds, setDismissedPropertyIds] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [localityScore, setLocalityScore] = useState<LocalityScoreRecord | null>(null);

  // Trending & History
  const trendingSearches = useMemo(() => getTrendingSearches(), []);

  // Update suggestions when user types
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const sugs = getSearchSuggestions(searchQuery);
      setSuggestions(sugs);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Fetch neighborhood intelligence when locality changes
  useEffect(() => {
    const nlp = parseNaturalLanguageQuery(searchQuery);
    const targetLoc = nlp.detectedLocality || 'Bandra West';
    getLocalityScores(targetLoc).then(setLocalityScore).catch(() => {});
  }, [searchQuery]);

  // Handle Typo Correction Suggestion Pill
  const typoInfo = useMemo(() => {
    return correctQueryTypos(searchQuery);
  }, [searchQuery]);

  const toggleQuickFilter = (f: string) => {
    setSelectedQuickFilters((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
    setPage(1);
  };

  const handleApplyFilterSheet = (filters: AdvancedFilterPayload) => {
    setAdvancedFilters(filters);
    setPage(1);
  };

  const handleSelectSuggestion = (item: SearchSuggestionItem) => {
    setSearchQuery(item.title);
    setIsTyping(false);
    setSuggestions([]);
    setPage(1);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProperties?.();
    setIsRefreshing(false);
  };

  // Convert quick filters into advanced filter attributes
  const effectiveFilters: Partial<AdvancedFilterPayload> = useMemo(() => {
    const filters: Partial<AdvancedFilterPayload> = { ...advancedFilters };

    if (selectedQuickFilters.includes('Verified Listing')) filters.zero_brokerage_only = true;
    if (selectedQuickFilters.includes('0 Deposit Pass')) filters.zero_deposit_only = true;
    if (selectedQuickFilters.includes('Under ₹40k')) filters.rent_max = 40000;
    if (selectedQuickFilters.includes('2+ BHK')) filters.bhk = ['2 BHK', '3 BHK', '4+ BHK'];
    if (selectedQuickFilters.includes('Fully Furnished')) filters.furnishing = 'FULLY_FURNISHED';
    if (selectedQuickFilters.includes('Verified Landlord')) filters.owner_verified_only = true;
    if (selectedQuickFilters.includes('Pet Friendly')) filters.pet_friendly = true;
    if (selectedQuickFilters.includes('Covered Parking')) filters.covered_car_parking = true;
    if (selectedQuickFilters.includes('Near Metro')) filters.near_metro_only = true;
    if (selectedQuickFilters.includes('Immediate Move-in')) filters.move_in_timeline = 'IMMEDIATE';

    return filters;
  }, [advancedFilters, selectedQuickFilters]);

  // Execute smart search with AI Match scoring
  const searchResults = useMemo(() => {
    // In-memory filtered candidate list
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
    if (effectiveFilters.zero_brokerage_only) {
      list = list.filter((p) => (p.brokerage || 0) === 0);
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
      let score = 80;
      let why = 'Verified Match';

      if (prop.verification_status === 'VERIFIED') score += 6;
      if ((prop.deposit || 0) <= prop.rent) {
        score += 8;
        why = 'Zero Deposit Deal';
      }
      if (nlp.detectedLocality && prop.locality?.toLowerCase().includes(nlp.detectedLocality.toLowerCase())) {
        score += 10;
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

  // Property Actions: Share, Compare, Dismiss (Memoized)
  const handleShareProperty = useCallback(async (prop: Property) => {
    try {
      await Share.share({
        title: `REHVO: ${prop.title}`,
        message: `Check out this ${prop.bhk} in ${prop.locality}, Mumbai for ₹${(prop.rent || 0).toLocaleString('en-IN')}/mo on REHVO (Verified Listing): https://rehvo.in/property/${prop.id}`,
      });
    } catch {
      // Ignore share cancellation
    }
  }, []);

  const handleToggleCompare = useCallback((propId: string) => {
    setCompareList((prev) => {
      if (prev.includes(propId)) {
        showToast('Removed from compare list', 'info');
        return prev.filter((id) => id !== propId);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 properties', 'info');
          return prev;
        }
        showToast('Added to compare list', 'success');
        return [...prev, propId];
      }
    });
  }, [showToast]);

  const handleDismissProperty = useCallback((propId: string) => {
    setDismissedPropertyIds((prev) => [...prev, propId]);
    showToast('Listing dismissed from search', 'info');
  }, [showToast]);

  const renderPropertyItem = useCallback(({ item: property }: { item: Property & { aiMatchScore?: number; whyThisBadge?: string } }) => {
    const isComparing = compareList.includes(property.id);

    return (
      <View style={styles.cardWrapper}>
        <V4PropertyCardLarge
          property={property}
          aiMatchScore={property.aiMatchScore}
          whyThisBadge={property.whyThisBadge}
          isZeroDeposit={(property.deposit || 0) <= property.rent}
          isSaved={savedPropertyIdSet.has(property.id)}
          onToggleSave={toggleSaveProperty}
          onSelect={() => router.push(`/(renter)/property/${property.id}` as any)}
          onNotInterested={handleDismissProperty}
        />

        {/* Intelligence Preview Badges */}
        <View style={styles.intelPreviewRow}>
          <View style={styles.intelPreviewChip}>
            <Text style={styles.intelPreviewText}>🛡️ Safety A+</Text>
          </View>
          <View style={styles.intelPreviewChip}>
            <Text style={styles.intelPreviewText}>🍃 AQI 68</Text>
          </View>
          <View style={styles.intelPreviewChip}>
            <Text style={styles.intelPreviewText}>🚇 Metro ~7m</Text>
          </View>
          <View style={styles.intelPreviewChipHighlight}>
            <Text style={styles.intelPreviewTextHighlight}>Verified Listing</Text>
          </View>
        </View>

        {/* Extra Card Operations: Share & Compare */}
        <View style={styles.cardExtraActions}>
          <Pressable
            style={styles.extraActionBtn}
            onPress={() => handleToggleCompare(property.id)}
          >
            <Scale
              size={14}
              color={isComparing ? V4_COLORS.primary : '#64748B'}
            />
            <Text
              style={[
                styles.extraActionText,
                isComparing && styles.extraActionTextActive,
              ]}
            >
              {isComparing ? 'Comparing' : 'Compare'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.extraActionBtn}
            onPress={() => handleShareProperty(property)}
          >
            <Share2 size={14} color="#64748B" />
            <Text style={styles.extraActionText}>Share</Text>
          </Pressable>
        </View>
      </View>
    );
  }, [compareList, savedPropertyIdSet, toggleSaveProperty, router, handleDismissProperty, handleToggleCompare, handleShareProperty]);

  const keyExtractor = useCallback((item: Property) => item.id, []);

  const listHeaderComponent = useMemo(() => {
    if (!localityScore) return null;
    return <V4NeighborhoodCard localityScore={localityScore} />;
  }, [localityScore]);

  const listFooterComponent = useMemo(() => {
    if (!hasMore) return null;
    return (
      <Pressable style={styles.loadMoreBtn} onPress={() => setPage((p) => p + 1)}>
        <Text style={styles.loadMoreBtnText}>
          Load More Properties ({searchResults.length - visibleList.length} remaining)
        </Text>
      </Pressable>
    );
  }, [hasMore, searchResults.length, visibleList.length]);

  const listEmptyComponent = useMemo(() => {
    return (
      <V4EmptyState
        title="No Matching Homes"
        description="Try broadening your budget or relaxing your locality and amenity filters."
        actionLabel="Reset All Filters"
        onActionPress={() => {
          setSearchQuery('');
          setSelectedQuickFilters([]);
          setAdvancedFilters({});
        }}
      />
    );
  }, []);

  const handleSaveSearch = async () => {
    const userId = user?.id || 'guest_user';
    const res = await saveUserSearch(userId, searchQuery || 'Mumbai Search', effectiveFilters);
    if (res.success) {
      showToast('Search alert saved! You\'ll receive instant alerts.', 'success');
    } else {
      showToast(res.error || 'Failed to save search', 'error');
    }
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* 1. TOP HEADER & SEARCH BAR */}
      <View style={styles.header}>
        <View style={styles.searchBarWrapper}>
          <Search size={18} color="#0F766E" strokeWidth={2.4} />
          <Pressable
            style={styles.searchInputFake}
            onPress={() => setIsTyping(true)}
          >
            <Text
              style={[
                styles.searchPlaceholder,
                searchQuery ? styles.searchQueryText : undefined,
              ]}
              numberOfLines={1}
            >
              {searchQuery || 'Search "2BHK near BKC under 45k"'}
            </Text>
          </Pressable>

          {searchQuery ? (
            <Pressable
              style={styles.clearSearchBtn}
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
              style={styles.micBtn}
              onPress={() => setVoiceModalOpen(true)}
              hitSlop={8}
            >
              <Mic size={18} color={V4_COLORS.primary} strokeWidth={2.4} />
            </Pressable>
          )}
        </View>

        {/* Map View Toggle Switch */}
        <Pressable
          style={styles.mapSwitchBtn}
          onPress={() => router.push('/(renter)/map' as any)}
          hitSlop={8}
        >
          <Map size={18} color={V4_COLORS.primary} strokeWidth={2.4} />
        </Pressable>

        {/* REHVO AI Assistant Trigger */}
        <Pressable
          style={[styles.mapSwitchBtn, { backgroundColor: '#CCFBF1' }]}
          onPress={() =>
            router.push({
              pathname: '/(renter)/ai',
              params: {
                prompt: searchQuery
                  ? `Find homes matching: ${searchQuery}`
                  : 'Find me a verified verified listing home in Mumbai',
                context: 'search',
              },
            } as any)
          }
          hitSlop={8}
        >
          <Sparkles size={18} color={V4_COLORS.primary} strokeWidth={2.4} />
        </Pressable>
      </View>

      {/* Typo Correction Banner */}
      {typoInfo.hasCorrection && typoInfo.suggestionPill && (
        <Pressable
          style={styles.typoBanner}
          onPress={() => setSearchQuery(typoInfo.correctedQuery)}
        >
          <AlertCircle size={13} color="#0F766E" />
          <Text style={styles.typoBannerText}>
            Showing results for <Text style={styles.typoBold}>{typoInfo.correctedQuery}</Text>.
          </Text>
        </Pressable>
      )}

      {/* Suggestions Overlay Dropdown */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsOverlay}>
          <V4SearchSuggestions
            suggestions={suggestions}
            onSelectSuggestion={handleSelectSuggestion}
          />
        </View>
      )}

      {/* 2. QUICK FILTER PILLS & ADVANCED FILTER TRIGGER */}
      <View style={styles.filtersBar}>
        <Pressable
          style={styles.filterSheetTrigger}
          onPress={() => setFilterSheetOpen(true)}
        >
          <SlidersHorizontal size={14} color={V4_COLORS.primary} strokeWidth={2.4} />
          <Text style={styles.filterSheetTriggerText}>Filters</Text>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFiltersScroll}
        >
          {QUICK_FILTERS.map((f) => {
            const isSelected = selectedQuickFilters.includes(f);
            return (
              <Pressable
                key={f}
                style={[styles.quickFilterChip, isSelected && styles.quickFilterChipActive]}
                onPress={() => toggleQuickFilter(f)}
              >
                <Text
                  style={[
                    styles.quickFilterText,
                    isSelected && styles.quickFilterTextActive,
                  ]}
                >
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. RESULTS SUB-HEADER: COUNT, SORT DROPDOWN, SAVE SEARCH */}
      <View style={styles.resultsSubHeader}>
        <Text style={styles.resultsCount}>
          <Text style={styles.resultsCountBold}>{searchResults.length}</Text> Homes in Mumbai
        </Text>

        <View style={styles.headerActions}>
          <Pressable style={styles.saveSearchPill} onPress={handleSaveSearch}>
            <Sparkles size={12} color="#0F766E" />
            <Text style={styles.saveSearchPillText}>Save Search</Text>
          </Pressable>

          <Pressable
            style={styles.sortDropdownPill}
            onPress={() => setSortModalOpen(!sortModalOpen)}
          >
            <Text style={styles.sortDropdownText}>
              {SORT_OPTIONS.find((s) => s.key === sortBy)?.label}
            </Text>
            <ChevronDown size={12} color="#475569" strokeWidth={2.4} />
          </Pressable>
        </View>
      </View>

      {/* Sort Dropdown Modal / Picker */}
      {sortModalOpen && (
        <View style={styles.sortDropdownCard}>
          {SORT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              style={[
                styles.sortOptionRow,
                sortBy === opt.key && styles.sortOptionRowActive,
              ]}
              onPress={() => {
                setSortBy(opt.key);
                setSortModalOpen(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === opt.key && styles.sortOptionTextActive,
                ]}
              >
                {opt.label}
              </Text>
              {sortBy === opt.key && <Check size={14} color={V4_COLORS.primary} />}
            </Pressable>
          ))}
        </View>
      )}

      {/* 4. MAIN SEARCH FEED (LIST OF HOMES WITH VIRTUALIZED FLATLIST) */}
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
        contentContainerStyle={[styles.feedContent, { paddingBottom: Math.max(insets.bottom, 24) + 90 }]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={V4_COLORS.primary}
          />
        }
      />

      {/* Voice AI Assistant Modal (V7.1) */}
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

      {/* Advanced Filter Sheet V2 */}
      <V4FilterSheet
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        initialFilters={advancedFilters}
        onApply={handleApplyFilterSheet}
      />

      {/* Floating Compare Bar */}
      {compareList.length > 0 && (
        <View style={[styles.floatingCompareBar, { bottom: insets.bottom + 16 }]}>
          <View style={styles.compareBarInfo}>
            <View style={styles.compareCountPill}>
              <Text style={styles.compareCountText}>{compareList.length}/4</Text>
            </View>
            <Text style={styles.compareBarLabel}>Selected for compare</Text>
          </View>
          <Pressable
            style={styles.compareBarActionBtn}
            onPress={() => router.push(`/(renter)/compare?ids=${compareList.join(',')}` as any)}
          >
            <Text style={styles.compareBarActionText}>Compare Now</Text>
            <ArrowRight size={14} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFDFD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  searchInputFake: {
    flex: 1,
  },
  searchPlaceholder: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  searchQueryText: {
    color: V4_COLORS.textPrimary,
    fontWeight: '700',
  },
  clearSearchBtn: {
    padding: 4,
  },
  micBtn: {
    padding: 2,
  },
  mapSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    ...V4_SHADOWS.soft,
  },
  mapSwitchText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  typoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
  },
  typoBannerText: {
    fontSize: 11.5,
    color: '#0F766E',
  },
  typoBold: {
    fontWeight: '800',
  },
  suggestionsOverlay: {
    position: 'absolute',
    top: 75,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  filtersBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  filterSheetTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: V4_COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 12,
    marginLeft: 16,
    marginRight: 8,
    ...V4_SHADOWS.soft,
  },
  filterSheetTriggerText: {
    fontSize: 12,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  quickFiltersScroll: {
    paddingRight: 16,
    gap: 8,
  },
  quickFilterChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 12,
  },
  quickFilterChipActive: {
    backgroundColor: 'rgba(15, 118, 110, 0.12)',
    borderColor: V4_COLORS.primary,
  },
  quickFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  quickFilterTextActive: {
    color: V4_COLORS.primary,
    fontWeight: '800',
  },
  resultsSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
  },
  resultsCountBold: {
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveSearchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
  },
  saveSearchPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  sortDropdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
  },
  sortDropdownText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  sortDropdownCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 4,
    marginBottom: 8,
    ...V4_SHADOWS.card,
  },
  sortOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  sortOptionRowActive: {
    backgroundColor: '#F0FDFA',
  },
  sortOptionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  sortOptionTextActive: {
    color: V4_COLORS.primary,
    fontWeight: '800',
  },
  feedContent: {
    paddingBottom: 110,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  cardExtraActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  extraActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  extraActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  extraActionTextActive: {
    color: V4_COLORS.primary,
    fontWeight: '800',
  },
  loadMoreBtn: {
    marginHorizontal: 16,
    marginVertical: 14,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  loadMoreBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  intelPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 8,
  },
  intelPreviewChip: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  intelPreviewText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  intelPreviewChipHighlight: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  intelPreviewTextHighlight: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
  },
  floatingCompareBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#031B2A',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...V4_SHADOWS.card,
    zIndex: 999,
  },
  compareBarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compareCountPill: {
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  compareCountText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  compareBarLabel: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '700',
  },
  compareBarActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  compareBarActionText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
