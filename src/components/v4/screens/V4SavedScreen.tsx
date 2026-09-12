import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Calendar,
  Users,
  Building2,
  Bookmark,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4PropertyCardLarge } from '../ui/V4PropertyCardLarge';
import { V4FlatmateCard } from '../flatmates/V4FlatmateCard';
import { V4AuthGate } from '../ui/V4AuthGate';
import { V4EmptyState } from '../ui/V4EmptyState';

const SAVED_TABS = ['All Saved', 'Flats & Homes', 'PG & Hostel', 'Commercial', 'Flatmates'] as const;
type SavedTab = (typeof SAVED_TABS)[number];

interface V4SavedScreenProps {
  initialTab?: string;
}

export const V4SavedScreen: React.FC<V4SavedScreenProps> = ({ initialTab }) => {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const insets = useSafeAreaInsets();
  const {
    properties,
    savedPropertyIds,
    toggleSaveProperty,
    flatmates,
    savedFlatmateIds,
    toggleSaveFlatmate,
    showToast,
    isAuthenticated,
    fetchProperties,
    fetchSavedIds,
  } = useAppStore();

  const resolveTab = (tabName?: string): SavedTab => {
    if (!tabName) return 'All Saved';
    const lower = tabName.toLowerCase();
    if (lower.includes('commercial')) return 'Commercial';
    if (lower.includes('flatmate')) return 'Flatmates';
    if (lower.includes('pg') || lower.includes('hostel')) return 'PG & Hostel';
    if (lower.includes('flat') || lower.includes('home')) return 'Flats & Homes';
    return 'All Saved';
  };

  const [activeTab, setActiveTab] = useState<SavedTab>(
    resolveTab(initialTab || params?.tab)
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (params?.tab) {
      setActiveTab(resolveTab(params.tab));
    }
  }, [params?.tab]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchProperties(), fetchSavedIds()]);
    } catch {
      // Refresh error handled silently
    } finally {
      setRefreshing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.root}>
        {/* TOP APP BAR */}
        <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
          <View style={styles.headerRow}>
            <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
              <ArrowLeft size={18} color="#0F172A" strokeWidth={2.4} />
            </Pressable>

            <View style={styles.titleCol}>
              <Text style={styles.screenTitle}>Saved Wishlist</Text>
              <Text style={styles.screenSub}>Verified Listing Shortlist & Matches</Text>
            </View>
            <View style={{ width: 36 }} />
          </View>
        </View>

        <V4AuthGate
          title="Save your favourite homes"
          description="Create an account to bookmark properties and flatmates."
          featureName="Saved Wishlist"
          badgeText="WISHLIST & SHORTLIST"
          icon={<Heart size={32} color="#059669" strokeWidth={2.4} />}
          benefits={[
            'Bookmark properties and co-living rooms across India',
            'Receive instant alerts on rent drops & price changes',
            'Save flatmate profiles and sync mutual waves',
            'verified listing direct connections with verified owners',
          ]}
          fullScreen={false}
        />
      </View>
    );
  }

  // Saved Properties List
  const savedPropertiesList = useMemo(() => {
    const list = (properties || []).filter((p) => savedPropertyIds.includes(p.id));

    if (activeTab === 'Flats & Homes') {
      return list.filter((p) => p.category !== 'commercial' && p.property_type !== 'PG' && p.bhk !== 'PG / Co-Living');
    }
    if (activeTab === 'PG & Hostel') {
      return list.filter((p) => p.bhk === 'PG / Co-Living' || p.property_type === 'PG');
    }
    if (activeTab === 'Commercial') {
      return list.filter((p) => p.category === 'commercial' || ['OFFICE', 'SHOP', 'SHOWROOM', 'WAREHOUSE', 'COMMERCIAL_BUILDING', 'COWORKING', 'COMMERCIAL_PLOT', 'OTHER_COMMERCIAL'].includes(p.property_type));
    }

    return list;
  }, [properties, savedPropertyIds, activeTab]);

  // Saved Flatmates List
  const savedFlatmatesList = useMemo(() => {
    const list = flatmates || [];
    return list.filter((fm) => savedFlatmateIds.includes(fm.id));
  }, [flatmates, savedFlatmateIds]);

  // Item counts
  const totalItemCount = useMemo(() => {
    if (activeTab === 'Flatmates') return savedFlatmatesList.length;
    if (activeTab === 'Flats & Homes' || activeTab === 'PG & Hostel' || activeTab === 'Commercial') return savedPropertiesList.length;
    return savedPropertiesList.length + savedFlatmatesList.length;
  }, [activeTab, savedPropertiesList.length, savedFlatmatesList.length]);

  // Estimated brokerage savings calculation (1 month rent per property)
  const totalBrokerageSaved = useMemo(() => {
    const propSavings = savedPropertiesList.reduce((acc, p) => acc + (p.rent || 35000), 0);
    const flatmateSavings = savedFlatmatesList.reduce((acc, fm) => acc + (fm.budget_min || 20000), 0);
    return propSavings + (activeTab === 'Flatmates' || activeTab === 'All Saved' ? flatmateSavings : 0);
  }, [savedPropertiesList, savedFlatmatesList, activeTab]);

  return (
    <View style={styles.root}>
      {/* 1. TOP APP BAR WITH BACK BUTTON */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
        <View style={styles.headerRow}>
          {/* Back Action Button */}
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={18} color="#0F172A" strokeWidth={2.4} />
          </Pressable>

          {/* Center Screen Title */}
          <View style={styles.titleCol}>
            <View style={styles.titleWithBadge}>
              <Text style={styles.screenTitle}>Saved Wishlist</Text>
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{totalItemCount}</Text>
              </View>
            </View>
            <Text style={styles.screenSub}>Verified Listing Shortlist & Matches</Text>
          </View>

          {/* Right Action: Search / Explore */}
          <Pressable
            style={styles.rightActionBtn}
            onPress={() => {
              if (activeTab === 'Flatmates') {
                router.push('/(renter)/flatmates' as any);
              } else {
                router.push('/(renter)/search' as any);
              }
            }}
            hitSlop={8}
          >
            {activeTab === 'Flatmates' ? (
              <Users size={16} color="#059669" strokeWidth={2.4} />
            ) : (
              <Search size={16} color="#059669" strokeWidth={2.4} />
            )}
          </Pressable>
        </View>

        {/* Filter Segmented Tabs */}
        <View style={styles.tabsRow}>
          {SAVED_TABS.map((tab) => {
            const isSelected = activeTab === tab;
            const badgeCount =
              tab === 'Flatmates'
                ? savedFlatmateIds.length
                : tab === 'Flats & Homes'
                ? (properties || []).filter((p) => savedPropertyIds.includes(p.id) && p.category !== 'commercial' && p.property_type !== 'PG').length
                : tab === 'PG & Hostel'
                ? (properties || []).filter((p) => savedPropertyIds.includes(p.id) && (p.property_type === 'PG' || p.bhk === 'PG / Co-Living')).length
                : tab === 'Commercial'
                ? (properties || []).filter((p) => savedPropertyIds.includes(p.id) && p.category === 'commercial').length
                : undefined;

            return (
              <Pressable
                key={tab}
                style={[styles.tabChip, isSelected && styles.tabChipActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                  {tab}
                </Text>
                {badgeCount !== undefined && badgeCount > 0 && !isSelected && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{badgeCount}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 2. SAVED FEED */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: Math.max(insets.bottom, 24) + 90 },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#059669" />
        }
      >
        {totalItemCount > 0 ? (
          <>
            {/* Savings Highlight Card */}
            <View style={styles.savingsBannerCard}>
              <View style={styles.savingsLeft}>
                <View style={styles.savingsTag}>
                  <Sparkles size={11} color="#059669" strokeWidth={2.6} />
                  <Text style={styles.savingsTagText}>VERIFIED LISTING BENEFIT</Text>
                </View>
                <Text style={styles.savingsAmount}>
                  ₹{totalBrokerageSaved.toLocaleString('en-IN')} Saved
                </Text>
                <Text style={styles.savingsSub}>
                  {activeTab === 'Flatmates'
                    ? `Across ${savedFlatmatesList.length} direct roommate connections`
                    : `Across ${totalItemCount} direct verified homes & flatmates`}
                </Text>
              </View>

              {activeTab === 'Flatmates' ? (
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => router.push('/(renter)/flatmate/discover' as any)}
                >
                  <Sparkles size={13} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.actionBtnText}>Swipe Deck</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => router.push('/(renter)/visits' as any)}
                >
                  <Calendar size={13} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.actionBtnText}>My Visits</Text>
                </Pressable>
              )}
            </View>

            {/* Flatmates Tab View */}
            {activeTab === 'Flatmates' && (
              <View style={styles.feedWrapper}>
                {savedFlatmatesList.map((flatmate) => (
                  <V4FlatmateCard
                    key={flatmate.id}
                    flatmate={flatmate}
                    variant="feed"
                    isSaved={true}
                    onToggleSave={() => toggleSaveFlatmate(flatmate.id)}
                  />
                ))}
              </View>
            )}

            {/* Flats & Homes / PG & Hostel / Commercial Tab Views */}
            {(activeTab === 'Flats & Homes' || activeTab === 'PG & Hostel' || activeTab === 'Commercial') && (
              <View style={styles.feedWrapper}>
                {savedPropertiesList.map((property) => (
                  <V4PropertyCardLarge
                    key={property.id}
                    property={property}
                    isSaved={true}
                    onToggleSave={toggleSaveProperty}
                    onSelect={(p) => router.push(`/(renter)/property/${p.id}` as any)}
                    onBookVisit={() => router.push('/(renter)/visits' as any)}
                  />
                ))}
              </View>
            )}

            {/* All Saved Unified View */}
            {activeTab === 'All Saved' && (
              <View style={styles.feedWrapper}>
                {/* Properties Section */}
                {savedPropertiesList.length > 0 && (
                  <>
                    <View style={styles.sectionHeaderRow}>
                      <Building2 size={16} color="#059669" strokeWidth={2.4} />
                      <Text style={styles.sectionHeading}>
                        Saved Homes & Spaces ({savedPropertiesList.length})
                      </Text>
                    </View>
                    {savedPropertiesList.map((property) => (
                      <V4PropertyCardLarge
                        key={property.id}
                        property={property}
                        isSaved={true}
                        onToggleSave={toggleSaveProperty}
                        onSelect={(p) => router.push(`/(renter)/property/${p.id}` as any)}
                        onBookVisit={() => router.push('/(renter)/visits' as any)}
                      />
                    ))}
                  </>
                )}

                {/* Flatmates Section */}
                {savedFlatmatesList.length > 0 && (
                  <>
                    <View style={[styles.sectionHeaderRow, savedPropertiesList.length > 0 && { marginTop: 24 }]}>
                      <Users size={16} color="#059669" strokeWidth={2.4} />
                      <Text style={styles.sectionHeading}>
                        Saved Co-Living Flatmates ({savedFlatmatesList.length})
                      </Text>
                    </View>
                    {savedFlatmatesList.map((flatmate) => (
                      <V4FlatmateCard
                        key={flatmate.id}
                        flatmate={flatmate}
                        variant="feed"
                        isSaved={true}
                        onToggleSave={() => toggleSaveFlatmate(flatmate.id)}
                      />
                    ))}
                  </>
                )}
              </View>
            )}

            {/* Escrow & Trust Guarantee Strip */}
            <View style={styles.trustBanner}>
              <ShieldCheck size={16} color="#16A34A" strokeWidth={2.4} />
              <Text style={styles.trustBannerText}>
                All shortlisted listings and roommates are DigiLocker verified with 100% token escrow protection.
              </Text>
            </View>
          </>
        ) : (
          <V4EmptyState
            icon={activeTab === 'Flatmates' ? <Users size={32} color="#0F766E" /> : <Heart size={32} color="#0F766E" />}
            title={activeTab === 'Flatmates' ? 'No Saved Flatmates Yet' : `No Saved ${activeTab === 'All Saved' ? 'Properties' : activeTab} Yet`}
            description={activeTab === 'Flatmates' ? 'Browse curated roommate profiles and swipe right on potential flatmates.' : 'Explore verified homes across Mumbai and tap the heart icon to save them.'}
            actionLabel={activeTab === 'Flatmates' ? 'Explore Flatmates →' : 'Explore Properties →'}
            onActionPress={() => {
              if (activeTab === 'Flatmates') {
                router.push('/(renter)/flatmates' as any);
              } else if (activeTab === 'Commercial') {
                router.push('/(renter)/commercial' as any);
              } else if (activeTab === 'PG & Hostel') {
                router.push('/(renter)/pg' as any);
              } else {
                router.push('/(renter)/search' as any);
              }
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  topBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCol: {
    flex: 1,
    marginLeft: 12,
  },
  titleWithBadge: {
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
  countPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  screenSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  rightActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  tabChipActive: {
    backgroundColor: '#059669',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabBadge: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollContainer: {
    paddingTop: 12,
  },
  feedWrapper: {
    paddingHorizontal: 0,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  savingsBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    ...V4_SHADOWS.soft,
  },
  savingsLeft: {
    flex: 1,
    marginRight: 10,
  },
  savingsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  savingsTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  savingsAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  savingsSub: {
    fontSize: 11,
    color: '#059669',
    marginTop: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  trustBannerText: {
    fontSize: 11.5,
    color: '#15803D',
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 36,
    marginHorizontal: 18,
    marginTop: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
    backgroundColor: '#059669',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    ...V4_SHADOWS.soft,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
