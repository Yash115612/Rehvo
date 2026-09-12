import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  MapPin,
  RotateCcw,
  Users,
  Compass,
  List,
  Building2,
  TrendingUp,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { FlatmateProfile } from '../../types';
import { V4_COLORS, V4_SHADOWS } from '../../theme/v4Theme';
import { V4FlatmateCard } from './ui/V4FlatmateCard';
import { V4FilterBottomSheet, V4FlatmateFilterState } from './ui/V4FilterBottomSheet';
import { MatchCelebrationModal } from './MatchCelebrationModal';
import { calculateCompatibilityScore2 } from '../../services/flatmateCompatibility';
import { clusterProfilesByLocality, LocalityCluster } from '../../services/nearbyEngine';

const { width } = Dimensions.get('window');

type SortOption = 'match' | 'newest' | 'budget_asc' | 'budget_desc' | 'age';

export const ExploreFlatmatesScreen: React.FC = () => {
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
    fetchPublishedFlatmates,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedClusterLocality, setSelectedClusterLocality] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<V4FlatmateFilterState>({});
  const [celebrationFlatmate, setCelebrationFlatmate] = useState<FlatmateProfile | null>(null);
  const [wavingIds, setWavingIds] = useState<{ [id: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Sync latest published flatmates
  useEffect(() => {
    setIsLoading(true);
    fetchPublishedFlatmates().finally(() => setIsLoading(false));
  }, [fetchPublishedFlatmates]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Compute active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '' && v !== false).length;
  }, [filters]);

  // Filter and Sort Engine
  const filteredAndSorted = useMemo(() => {
    let list = flatmates.filter((fm) => {
      if (myFlatmateProfile && fm.id === myFlatmateProfile.id) return false;

      // Text Search Query
      if (debouncedQuery) {
        const q = debouncedQuery.toLowerCase();
        const matchesName = fm.name.toLowerCase().includes(q);
        const matchesLoc = (fm.locality || '').toLowerCase().includes(q) || (fm.city || '').toLowerCase().includes(q);
        const matchesComp = (fm.company || '').toLowerCase().includes(q) || (fm.college || '').toLowerCase().includes(q) || (fm.company_or_college || '').toLowerCase().includes(q);
        const matchesOcc = (fm.occupation || fm.profession || '').toLowerCase().includes(q);
        const matchesBio = (fm.bio || '').toLowerCase().includes(q);
        const matchesInterests = (fm.interests || fm.lifestyle_preferences || []).some((tag) => tag.toLowerCase().includes(q));

        if (!matchesName && !matchesLoc && !matchesComp && !matchesOcc && !matchesBio && !matchesInterests) {
          return false;
        }
      }

      // Selected Locality Cluster in Map Mode
      if (selectedClusterLocality) {
        const pLoc = (fm.locality || '').toLowerCase();
        if (!pLoc.includes(selectedClusterLocality.toLowerCase())) {
          return false;
        }
      }

      // Filter State
      if (filters.verifiedOnly && !fm.is_kyc_verified && !fm.verifications?.is_identity_verified) return false;
      if (filters.gender && filters.gender !== 'Any' && fm.gender?.toLowerCase() !== filters.gender.toLowerCase()) return false;
      if (filters.roomType && fm.room_preference && !fm.room_preference.toLowerCase().includes(filters.roomType.toLowerCase())) return false;
      if (filters.budgetMin !== undefined && fm.budget_max < filters.budgetMin) return false;
      if (filters.budgetMax !== undefined && fm.budget_min > filters.budgetMax) return false;
      if (filters.foodPreference && fm.food_preference && !fm.food_preference.toLowerCase().includes(filters.foodPreference.toLowerCase())) return false;
      if (filters.smoking && fm.smoking && !fm.smoking.toLowerCase().includes(filters.smoking.toLowerCase())) return false;
      if (filters.drinking && fm.drinking && !fm.drinking.toLowerCase().includes(filters.drinking.toLowerCase())) return false;
      if (filters.pets && fm.pets && !fm.pets.toLowerCase().includes(filters.pets.toLowerCase())) return false;
      if (filters.sleepHabit && (fm.sleep_schedule || fm.sleep_habit) && !(fm.sleep_schedule || fm.sleep_habit)!.toLowerCase().includes(filters.sleepHabit.toLowerCase())) return false;
      if (filters.workStyle && (fm.work_mode || fm.work_style) && !(fm.work_mode || fm.work_style)!.toLowerCase().includes(filters.workStyle.toLowerCase())) return false;
      if (filters.nearMetro && !fm.near_metro) return false;
      if (filters.nearItPark && !fm.near_it_park) return false;
      if (filters.nearCollege && !fm.near_college) return false;

      return true;
    });

    // 5-Way Sorting
    return list.sort((a, b) => {
      if (sortBy === 'budget_asc') return (a.budget_min || 0) - (b.budget_min || 0);
      if (sortBy === 'budget_desc') return (b.budget_max || 0) - (a.budget_max || 0);
      if (sortBy === 'age') return (a.age || 25) - (b.age || 25);
      if (sortBy === 'newest') return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();

      // Compatibility sort
      const scoreA = calculateCompatibilityScore2(myFlatmateProfile, a).overallScore;
      const scoreB = calculateCompatibilityScore2(myFlatmateProfile, b).overallScore;
      return scoreB - scoreA;
    });
  }, [flatmates, myFlatmateProfile, debouncedQuery, filters, sortBy, selectedClusterLocality]);

  // Locality clusters for map mode
  const localityClusters = useMemo(() => {
    return clusterProfilesByLocality(filteredAndSorted);
  }, [filteredAndSorted]);

  const handleWave = async (profile: FlatmateProfile) => {
    if (wavingIds[profile.id]) return;
    setWavingIds((prev) => ({ ...prev, [profile.id]: true }));

    try {
      const res = await sendFlatmateWave(
        profile.id,
        profile.name,
        profile.avatar,
        profile.locality || profile.city
      );

      if (res.isMatched) {
        setCelebrationFlatmate(profile);
      }
    } finally {
      setWavingIds((prev) => ({ ...prev, [profile.id]: false }));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={22} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        {/* Search Input */}
        <View style={styles.searchBar}>
          <Search size={18} color="#94A3B8" strokeWidth={2.2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, locality, tech park, college..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={16} color="#64748B" />
            </Pressable>
          )}
        </View>

        {/* View Mode Toggle: List vs Map */}
        <Pressable
          style={[styles.iconToggleBtn, viewMode === 'map' && styles.iconToggleBtnActive]}
          onPress={() => {
            setViewMode(viewMode === 'list' ? 'map' : 'list');
            setSelectedClusterLocality(null);
          }}
          hitSlop={8}
          accessibilityLabel="Toggle View Mode"
        >
          {viewMode === 'list' ? (
            <Compass size={20} color={V4_COLORS.primary} strokeWidth={2.2} />
          ) : (
            <List size={20} color="#FFFFFF" strokeWidth={2.2} />
          )}
        </Pressable>

        {/* Filter Trigger Button */}
        <Pressable
          style={[styles.filterBtn, activeFiltersCount > 0 && styles.filterBtnActive]}
          onPress={() => setIsFilterModalOpen(true)}
          hitSlop={8}
          accessibilityLabel="Open Filters"
        >
          <SlidersHorizontal
            size={18}
            color={activeFiltersCount > 0 ? '#FFFFFF' : V4_COLORS.primary}
            strokeWidth={2.2}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </Pressable>

        {/* AI Flatmate Advisor Button */}
        <Pressable
          style={[styles.iconToggleBtn, { backgroundColor: '#CCFBF1' }]}
          onPress={() =>
            router.push({
              pathname: '/(renter)/ai',
              params: {
                prompt: 'Give me flatmate compatibility advice and fair room budget split tips',
                context: 'flatmate',
              },
            } as any)
          }
          hitSlop={8}
          accessibilityLabel="AI Flatmate Advisor"
        >
          <Sparkles size={18} color={V4_COLORS.primary} strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* 5-Way Sorting Pills Strip */}
      <View style={styles.sortingStrip}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortingContent}
        >
          {[
            { label: '✨ Best Synergy', key: 'match' as const },
            { label: '⚡ Newest', key: 'newest' as const },
            { label: '💰 Budget: Low to High', key: 'budget_asc' as const },
            { label: '💎 Budget: High to Low', key: 'budget_desc' as const },
            { label: '🎂 Age', key: 'age' as const },
          ].map((item) => {
            const isActive = sortBy === item.key;
            return (
              <Pressable
                key={item.key}
                style={[styles.sortPill, isActive && styles.sortPillActive]}
                onPress={() => setSortBy(item.key)}
              >
                <Text style={[styles.sortPillText, isActive && styles.sortPillTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Cluster Banner if Locality Selected in Map View */}
      {selectedClusterLocality && (
        <View style={styles.clusterFilterBanner}>
          <Text style={styles.clusterFilterText}>
            Filtering by Hub: <Text style={{ fontWeight: '700' }}>{selectedClusterLocality}</Text>
          </Text>
          <Pressable onPress={() => setSelectedClusterLocality(null)} hitSlop={8}>
            <X size={16} color="#064E3B" />
          </Pressable>
        </View>
      )}

      {/* Main Content: Map Mode or List Mode */}
      {viewMode === 'map' ? (
        <ScrollView style={styles.mapContainer} contentContainerStyle={styles.mapContent}>
          <View style={styles.mapHeaderBanner}>
            <Compass size={24} color={V4_COLORS.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.mapHeaderTitle}>Locality & Neighborhood Clusters</Text>
              <Text style={styles.mapHeaderSubtitle}>
                Tap any cluster to filter verified roommates looking in that hub
              </Text>
            </View>
          </View>

          <View style={styles.clusterGrid}>
            {localityClusters.map((cluster) => {
              const isSelected = selectedClusterLocality === cluster.locality;
              return (
                <Pressable
                  key={cluster.locality}
                  style={[styles.clusterCard, isSelected && styles.clusterCardSelected]}
                  onPress={() => {
                    setSelectedClusterLocality(isSelected ? null : cluster.locality);
                  }}
                >
                  <View style={styles.clusterIconWrap}>
                    <Building2 size={18} color={V4_COLORS.primary} />
                  </View>
                  <Text style={styles.clusterLocalityName}>{cluster.locality}</Text>
                  <Text style={styles.clusterCity}>{cluster.city}</Text>

                  <View style={styles.clusterMetricsRow}>
                    <View style={styles.clusterCountPill}>
                      <Users size={12} color="#0F766E" />
                      <Text style={styles.clusterCountText}>{cluster.count} Flatmates</Text>
                    </View>
                    <Text style={styles.clusterBudgetText}>
                      Avg ₹{(cluster.averageBudget / 1000).toFixed(0)}K
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        /* List Mode */
        <FlatList
          data={filteredAndSorted}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSaved = savedFlatmateIds.includes(item.id);
            const isWaved = wavedFlatmateIds.includes(item.id);
            const isWaving = Boolean(wavingIds[item.id]);

            return (
              <View style={styles.cardWrapper}>
                <V4FlatmateCard
                  profile={item}
                  isSaved={isSaved}
                  isWaved={isWaved}
                  isWaving={isWaving}
                  onSelect={() => router.push(`/(renter)/flatmate/${item.id}`)}
                  onToggleSave={() => toggleSaveFlatmate(item.id)}
                  onWave={() => handleWave(item)}
                  showPassBtn={false}
                />
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              {isLoading ? (
                <>
                  <ActivityIndicator size="large" color={V4_COLORS.primary} />
                  <Text style={styles.emptyTitle}>Scanning verified roommates...</Text>
                </>
              ) : (
                <>
                  <View style={styles.emptyIconBox}>
                    <Sparkles size={32} color={V4_COLORS.primary} />
                  </View>
                  <Text style={styles.emptyTitle}>No Flatmates Found</Text>
                  <Text style={styles.emptySub}>
                    Try broadening your budget, search term, or filters to explore more roommates.
                  </Text>
                  <Pressable
                    style={styles.resetSearchBtn}
                    onPress={() => {
                      setSearchQuery('');
                      setFilters({});
                      setSelectedClusterLocality(null);
                    }}
                  >
                    <RotateCcw size={16} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.resetSearchText}>Clear All Filters</Text>
                  </Pressable>
                </>
              )}
            </View>
          }
        />
      )}

      {/* Filter Bottom Sheet Modal */}
      <V4FilterBottomSheet
        visible={isFilterModalOpen}
        filters={filters}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
        onReset={() => setFilters({})}
      />

      {/* Match Celebration Modal */}
      {celebrationFlatmate && (
        <MatchCelebrationModal
          visible={Boolean(celebrationFlatmate)}
          flatmate={celebrationFlatmate}
          onClose={() => setCelebrationFlatmate(null)}
          onStartChat={() => {
            const target = celebrationFlatmate;
            setCelebrationFlatmate(null);
            router.push(`/(renter)/flatmate/${target.id}`);
          }}
          onViewProfile={() => {
            const target = celebrationFlatmate;
            setCelebrationFlatmate(null);
            router.push(`/(renter)/flatmate/${target.id}`);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: V4_COLORS.textPrimary,
    paddingVertical: 0,
  },
  iconToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconToggleBtnActive: {
    backgroundColor: V4_COLORS.primary,
  },
  filterBtn: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: V4_COLORS.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sortingStrip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sortingContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sortPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  sortPillActive: {
    backgroundColor: V4_COLORS.primary,
  },
  sortPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  sortPillTextActive: {
    color: '#FFFFFF',
  },
  clusterFilterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#99F6E4',
  },
  clusterFilterText: {
    fontSize: 13,
    color: '#064E3B',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  mapContainer: {
    flex: 1,
  },
  mapContent: {
    padding: 16,
  },
  mapHeaderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDFA',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginBottom: 16,
  },
  mapHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F766E',
  },
  mapHeaderSubtitle: {
    fontSize: 12,
    color: '#064E3B',
    marginTop: 2,
  },
  clusterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  clusterCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  clusterCardSelected: {
    borderColor: V4_COLORS.primary,
    borderWidth: 2,
    backgroundColor: '#F0FDFA',
  },
  clusterIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  clusterLocalityName: {
    fontSize: 15,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  clusterCity: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginBottom: 8,
  },
  clusterMetricsRow: {
    marginTop: 6,
    gap: 4,
  },
  clusterCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clusterCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  clusterBudgetText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  resetSearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  resetSearchText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
