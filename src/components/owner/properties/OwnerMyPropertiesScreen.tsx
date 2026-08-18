import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../../store/useAppStore';
import { Property } from '../../../types';
import { OwnerPropertiesHeader } from './OwnerPropertiesHeader';
import { OwnerPropertiesSummary } from './OwnerPropertiesSummary';
import {
  OwnerStatusFilterTabs,
  PropertyStatusTab,
} from './OwnerStatusFilterTabs';
import { OwnerPropertySearchBar } from './OwnerPropertySearchBar';
import { OwnerPropertyManagementCard } from './OwnerPropertyManagementCard';
import { OwnerFilteredEmptyState } from './OwnerFilteredEmptyState';
import { OwnerSortModal, OwnerSortOption } from './OwnerSortModal';
import { OwnerPropertyActionSheet } from '../OwnerPropertyActionSheet';
import { DeletePropertyConfirmModal } from './DeletePropertyConfirmModal';

const CATEGORY_TABS = [
  { id: 'ALL', label: 'All Types' },
  { id: 'FLAT', label: 'Flats' },
  { id: 'ROOM', label: 'Rooms' },
  { id: 'PG', label: 'PG / Co-living' },
  { id: 'STUDIO', label: 'Studios' },
] as const;

export const OwnerMyPropertiesScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    properties,
    user,
    updateProperty,
    deleteProperty,
    fetchMyProperties,
    showToast,
  } = useAppStore();

  type OwnerCategoryTab = 'ALL' | 'FLAT' | 'ROOM' | 'PG' | 'STUDIO';

  const [activeTab, setActiveTab] = useState<PropertyStatusTab>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<OwnerCategoryTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<OwnerSortOption>('RECENT_UPDATED');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchMyProperties();
  }, [fetchMyProperties]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchMyProperties();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchMyProperties]);

  // Filter properties owned by this user
  const ownerProperties = useMemo(() => {
    if (!user) return [];
    return properties.filter(
      (p) => p.owner_id === user.id || (user.phone && p.owner_phone === user.phone)
    );
  }, [properties, user]);

  const hasPropertyListing = ownerProperties.length > 0;

  // Counts for summary and tabs
  const counts = useMemo(() => {
    const active = ownerProperties.filter(
      (p) => p.status === 'ACTIVE' || !p.status
    ).length;
    const draft = ownerProperties.filter((p) => p.status === 'DRAFT').length;
    const paused = ownerProperties.filter((p) => p.status === 'PAUSED').length;
    const rented = ownerProperties.filter((p) => p.status === 'RENTED').length;

    return {
      ALL: ownerProperties.length,
      ACTIVE: active,
      DRAFT: draft,
      PAUSED: paused,
      RENTED: rented,
    };
  }, [ownerProperties]);

  // Filtered and Sorted list
  const displayProperties = useMemo(() => {
    let list = [...ownerProperties];

    // Status filter
    if (activeTab === 'ACTIVE') {
      list = list.filter((p) => p.status === 'ACTIVE' || !p.status);
    } else if (activeTab === 'DRAFT') {
      list = list.filter((p) => p.status === 'DRAFT');
    } else if (activeTab === 'PAUSED') {
      list = list.filter((p) => p.status === 'PAUSED');
    } else if (activeTab === 'RENTED') {
      list = list.filter((p) => p.status === 'RENTED');
    }

    // Category filter
    if (selectedCategory === 'FLAT') {
      list = list.filter((p) => p.property_type === 'FLAT' || p.property_type === 'APARTMENT');
    } else if (selectedCategory === 'ROOM') {
      list = list.filter((p) => p.property_type === 'PRIVATE_ROOM' || p.property_type === 'SHARED_ROOM');
    } else if (selectedCategory === 'PG') {
      list = list.filter((p) => p.property_type === 'PG' || p.property_type === 'CO_LIVING');
    } else if (selectedCategory === 'STUDIO') {
      list = list.filter((p) => p.property_type === 'STUDIO' || p.bhk?.toLowerCase().includes('studio'));
    }

    // Search query filter (title, locality, property_type)
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.locality?.toLowerCase().includes(q) ||
          p.property_type?.toLowerCase().includes(q) ||
          p.bhk?.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortOption) {
      case 'NEWEST':
        list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        break;
      case 'MOST_VIEWED':
        list.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
        break;
      case 'MOST_ENQUIRIES':
        list.sort((a, b) => (b.enquiries_count || 0) - (a.enquiries_count || 0));
        break;
      case 'RENT_LOW_HIGH':
        list.sort((a, b) => a.rent - b.rent);
        break;
      case 'RENT_HIGH_LOW':
        list.sort((a, b) => b.rent - a.rent);
        break;
      case 'RECENT_UPDATED':
      default:
        list.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
        break;
    }

    return list;
  }, [ownerProperties, activeTab, selectedCategory, searchQuery, sortOption]);

  const handleListProperty = () => {
    router.push('/(renter)/listing/property-type');
  };

  const handleViewProperty = (prop: Property) => {
    router.push(`/(renter)/property/${prop.id}`);
  };

  const handleEditProperty = (prop: Property) => {
    showToast('Editing property listing...', 'info');
    router.push('/(renter)/listing/property-type');
  };

  const handleToggleStatus = (prop: Property) => {
    const nextStatus = prop.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED';
    updateProperty(prop.id, { status: nextStatus });
    showToast(
      nextStatus === 'PAUSED'
        ? 'Listing paused. It will not appear in renter search.'
        : 'Listing resumed and is now active.',
      'info'
    );
  };

  const handleMarkRented = (prop: Property) => {
    updateProperty(prop.id, { status: 'RENTED' });
    showToast('Listing marked as rented out.', 'info');
  };

  const handleDeleteProperty = (prop: Property) => {
    setActionSheetVisible(false);
    setPropertyToDelete(prop);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);
    try {
      const remainingCount = ownerProperties.length - 1;
      const res = await deleteProperty(propertyToDelete.id);
      if (res.success) {
        setPropertyToDelete(null);
        if (remainingCount <= 0) {
          router.replace('/(renter)/profile');
        }
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenActions = (prop: Property) => {
    setSelectedProperty(prop);
    setActionSheetVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Header with Title & Sort */}
      <OwnerPropertiesHeader
        onSortPress={() => setSortModalVisible(true)}
        onAddPress={handleListProperty}
      />

      {/* FlatList for all content to scroll smoothly */}
      <FlatList
        data={displayProperties}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 110 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#6C4DFF']}
            tintColor="#6C4DFF"
          />
        }
        ListHeaderComponent={
          <View style={styles.headerStack}>
            {/* 2. Top Summary */}
            <OwnerPropertiesSummary
              totalCount={counts.ALL}
              activeCount={counts.ACTIVE}
              draftCount={counts.DRAFT}
              pausedCount={counts.PAUSED}
              rentedCount={counts.RENTED}
            />

            {/* 3. Status Filters */}
            <OwnerStatusFilterTabs
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              counts={counts}
            />

            {/* 4. Category Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {CATEGORY_TABS.map((tab) => {
                const isSelected = selectedCategory === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    style={[
                      styles.categoryPill,
                      isSelected && styles.categoryPillActive,
                    ]}
                    onPress={() => setSelectedCategory(tab.id as any)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextActive,
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* 5. Search within properties */}
            <OwnerPropertySearchBar
              query={searchQuery}
              onChangeQuery={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <OwnerPropertyManagementCard
              property={item}
              onPress={() => handleViewProperty(item)}
              onOpenActions={() => handleOpenActions(item)}
              onContinueDraft={handleListProperty}
            />
          </View>
        )}
        ListEmptyComponent={
          <OwnerFilteredEmptyState
            activeTab={activeTab}
            hasQuery={searchQuery.length > 0}
            onClearSearch={() => setSearchQuery('')}
            onListProperty={handleListProperty}
          />
        }
      />

      {/* Action Sheet Modal */}
      <OwnerPropertyActionSheet
        property={selectedProperty}
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        onView={handleViewProperty}
        onEdit={handleEditProperty}
        onToggleStatus={handleToggleStatus}
        onMarkRented={handleMarkRented}
        onDelete={handleDeleteProperty}
      />

      {/* Sort Modal */}
      <OwnerSortModal
        visible={sortModalVisible}
        activeSort={sortOption}
        onSelectSort={setSortOption}
        onClose={() => setSortModalVisible(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeletePropertyConfirmModal
        visible={!!propertyToDelete}
        property={propertyToDelete}
        isDeleting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setPropertyToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  listContent: {
    paddingTop: 4,
  },
  headerStack: {
    gap: 10,
    marginBottom: 14,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
  cardWrapper: {
    paddingHorizontal: 16,
  },
});
