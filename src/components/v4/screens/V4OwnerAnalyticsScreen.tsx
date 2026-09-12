import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Calendar,
  Users,
  Award,
  MapPin,
  Download,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Building2,
} from 'lucide-react-native';
import { AnalyticsTimeFilter } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { ownerEcosystemService } from '../../../services/ownerEcosystem';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface V4OwnerAnalyticsScreenProps {
  hideHeader?: boolean;
}

export const V4OwnerAnalyticsScreen: React.FC<V4OwnerAnalyticsScreenProps> = ({
  hideHeader = false,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast, myProperties, tenantLeads, fetchMyProperties } = useAppStore();

  const [timeFilter, setTimeFilter] = useState<AnalyticsTimeFilter>('30d');
  const [activeMetric, setActiveMetric] = useState<'views' | 'saves' | 'leads'>('views');
  const [refreshing, setRefreshing] = useState(false);

  const analyticsData = ownerEcosystemService.getPortfolioAnalytics(
    myProperties,
    tenantLeads,
    timeFilter
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMyProperties();
    setRefreshing(false);
  };

  const handleExport = () => {
    showToast?.('Exporting portfolio report (PDF & CSV)...', 'info');
    setTimeout(() => {
      showToast?.('Portfolio analytics report downloaded', 'success');
    }, 1200);
  };

  const activeTimeline =
    activeMetric === 'views'
      ? analyticsData.viewsTimeline
      : activeMetric === 'saves'
      ? analyticsData.savesTimeline
      : analyticsData.leadsTimeline;

  const maxVal = Math.max(...activeTimeline.map((t) => t.value), 1);

  return (
    <View style={[styles.container, !hideHeader && { paddingTop: insets.top }]}>
      {/* Top Header */}
      {!hideHeader && (
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
          </Pressable>
          <View style={styles.topNavCenter}>
            <Text style={styles.topNavTitle}>Property Analytics</Text>
            <Text style={styles.topNavSub}>Traffic, Leads & Occupancy</Text>
          </View>
          <Pressable style={styles.exportBtn} onPress={handleExport}>
            <Download size={18} color="#0F766E" />
          </Pressable>
        </View>
      )}

      {/* Time Filters */}
      <View style={styles.timeFiltersRow}>
        {(['7d', '30d', '90d', '1y'] as AnalyticsTimeFilter[]).map((f) => (
          <Pressable
            key={f}
            style={[styles.timeFilterPill, timeFilter === f && styles.timeFilterPillActive]}
            onPress={() => setTimeFilter(f)}
          >
            <Text
              style={[
                styles.timeFilterText,
                timeFilter === f && styles.timeFilterTextActive,
              ]}
            >
              {f === '7d'
                ? '7 Days'
                : f === '30d'
                ? '30 Days'
                : f === '90d'
                ? '90 Days'
                : '1 Year'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0F766E" />
        }
      >
        {/* ===================================================================
            1. KPI SUMMARY HIGHLIGHTS
           =================================================================== */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <View style={styles.kpiTopRow}>
              <Text style={styles.kpiLabel}>Lead Conversion</Text>
              <TrendingUp size={14} color="#059669" />
            </View>
            <Text style={styles.kpiVal}>{analyticsData.conversionRate}%</Text>
            <Text style={styles.kpiSub}>+1.4% vs city avg</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={styles.kpiTopRow}>
              <Text style={styles.kpiLabel}>Occupancy Rate</Text>
              <ShieldCheck size={14} color="#0284C7" />
            </View>
            <Text style={styles.kpiVal}>{analyticsData.occupancyRate}%</Text>
            <Text style={styles.kpiSub}>3 of 4 units rented</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={styles.kpiTopRow}>
              <Text style={styles.kpiLabel}>Portfolio Yield</Text>
              <Sparkles size={14} color="#D97706" />
            </View>
            <Text style={styles.kpiVal}>
              ₹{(analyticsData.totalEarnings / 1000).toFixed(0)}k
            </Text>
            <Text style={styles.kpiSub}>Monthly Rent</Text>
          </View>
        </View>

        {/* ===================================================================
            2. INTERACTIVE TREND CHART
           =================================================================== */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>PERFORMANCE TIMELINE</Text>
            <View style={styles.metricSwitcherRow}>
              {(['views', 'saves', 'leads'] as const).map((m) => (
                <Pressable
                  key={m}
                  style={[
                    styles.metricSwitchBtn,
                    activeMetric === m && styles.metricSwitchBtnActive,
                  ]}
                  onPress={() => setActiveMetric(m)}
                >
                  <Text
                    style={[
                      styles.metricSwitchTxt,
                      activeMetric === m && styles.metricSwitchTxtActive,
                    ]}
                  >
                    {m.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Bar Chart Bars */}
          <View style={styles.barsContainer}>
            {activeTimeline.map((item, idx) => {
              const heightPct = Math.max((item.value / maxVal) * 100, 10);

              return (
                <View key={idx} style={styles.barCol}>
                  <Text style={styles.barValText}>{item.value}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${heightPct}%` }]} />
                  </View>
                  <Text style={styles.barLabelText}>{item.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ===================================================================
            3. TOP PERFORMING PROPERTY SPOTLIGHT
           =================================================================== */}
        <Text style={styles.sectionHeading}>TOP PERFORMING PROPERTY</Text>
        <View style={styles.topPropCard}>
          <View style={styles.topPropBadge}>
            <Award size={14} color="#D97706" />
            <Text style={styles.topPropBadgeTxt}>#1 MOST VIEWED LISTING</Text>
          </View>

          <Text style={styles.topPropTitle}>{analyticsData.topProperty.title}</Text>
          <View style={styles.topPropLocRow}>
            <MapPin size={13} color="#64748B" />
            <Text style={styles.topPropLocTxt}>{analyticsData.topProperty.locality}</Text>
          </View>

          <View style={styles.topPropStatsRow}>
            <View style={styles.topPropStat}>
              <Text style={styles.topPropStatVal}>
                {analyticsData.topProperty.views.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.topPropStatLbl}>Views</Text>
            </View>
            <View style={styles.topPropStat}>
              <Text style={styles.topPropStatVal}>{analyticsData.topProperty.leads}</Text>
              <Text style={styles.topPropStatLbl}>Leads</Text>
            </View>
            <View style={styles.topPropStat}>
              <Text style={styles.topPropStatVal}>
                ₹{analyticsData.topProperty.rent.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.topPropStatLbl}>Rent/mo</Text>
            </View>
          </View>
        </View>

        {/* ===================================================================
            4. POPULAR LOCALITY BENCHMARK
           =================================================================== */}
        <Text style={styles.sectionHeading}>LOCALITY BENCHMARK</Text>
        <View style={styles.localityCard}>
          <View style={styles.localityTopRow}>
            <View>
              <Text style={styles.localityName}>{analyticsData.popularLocality.name}</Text>
              <Text style={styles.localityDemand}>
                {analyticsData.popularLocality.demand}
              </Text>
            </View>
            <View style={styles.localityScoreBox}>
              <Text style={styles.localityScoreVal}>
                {analyticsData.popularLocality.score}
              </Text>
              <Text style={styles.localityScoreLbl}>Score</Text>
            </View>
          </View>
          <Text style={styles.localityDesc}>
            Properties in this pocket rent 3.2x faster than average Mumbai listings. Keeping pricing within ₹95,000 ensures maximum tenant quality.
          </Text>
        </View>
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
  topNavCenter: {
    alignItems: 'center',
  },
  topNavTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  topNavSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  exportBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeFiltersRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  timeFilterPill: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  timeFilterPillActive: {
    backgroundColor: '#064E3B',
  },
  timeFilterText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  timeFilterTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // KPI Grid
  kpiGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  kpiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  kpiVal: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    marginTop: 6,
  },
  kpiSub: {
    fontSize: 9.5,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },

  // Chart
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  metricSwitcherRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  metricSwitchBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metricSwitchBtnActive: {
    backgroundColor: '#064E3B',
  },
  metricSwitchTxt: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
  },
  metricSwitchTxtActive: {
    color: '#FFFFFF',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 20,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    gap: 4,
  },
  barValText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  barTrack: {
    width: 22,
    height: 90,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#064E3B',
    borderRadius: 6,
  },
  barLabelText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },

  // Section
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },

  // Top Prop
  topPropCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  topPropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  topPropBadgeTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  topPropTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  topPropLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  topPropLocTxt: {
    fontSize: 12,
    color: '#64748B',
  },
  topPropStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  topPropStat: {
    alignItems: 'center',
  },
  topPropStatVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#064E3B',
  },
  topPropStatLbl: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },

  // Locality
  localityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  localityTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  localityName: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  localityDemand: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2,
  },
  localityScoreBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  localityScoreVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#065F46',
  },
  localityScoreLbl: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#065F46',
  },
  localityDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginTop: 12,
  },
});
