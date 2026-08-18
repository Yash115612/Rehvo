import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { UserProfile, Property } from '../../types';
import { HomeHeader } from './HomeHeader';
import {
  PropertyCategorySwitcher,
  PropertyCategory,
} from './PropertyCategorySwitcher';
import { REHVOSearchBar } from '../search/REHVOSearchBar';
import { AdCarousel } from './AdCarousel';
import { HomeQuickFilters, QuickFilterId } from './HomeQuickFilters';
import { HomeRecommendedCarousel } from './HomeRecommendedCarousel';
import { HomeLocationCarousel, LocationItem } from './HomeLocationCarousel';
import { HomePropertyGrid } from './HomePropertyGrid';
import { HomeFlatmatePromoCard } from './HomeFlatmatePromoCard';
import { FlatmateDiscoveryFeed } from '../flatmates/FlatmateDiscoveryFeed';
import { FlatmateProfile } from '../../types';
import { AnimatedCategoryContent } from './AnimatedCategoryContent';

interface RenterHomeScreenProps {
  user: UserProfile | null;
  initialCategory?: PropertyCategory;
  onLogout?: () => void;
}

interface CategoryCopy {
  recommendedTitle: string;
  recommendedSubtitle: string;
  moreTitle: string;
  moreSubtitle: string;
}

const CATEGORY_COPY_MAP: Record<PropertyCategory, CategoryCopy> = {
  rent: {
    recommendedTitle: 'Recommended apartments',
    recommendedSubtitle: 'Verified flats & apartments across Mumbai',
    moreTitle: 'More rental apartments',
    moreSubtitle: 'Fresh listings matching your preferences',
  },
  pg: {
    recommendedTitle: 'Popular PGs & co-living',
    recommendedSubtitle: 'Move-in ready stays with food & Wi-Fi',
    moreTitle: 'More PGs & shared stays',
    moreSubtitle: 'Budget-friendly accommodations for students & pros',
  },
  rooms: {
    recommendedTitle: 'Rooms near you',
    recommendedSubtitle: 'Private & shared rooms with flexible terms',
    moreTitle: 'More room rentals',
    moreSubtitle: 'Independent rooms with zero hassle',
  },
  flatmates: {
    recommendedTitle: 'Places for flatmates',
    recommendedSubtitle: 'Find a home that fits your lifestyle & budget',
    moreTitle: 'More flatmate spaces',
    moreSubtitle: 'Verified homes with friendly housemates',
  },
  studios: {
    recommendedTitle: 'Popular studios',
    recommendedSubtitle: 'Compact, modern & private studio homes',
    moreTitle: 'More studio apartments',
    moreSubtitle: 'Minimalist living spaces in prime locations',
  },
};

export const RenterHomeScreen: React.FC<RenterHomeScreenProps> = ({
  user,
  initialCategory = 'rent',
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    properties,
    savedPropertyIds,
    toggleSaveProperty,
    setFilter,
    initializeFromStorage,
    flatmates,
    myFlatmateProfile,
    flatmateDraft,
    savedFlatmateIds,
    toggleSaveFlatmate,
    fetchProperties,
    fetchMyProperties,
    fetchPublishedFlatmates,
    fetchMyFlatmateProfile,
  } = useAppStore();

  const handleFlatmateHeaderPress = useCallback(() => {
    if (myFlatmateProfile) {
      router.push('/(renter)/flatmate/my-profile');
    } else {
      router.push('/(renter)/flatmate/create');
    }
  }, [myFlatmateProfile, router]);

  const [selectedCategory, setSelectedCategory] =
    useState<PropertyCategory>(initialCategory);
  const [selectedQuickFilter, setSelectedQuickFilter] =
    useState<QuickFilterId | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchProperties(),
        fetchMyProperties(),
        fetchPublishedFlatmates(),
        fetchMyFlatmateProfile(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchProperties, fetchMyProperties, fetchPublishedFlatmates, fetchMyFlatmateProfile]);

  // Handle switching category in-place with smooth directional transition
  const handleCategoryChange = (category: PropertyCategory) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
    setSelectedQuickFilter(null);
  };

  const handleSelectFlatmate = (profile: FlatmateProfile) => {
    router.push(`/(renter)/flatmate/${profile.id}`);
  };

  const handleCreateFlatmateProfile = () => {
    router.push('/(renter)/flatmate/create');
  };

  const handleManageFlatmateProfile = () => {
    router.push('/(renter)/flatmate/my-profile');
  };

  // Filter properties based on category and optional quick filter
  const categoryFilteredProperties = useMemo(() => {
    let list = [...properties];

    // 1. Filter by category
    switch (selectedCategory) {
      case 'rent':
        list = list.filter(
          (p) =>
            p.property_type === 'FLAT' ||
            p.property_type === 'APARTMENT' ||
            (!['PG', 'CO_LIVING', 'PRIVATE_ROOM', 'SHARED_ROOM'].includes(
              p.property_type
            ) &&
              p.bhk !== 'Studio')
        );
        break;
      case 'pg':
        list = list.filter(
          (p) =>
            p.property_type === 'PG' ||
            p.property_type === 'CO_LIVING' ||
            p.title.toLowerCase().includes('pg') ||
            p.title.toLowerCase().includes('co-living')
        );
        break;
      case 'rooms':
        list = list.filter(
          (p) =>
            p.property_type === 'PRIVATE_ROOM' ||
            p.property_type === 'SHARED_ROOM' ||
            p.bhk === '1 RK' ||
            p.title.toLowerCase().includes('room')
        );
        break;
      case 'flatmates':
        list = list.filter(
          (p) =>
            p.tenant_preferences.includes('Bachelors Allowed') ||
            p.property_type === 'SHARED_ROOM' ||
            p.bhk === '2 BHK' ||
            p.bhk === '3 BHK'
        );
        break;
      case 'studios':
        list = list.filter(
          (p) =>
            p.bhk === 'Studio' ||
            p.bhk === '1 RK' ||
            p.title.toLowerCase().includes('studio')
        );
        break;
    }

    // 2. Apply quick filter if active
    if (selectedQuickFilter) {
      switch (selectedQuickFilter) {
        case 'under_15k':
          list = list.filter((p) => p.rent <= 15000);
          break;
        case 'under_20k':
          list = list.filter((p) => p.rent <= 20000);
          break;
        case 'under_25k':
          list = list.filter((p) => p.rent <= 25000);
          break;
        case 'no_brokerage':
          list = list.filter((p) => p.brokerage === 0);
          break;
        case 'near_metro':
          list = list.filter(
            (p) =>
              p.title.toLowerCase().includes('metro') ||
              p.description.toLowerCase().includes('metro') ||
              p.address.toLowerCase().includes('metro') ||
              p.locality.toLowerCase().includes('andheri') ||
              p.locality.toLowerCase().includes('ghatkopar')
          );
          break;
        case 'furnished':
          list = list.filter((p) => p.furnishing === 'FULLY_FURNISHED');
          break;
        case '1_bhk':
          list = list.filter((p) => p.bhk === '1 BHK');
          break;
        case '2_bhk':
          list = list.filter((p) => p.bhk === '2 BHK');
          break;
        case '3_bhk':
          list = list.filter((p) => p.bhk === '3 BHK');
          break;
        case 'verified':
          list = list.filter((p) => p.verification_status === 'VERIFIED');
          break;
        case 'ac':
          list = list.filter((p) => p.amenities.includes('AC'));
          break;
        case 'food_included':
          list = list.filter((p) =>
            p.amenities.some((a) => a.toLowerCase().includes('food'))
          );
          break;
        case 'single_occupancy':
        case 'private_room':
          list = list.filter(
            (p) =>
              p.property_type === 'PRIVATE_ROOM' ||
              p.bhk === '1 RK' ||
              p.bhk === 'Studio'
          );
          break;
        case 'shared_room':
          list = list.filter(
            (p) =>
              p.property_type === 'SHARED_ROOM' ||
              p.property_type === 'CO_LIVING'
          );
          break;
        case 'working_professionals':
          list = list.filter((p) =>
            p.tenant_preferences.includes('Working Professionals Preferred')
          );
          break;
        case 'bachelors_allowed':
          list = list.filter((p) =>
            p.tenant_preferences.includes('Bachelors Allowed')
          );
          break;
        case 'car_parking':
          list = list.filter((p) => p.parking.includes('Car'));
          break;
        case 'pet_friendly':
          list = list.filter((p) =>
            p.tenant_preferences.includes('Pets Allowed')
          );
          break;
      }
    }

    return list;
  }, [properties, selectedCategory, selectedQuickFilter]);

  // Slices for Recommended and More Places
  const recommendedProperties = useMemo(() => {
    return categoryFilteredProperties.slice(0, 5);
  }, [categoryFilteredProperties]);

  const moreProperties = useMemo(() => {
    return categoryFilteredProperties.slice(2, 8);
  }, [categoryFilteredProperties]);

  // View All -> routes to Search with proper filters applied
  const handleViewAll = () => {
    switch (selectedCategory) {
      case 'pg':
        setFilter({ property_type: 'PG' });
        break;
      case 'rooms':
        setFilter({ property_type: 'PRIVATE_ROOM' });
        break;
      case 'flatmates':
        router.push('/(renter)/flatmates');
        return;
      case 'studios':
        setFilter({ bhk: 'Studio' });
        break;
      default:
        setFilter({ property_type: 'FLAT' });
        break;
    }
    router.push('/(renter)/search');
  };

  const handleOpenSearch = handleViewAll;

  // Location Selection -> preserves selected category and applies location
  const handleSelectLocation = (loc: LocationItem) => {
    const filterUpdate: Parameters<typeof setFilter>[0] = {
      locality: loc.name,
    };

    switch (selectedCategory) {
      case 'pg':
        filterUpdate.property_type = 'PG';
        break;
      case 'rooms':
        filterUpdate.property_type = 'PRIVATE_ROOM';
        break;
      case 'flatmates':
        filterUpdate.property_type = 'SHARED_ROOM';
        break;
      case 'studios':
        filterUpdate.bhk = 'Studio';
        break;
      default:
        filterUpdate.property_type = 'FLAT';
        break;
    }

    setFilter(filterUpdate);
    router.push('/(renter)/search');
  };

  // Property Card Press -> Property Details
  const handleSelectProperty = (prop: Property) => {
    router.push(`/(renter)/property/${prop.id}`);
  };

  // Quick Filter Selection -> toggles filter locally
  const handleSelectQuickFilter = (filterId: QuickFilterId) => {
    setSelectedQuickFilter((prev) => (prev === filterId ? null : filterId));
  };

  const copy = CATEGORY_COPY_MAP[selectedCategory] || CATEGORY_COPY_MAP.rent;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
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
      >
        {/* 1. Compact Home Header (with Flatmate Profile entry replacing Bell) */}
        <HomeHeader
          user={user}
          myFlatmateProfile={myFlatmateProfile}
          flatmateDraft={flatmateDraft}
          onFlatmatePress={handleFlatmateHeaderPress}
        />

        {/* 2. Top Property Category Switcher */}
        <PropertyCategorySwitcher
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* 3. Search Bar (opens search with preselected category) */}
        <View style={styles.searchBarWrap}>
          <REHVOSearchBar
            placeholder="Where do you want to live?"
            editable={false}
            onPress={handleOpenSearch}
            showFilter
            onFilterPress={handleOpenSearch}
            paddingHorizontal={0}
          />
        </View>

        {/* 4. Category-Specific Animated & Swipeable Content */}
        <View style={styles.animatedContentWrap}>
          <AnimatedCategoryContent
            category={selectedCategory}
            onSwipeCategory={handleCategoryChange}
          >
            {selectedCategory === 'flatmates' ? (
              /* Dedicated Flatmate Discovery Feed */
              <FlatmateDiscoveryFeed
                flatmates={flatmates}
                myProfile={myFlatmateProfile}
                savedFlatmateIds={savedFlatmateIds}
                onToggleSave={toggleSaveFlatmate}
                onSelectFlatmate={handleSelectFlatmate}
                onCreateProfile={handleCreateFlatmateProfile}
                onManageMyProfile={handleManageFlatmateProfile}
              />
            ) : (
              <>
                {/* Promotional Ad Carousel (stable inside feed) */}
                <AdCarousel />

                {/* Category-Specific Quick Filters */}
                <HomeQuickFilters
                  category={selectedCategory}
                  activeFilterId={selectedQuickFilter}
                  onSelectFilter={handleSelectQuickFilter}
                />

                {/* Category-Specific Recommended Properties */}
                <HomeRecommendedCarousel
                  title={copy.recommendedTitle}
                  subtitle={copy.recommendedSubtitle}
                  properties={recommendedProperties}
                  savedPropertyIds={savedPropertyIds}
                  onToggleSave={toggleSaveProperty}
                  onSelectProperty={handleSelectProperty}
                  onViewAll={handleOpenSearch}
                  onResetCategory={() => handleCategoryChange('rent')}
                />

                {/* Popular Locations */}
                <HomeLocationCarousel
                  onSelectLocation={handleSelectLocation}
                  onViewAll={handleOpenSearch}
                />

                {/* Contextual Flatmate Discovery Card */}
                <HomeFlatmatePromoCard myProfile={myFlatmateProfile} />

                {/* More Places (2-Column Grid respecting category) */}
                <HomePropertyGrid
                  title={copy.moreTitle}
                  subtitle={copy.moreSubtitle}
                  properties={moreProperties}
                  savedPropertyIds={savedPropertyIds}
                  onToggleSave={toggleSaveProperty}
                  onSelectProperty={handleSelectProperty}
                />
              </>
            )}
          </AnimatedCategoryContent>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  scrollContent: {
    paddingTop: 4,
  },
  searchBarWrap: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  animatedContentWrap: {
    marginTop: 22,
  },
});
