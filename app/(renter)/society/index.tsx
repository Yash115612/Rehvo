import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  RefreshControl,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  UserCheck,
  Truck,
  FileText,
  AlertCircle,
  Bell,
  Calendar,
  PhoneCall,
  QrCode,
  Clock,
  ChevronRight,
  CheckCircle2,
  Building,
  Key,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../src/theme/v4Theme';
import { triggerHapticFeedback } from '../../../src/utils/haptics';

export default function SocietyDashboardRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    properties,
    leaseAgreements,
    visitorPasses,
    deliveryPasses,
    societyNotices,
    maintenancePayments,
    fetchVisitorPasses,
    fetchDeliveryPasses,
    fetchSocietyNotices,
    fetchMaintenancePayments,
    fetchSocietyComplaints,
    showToast,
  } = useAppStore();

  const [refreshing, setRefreshing] = useState(false);

  const activeLease = useMemo(
    () => leaseAgreements?.find((l) => l.status === 'active') || leaseAgreements?.[0],
    [leaseAgreements]
  );
  const activeProperty = useMemo(
    () => properties?.find((p) => p.id === activeLease?.property_id) || properties?.[0],
    [properties, activeLease]
  );

  const societyName = activeProperty?.society_name || activeProperty?.title || 'Prestige Green Gables';
  const unitNumber = activeProperty?.unit_number || 'Tower 4 - Flat 1204';

  useEffect(() => {
    fetchVisitorPasses();
    fetchDeliveryPasses();
    fetchSocietyNotices(societyName);
    fetchMaintenancePayments();
    fetchSocietyComplaints(societyName);
  }, [societyName]);

  const onRefresh = async () => {
    setRefreshing(true);
    triggerHapticFeedback('impactLight');
    await Promise.all([
      fetchVisitorPasses(),
      fetchDeliveryPasses(),
      fetchSocietyNotices(societyName),
      fetchMaintenancePayments(),
    ]);
    setRefreshing(false);
  };

  // Active passes
  const activeVisitorPass = visitorPasses?.find((p) => p.status === 'approved');
  const activeDeliveryPass = deliveryPasses?.find((p) => p.status === 'approved');

  // Pinned or recent notice
  const latestNotice = societyNotices?.[0];

  const quickActions = [
    {
      id: 'visitor',
      title: 'Visitor Pass',
      desc: 'Instant QR & 6-digit entry PIN',
      icon: UserCheck,
      color: '#0F766E',
      bg: '#F0FDFA',
      badge: visitorPasses?.filter((p) => p.status === 'approved').length || 0,
      route: '/(renter)/society/visitor-pass',
    },
    {
      id: 'delivery',
      title: 'Delivery Pass',
      desc: 'Swiggy, Blinkit, Amazon 1-tap pass',
      icon: Truck,
      color: '#0284C7',
      bg: '#F0F9FF',
      badge: deliveryPasses?.filter((p) => p.status === 'approved').length || 0,
      route: '/(renter)/society/delivery-pass',
    },
    {
      id: 'maintenance',
      title: 'Maintenance',
      desc: 'CAM, water bill & payment ledger',
      icon: FileText,
      color: '#D97706',
      bg: '#FFFBEB',
      badge: maintenancePayments?.filter((p) => p.payment_status === 'pending').length || 'Due',
      route: '/(renter)/society/maintenance',
    },
    {
      id: 'complaints',
      title: 'Complaints',
      desc: 'Raise ticket to society committee',
      icon: AlertCircle,
      color: '#E11D48',
      bg: '#FFF1F2',
      route: '/(renter)/society/complaints',
    },
    {
      id: 'notices',
      title: 'Notice Board',
      desc: 'Circulars, AGM & water updates',
      icon: Bell,
      color: '#8B5CF6',
      bg: '#F5F3FF',
      badge: societyNotices?.length || 0,
      route: '/(renter)/society/notices',
    },
    {
      id: 'amenities',
      title: 'Amenities',
      desc: 'Book pool, gym, clubhouse & courts',
      icon: Calendar,
      color: '#10B981',
      bg: '#ECFDF5',
      route: '/(renter)/society/amenities',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            triggerHapticFeedback('selection');
            if (router.canGoBack()) router.back();
            else router.push('/(renter)' as any);
          }}
          hitSlop={12}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </Pressable>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Society Services</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {societyName}
          </Text>
        </View>

        {/* SOS Quick Button */}
        <Pressable
          style={styles.sosHeaderBtn}
          onPress={() => {
            triggerHapticFeedback('impactHeavy');
            router.push('/(renter)/society/sos' as any);
          }}
          hitSlop={8}
        >
          <ShieldAlert size={18} color="#FFFFFF" />
          <Text style={styles.sosHeaderBtnText}>SOS</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0F766E" />}
      >
        {/* Residence Card */}
        <View style={styles.societyHeroCard}>
          <View style={styles.societyHeroContent}>
            <View style={styles.societyHeroIconBox}>
              <Building size={24} color="#0F766E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.societyHeroName} numberOfLines={1}>{societyName}</Text>
              <Text style={styles.societyHeroUnit}>{unitNumber}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.activeTag}>
                  <CheckCircle2 size={12} color="#0F766E" />
                  <Text style={styles.activeTagText}>Resident Verified</Text>
                </View>
                <View style={styles.gateTag}>
                  <Shield size={12} color="#475569" />
                  <Text style={styles.gateTagText}>Gate Security Live</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.societyHeroFooter}>
            <Pressable
              style={styles.heroFooterBtn}
              onPress={() => router.push('/(renter)/society/visitor-pass' as any)}
            >
              <Key size={14} color="#0F766E" />
              <Text style={styles.heroFooterBtnText}>Generate Pass</Text>
            </Pressable>
            <View style={styles.heroDivider} />
            <Pressable
              style={styles.heroFooterBtn}
              onPress={() => router.push('/(renter)/society/maintenance' as any)}
            >
              <FileText size={14} color="#0F766E" />
              <Text style={styles.heroFooterBtnText}>Pay Maintenance</Text>
            </Pressable>
          </View>
        </View>

        {/* Active Passes Banner (if any) */}
        {(activeVisitorPass || activeDeliveryPass) && (
          <View style={styles.activePassBanner}>
            <View style={styles.activePassHeader}>
              <View style={styles.activePulse}>
                <View style={styles.activeDot} />
                <Text style={styles.activePassTitle}>ACTIVE GATE PASS</Text>
              </View>
              <Pressable
                onPress={() => {
                  triggerHapticFeedback('selection');
                  if (activeVisitorPass) router.push('/(renter)/society/visitor-pass' as any);
                  else router.push('/(renter)/society/delivery-pass' as any);
                }}
              >
                <Text style={styles.activePassViewAll}>View QR Code →</Text>
              </Pressable>
            </View>

            {activeVisitorPass && (
              <View style={styles.passDetailRow}>
                <View style={styles.passIconBox}>
                  <QrCode size={20} color="#0F766E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.passPersonName}>{activeVisitorPass.visitor_name}</Text>
                  <Text style={styles.passSubtext}>
                    PIN: <Text style={styles.passPinBold}>{activeVisitorPass.pass_code}</Text> • {activeVisitorPass.purpose || 'Visitor'}
                  </Text>
                </View>
                <View style={styles.passDurationBadge}>
                  <Clock size={12} color="#0F766E" />
                  <Text style={styles.passDurationText}>Active</Text>
                </View>
              </View>
            )}

            {activeDeliveryPass && !activeVisitorPass && (
              <View style={styles.passDetailRow}>
                <View style={[styles.passIconBox, { backgroundColor: '#F0F9FF' }]}>
                  <Truck size={20} color="#0284C7" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.passPersonName}>{activeDeliveryPass.company_name} Delivery</Text>
                  <Text style={styles.passSubtext}>
                    PIN: <Text style={styles.passPinBold}>{activeDeliveryPass.pass_code}</Text>
                  </Text>
                </View>
                <View style={[styles.passDurationBadge, { backgroundColor: '#F0F9FF' }]}>
                  <Clock size={12} color="#0284C7" />
                  <Text style={[styles.passDurationText, { color: '#0284C7' }]}>Active</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Latest Notice Banner */}
        {latestNotice && (
          <Pressable
            style={styles.noticeBanner}
            onPress={() => {
              triggerHapticFeedback('selection');
              router.push('/(renter)/society/notices' as any);
            }}
          >
            <View style={styles.noticeIconBox}>
              <Bell size={18} color="#8B5CF6" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.noticeRow}>
                <Text style={styles.noticeBadge}>
                  {latestNotice.is_pinned ? '📌 PINNED NOTICE' : 'SOCIETY CIRCULAR'}
                </Text>
                <Text style={styles.noticeTime}>Recent</Text>
              </View>
              <Text style={styles.noticeTitle} numberOfLines={1}>
                {latestNotice.title}
              </Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>
        )}

        {/* Quick Actions Grid */}
        <Text style={styles.sectionHeader}>SOCIETY MODULES</Text>
        <View style={styles.grid}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Pressable
                key={action.id}
                style={styles.gridCard}
                onPress={() => {
                  triggerHapticFeedback('selection');
                  router.push(action.route as any);
                }}
              >
                <View style={styles.gridCardTop}>
                  <View style={[styles.gridIconBox, { backgroundColor: action.bg }]}>
                    <Icon size={24} color={action.color} />
                  </View>
                  {action.badge !== undefined && action.badge !== 0 && (
                    <View
                      style={[
                        styles.gridBadge,
                        typeof action.badge === 'string' && { backgroundColor: '#FEF3C7' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.gridBadgeText,
                          typeof action.badge === 'string' && { color: '#B45309' },
                        ]}
                      >
                        {action.badge}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.gridTitle}>{action.title}</Text>
                <Text style={styles.gridDesc}>{action.desc}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Emergency SOS Banner */}
        <Pressable
          style={styles.sosBanner}
          onPress={() => {
            triggerHapticFeedback('impactHeavy');
            router.push('/(renter)/society/sos' as any);
          }}
        >
          <View style={styles.sosBannerIcon}>
            <ShieldAlert size={28} color="#E11D48" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sosBannerTitle}>Emergency SOS & Gate Security</Text>
            <Text style={styles.sosBannerSubtitle}>
              Instant alert to Main Gate, Police, Ambulance & Fire
            </Text>
          </View>
          <ChevronRight size={20} color="#E11D48" />
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  sosHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E11D48',
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    gap: 6,
  },
  sosHeaderBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  societyHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...V4_SHADOWS.card,
  },
  societyHeroContent: {
    flexDirection: 'row',
    padding: 18,
    gap: 14,
    alignItems: 'center',
  },
  societyHeroIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  societyHeroName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  societyHeroUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F766E',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  gateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gateTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  societyHeroFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  heroFooterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    minHeight: 44,
  },
  heroFooterBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  heroDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  activePassBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#0F766E',
    gap: 12,
    ...V4_SHADOWS.card,
  },
  activePassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activePulse: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  activePassTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  activePassViewAll: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  passDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  passIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passPersonName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  passSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  passPinBold: {
    color: '#0F766E',
    fontWeight: '800',
  },
  passDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  passDurationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    gap: 12,
  },
  noticeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  noticeBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B5CF6',
  },
  noticeTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 130,
    justifyContent: 'space-between',
    ...V4_SHADOWS.card,
  },
  gridCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gridIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  gridBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  gridDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14,
    marginTop: 2,
  },
  sosBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    gap: 14,
  },
  sosBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9F1239',
  },
  sosBannerSubtitle: {
    fontSize: 11,
    color: '#BE123C',
    marginTop: 2,
  },
});
