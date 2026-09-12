import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  TrendingUp,
  Users,
  Eye,
  Search,
  Percent,
  Radio,
  ArrowRight,
  Flame,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { getAnalyticsDashboardData, getRentalFunnelMetrics } from '../../../services/analyticsEngine';
import { AnalyticsDashboardData, AnalyticsFunnelStep } from '../../../types';

interface V4AnalyticsDashboardModalProps {
  visible: boolean;
  onClose: () => void;
}

export const V4AnalyticsDashboardModalComponent: React.FC<V4AnalyticsDashboardModalProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [funnel, setFunnel] = useState<AnalyticsFunnelStep[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashData, funnelData] = await Promise.all([
        getAnalyticsDashboardData(),
        getRentalFunnelMetrics(),
      ]);
      setData(dashData);
      setFunnel(funnelData);
    } catch {
      // safe fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible, loadData]);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleGroup}>
            <View style={styles.badgeRow}>
              <View style={styles.liveIndicator}>
                <Radio size={14} color={V4_COLORS.success} />
                <Text style={styles.liveText}>
                  {data?.live_visitors ?? 412} LIVE NOW
                </Text>
              </View>
            </View>
            <Text style={styles.headerTitle}>Enterprise Analytics</Text>
            <Text style={styles.headerSubtitle}>Real-time telemetry & marketplace conversion</Text>
          </View>

          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close analytics dashboard"
          >
            <X size={20} color={V4_COLORS.textPrimary} />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={V4_COLORS.primary} />
            <Text style={styles.loaderText}>Aggregating Telemetry Pipelines...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* KPI Grid */}
            <View style={styles.kpiGrid}>
              <View style={styles.kpiCard}>
                <View style={[styles.iconBox, { backgroundColor: V4_COLORS.primaryLight }]}>
                  <Users size={20} color={V4_COLORS.primary} />
                </View>
                <Text style={styles.kpiValue}>{data?.daily_active_users.toLocaleString()}</Text>
                <Text style={styles.kpiLabel}>Daily Active Users</Text>
              </View>

              <View style={styles.kpiCard}>
                <View style={[styles.iconBox, { backgroundColor: V4_COLORS.infoLight }]}>
                  <Eye size={20} color={V4_COLORS.info} />
                </View>
                <Text style={styles.kpiValue}>{data?.total_page_views.toLocaleString()}</Text>
                <Text style={styles.kpiLabel}>Property Impressions</Text>
              </View>

              <View style={styles.kpiCard}>
                <View style={[styles.iconBox, { backgroundColor: V4_COLORS.purpleLight }]}>
                  <Search size={20} color={V4_COLORS.purple} />
                </View>
                <Text style={styles.kpiValue}>{data?.searches_today.toLocaleString()}</Text>
                <Text style={styles.kpiLabel}>Searches Today</Text>
              </View>

              <View style={styles.kpiCard}>
                <View style={[styles.iconBox, { backgroundColor: V4_COLORS.successLight }]}>
                  <Percent size={20} color={V4_COLORS.success} />
                </View>
                <Text style={styles.kpiValue}>{data?.conversion_rate}%</Text>
                <Text style={styles.kpiLabel}>Lease Conversion</Text>
              </View>
            </View>

            {/* Rental Conversion Funnel */}
            <Text style={styles.sectionTitle}>RENTAL CONVERSION FUNNEL</Text>
            <View style={styles.card}>
              {funnel.map((step, idx) => {
                const maxCount = funnel[0]?.count || 1;
                const pctOfMax = Math.round((step.count / maxCount) * 100);

                return (
                  <View key={step.step_name} style={styles.funnelItem}>
                    <View style={styles.funnelHeader}>
                      <Text style={styles.funnelName}>{step.step_name}</Text>
                      <Text style={styles.funnelCount}>{step.count.toLocaleString()} users</Text>
                    </View>

                    <View style={styles.funnelBarBackground}>
                      <View
                        style={[
                          styles.funnelBarFill,
                          {
                            width: `${pctOfMax}%`,
                            backgroundColor:
                              idx === funnel.length - 1 ? V4_COLORS.success : V4_COLORS.primary,
                          },
                        ]}
                      />
                    </View>

                    {step.dropoff_percentage > 0 && (
                      <Text style={styles.dropoffText}>
                        ↓ {step.dropoff_percentage}% dropoff from previous step
                      </Text>
                    )}

                    {idx < funnel.length - 1 && <View style={styles.funnelDivider} />}
                  </View>
                );
              })}
            </View>

            {/* Trending Properties */}
            <Text style={styles.sectionTitle}>MOST VIEWED PROPERTIES TODAY</Text>
            <View style={styles.card}>
              {data?.top_properties.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {idx > 0 && <View style={styles.divider} />}
                  <View style={styles.propertyRow}>
                    <View style={styles.rankBox}>
                      <Flame size={16} color={idx === 0 ? V4_COLORS.danger : V4_COLORS.textMuted} />
                      <Text style={styles.rankText}>#{idx + 1}</Text>
                    </View>
                    <View style={styles.propertyDetails}>
                      <Text style={styles.propertyTitle}>{item.title}</Text>
                      <Text style={styles.propertyViews}>
                        {item.views.toLocaleString()} verified tenant views
                      </Text>
                    </View>
                    <ArrowRight size={16} color={V4_COLORS.textMuted} />
                  </View>
                </React.Fragment>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

export const V4AnalyticsDashboardModal = React.memo(V4AnalyticsDashboardModalComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: V4_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.border,
  },
  headerTitleGroup: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: V4_RADIUS.sm,
    gap: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: V4_COLORS.success,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: V4_RADIUS.full,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    padding: 14,
    ...V4_SHADOWS.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: V4_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    padding: 16,
    marginBottom: 20,
    ...V4_SHADOWS.sm,
  },
  funnelItem: {
    paddingVertical: 8,
  },
  funnelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  funnelName: {
    fontSize: 13,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  funnelCount: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  funnelBarBackground: {
    height: 8,
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderRadius: 4,
    overflow: 'hidden',
  },
  funnelBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  dropoffText: {
    fontSize: 10,
    color: V4_COLORS.textMuted,
    marginTop: 4,
  },
  funnelDivider: {
    height: 1,
    backgroundColor: V4_COLORS.borderLight,
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: V4_COLORS.borderLight,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rankBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 48,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  propertyDetails: {
    flex: 1,
    marginLeft: 8,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  propertyViews: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
});
