import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Phone,
  MessageSquare,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Clock,
  CheckCircle2,
  Share2,
  Calendar,
  IndianRupee,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS, V4_RADIUS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface V4BrokerDashboardScreenProps {
  hideHeader?: boolean;
}

export const V4BrokerDashboardScreen: React.FC<V4BrokerDashboardScreenProps> = ({
  hideHeader = false,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    brokerProfile,
    brokerMetrics,
    brokerClients,
    showToast,
  } = useAppStore();

  const [filterPeriod, setFilterPeriod] = useState<'this_month' | 'quarter' | 'all'>('this_month');

  const agencyName =
    brokerProfile?.agency_name ||
    brokerProfile?.company_name ||
    (user?.name ? `${user?.name}'s Agency` : 'Prime Realty Partners');
  const operatingCity = brokerProfile?.operating_city || 'Mumbai';
  const isReraVerified = brokerProfile?.is_rera_verified ?? brokerProfile?.verified ?? true;
  const reraNumber = brokerProfile?.rera_number || 'A51800098762';

  const activeDeals = brokerMetrics?.active_deals_count ?? brokerMetrics?.active_deals ?? 4;
  const totalProperties = brokerMetrics?.active_inventory_count ?? brokerMetrics?.total_properties ?? 14;
  const closedDeals = brokerMetrics?.closed_deals ?? 12;

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      showToast('Could not initiate call', 'error');
    });
  };

  const handleShareCatalog = () => {
    showToast('Broker catalog link copied to clipboard!', 'success');
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom + 110 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. AGENCY IDENTITY HERO BANNER */}
      <View style={styles.agencyHeroCard}>
        <View style={styles.agencyHeroTop}>
          <View style={styles.agencyAvatarBox}>
            <Building2 size={26} color="#FFFFFF" strokeWidth={2.4} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroRolePill}>
                <Text style={styles.heroRolePillText}>RERA CERTIFIED AGENT</Text>
              </View>
              {isReraVerified && (
                <View style={styles.verifiedTag}>
                  <ShieldCheck size={12} color="#D1FAE5" />
                  <Text style={styles.verifiedTagText}>VERIFIED</Text>
                </View>
              )}
            </View>
            <Text style={styles.agencyHeroName} numberOfLines={1}>
              {agencyName}
            </Text>
            <Text style={styles.agencyHeroLoc}>
              {operatingCity} • MahaRERA: {reraNumber}
            </Text>
          </View>
        </View>

        {/* Quick Agency Stats Strip */}
        <View style={styles.heroStatsStrip}>
          <View style={styles.heroStatUnit}>
            <Text style={styles.heroStatValue}>₹4.8 Cr</Text>
            <Text style={styles.heroStatTitle}>Active Pipeline</Text>
          </View>
          <View style={styles.heroStatSep} />
          <View style={styles.heroStatUnit}>
            <Text style={styles.heroStatValue}>{activeDeals}</Text>
            <Text style={styles.heroStatTitle}>Deals In Progress</Text>
          </View>
          <View style={styles.heroStatSep} />
          <View style={styles.heroStatUnit}>
            <Text style={styles.heroStatValue}>₹4.85 L</Text>
            <Text style={styles.heroStatTitle}>Est. Commission</Text>
          </View>
        </View>
      </View>

      {/* 2. QUICK ACTION LAUNCHPAD */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <View style={styles.quickActionRow}>
        <Pressable
          style={styles.quickActionCard}
          onPress={() => router.push('/(broker)/inventory' as any)}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#ECFDF5' }]}>
            <Building2 size={20} color="#059669" />
          </View>
          <Text style={styles.actionCardTitle}>Add Listing</Text>
          <Text style={styles.actionCardSub}>Upload exclusive property</Text>
        </Pressable>

        <Pressable
          style={styles.quickActionCard}
          onPress={() => router.push('/(broker)/clients' as any)}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#EDE9FE' }]}>
            <Users size={20} color="#5B21B6" />
          </View>
          <Text style={styles.actionCardTitle}>Add Client</Text>
          <Text style={styles.actionCardSub}>New buyer/tenant lead</Text>
        </Pressable>

        <Pressable
          style={styles.quickActionCard}
          onPress={handleShareCatalog}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7' }]}>
            <Share2 size={20} color="#B45309" />
          </View>
          <Text style={styles.actionCardTitle}>Share Catalog</Text>
          <Text style={styles.actionCardSub}>Send to WhatsApp</Text>
        </Pressable>
      </View>

      {/* 3. PERFORMANCE METRICS GRID */}
      <View style={styles.sectionHeaderWithAction}>
        <Text style={styles.sectionTitle}>Pipeline Overview</Text>
        <View style={styles.periodPillGroup}>
          <Pressable
            style={[styles.periodPill, filterPeriod === 'this_month' && styles.periodPillActive]}
            onPress={() => setFilterPeriod('this_month')}
          >
            <Text
              style={[
                styles.periodPillTxt,
                filterPeriod === 'this_month' && styles.periodPillTxtActive,
              ]}
            >
              This Month
            </Text>
          </Pressable>
          <Pressable
            style={[styles.periodPill, filterPeriod === 'all' && styles.periodPillActive]}
            onPress={() => setFilterPeriod('all')}
          >
            <Text
              style={[
                styles.periodPillTxt,
                filterPeriod === 'all' && styles.periodPillTxtActive,
              ]}
            >
              All Time
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        {/* Metric 1 */}
        <View style={styles.metricCard}>
          <View style={styles.metricTop}>
            <View style={[styles.metricIconWrap, { backgroundColor: '#F0FDF4' }]}>
              <TrendingUp size={18} color="#16A34A" />
            </View>
            <View style={styles.trendPill}>
              <ArrowUpRight size={12} color="#16A34A" />
              <Text style={styles.trendText}>+18.4%</Text>
            </View>
          </View>
          <Text style={styles.metricValue}>₹4,85,000</Text>
          <Text style={styles.metricLabel}>Projected Revenue</Text>
        </View>

        {/* Metric 2 */}
        <View style={styles.metricCard}>
          <View style={styles.metricTop}>
            <View style={[styles.metricIconWrap, { backgroundColor: '#F5F3FF' }]}>
              <Building2 size={18} color="#7C3AED" />
            </View>
            <View style={styles.trendPill}>
              <Text style={styles.trendText}>14 Units</Text>
            </View>
          </View>
          <Text style={styles.metricValue}>{totalProperties}</Text>
          <Text style={styles.metricLabel}>Managed Properties</Text>
        </View>

        {/* Metric 3 */}
        <View style={styles.metricCard}>
          <View style={styles.metricTop}>
            <View style={[styles.metricIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <Users size={18} color="#2563EB" />
            </View>
            <View style={styles.trendPill}>
              <Text style={styles.trendText}>Active CRM</Text>
            </View>
          </View>
          <Text style={styles.metricValue}>{brokerClients.length}</Text>
          <Text style={styles.metricLabel}>Total Buyer Leads</Text>
        </View>

        {/* Metric 4 */}
        <View style={styles.metricCard}>
          <View style={styles.metricTop}>
            <View style={[styles.metricIconWrap, { backgroundColor: '#FEF2F2' }]}>
              <CheckCircle2 size={18} color="#DC2626" />
            </View>
            <View style={styles.trendPill}>
              <Text style={styles.trendText}>92% Rate</Text>
            </View>
          </View>
          <Text style={styles.metricValue}>{closedDeals}</Text>
          <Text style={styles.metricLabel}>Closed Agreements</Text>
        </View>
      </View>

      {/* 4. ACTIVE DEALS IN PROGRESS PIPELINE */}
      <View style={styles.sectionHeaderWithAction}>
        <Text style={styles.sectionTitle}>Active Deals In Progress</Text>
        <Pressable onPress={() => router.push('/(broker)/clients' as any)}>
          <Text style={styles.sectionActionText}>View Kanban →</Text>
        </Pressable>
      </View>

      <View style={styles.dealsList}>
        {[
          {
            id: 'deal-1',
            clientName: 'Vikram Malhotra',
            property: '3 BHK Sea Face, Bandra West',
            amount: '₹1,85,000 / mo',
            stage: 'Site Visit Confirmed',
            stageColor: '#0284C7',
            stageBg: '#E0F2FE',
            time: 'Today, 4:30 PM',
          },
          {
            id: 'deal-2',
            clientName: 'Pooja Singhania',
            property: '4 BHK Duplex, Worli Sea Face',
            amount: '₹3,40,000 / mo',
            stage: 'Token & Negotiation',
            stageColor: '#D97706',
            stageBg: '#FEF3C7',
            time: 'Tomorrow, 11:00 AM',
          },
          {
            id: 'deal-3',
            clientName: 'Rohan Mehra',
            property: '2 BHK Modern, Hiranandani Powai',
            amount: '₹95,000 / mo',
            stage: 'E-Lease Registration',
            stageColor: '#059669',
            stageBg: '#D1FAE5',
            time: 'Sep 10, 2:00 PM',
          },
        ].map((deal) => (
          <View key={deal.id} style={styles.dealCard}>
            <View style={styles.dealCardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.dealClientName}>{deal.clientName}</Text>
                <Text style={styles.dealPropName} numberOfLines={1}>
                  {deal.property}
                </Text>
              </View>
              <View style={[styles.stagePill, { backgroundColor: deal.stageBg }]}>
                <Text style={[styles.stagePillText, { color: deal.stageColor }]}>
                  {deal.stage}
                </Text>
              </View>
            </View>

            <View style={styles.dealDivider} />

            <View style={styles.dealFooter}>
              <View style={styles.dealTimeCol}>
                <Clock size={13} color="#64748B" />
                <Text style={styles.dealTimeTxt}>{deal.time}</Text>
              </View>
              <Text style={styles.dealAmountTxt}>{deal.amount}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 5. RECENT HIGH-INTENT CLIENT LEADS */}
      <View style={styles.sectionHeaderWithAction}>
        <Text style={styles.sectionTitle}>Recent Buyer & Tenant Leads</Text>
        <Pressable onPress={() => router.push('/(broker)/clients' as any)}>
          <Text style={styles.sectionActionText}>All Leads ({brokerClients.length})</Text>
        </Pressable>
      </View>

      <View style={styles.leadsContainer}>
        {brokerClients.slice(0, 3).map((client) => (
          <View key={client.id} style={styles.leadCard}>
            <View style={styles.leadTopRow}>
              <Image
                source={{
                  uri:
                    client.client_avatar ||
                    client.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                }}
                style={styles.leadAvatar}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.leadName}>{client.client_name}</Text>
                  {client.is_verified && (
                    <ShieldCheck size={14} color="#059669" strokeWidth={2.5} />
                  )}
                </View>
                <Text style={styles.leadRequirement}>
                  {client.requirement}
                </Text>
                <Text style={styles.leadBudget}>
                  Budget: ₹{(client.budget_min / 1000).toFixed(0)}k - ₹{(client.budget_max / 1000).toFixed(0)}k/mo
                </Text>
              </View>
            </View>

            <View style={styles.leadBtnRow}>
              <Pressable
                style={styles.leadContactBtn}
                onPress={() => handleCall(client.client_phone)}
              >
                <Phone size={14} color="#065F46" />
                <Text style={styles.leadContactBtnTxt}>Call Client</Text>
              </Pressable>

              <Pressable
                style={[styles.leadContactBtn, styles.leadChatBtn]}
                onPress={() => router.push('/(broker)/messages' as any)}
              >
                <MessageSquare size={14} color="#5B21B6" />
                <Text style={[styles.leadContactBtnTxt, { color: '#5B21B6' }]}>
                  Send Proposal
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
  },
  agencyHeroCard: {
    backgroundColor: '#064E3B',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    ...V4_SHADOWS.card,
  },
  agencyHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  agencyAvatarBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  heroRolePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  heroRolePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A7F3D0',
    letterSpacing: 0.6,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#047857',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  agencyHeroName: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  agencyHeroLoc: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 2,
  },
  heroStatsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  heroStatUnit: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroStatTitle: {
    fontSize: 10,
    color: '#D1FAE5',
    fontWeight: '600',
    marginTop: 2,
  },
  heroStatSep: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionCardSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 14,
  },
  periodPillGroup: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  periodPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  periodPillActive: {
    backgroundColor: '#FFFFFF',
    ...V4_SHADOWS.soft,
  },
  periodPillTxt: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  periodPillTxtActive: {
    color: '#064E3B',
    fontWeight: '800',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  metricCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  dealsList: {
    gap: 10,
    marginBottom: 20,
  },
  dealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  dealCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  dealClientName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  dealPropName: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  stagePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stagePillText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  dealDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealTimeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dealTimeTxt: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  dealAmountTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#064E3B',
  },
  leadsContainer: {
    gap: 10,
  },
  leadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  leadTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  leadName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  leadRequirement: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  leadBudget: {
    fontSize: 11.5,
    color: '#0F766E',
    fontWeight: '700',
    marginTop: 2,
  },
  leadBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  leadContactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  leadChatBtn: {
    backgroundColor: '#FAF5FF',
    borderColor: '#F3E8FF',
  },
  leadContactBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
});
