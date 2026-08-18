import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowDownUp, ChevronDown, Building2, Users2, Sparkles } from 'lucide-react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { Property, FlatmateProfile } from '../../src/types';
import { SavedCard } from '../../src/components/saved/SavedCard';
import { FlatmateCard } from '../../src/components/flatmates/FlatmateCard';
import {
  SavedSortModal,
  SavedSortOption,
} from '../../src/components/saved/SavedSortModal';
import { SavedSkeleton } from '../../src/components/saved/SavedSkeleton';
import { SavedEmptyState } from '../../src/components/saved/SavedEmptyState';

type MainTab = 'PROPERTIES' | 'FLATMATES';
type PropertyCategoryFilter = 'ALL' | 'FLATS' | 'PG' | 'ROOMS' | 'STUDIOS';

const PROPERTY_CATEGORIES: { id: PropertyCategoryFilter; label: string }[] = [
  { id: 'ALL', label: 'All Places' },
  { id: 'FLATS', label: 'Flats' },
  { id: 'PG', label: 'PG / Co-living' },
  { id: 'ROOMS', label: 'Rooms' },
  { id: 'STUDIOS', label: 'Studios' },
];

export default function SavedRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ tab?: string }>();

  const {
    user,
    properties,
    savedPropertyIds,
    toggleSaveProperty,
    flatmates,
    savedFlatmateIds,
    toggleSaveFlatmate,
    fetchSavedIds,
    fetchProperties,
    fetchPublishedFlatmates,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<MainTab>(
    params.tab?.toUpperCase() === 'FLATMATES' ? 'FLATMATES' : 'PROPERTIES',
  );

  useEffect(() => {
    if (params.tab?.toUpperCase() === 'FLATMATES') {
      setActiveTab('FLATMATES');
    }
  }, [params.tab]);

  useEffect(() => {
    if (user?.id) {
      fetchSavedIds();
      fetchProperties();
      fetchPublishedFlatmates();
    }
  }, [user?.id, fetchSavedIds, fetchProperties, fetchPublishedFlatmates]);

  const [selectedPropertyCategory, setSelectedPropertyCategory] =
    useState<PropertyCategoryFilter>('ALL');
  const [selectedSort, setSelectedSort] =
    useState<SavedSortOption>('RECENTLY_SAVED');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Get all saved properties and flatmates from store
  const allSavedProperties = useMemo(() => {
    return savedPropertyIds
      .map((id) => properties.find((p) => p.id === id))
      .filter((p): p is Property => Boolean(p));
  }, [savedPropertyIds, properties]);

  const allSavedFlatmates = useMemo(() => {
    return savedFlatmateIds
      .map((id) => flatmates.find((f) => f.id === id))
      .filter((f): f is FlatmateProfile => Boolean(f));
  }, [savedFlatmateIds, flatmates]);

  // 2. Filter properties by category
  const filteredProperties = useMemo(() => {
    return allSavedProperties.filter((property) => {
      if (selectedPropertyCategory === 'ALL') return true;
      if (selectedPropertyCategory === 'FLATS') {
        return (
          property.property_type === 'FLAT' ||
          property.property_type === 'APARTMENT'
        );
      }
      if (selectedPropertyCategory === 'PG') {
        return (
          property.property_type === 'PG' ||
          property.property_type === 'CO_LIVING'
        );
      }
      if (selectedPropertyCategory === 'ROOMS') {
        return (
          property.property_type === 'PRIVATE_ROOM' ||
          property.property_type === 'SHARED_ROOM'
        );
      }
      if (selectedPropertyCategory === 'STUDIOS') {
        return (
          property.property_type === 'STUDIO' ||
          property.bhk?.toLowerCase().includes('studio')
        );
      }
      return true;
    });
  }, [allSavedProperties, selectedPropertyCategory]);

  // 3. Sort saved properties
  const sortedProperties = useMemo(() => {
    const list = [...filteredProperties];
    switch (selectedSort) {
      case 'PRICE_LOW_TO_HIGH':
        return list.sort((a, b) => a.rent - b.rent);
      case 'PRICE_HIGH_TO_LOW':
        return list.sort((a, b) => b.rent - a.rent);
      case 'NEWEST':
        return list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime(),
        );
      case 'RECENTLY_SAVED':
      default:
        return list;
    }
  }, [filteredProperties, selectedSort]);

  // Pull to refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchSavedIds(),
        fetchProperties(),
        fetchPublishedFlatmates(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchSavedIds, fetchProperties, fetchPublishedFlatmates]);

  const handleCardPress = useCallback(
    (property: Property) => {
      router.push(`/(renter)/property/${property.id}`);
    },
    [router],
  );

  const handleRemoveProperty = useCallback(
    (propertyId: string) => {
      toggleSaveProperty(propertyId);
    },
    [toggleSaveProperty],
  );

  const getSortLabel = () => {
    switch (selectedSort) {
      case 'PRICE_LOW_TO_HIGH':
        return 'Price: Low to High';
      case 'PRICE_HIGH_TO_LOW':
        return 'Price: High to Low';
      case 'NEWEST':
        return 'Newest';
      case 'RECENTLY_SAVED':
      default:
        return 'Recently saved';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Saved</Text>
          <Text style={styles.headerSubtitle}>Your shortlisted places & flatmates</Text>
        </View>

        {activeTab === 'PROPERTIES' && allSavedProperties.length > 0 && (
          <Pressable
            style={styles.sortBtn}
            onPress={() => setIsSortModalOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Sort saved listings"
          >
            <ArrowDownUp size={14} color="#171522" strokeWidth={2} />
            <Text style={styles.sortBtnText}>{getSortLabel()}</Text>
            <ChevronDown size={14} color="#777482" />
          </Pressable>
        )}
      </View>

      {/* 2. Top Segmented Control (Properties vs Flatmates) */}
      <View style={styles.segmentContainer}>
        <Pressable
          style={[
            styles.segmentBtn,
            activeTab === 'PROPERTIES' && styles.segmentBtnActive,
          ]}
          onPress={() => setActiveTab('PROPERTIES')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'PROPERTIES' }}
        >
          <Building2
            size={16}
            color={activeTab === 'PROPERTIES' ? '#6C4DFF' : '#777482'}
            strokeWidth={2.2}
          />
          <Text
            style={[
              styles.segmentText,
              activeTab === 'PROPERTIES' && styles.segmentTextActive,
            ]}
          >
            Properties ({allSavedProperties.length})
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.segmentBtn,
            activeTab === 'FLATMATES' && styles.segmentBtnActive,
          ]}
          onPress={() => setActiveTab('FLATMATES')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'FLATMATES' }}
        >
          <Users2
            size={16}
            color={activeTab === 'FLATMATES' ? '#6C4DFF' : '#777482'}
            strokeWidth={2.2}
          />
          <Text
            style={[
              styles.segmentText,
              activeTab === 'FLATMATES' && styles.segmentTextActive,
            ]}
          >
            Flatmates ({allSavedFlatmates.length})
          </Text>
        </Pressable>
      </View>

      {/* 3. Sub-Category Filters for Properties */}
      {activeTab === 'PROPERTIES' && allSavedProperties.length > 0 && (
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {PROPERTY_CATEGORIES.map((cat) => {
              const isSelected = selectedPropertyCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.categoryPill,
                    isSelected && styles.categoryPillActive,
                  ]}
                  onPress={() => setSelectedPropertyCategory(cat.id)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* 4. Main List */}
      {activeTab === 'FLATMATES' ? (
        <FlatList
          data={allSavedFlatmates}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12 }}>
              <FlatmateCard
                profile={item}
                isSaved={true}
                onToggleSave={toggleSaveFlatmate}
                onPress={(p) => router.push(`/(renter)/flatmate/${p.id}`)}
              />
            </View>
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 110 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#6C4DFF']}
              tintColor="#6C4DFF"
            />
          }
          ListEmptyComponent={
            <SavedEmptyState
              isFiltered={false}
              filterLabel="flatmates"
              onExplore={() => router.push('/(renter)/flatmates')}
            />
          }
        />
      ) : (
        <FlatList
          data={sortedProperties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SavedCard
              property={item}
              onPress={handleCardPress}
              onRemove={handleRemoveProperty}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 110 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#6C4DFF']}
              tintColor="#6C4DFF"
            />
          }
          ListEmptyComponent={
            isRefreshing ? (
              <View style={{ gap: 16 }}>
                <SavedSkeleton />
                <SavedSkeleton />
              </View>
            ) : (
              <SavedEmptyState
                isFiltered={
                  selectedPropertyCategory !== 'ALL' &&
                  allSavedProperties.length > 0
                }
                filterLabel={
                  PROPERTY_CATEGORIES.find(
                    (c) => c.id === selectedPropertyCategory,
                  )?.label.toLowerCase() || 'places'
                }
                onExplore={() => router.push('/(renter)/home')}
              />
            )
          }
        />
      )}

      {/* 5. Sort Modal */}
      <SavedSortModal
        visible={isSortModalOpen}
        currentSort={selectedSort}
        onSelectSort={(sort) => setSelectedSort(sort)}
        onClose={() => setIsSortModalOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#F8F7F4',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#777482',
    marginTop: 2,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    gap: 6,
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171522',
  },
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#EDEBF2',
    padding: 4,
    borderRadius: 14,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 7,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#777482',
  },
  segmentTextActive: {
    color: '#171522',
    fontWeight: '700',
  },
  filterSection: {
    marginBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  categoryPillActive: {
    backgroundColor: '#171522',
    borderColor: '#171522',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777482',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
});
