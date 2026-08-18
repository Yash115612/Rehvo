import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  Text,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Sparkles,
} from 'lucide-react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { Property, PropertyFilter } from '../../src/types';
import { REHVOSearchBar } from '../../src/components/search/REHVOSearchBar';
import { ResultsHeader } from '../../src/components/search/ResultsHeader';
import { SearchPropertyCard } from '../../src/components/search/SearchPropertyCard';
import { SearchSkeletonCard } from '../../src/components/search/SearchSkeletonCard';
import { SearchEmptyState } from '../../src/components/search/SearchEmptyState';
import { FilterBottomSheet } from '../../src/components/explore/FilterBottomSheet';
import { SortBottomSheet } from '../../src/components/explore/SortBottomSheet';
import { MapDiscoveryView } from '../../src/components/explore/MapDiscoveryView';
import { GuidedSearchModal } from '../../src/components/search/guided/GuidedSearchModal';
import {
  GuidedSearchState,
  INITIAL_GUIDED_STATE,
} from '../../src/components/search/guided/guidedSearchTypes';
import { formatBudgetLabel } from '../../src/components/search/useSearchResults';

const SORT_LABELS: Record<PropertyFilter['sort_by'], string> = {
  recommended: 'Recommended',
  newest: 'Newest',
  price_low: 'Price: Low to High',
  price_high: 'Price: High to Low',
  most_saved: 'Most Saved',
};

export default function SearchRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    properties,
    savedPropertyIds,
    toggleSaveProperty,
    activeFilter,
    setFilter,
    resetFilter,
    fetchProperties,
  } = useAppStore();

  const [guidedModalOpen, setGuidedModalOpen] = useState(false);
  const [guidedState, setGuidedState] = useState<GuidedSearchState>(
    INITIAL_GUIDED_STATE,
  );
  const [hasCompletedGuidedSearch, setHasCompletedGuidedSearch] =
    useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Apply Guided Search Form state into active store filters
  const handleApplyGuidedSearch = (newState: GuidedSearchState) => {
    setGuidedState(newState);
    setHasCompletedGuidedSearch(true);

    const filterUpdates: Partial<PropertyFilter> = {
      rent_min: newState.rentMin,
      rent_max: newState.rentMax,
      bhk: newState.spaceType.includes('BHK') ? newState.spaceType : 'ALL',
      furnishing: newState.furnishing,
      brokerage_free_only: newState.preferences.includes('No Brokerage'),
      locality:
        newState.locations.length > 0 ? newState.locations[0] : 'ALL',
    };

    setFilter(filterUpdates);
  };

  // Filter properties from store based on active criteria
  const results = useMemo(() => {
    return properties.filter((p) => {
      // 1. Rent Range
      if (p.rent < activeFilter.rent_min || p.rent > activeFilter.rent_max) {
        return false;
      }

      // 2. Category matching from guidedState if active
      if (hasCompletedGuidedSearch) {
        if (
          guidedState.category === 'FLAT' &&
          p.property_type !== 'FLAT' &&
          p.property_type !== 'APARTMENT'
        ) {
          return false;
        }
        if (
          guidedState.category === 'PG' &&
          p.property_type !== 'PG' &&
          p.property_type !== 'CO_LIVING'
        ) {
          return false;
        }
        if (
          guidedState.category === 'PRIVATE_ROOM' &&
          p.property_type !== 'PRIVATE_ROOM'
        ) {
          return false;
        }
        if (
          guidedState.category === 'SHARED_ROOM' &&
          p.property_type !== 'SHARED_ROOM'
        ) {
          return false;
        }
        if (
          guidedState.category === 'STUDIO' &&
          p.property_type !== 'STUDIO' &&
          !p.bhk?.toLowerCase().includes('studio')
        ) {
          return false;
        }
      }

      // 3. Location matching
      if (
        activeFilter.locality &&
        activeFilter.locality !== 'ALL' &&
        !p.locality.toLowerCase().includes(activeFilter.locality.toLowerCase()) &&
        !p.city.toLowerCase().includes(activeFilter.locality.toLowerCase())
      ) {
        return false;
      }

      // 4. BHK
      if (activeFilter.bhk !== 'ALL' && p.bhk !== activeFilter.bhk) {
        return false;
      }

      // 5. Furnishing
      if (
        activeFilter.furnishing !== 'ALL' &&
        p.furnishing !== activeFilter.furnishing
      ) {
        return false;
      }

      // 6. Brokerage free
      if (activeFilter.brokerage_free_only && p.brokerage > 0) {
        return false;
      }

      // 7. Verified only
      if (activeFilter.verified_only && p.verification_status !== 'VERIFIED') {
        return false;
      }

      return true;
    });
  }, [properties, activeFilter, hasCompletedGuidedSearch, guidedState]);

  // Sort results
  const sortedResults = useMemo(() => {
    const list = [...results];
    switch (activeFilter.sort_by) {
      case 'price_low':
        return list.sort((a, b) => a.rent - b.rent);
      case 'price_high':
        return list.sort((a, b) => b.rent - a.rent);
      case 'newest':
        return list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      case 'most_saved':
        return list.sort((a, b) => b.saves_count - a.saves_count);
      case 'recommended':
      default:
        return list;
    }
  }, [results, activeFilter.sort_by]);

  // Pull to refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchProperties();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchProperties]);

  // Card click -> Property Details
  const handleCardPress = useCallback(
    (property: Property) => {
      router.push(`/(renter)/property/${property.id}`);
    },
    [router],
  );

  // Heart click -> Toggle Save in global store
  const handleToggleSave = useCallback(
    (propertyId: string) => {
      toggleSaveProperty(propertyId);
    },
    [toggleSaveProperty],
  );

  const handleResetSearch = () => {
    resetFilter();
    setGuidedState(INITIAL_GUIDED_STATE);
    setHasCompletedGuidedSearch(false);
  };

  const summaryLocation =
    guidedState.locations.length > 0
      ? guidedState.locations.join(', ')
      : activeFilter.locality !== 'ALL'
      ? activeFilter.locality
      : 'Mumbai';

  const summaryBudget = formatBudgetLabel(
    activeFilter.rent_min,
    activeFilter.rent_max,
  ) || 'Any budget';

  const summarySpace =
    activeFilter.bhk !== 'ALL' ? activeFilter.bhk : guidedState.spaceType;

  // Render the scrolling search controls inside FlatList Header
  const renderListHeader = () => (
    <View style={styles.listHeaderContainer}>
      {/* 1. Top Search Bar */}
      <View style={styles.searchBarWrapper}>
        <REHVOSearchBar
          placeholder="What are you looking for?"
          value={activeFilter.query}
          editable={false}
          onPress={() => setGuidedModalOpen(true)}
          showFilter
          filterActive={hasCompletedGuidedSearch}
          onFilterPress={() => setFilterOpen(true)}
          paddingHorizontal={0}
        />
      </View>

      {/* 2. Search Summary Card (Tappable to re-open guided search) */}
      <View style={styles.summaryBar}>
        <Pressable
          style={styles.summaryPill}
          onPress={() => setGuidedModalOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Edit guided search criteria"
        >
          <View style={styles.summaryPillLeft}>
            <View style={styles.sparkleBadge}>
              <Sparkles size={14} color="#6C4DFF" strokeWidth={2.2} />
            </View>
            <View style={styles.summaryTextWrap}>
              <Text style={styles.summaryTitle} numberOfLines={1}>
                {summaryLocation} · {summarySpace} · {summaryBudget}
              </Text>
              <Text style={styles.summarySub}>Tap to edit your search</Text>
            </View>
          </View>
          <View style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </View>
        </Pressable>
      </View>

      {/* 3. Results Header & List/Map Toggle */}
      <ResultsHeader
        count={sortedResults.length}
        location={summaryLocation}
        sortLabel={SORT_LABELS[activeFilter.sort_by] || 'Recommended'}
        viewMode={viewMode}
        paddingHorizontal={0}
        onSortPress={() => setSortOpen(true)}
        onViewChange={(mode) => setViewMode(mode)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          {/* Top Controls in Map View */}
          <View style={styles.mapHeaderWrapper}>
            <View style={styles.searchBarWrapper}>
              <REHVOSearchBar
                placeholder="What are you looking for?"
                value={activeFilter.query}
                editable={false}
                onPress={() => setGuidedModalOpen(true)}
                showFilter
                filterActive={hasCompletedGuidedSearch}
                onFilterPress={() => setFilterOpen(true)}
                paddingHorizontal={0}
              />
            </View>
            <ResultsHeader
              count={sortedResults.length}
              location={summaryLocation}
              sortLabel={SORT_LABELS[activeFilter.sort_by] || 'Recommended'}
              viewMode={viewMode}
              paddingHorizontal={0}
              onSortPress={() => setSortOpen(true)}
              onViewChange={(mode) => setViewMode(mode)}
            />
          </View>
          <MapDiscoveryView
            properties={sortedResults}
            savedPropertyIds={savedPropertyIds}
            onToggleSave={handleToggleSave}
            onSelectProperty={handleCardPress}
          />
        </View>
      ) : (
        /* Unified Scrollable FlatList — Search controls scroll naturally with results */
        <FlatList
          data={sortedResults}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          renderItem={({ item }) => (
            <SearchPropertyCard
              property={item}
              isSaved={savedPropertyIds.includes(item.id)}
              onPress={handleCardPress}
              onToggleSave={handleToggleSave}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 110 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#6C4DFF']}
              tintColor="#6C4DFF"
            />
          }
          ListEmptyComponent={
            isLoading ? (
              <View style={{ gap: 16 }}>
                <SearchSkeletonCard />
                <SearchSkeletonCard />
              </View>
            ) : (
              <SearchEmptyState
                onClearFilters={handleResetSearch}
                onChangeLocation={() => setGuidedModalOpen(true)}
              />
            )
          }
        />
      )}

      {/* Guided Property Discovery Modal */}
      <GuidedSearchModal
        visible={guidedModalOpen}
        onClose={() => setGuidedModalOpen(false)}
        onApply={handleApplyGuidedSearch}
        initialState={guidedState}
        properties={properties}
      />

      {/* Advanced Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        activeFilter={activeFilter}
        onApplyFilter={(filterUpdates) => setFilter(filterUpdates)}
        onResetFilter={handleResetSearch}
        properties={properties}
        category={
          guidedState.category === 'PG'
            ? 'PG / Co-living'
            : guidedState.category === 'PRIVATE_ROOM' ||
              guidedState.category === 'SHARED_ROOM'
            ? 'Rooms'
            : guidedState.category === 'FLATMATE'
            ? 'Flatmates'
            : 'Flats'
        }
        nearMetro={guidedState.preferences.includes('Near Metro')}
        availability={
          guidedState.moveInTime === 'IMMEDIATE'
            ? 'IMMEDIATE'
            : guidedState.moveInTime === 'WITHIN_1_MONTH'
            ? 'WITHIN_MONTH'
            : 'ALL'
        }
      />

      {/* Sort Action Sheet */}
      <SortBottomSheet
        isOpen={sortOpen}
        onClose={() => setSortOpen(false)}
        currentSort={activeFilter.sort_by}
        onSelectSort={(sortBy) => setFilter({ sort_by: sortBy })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  listContent: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  listHeaderContainer: {
    paddingTop: 8,
    paddingBottom: 10,
  },
  searchBarWrapper: {
    paddingBottom: 10,
  },
  summaryBar: {
    paddingBottom: 10,
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  summaryPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  sparkleBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
  },
  summarySub: {
    fontSize: 11.5,
    color: '#777482',
    fontWeight: '500',
    marginTop: 1,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F4F2F6',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  mapContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  mapHeaderWrapper: {
    paddingTop: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F8F7F4',
  },
});
