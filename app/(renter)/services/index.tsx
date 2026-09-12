import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  RefreshControl,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  ChevronRight,
  Wrench,
  Zap,
  Droplets,
  Hammer,
  Bug,
  Paintbrush,
  Cctv,
  Activity,
  Sun,
  Home,
  CheckCircle2,
  Calendar,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../src/theme/v4Theme';
import { triggerHapticFeedback } from '../../../src/utils/haptics';
import { V4TechnicianCard } from '../../../src/components/v4/services/V4TechnicianCard';

export default function HomeServicesMarketplaceRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    serviceCategories,
    technicians,
    homeServiceBookings,
    fetchServiceCategories,
    fetchTechnicians,
    fetchHomeServiceBookings,
    showToast,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchServiceCategories();
    fetchTechnicians();
    fetchHomeServiceBookings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    triggerHapticFeedback('impactLight');
    await Promise.all([
      fetchServiceCategories(),
      fetchTechnicians(),
      fetchHomeServiceBookings(),
    ]);
    setRefreshing(false);
  };

  const categories = [
    {
      id: 'cleaning',
      slug: 'cleaning',
      name: 'Deep Cleaning',
      desc: 'Full home, kitchen, bathroom & sofa',
      price: 'From ₹499',
      icon: Sparkles,
      color: '#0F766E',
      bg: '#F0FDFA',
      badge: 'Bestseller',
    },
    {
      id: 'appliances',
      slug: 'appliances',
      name: 'Appliance Repair',
      desc: 'AC, fridge, washing machine & microwave',
      price: 'From ₹299',
      icon: Activity,
      color: '#0284C7',
      bg: '#F0F9FF',
      badge: 'Instant Slot',
    },
    {
      id: 'electrician',
      slug: 'electrician',
      name: 'Electrician',
      desc: 'Wiring, fan, switchboard & lights',
      price: 'From ₹149',
      icon: Zap,
      color: '#D97706',
      bg: '#FFFBEB',
    },
    {
      id: 'plumber',
      slug: 'plumber',
      name: 'Plumber',
      desc: 'Leakage, taps, pipes & basin repair',
      price: 'From ₹149',
      icon: Droplets,
      color: '#059669',
      bg: '#ECFDF5',
    },
    {
      id: 'carpenter',
      slug: 'carpenter',
      name: 'Carpenter',
      desc: 'Furniture, lock installation & hinges',
      price: 'From ₹199',
      icon: Hammer,
      color: '#B45309',
      bg: '#FEF3C7',
    },
    {
      id: 'pest-control',
      slug: 'pest-control',
      name: 'Pest Control',
      desc: 'Cockroach, termite & bed bug treatment',
      price: 'From ₹699',
      icon: Bug,
      color: '#E11D48',
      bg: '#FFF1F2',
      badge: 'Govt Approved',
    },
    {
      id: 'painting',
      slug: 'painting',
      name: 'Painting & Water',
      desc: 'Waterproofing, single wall & touchups',
      price: 'From ₹999',
      icon: Paintbrush,
      color: '#7C3AED',
      bg: '#F5F3FF',
    },
    {
      id: 'cctv',
      slug: 'cctv',
      name: 'Home Security',
      desc: 'CCTV setup, smart lock & video bell',
      price: 'From ₹499',
      icon: Cctv,
      color: '#475569',
      bg: '#F1F5F9',
    },
    {
      id: 'water-purifier',
      slug: 'water-purifier',
      name: 'RO Purifier',
      desc: 'Filter change, candle clean & repair',
      price: 'From ₹399',
      icon: Droplets,
      color: '#0284C7',
      bg: '#F0F9FF',
    },
    {
      id: 'disinfection',
      slug: 'disinfection',
      name: 'Disinfection',
      desc: 'Hospital-grade viral sanitization',
      price: 'From ₹449',
      icon: ShieldCheck,
      color: '#0F766E',
      bg: '#F0FDFA',
    },
    {
      id: 'solar',
      slug: 'solar',
      name: 'Solar & Inverter',
      desc: 'Battery maintenance, UPS & rooftop',
      price: 'From ₹599',
      icon: Sun,
      color: '#EA580C',
      bg: '#FFF7ED',
    },
    {
      id: 'smart-home',
      slug: 'smart-home',
      name: 'Smart Home',
      desc: 'Alexa, smart switches & automation',
      price: 'From ₹349',
      icon: Home,
      color: '#10B981',
      bg: '#ECFDF5',
    },
  ];

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Active ongoing booking
  const activeBooking = homeServiceBookings?.find(
    (b) => b.status === 'booked' || b.status === 'accepted' || b.status === 'technician_assigned' || b.status === 'in_progress'
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
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
          <Text style={styles.headerTitle}>Home Services</Text>
          <Text style={styles.headerSubtitle}>REHVO Assured Marketplace</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0F766E" />}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search AC repair, deep clean, electrician..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* REHVO Assured Banner */}
        <View style={styles.assuredBanner}>
          <View style={styles.assuredTop}>
            <View style={styles.assuredBadge}>
              <ShieldCheck size={16} color="#0F766E" />
              <Text style={styles.assuredBadgeText}>REHVO ASSURED</Text>
            </View>
            <Text style={styles.assuredCashback}>Earn 2% R-Cash Cashback</Text>
          </View>
          <Text style={styles.assuredTitle}>Verified Experts at Your Doorstep</Text>
          <View style={styles.assuredBullets}>
            <View style={styles.bulletItem}>
              <CheckCircle2 size={12} color="#0F766E" />
              <Text style={styles.bulletText}>30-Day Free Rework Warranty</Text>
            </View>
            <View style={styles.bulletItem}>
              <CheckCircle2 size={12} color="#0F766E" />
              <Text style={styles.bulletText}>Transparent Upfront Pricing</Text>
            </View>
            <View style={styles.bulletItem}>
              <CheckCircle2 size={12} color="#0F766E" />
              <Text style={styles.bulletText}>Background Verified Pros</Text>
            </View>
          </View>
        </View>

        {/* Active Booking Tracker (if any) */}
        {activeBooking && (
          <Pressable
            style={styles.activeBookingCard}
            onPress={() => {
              triggerHapticFeedback('selection');
              router.push(`/(renter)/services/${activeBooking.service_type || 'cleaning'}` as any);
            }}
          >
            <View style={styles.activeBookingHeader}>
              <View style={styles.activeDotPulse}>
                <View style={styles.activeDot} />
                <Text style={styles.activeBookingStatus}>LIVE SERVICE ORDER</Text>
              </View>
              <Text style={styles.activeBookingTime}>
                {activeBooking.status.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.activeBookingTitle}>
              {activeBooking.service_name || activeBooking.service_type || 'Home Service'}
            </Text>
            <Text style={styles.activeBookingSlot}>
              📅 {activeBooking.scheduled_date || activeBooking.booking_date} • ⏰ {activeBooking.time_slot}
            </Text>

            {activeBooking.otp_start && (
              <View style={styles.activeOtpRow}>
                <Text style={styles.activeOtpLabel}>Start OTP:</Text>
                <Text style={styles.activeOtpCode}>{activeBooking.otp_start}</Text>
              </View>
            )}
          </Pressable>
        )}

        {/* Categories 12-Grid */}
        <Text style={styles.sectionHeader}>EXPLORE SERVICES</Text>
        <View style={styles.grid}>
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Pressable
                key={cat.id}
                style={styles.gridCard}
                onPress={() => {
                  triggerHapticFeedback('selection');
                  router.push(`/(renter)/services/${cat.slug}` as any);
                }}
              >
                <View style={styles.gridCardTop}>
                  <View style={[styles.gridIconBox, { backgroundColor: cat.bg }]}>
                    <Icon size={22} color={cat.color} />
                  </View>
                  {cat.badge && (
                    <View style={styles.badgeChip}>
                      <Text style={styles.badgeChipText}>{cat.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.gridCardName}>{cat.name}</Text>
                <Text style={styles.gridCardDesc} numberOfLines={2}>{cat.desc}</Text>
                <Text style={styles.gridCardPrice}>{cat.price}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Top-Rated Pros Section */}
        {technicians && technicians.length > 0 && (
          <View style={{ marginTop: 10, gap: 12 }}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>TOP-RATED PROS</Text>
              <Text style={styles.sectionSubLink}>4.8★ & Above</Text>
            </View>
            {technicians.slice(0, 3).map((tech) => (
              <V4TechnicianCard
                key={tech.id}
                technician={tech}
                onSelect={() => {
                  triggerHapticFeedback('selection');
                  router.push(`/(renter)/services/cleaning` as any);
                }}
              />
            ))}
          </View>
        )}

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
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    ...V4_SHADOWS.card,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  assuredBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#0F766E',
    gap: 10,
    ...V4_SHADOWS.card,
  },
  assuredTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  assuredBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  assuredCashback: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  assuredTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  assuredBullets: {
    gap: 6,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bulletText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  activeBookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#0284C7',
    gap: 8,
    ...V4_SHADOWS.card,
  },
  activeBookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeDotPulse: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0284C7',
  },
  activeBookingStatus: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  activeBookingTime: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  activeBookingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  activeBookingSlot: {
    fontSize: 12,
    color: '#64748B',
  },
  activeOtpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  activeOtpLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  activeOtpCode: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0284C7',
    letterSpacing: 1,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionSubLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
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
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    ...V4_SHADOWS.card,
  },
  gridCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeChip: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeChipText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
  gridCardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  gridCardDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14,
  },
  gridCardPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
    marginTop: 2,
  },
});
