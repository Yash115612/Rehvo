import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  RefreshControl,
  Dimensions,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Plus,
  Building2,
  LayoutGrid,
  List,
  Eye,
  Heart,
  Users,
  Calendar,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  Edit3,
  Trash2,
  ExternalLink,
  BarChart2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Copy,
  Share2,
} from 'lucide-react-native';
import { Property, ListingLifecycleStatus } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { V4EmptyState } from '../ui/V4EmptyState';
import { V4Image } from '../ui/V4Image';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FilterTab = 'ALL' | 'ACTIVE' | 'DRAFT' | 'PAUSED' | 'RENTED' | 'EXPIRED';

interface V4OwnerPropertiesScreenProps {
  hideHeader?: boolean;
}

export const V4OwnerPropertiesScreen: React.FC<V4OwnerPropertiesScreenProps> = ({
  hideHeader = false,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    myProperties,
    fetchMyProperties,
    updateProperty,
    deleteProperty,
    duplicateProperty,
    markPropertyRented,
    savePropertyDraft,
    showToast,
    activeMode,
  } = useAppStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const listingRoute = activeMode === 'owner' ? '/(owner)/listing' : '/(renter)/listing';

  const loadData = useCallback(async () => {
    await fetchMyProperties();
  }, [fetchMyProperties]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Status Badge Helper
  const getStatusBadge = (status?: string) => {
    const s = (status || 'PUBLISHED').toUpperCase();
    switch (s) {
      case 'PUBLISHED':
      case 'ACTIVE':
        return { label: 'Live Active', bg: '#DCFCE7', color: '#15803D', icon: CheckCircle2 };
      case 'PAUSED':
        return { label: 'Paused', bg: '#FEF3C7', color: '#B45309', icon: PauseCircle };
      case 'UNDER_REVIEW':
        return { label: 'Under Review', bg: '#DBEAFE', color: '#1D4ED8', icon: Clock };
      case 'RENTED':
        return { label: 'Rented Out', bg: '#F3E8FF', color: '#7E22CE', icon: CheckCircle2 };
      case 'DRAFT':
        return { label: 'Draft', bg: '#F1F5F9', color: '#475569', icon: Edit3 };
      case 'EXPIRED':
        return { label: 'Expired', bg: '#FFE4E6', color: '#BE123C', icon: AlertCircle };
      case 'ARCHIVED':
      default:
        return { label: 'Archived', bg: '#E2E8F0', color: '#334155', icon: AlertCircle };
    }
  };

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return myProperties.filter((p) => {
      const status = (p.status || 'PUBLISHED').toUpperCase();
      if (activeTab === 'ALL') return true;
      if (activeTab === 'ACTIVE') return status === 'PUBLISHED' || status === 'ACTIVE';
      if (activeTab === 'DRAFT') return status === 'DRAFT';
      if (activeTab === 'PAUSED') return status === 'PAUSED';
      if (activeTab === 'RENTED') return status === 'RENTED';
      if (activeTab === 'EXPIRED') return status === 'EXPIRED';
      return true;
    });
  }, [myProperties, activeTab]);

  const paginatedProperties = useMemo(() => {
    return filteredProperties.slice(0, page * pageSize);
  }, [filteredProperties, page]);

  const handleTogglePause = async (propId: string, currentStatus?: string) => {
    const isPaused = (currentStatus || '').toUpperCase() === 'PAUSED';
    const nextStatus = isPaused ? 'PUBLISHED' : 'PAUSED';
    const res = await updateProperty(propId, { status: nextStatus as any });
    if (res.success) {
      showToast?.(isPaused ? 'Listing is now live!' : 'Listing paused', 'info');
      await fetchMyProperties();
    }
  };

  const handleDuplicate = async (propId: string) => {
    Alert.alert(
      'Duplicate Listing',
      'Do you want to create a duplicate draft of this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Duplicate',
          onPress: async () => {
            const res = await duplicateProperty(propId);
            if (res.success) {
              showToast?.('Listing duplicated successfully!', 'success');
              await fetchMyProperties();
            } else {
              Alert.alert('Duplicate Failed', res.error || 'Could not duplicate listing.');
            }
          },
        },
      ]
    );
  };

  const handleMarkRented = async (propId: string, title: string) => {
    Alert.alert(
      'Mark as Rented',
      `Mark "${title}" as rented out? It will be moved to your Rented tab.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Rented',
          onPress: async () => {
            const res = await markPropertyRented(propId);
            if (res.success) {
              showToast?.('Listing marked as rented!', 'success');
              await fetchMyProperties();
            } else {
              Alert.alert('Error', res.error || 'Could not update listing status.');
            }
          },
        },
      ]
    );
  };

  const handleShare = async (prop: Property) => {
    try {
      await Share.share({
        title: prop.title,
        message: `Check out this verified property on REHVO: ${prop.title} in ${prop.locality}, ${prop.city}. Rent: ₹${(prop.rent || 0).toLocaleString('en-IN')}/mo with Verified Listing!`,
      });
    } catch {
      // Share error handled silently
    }
  };

  const handleDelete = (propId: string, title: string) => {
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteProperty(propId);
            if (res.success) {
              showToast?.('Listing removed successfully', 'success');
              await fetchMyProperties();
            }
          },
        },
      ]
    );
  };

  const handleEdit = (prop: Property) => {
    savePropertyDraft({
      id: prop.id,
      title: prop.title,
      bhk: prop.bhk,
      rent: String(prop.rent || ''),
      deposit: String(prop.deposit || ''),
      locality: prop.locality,
      city: prop.city,
      areaSqft: String(prop.area_sqft || ''),
      furnishing: prop.furnishing,
      photos: (prop.images || []).map((img) => (typeof img === 'string' ? img : img.url)),
      floorPlanUri: prop.floor_plan_url || undefined,
      virtualTourUri: prop.virtual_tour_url || undefined,
    });
    router.push(listingRoute as any);
  };

  return (
    <View style={[styles.container, !hideHeader && { paddingTop: insets.top }]}>
      {!hideHeader && (
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
          </Pressable>
          <Text style={styles.topNavTitle}>My Properties</Text>
          <View style={styles.topNavRight}>
            <Pressable
              style={styles.viewToggleBtn}
              onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              {viewMode === 'list' ? (
                <LayoutGrid size={20} color="#0F766E" />
              ) : (
                <List size={20} color="#0F766E" />
              )}
            </Pressable>
            <Pressable
              style={styles.addBtn}
              onPress={() => router.push(listingRoute as any)}
            >
              <Plus size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      )}

      {/* Filter Tabs Strip */}
      <View style={styles.filterStripWrap}>
        <View style={styles.filterStripInner}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterTabsScroll}
            style={{ flex: 1 }}
          >
            {(['ALL', 'ACTIVE', 'DRAFT', 'PAUSED', 'RENTED', 'EXPIRED'] as FilterTab[]).map(
              (tab) => {
                const active = activeTab === tab;
                const count =
                  tab === 'ALL'
                    ? myProperties.length
                    : myProperties.filter((p) => {
                        const s = (p.status || 'PUBLISHED').toUpperCase();
                        if (tab === 'ACTIVE') return s === 'PUBLISHED' || s === 'ACTIVE';
                        return s === tab;
                      }).length;

                return (
                  <Pressable
                    key={tab}
                    style={[styles.filterPill, active && styles.filterPillActive]}
                    onPress={() => {
                      setActiveTab(tab);
                      setPage(1);
                    }}
                  >
                    <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                      {tab.replace('_', ' ')}
                    </Text>
                    <View style={[styles.filterCountBadge, active && styles.filterCountBadgeActive]}>
                      <Text
                        style={[
                          styles.filterCountBadgeText,
                          active && styles.filterCountBadgeTextActive,
                        ]}
                      >
                        {count}
                      </Text>
                    </View>
                  </Pressable>
                );
              }
            )}
          </ScrollView>

          {/* View toggle: list ↔ grid */}
          <Pressable
            style={styles.viewToggleBtn}
            onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? (
              <LayoutGrid size={18} color="#0F766E" />
            ) : (
              <List size={18} color="#0F766E" />
            )}
          </Pressable>
        </View>
      </View>

      {/* Properties List/Grid */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0F766E" />
        }
      >
        {paginatedProperties.length === 0 ? (
          <View style={{ paddingTop: 30, paddingHorizontal: 16 }}>
            <V4EmptyState
              icon={<Building2 size={36} color={V4_COLORS.primary} />}
              title="No Properties Found"
              description={
                activeTab === 'ALL'
                  ? 'You haven’t listed any properties yet. Post your home to start receiving verified tenant leads!'
                  : `No properties currently in "${activeTab.replace('_', ' ')}" status.`
              }
              actionLabel="Post New Property"
              onActionPress={() => router.push(listingRoute as any)}
            />
          </View>
        ) : viewMode === 'list' ? (
          // LIST VIEW
          <View style={styles.listContainer}>
            {paginatedProperties.map((prop) => {
              const badge = getStatusBadge(prop.status);
              const firstImg = prop.images?.[0];
              const imageUri =
                typeof firstImg === 'string'
                  ? firstImg
                  : (firstImg as any)?.url ||
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
              const rentVal = Number(prop.rent || (prop as any).price || 0);
              const isPaused = (prop.status || '').toUpperCase() === 'PAUSED';
              const isRented = (prop.status || '').toUpperCase() === 'RENTED';

              return (
                <View key={prop.id} style={styles.listCard}>
                  <View style={styles.listCardTopRow}>
                    <V4Image
                      source={{ uri: imageUri }}
                      style={styles.listCardImage}
                      containerStyle={styles.listCardImage}
                      borderRadius={14}
                      resizeMode="cover"
                    />
                    <View style={styles.listCardInfo}>
                      <View style={styles.listBadgeRow}>
                        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                          <badge.icon size={11} color={badge.color} />
                          <Text style={[styles.statusBadgeText, { color: badge.color }]}>
                            {badge.label}
                          </Text>
                        </View>
                        <Text style={styles.propTypeTxt}>{prop.bhk || 'Apartment'}</Text>
                      </View>

                      <Text style={styles.listCardTitle} numberOfLines={1}>
                        {prop.title}
                      </Text>
                      <Text style={styles.listCardLocality} numberOfLines={1}>
                        {prop.locality}, {prop.city}
                      </Text>

                      <Text style={styles.listCardRent}>
                        ₹{rentVal.toLocaleString('en-IN')}
                        <Text style={styles.listCardRentMo}> /month</Text>
                      </Text>
                    </View>
                  </View>

                  {/* Metrics Bar */}
                  <View style={styles.metricsBar}>
                    <View style={styles.metricItem}>
                      <Eye size={13} color="#64748B" />
                      <Text style={styles.metricVal}>{prop.views_count || 0}</Text>
                      <Text style={styles.metricLabel}>Views</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Heart size={13} color="#64748B" />
                      <Text style={styles.metricVal}>{prop.saves_count || 0}</Text>
                      <Text style={styles.metricLabel}>Saves</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Users size={13} color="#64748B" />
                      <Text style={styles.metricVal}>{(prop as any).enquiries_count || 0}</Text>
                      <Text style={styles.metricLabel}>Leads</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Calendar size={13} color="#64748B" />
                      <Text style={styles.metricVal}>{(prop as any).visits_count || 0}</Text>
                      <Text style={styles.metricLabel}>Visits</Text>
                    </View>
                  </View>

                  {/* Actions Bar - Row 1 */}
                  <View style={styles.actionsBar}>
                    <Pressable
                      style={styles.actionBtn}
                      onPress={() => handleEdit(prop)}
                    >
                      <Edit3 size={14} color="#0F766E" />
                      <Text style={styles.actionBtnText}>Edit</Text>
                    </Pressable>

                    <Pressable
                      style={styles.actionBtn}
                      onPress={() => handleDuplicate(prop.id)}
                    >
                      <Copy size={14} color="#0284C7" />
                      <Text style={[styles.actionBtnText, { color: '#0284C7' }]}>Duplicate</Text>
                    </Pressable>

                    <Pressable
                      style={styles.actionBtn}
                      onPress={() => handleTogglePause(prop.id, prop.status)}
                    >
                      {isPaused ? (
                        <>
                          <PlayCircle size={14} color="#059669" />
                          <Text style={[styles.actionBtnText, { color: '#059669' }]}>Resume</Text>
                        </>
                      ) : (
                        <>
                          <PauseCircle size={14} color="#D97706" />
                          <Text style={[styles.actionBtnText, { color: '#D97706' }]}>Pause</Text>
                        </>
                      )}
                    </Pressable>

                    {!isRented && (
                      <Pressable
                        style={styles.actionBtn}
                        onPress={() => handleMarkRented(prop.id, prop.title)}
                      >
                        <CheckCircle2 size={14} color="#7E22CE" />
                        <Text style={[styles.actionBtnText, { color: '#7E22CE' }]}>Rented</Text>
                      </Pressable>
                    )}
                  </View>

                  {/* Actions Bar - Row 2 */}
                  <View style={[styles.actionsBar, { borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}>
                    <Pressable
                      style={styles.actionBtn}
                      onPress={() => router.push(`/property/${prop.id}` as any)}
                    >
                      <ExternalLink size={14} color="#475569" />
                      <Text style={styles.actionBtnText}>Preview</Text>
                    </Pressable>

                    <Pressable
                      style={styles.actionBtn}
                      onPress={() => router.push(`/(renter)/owner-performance?id=${prop.id}` as any)}
                    >
                      <BarChart2 size={14} color="#9333EA" />
                      <Text style={[styles.actionBtnText, { color: '#9333EA' }]}>Stats</Text>
                    </Pressable>

                    <Pressable
                      style={styles.actionBtn}
                      onPress={() => handleShare(prop)}
                    >
                      <Share2 size={14} color="#0F766E" />
                      <Text style={[styles.actionBtnText, { color: '#0F766E' }]}>Share</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.actionBtn, { borderRightWidth: 0 }]}
                      onPress={() => handleDelete(prop.id, prop.title)}
                    >
                      <Trash2 size={14} color="#DC2626" />
                      <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          // GRID VIEW
          <View style={styles.gridContainer}>
            {paginatedProperties.map((prop) => {
              const badge = getStatusBadge(prop.status);
              const firstImg = prop.images?.[0];
              const imageUri =
                typeof firstImg === 'string'
                  ? firstImg
                  : (firstImg as any)?.url ||
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
              const rentVal = Number(prop.rent || (prop as any).price || 0);

              return (
                <View key={prop.id} style={styles.gridCard}>
                  <V4Image
                    source={{ uri: imageUri }}
                    style={styles.gridCardImage}
                    containerStyle={styles.gridCardImage}
                    borderRadius={0}
                    resizeMode="cover"
                  />
                  <View style={[styles.gridStatusBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.gridStatusText, { color: badge.color }]}>
                      {badge.label}
                    </Text>
                  </View>

                  <View style={styles.gridContent}>
                    <Text style={styles.gridRent}>₹{rentVal.toLocaleString('en-IN')}</Text>
                    <Text style={styles.gridTitle} numberOfLines={1}>
                      {prop.title}
                    </Text>
                    <Text style={styles.gridLocality} numberOfLines={1}>
                      {prop.locality}
                    </Text>

                    <View style={styles.gridMetricsRow}>
                      <View style={styles.gridMetricItem}>
                        <Eye size={11} color="#64748B" />
                        <Text style={styles.gridMetricTxt}>{prop.views_count || 0}</Text>
                      </View>
                      <View style={styles.gridMetricItem}>
                        <Users size={11} color="#64748B" />
                        <Text style={styles.gridMetricTxt}>{(prop as any).enquiries_count || 0}</Text>
                      </View>
                    </View>

                    <View style={styles.gridActionRow}>
                      <Pressable
                        style={styles.gridEditBtn}
                        onPress={() => handleEdit(prop)}
                      >
                        <Edit3 size={12} color="#0F766E" />
                        <Text style={styles.gridEditTxt}>Edit</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.gridIconBtn, { backgroundColor: '#F0F9FF' }]}
                        onPress={() => handleDuplicate(prop.id)}
                      >
                        <Copy size={12} color="#0284C7" />
                      </Pressable>
                      <Pressable
                        style={[styles.gridIconBtn, { backgroundColor: '#F0FDFA' }]}
                        onPress={() => handleShare(prop)}
                      >
                        <Share2 size={12} color="#0F766E" />
                      </Pressable>
                      <Pressable
                        style={styles.gridPerfBtn}
                        onPress={() => router.push(`/(renter)/owner-performance?id=${prop.id}` as any)}
                      >
                        <BarChart2 size={12} color="#9333EA" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Pagination Trigger */}
        {filteredProperties.length > paginatedProperties.length && (
          <View style={styles.loadMoreWrap}>
            <V4Button
              title="Load More Properties"
              variant="outline"
              onPress={() => setPage((p) => p + 1)}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  topNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterStripWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
  },
  filterStripInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  filterTabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterPillActive: {
    backgroundColor: '#064E3B',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  filterCountBadge: {
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  filterCountBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  filterCountBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
  filterCountBadgeTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 14,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  listContainer: {
    gap: 14,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...V4_SHADOWS.card,
  },
  listCardTopRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  listCardImage: {
    width: 100,
    height: 90,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  listCardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  listBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  propTypeTxt: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  listCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  listCardLocality: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  listCardRent: {
    fontSize: 16,
    fontWeight: '900',
    color: '#064E3B',
    marginTop: 4,
  },
  listCardRentMo: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  metricsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 8,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricVal: {
    fontSize: 12,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
    ...V4_SHADOWS.soft,
  },
  gridCardImage: {
    width: '100%',
    height: 110,
    backgroundColor: '#E2E8F0',
  },
  gridStatusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gridStatusText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  gridContent: {
    padding: 10,
  },
  gridRent: {
    fontSize: 15,
    fontWeight: '900',
    color: '#064E3B',
  },
  gridTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  gridLocality: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  gridMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  gridMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  gridMetricTxt: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  gridActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  gridEditBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingVertical: 6,
    borderRadius: 8,
  },
  gridEditTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  gridPerfBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreWrap: {
    marginTop: 16,
    alignItems: 'center',
  },
  subBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  subBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
});
