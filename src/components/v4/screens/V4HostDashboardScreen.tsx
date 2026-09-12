import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Plus,
  Building2,
  TrendingUp,
  Eye,
  MessageSquare,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  FileCheck,
  Crown,
  Zap,
  ArrowUpRight,
  Trash2,
  PauseCircle,
  PlayCircle,
  ExternalLink,
} from 'lucide-react-native';
import { Property } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';
import { V4HostPlanGateModal } from '../ui/V4HostPlanGateModal';
import { V4AuthGate } from '../ui/V4AuthGate';

export const V4HostDashboardScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    activeHostPlan,
    canListNewProperty,
    myProperties,
    fetchMyProperties,
    fetchOwnerMetrics,
    ownerMetrics,
    updateProperty,
    deleteProperty,
    savePropertyDraft,
    isAuthenticated,
    showToast,
  } = useAppStore();

  const [tab, setTab] = useState<'all' | 'active' | 'pending'>('all');
  const [gateModalVisible, setGateModalVisible] = useState(false);
  const [gateReason, setGateReason] = useState<'NO_PLAN' | 'LIMIT_REACHED'>('LIMIT_REACHED');
  const [refreshing, setRefreshing] = useState(false);

  const loadHostData = useCallback(async () => {
    if (isAuthenticated) {
      await Promise.all([fetchMyProperties(), fetchOwnerMetrics()]);
    }
  }, [isAuthenticated, fetchMyProperties, fetchOwnerMetrics]);

  useEffect(() => {
    loadHostData();
  }, [loadHostData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHostData();
    setRefreshing(false);
  };

  const handleAddListing = () => {
    if (!isAuthenticated) {
      router.push('/(renter)/login' as any);
      return;
    }
    const check = canListNewProperty();
    if (!check.allowed) {
      setGateReason(check.reason || 'LIMIT_REACHED');
      setGateModalVisible(true);
      return;
    }
    router.push('/(renter)/listing' as any);
  };

  const handleEditProperty = (prop: Property) => {
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
      tenantType: (prop as any).tenant_preference || prop.tenant_preferences?.[0] || 'ALL',
      selectedAmenities: prop.amenities || [],
      photos: (prop.images || []).map((img) => (typeof img === 'string' ? img : img.url)),
      coverIndex: (prop.images || []).findIndex((img) => typeof img !== 'string' && img.is_cover) >= 0
        ? (prop.images || []).findIndex((img) => typeof img !== 'string' && img.is_cover)
        : 0,
    });
    router.push('/(renter)/listing' as any);
  };

  const handleTogglePause = async (propId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PAUSED' ? 'ACTIVE' : 'PAUSED';
    const res = await updateProperty(propId, { status: nextStatus });
    if (res.success) {
      showToast?.(nextStatus === 'PAUSED' ? 'Listing paused' : 'Listing is now live!', 'info');
    }
  };

  const handleDeleteProperty = (propId: string, title: string) => {
    Alert.alert(
      'Delete Property Listing',
      `Are you sure you want to permanently delete "${title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Listing',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteProperty(propId);
            if (res.success) {
              showToast?.('Listing deleted successfully', 'success');
            } else {
              Alert.alert('Error', res.error || 'Could not delete listing.');
            }
          },
        },
      ]
    );
  };

  const userProperties = myProperties.map((p) => {
    const rawPrice = (p as any).price || p.rent || (p as any).monthlyRent || 0;
    const isVerified = (p as any).verificationStatus === 'verified' || (p as any).verification_status === 'VERIFIED' || (p as any).is_verified;
    const isPaused = p.status === 'PAUSED';
    const isDraft = p.status === 'DRAFT';
    const firstImg = p.images?.[0];
    const imageUri = typeof firstImg === 'string' ? firstImg : (firstImg as any)?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
    
    let statusLabel = 'ACTIVE';
    if (isPaused) statusLabel = 'PAUSED';
    else if (isDraft) statusLabel = 'DRAFT';
    else if (!isVerified) statusLabel = 'VERIFICATION_PENDING';

    return {
      id: p.id,
      raw: p,
      title: p.title,
      location: `${p.locality}, ${p.city}`,
      rent: `₹${Number(rawPrice).toLocaleString('en-IN')}/mo`,
      status: statusLabel,
      views: p.views_count || 0,
      enquiries: (p as any).enquiries_count || (p as any).inquiries_count || 0,
      visits: (p as any).visits_count || 0,
      image: imageUri,
      verified: isVerified,
      isPaused,
    };
  });

  const filteredProperties = userProperties.filter((p) => {
    if (tab === 'active') return p.status === 'ACTIVE';
    if (tab === 'pending') return p.status !== 'ACTIVE';
    return true;
  });

  const totalMonthlyYield = myProperties.reduce(
    (sum, p) => sum + Number((p as any).price || p.rent || (p as any).monthlyRent || 0),
    0
  );
  const activeCount = userProperties.filter((p) => p.status === 'ACTIVE').length;
  const pendingCount = userProperties.filter((p) => p.status !== 'ACTIVE').length;
  const totalViews = ownerMetrics?.total_views ?? myProperties.reduce((sum, p) => sum + (p.views_count || 0), 0);
  const totalEnquiries = ownerMetrics?.total_enquiries ?? myProperties.reduce((sum, p) => sum + ((p as any).enquiries_count || (p as any).inquiries_count || 0), 0);

  const getPlanInfo = () => {
    switch (activeHostPlan) {
      case 'pro':
        return {
          name: 'Pro Host Plan',
          price: '₹999/mo • Active',
          limit: 10,
          used: myProperties.length,
        };
      case 'growth':
        return {
          name: 'Growth Host Plan',
          price: '₹599/mo • Active',
          limit: 3,
          used: myProperties.length,
        };
      case 'basic':
        return {
          name: 'Basic Host Plan',
          price: '₹299/mo • Active',
          limit: 1,
          used: myProperties.length,
        };
      case 'starter':
      default:
        return {
          name: 'Starter Host Plan',
          price: '₹0 Free • Active',
          limit: 1,
          used: myProperties.length,
        };
    }
  };
  const planInfo = getPlanInfo();
  const usagePercentage = Math.min(100, Math.round((planInfo.used / planInfo.limit) * 100));

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.headerTitle}>Host Dashboard</Text>
        <Pressable
          style={styles.addListingBtn}
          onPress={handleAddListing}
        >
          <Plus size={15} color="#FFFFFF" strokeWidth={2.8} />
          <Text style={styles.addListingText}>Add Listing</Text>
        </Pressable>
      </View>

      {!isAuthenticated ? (
        <V4AuthGate
          icon={Building2}
          title="List & Manage Your Properties"
          description="Sign in as a homeowner or property manager to list flats, manage tenant applications, track scheduled visits, and collect rent."
          benefits={[
            'Reach thousands of verified tenants & working professionals',
            'AI matching & verified tenant background checks',
            'verified listing and direct landlord-tenant communication',
            'Instant digital rent collection with automated receipts',
          ]}
          fullScreen={false}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={V4_COLORS.primary}
            />
          }
        >
          {/* Earnings Card */}
          <View style={styles.earningsCard}>
            <View style={styles.earningsTopRow}>
              <View>
                <Text style={styles.earningsLabel}>TOTAL MONTHLY RENTAL YIELD</Text>
                <Text style={styles.earningsValue}>₹{totalMonthlyYield.toLocaleString('en-IN')}<Text style={styles.earningsMonth}>/month</Text></Text>
              </View>
              <View style={styles.growthBadge}>
                <TrendingUp size={12} color="#16A34A" strokeWidth={2.5} />
                <Text style={styles.growthText}>Live</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricVal}>{activeCount} Active</Text>
                <Text style={styles.metricLabel}>Properties Live</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricVal}>{totalViews}</Text>
                <Text style={styles.metricLabel}>Total Views</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricVal}>{totalEnquiries}</Text>
                <Text style={styles.metricLabel}>Direct Leads</Text>
              </View>
            </View>
          </View>

        {/* Quick Host Management Actions */}
        <View style={styles.hostActionsRow}>
          <Pressable
            style={styles.actionCard}
            onPress={handleAddListing}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#E6FFFA' }]}>
              <Plus size={18} color="#0F766E" strokeWidth={2.4} />
            </View>
            <Text style={styles.actionLabel}>Add Property</Text>
          </Pressable>

          <Pressable
            style={styles.actionCard}
            onPress={() => Alert.alert('Digital Agreements', 'View active tenant lease agreements.')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#EEF2FF' }]}>
              <FileCheck size={18} color="#6366F1" strokeWidth={2.4} />
            </View>
            <Text style={styles.actionLabel}>Agreements</Text>
          </Pressable>

          <Pressable
            style={styles.actionCard}
            onPress={() => router.push('/(renter)/kyc' as any)}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#DCFCE7' }]}>
              <ShieldCheck size={18} color="#16A34A" strokeWidth={2.4} />
            </View>
            <Text style={styles.actionLabel}>Police NOC</Text>
          </Pressable>
        </View>

        {/* CURRENT HOST SUBSCRIPTION PLAN CARD */}
        <View style={styles.subscriptionCard}>
          <View style={styles.subCardTopRow}>
            <View style={styles.subPlanTitleRow}>
              <View style={styles.subPlanIconBox}>
                <Crown size={16} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.subPlanName}>{planInfo.name}</Text>
                <Text style={styles.subPlanPrice}>{planInfo.price}</Text>
              </View>
            </View>
            <View style={styles.subActiveBadge}>
              <View style={styles.subActiveDot} />
              <Text style={styles.subActiveBadgeText}>ACTIVE</Text>
            </View>
          </View>

          {/* Usage & Days Remaining Stats */}
          <View style={styles.subUsageBarWrap}>
            <View style={styles.subUsageTextRow}>
              <Text style={styles.subUsageLabel}>
                Listings Usage:{' '}
                <Text style={{ fontWeight: '800', color: V4_COLORS.textPrimary }}>
                  {planInfo.used} of {planInfo.limit} Used
                </Text>
              </Text>
              <Text style={styles.subDaysLeftText}>24 Days Left</Text>
            </View>
            <View style={styles.subProgressBarBg}>
              <View style={[styles.subProgressBarFill, { width: `${usagePercentage}%` }]} />
            </View>
          </View>

          {/* Action Buttons: Upgrade & Renew */}
          <View style={styles.subActionsRow}>
            <Pressable
              style={styles.subUpgradeBtn}
              onPress={() => router.push('/(renter)/host-plans' as any)}
            >
              <Zap size={13} color="#042F2E" strokeWidth={2.5} />
              <Text style={styles.subUpgradeBtnText}>Upgrade Plan</Text>
              <ArrowUpRight size={13} color="#042F2E" strokeWidth={2.5} />
            </Pressable>

            <Pressable
              style={styles.subRenewBtn}
              onPress={() => router.push('/(renter)/host-plans' as any)}
            >
              <Text style={styles.subRenewBtnText}>Renew Plan</Text>
            </Pressable>
          </View>
        </View>

        {/* Listings Filter Tabs */}
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tabBtn, tab === 'all' && styles.tabBtnActive]}
            onPress={() => setTab('all')}
          >
            <Text style={[styles.tabBtnText, tab === 'all' && styles.tabBtnTextActive]}>
              All Listings ({userProperties.length})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, tab === 'active' && styles.tabBtnActive]}
            onPress={() => setTab('active')}
          >
            <Text style={[styles.tabBtnText, tab === 'active' && styles.tabBtnTextActive]}>
              Active ({activeCount})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, tab === 'pending' && styles.tabBtnActive]}
            onPress={() => setTab('pending')}
          >
            <Text style={[styles.tabBtnText, tab === 'pending' && styles.tabBtnTextActive]}>
              Paused / Review ({pendingCount})
            </Text>
          </Pressable>
        </View>

        {/* Listings List or Empty State */}
        {filteredProperties.length === 0 ? (
          <View
            style={{
              backgroundColor: V4_COLORS.surface,
              borderRadius: V4_RADIUS.card,
              padding: 28,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: V4_COLORS.border,
              marginTop: 12,
            }}
          >
            <Building2 size={36} color={V4_COLORS.primary} strokeWidth={1.8} />
            <Text style={{ fontSize: 16, fontWeight: '700', color: V4_COLORS.textPrimary, marginTop: 12, marginBottom: 4 }}>
              No Listed Properties
            </Text>
            <Text style={{ fontSize: 13, color: V4_COLORS.textSecondary, textAlign: 'center', lineHeight: 18, marginBottom: 16 }}>
              List your flat or room to start receiving verified tenant inquiries directly with verified listing.
            </Text>
            <Pressable
              style={{ backgroundColor: V4_COLORS.primary, paddingHorizontal: 20, paddingVertical: 11, borderRadius: V4_RADIUS.button }}
              onPress={handleAddListing}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>+ Add New Listing</Text>
            </Pressable>
          </View>
        ) : (
          filteredProperties.map((item) => (
            <View key={item.id} style={styles.propertyCard}>
              <Pressable onPress={() => router.push(`/(renter)/property/${item.id}` as any)}>
                <Image source={{ uri: item.image }} style={styles.propertyImage} />
              </Pressable>

              <View style={styles.propertyBody}>
                <View style={styles.propStatusRow}>
                  <View
                    style={[
                      styles.statusTag,
                      item.status === 'ACTIVE'
                        ? styles.statusTagActive
                        : item.status === 'PAUSED'
                        ? styles.statusTagPaused
                        : styles.statusTagPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusTagText,
                        {
                          color:
                            item.status === 'ACTIVE'
                              ? '#16A34A'
                              : item.status === 'PAUSED'
                              ? '#64748B'
                              : '#D97706',
                        },
                      ]}
                    >
                      {item.status === 'ACTIVE'
                        ? '● LIVE ON REHVO'
                        : item.status === 'PAUSED'
                        ? '⏸ PAUSED'
                        : '⏳ IN REVIEW'}
                    </Text>
                  </View>
                  <Text style={styles.propRent}>{item.rent}</Text>
                </View>

                <Pressable onPress={() => router.push(`/(renter)/property/${item.id}` as any)}>
                  <Text style={styles.propTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.propLocation}>{item.location}</Text>
                </Pressable>

                {/* Engagement Stats */}
                <View style={styles.propEngagementRow}>
                  <View style={styles.engagementStat}>
                    <Eye size={13} color="#64748B" strokeWidth={2.2} />
                    <Text style={styles.engagementStatText}>{item.views} Views</Text>
                  </View>
                  <View style={styles.engagementStat}>
                    <MessageSquare size={13} color="#64748B" strokeWidth={2.2} />
                    <Text style={styles.engagementStatText}>{item.enquiries} Leads</Text>
                  </View>
                  <View style={styles.engagementStat}>
                    <Calendar size={13} color="#64748B" strokeWidth={2.2} />
                    <Text style={styles.engagementStatText}>{item.visits} Visits</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.cardActionsRow}>
                  <Pressable
                    style={styles.cardActionBtn}
                    onPress={() => handleEditProperty(item.raw)}
                  >
                    <Text style={styles.cardActionText}>Edit</Text>
                  </Pressable>

                  <Pressable
                    style={styles.cardActionBtn}
                    onPress={() => handleTogglePause(item.id, item.status)}
                  >
                    <Text style={styles.cardActionText}>
                      {item.status === 'PAUSED' ? 'Resume' : 'Pause'}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.cardActionBtn, styles.cardActionBtnPrimary]}
                    onPress={() => router.push(`/(renter)/property/${item.id}` as any)}
                  >
                    <Text style={styles.cardActionTextPrimary}>Preview</Text>
                  </Pressable>

                  <Pressable
                    style={styles.cardDeleteBtn}
                    onPress={() => handleDeleteProperty(item.id, item.title)}
                  >
                    <Trash2 size={14} color="#EF4444" strokeWidth={2.2} />
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      )}

      <V4HostPlanGateModal
        visible={gateModalVisible}
        onClose={() => setGateModalVisible(false)}
        reason={gateReason}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EEF0',
    ...V4_SHADOWS.soft,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  addListingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  addListingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  earningsCard: {
    backgroundColor: '#0F766E',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    ...V4_SHADOWS.card,
  },
  earningsTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  earningsLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.8,
  },
  earningsValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginTop: 3,
  },
  earningsMonth: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  growthText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
    marginLeft: 3,
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 16,
    paddingVertical: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  hostActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6EEF0',
    ...V4_SHADOWS.soft,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    ...V4_SHADOWS.soft,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: V4_COLORS.primary,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E6EEF0',
    marginBottom: 16,
    ...V4_SHADOWS.soft,
  },
  propertyImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#E2E8F0',
  },
  propertyBody: {
    padding: 14,
  },
  propStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusTagActive: {
    backgroundColor: '#DCFCE7',
  },
  statusTagPaused: {
    backgroundColor: '#F1F5F9',
  },
  statusTagPending: {
    backgroundColor: '#FEF3C7',
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  propRent: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  propTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  propLocation: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  propEngagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EDF4F6',
  },
  engagementStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engagementStatText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 4,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  cardActionBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardActionBtnPrimary: {
    backgroundColor: '#E6FFFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  cardDeleteBtn: {
    width: 38,
    backgroundColor: '#FEF2F2',
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  cardActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  cardActionTextPrimary: {
    fontSize: 12,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },

  /* SUBSCRIPTION CURRENT PLAN CARD */
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  subCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subPlanTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subPlanIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subPlanName: {
    fontSize: 14,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  subPlanPrice: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  subActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  subActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  subActiveBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  subUsageBarWrap: {
    gap: 6,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
  },
  subUsageTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subUsageLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  subDaysLeftText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  subProgressBarBg: {
    height: 6,
    backgroundColor: '#E2ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  subProgressBarFill: {
    height: '100%',
    backgroundColor: '#0F766E',
    borderRadius: 3,
  },
  subActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  subUpgradeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#99F6E4',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  subUpgradeBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#042F2E',
  },
  subRenewBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subRenewBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
});
