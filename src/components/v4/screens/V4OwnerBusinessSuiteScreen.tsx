import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Building2,
  TrendingUp,
  Percent,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  DollarSign,
  Clock,
  Send,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import {
  getOwnerPortfolioSummary,
  getOwnerPropertyPerformances,
  getUpcomingLeaseRenewals,
  sendLeaseRenewalRequest,
  OwnerPortfolioSummary,
  UpcomingLeaseRenewal,
} from '../../../services/ownerBusinessSuite';
import { OwnerPropertyPerformance } from '../../../types';

export const V4OwnerBusinessSuiteScreenComponent: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, showToast } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<OwnerPortfolioSummary | null>(null);
  const [properties, setProperties] = useState<OwnerPropertyPerformance[]>([]);
  const [renewals, setRenewals] = useState<UpcomingLeaseRenewal[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sum, props, ren] = await Promise.all([
        getOwnerPortfolioSummary(user?.id),
        getOwnerPropertyPerformances(user?.id),
        getUpcomingLeaseRenewals(user?.id),
      ]);
      setSummary(sum);
      setProperties(props);
      setRenewals(ren);
    } catch {
      // safe fallback
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSendRenewal = useCallback(
    async (leaseId: string, currentRent: number, title: string) => {
      const proposedRent = Math.round(currentRent * 1.05); // 5% escalation
      const success = await sendLeaseRenewalRequest(leaseId, proposedRent);
      if (success) {
        setRenewals((prev) =>
          prev.map((r) => (r.leaseId === leaseId ? { ...r, status: 'renewal_sent' } : r))
        );
        showToast(`Renewal proposal (₹${proposedRent.toLocaleString()}) sent for ${title}!`, 'success');
      }
    },
    [showToast]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Owner Business Suite</Text>
          <Text style={styles.headerSubtitle}>Portfolio Yield, Occupancy & Vacancy OS</Text>
        </View>
        <View style={styles.headerBadge}>
          <Briefcase size={18} color={V4_COLORS.primary} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={V4_COLORS.primary} />
          <Text style={styles.loaderText}>Calculating Portfolio Economics...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Executive Portfolio Banner */}
          <View style={styles.portfolioBanner}>
            <View style={styles.bannerRow}>
              <View>
                <Text style={styles.bannerSubtitle}>ANNUAL RENTAL REVENUE (YTD)</Text>
                <Text style={styles.bannerAmount}>
                  ₹{(summary?.totalRevenueYTD || 2840000).toLocaleString()}
                </Text>
              </View>
              <View style={styles.occupancyPill}>
                <Text style={styles.occupancyPillText}>
                  {summary?.occupancyRate}% OCCUPIED
                </Text>
              </View>
            </View>

            <View style={styles.bannerDivider} />

            <View style={styles.bannerStatsRow}>
              <View style={styles.bannerStat}>
                <Text style={styles.statLabel}>Gross Yield</Text>
                <Text style={styles.statValue}>{summary?.grossAnnualYield}%</Text>
              </View>

              <View style={styles.bannerStat}>
                <Text style={styles.statLabel}>Net Yield</Text>
                <Text style={[styles.statValue, { color: V4_COLORS.primaryLight }]}>
                  {summary?.netAnnualYield}%
                </Text>
              </View>

              <View style={styles.bannerStat}>
                <Text style={styles.statLabel}>Active Properties</Text>
                <Text style={styles.statValue}>
                  {summary?.occupiedProperties} / {summary?.totalProperties}
                </Text>
              </View>
            </View>
          </View>

          {/* Lease Renewal Radar */}
          {renewals.length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeader}>LEASE RENEWAL RADAR</Text>
                <View style={styles.alertBadge}>
                  <AlertCircle size={12} color={V4_COLORS.warning} />
                  <Text style={styles.alertBadgeText}>{renewals.length} Action Needed</Text>
                </View>
              </View>

              <View style={styles.card}>
                {renewals.map((item, idx) => (
                  <React.Fragment key={item.leaseId}>
                    {idx > 0 && <View style={styles.divider} />}
                    <View style={styles.renewalRow}>
                      <View style={styles.renewalInfo}>
                        <Text style={styles.renewalTitle}>{item.propertyTitle}</Text>
                        <Text style={styles.renewalTenant}>
                          Tenant: {item.tenantName} • Rent: ₹{item.currentRent.toLocaleString()}/mo
                        </Text>
                        <View style={styles.expiryTag}>
                          <Clock size={12} color={V4_COLORS.danger} />
                          <Text style={styles.expiryTagText}>
                            Expires in {item.daysRemaining} days ({new Date(item.expiryDate).toLocaleDateString()})
                          </Text>
                        </View>
                      </View>

                      {item.status === 'renewal_sent' ? (
                        <View style={styles.sentPill}>
                          <CheckCircle2 size={14} color={V4_COLORS.success} />
                          <Text style={styles.sentPillText}>Offer Sent</Text>
                        </View>
                      ) : (
                        <Pressable
                          style={styles.renewButton}
                          onPress={() =>
                            handleSendRenewal(item.leaseId, item.currentRent, item.propertyTitle)
                          }
                          accessibilityRole="button"
                        >
                          <Send size={14} color={V4_COLORS.textWhite} />
                          <Text style={styles.renewButtonText}>Offer 5% +</Text>
                        </Pressable>
                      )}
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}

          {/* Property Economics Breakdown */}
          <Text style={styles.sectionHeader}>PORTFOLIO PROPERTY PERFORMANCE</Text>
          <View style={styles.card}>
            {properties.map((prop, idx) => (
              <React.Fragment key={prop.property_id}>
                {idx > 0 && <View style={styles.divider} />}
                <View style={styles.propRow}>
                  <View style={styles.propHeader}>
                    <View style={styles.propTitleGroup}>
                      <Text style={styles.propTitle}>{prop.title}</Text>
                      <Text style={styles.propLoc}>{prop.locality}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusTag,
                        {
                          backgroundColor:
                            prop.status === 'occupied'
                              ? V4_COLORS.successLight
                              : V4_COLORS.warningLight,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusTagText,
                          {
                            color:
                              prop.status === 'occupied'
                                ? V4_COLORS.success
                                : V4_COLORS.warning,
                          },
                        ]}
                      >
                        {prop.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.propMetricsGrid}>
                    <View style={styles.propMetric}>
                      <Text style={styles.propMetricLabel}>Monthly Rent</Text>
                      <Text style={styles.propMetricValue}>₹{prop.rent.toLocaleString()}</Text>
                    </View>

                    <View style={styles.propMetric}>
                      <Text style={styles.propMetricLabel}>Net Yield</Text>
                      <Text style={[styles.propMetricValue, { color: V4_COLORS.primary }]}>
                        {prop.net_yield}%
                      </Text>
                    </View>

                    <View style={styles.propMetric}>
                      <Text style={styles.propMetricLabel}>YTD Revenue</Text>
                      <Text style={styles.propMetricValue}>
                        ₹{(prop.total_revenue_ytd / 1000).toFixed(0)}k
                      </Text>
                    </View>

                    <View style={styles.propMetric}>
                      <Text style={styles.propMetricLabel}>Predicted Vacancy</Text>
                      <Text
                        style={[
                          styles.propMetricValue,
                          {
                            color:
                              prop.vacancy_days_predicted > 0
                                ? V4_COLORS.danger
                                : V4_COLORS.textSecondary,
                          },
                        ]}
                      >
                        {prop.vacancy_days_predicted > 0 ? `${prop.vacancy_days_predicted} days` : '0 days'}
                      </Text>
                    </View>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export const V4OwnerBusinessSuiteScreen = React.memo(V4OwnerBusinessSuiteScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: V4_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.border,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: V4_RADIUS.full,
    backgroundColor: V4_COLORS.surfaceSubtle,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  headerBadge: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: V4_COLORS.primaryLight,
    borderRadius: V4_RADIUS.full,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: V4_COLORS.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  portfolioBanner: {
    backgroundColor: V4_COLORS.emeraldDark,
    borderRadius: V4_RADIUS.xl,
    padding: 20,
    marginBottom: 24,
    ...V4_SHADOWS.md,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bannerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.8,
  },
  bannerAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: V4_COLORS.textWhite,
    marginTop: 4,
  },
  occupancyPill: {
    backgroundColor: 'rgba(204, 251, 241, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: V4_RADIUS.full,
  },
  occupancyPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.primaryLight,
  },
  bannerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 16,
  },
  bannerStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bannerStat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textWhite,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: V4_RADIUS.sm,
    gap: 4,
  },
  alertBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.warning,
  },
  card: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    paddingHorizontal: 16,
    marginBottom: 20,
    ...V4_SHADOWS.sm,
  },
  divider: {
    height: 1,
    backgroundColor: V4_COLORS.borderLight,
  },
  renewalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  renewalInfo: {
    flex: 1,
    marginRight: 12,
  },
  renewalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  renewalTenant: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  expiryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  expiryTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: V4_COLORS.danger,
  },
  renewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 12,
    borderRadius: V4_RADIUS.md,
    gap: 6,
  },
  renewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
  sentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.successLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: V4_RADIUS.md,
    gap: 4,
  },
  sentPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.success,
  },
  propRow: {
    paddingVertical: 16,
  },
  propHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  propTitleGroup: {
    flex: 1,
  },
  propTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  propLoc: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: V4_RADIUS.sm,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  propMetricsGrid: {
    flexDirection: 'row',
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderRadius: V4_RADIUS.md,
    padding: 10,
  },
  propMetric: {
    flex: 1,
  },
  propMetricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
    marginBottom: 2,
  },
  propMetricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
});
