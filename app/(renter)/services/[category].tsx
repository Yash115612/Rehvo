import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../src/theme/v4Theme';
import { triggerHapticFeedback } from '../../../src/utils/haptics';
import { V4TechnicianCard } from '../../../src/components/v4/services/V4TechnicianCard';
import { V4ServiceBookingSheet } from '../../../src/components/v4/services/V4ServiceBookingSheet';
import { TechnicianRecord } from '../../../src/types';

export default function ServiceCategoryDetailRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { category: categorySlug } = useLocalSearchParams<{ category: string }>();

  const {
    serviceCategories,
    technicians,
    fetchTechnicians,
    showToast,
    properties,
    leaseAgreements,
  } = useAppStore();

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedTech, setSelectedTech] = useState<TechnicianRecord | null>(null);
  const [bookingSheetVisible, setBookingSheetVisible] = useState(false);

  const activeLease = useMemo(
    () => leaseAgreements?.find((l) => l.status === 'active') || leaseAgreements?.[0],
    [leaseAgreements]
  );
  const activeProperty = useMemo(
    () => properties?.find((p) => p.id === activeLease?.property_id) || properties?.[0],
    [properties, activeLease]
  );

  const userAddress = activeProperty?.address || 'Tower 4, Flat 1204, Prestige Green Gables';

  useEffect(() => {
    fetchTechnicians();
  }, [categorySlug]);

  const categoryTitle = useMemo(() => {
    const slug = (categorySlug || 'cleaning').toLowerCase();
    const map: Record<string, string> = {
      cleaning: 'Deep Cleaning',
      appliances: 'Appliance Repair',
      electrician: 'Electrician Services',
      plumber: 'Plumbing Services',
      carpenter: 'Carpentry & Repairs',
      'pest-control': 'Pest Control',
      painting: 'Painting & Waterproofing',
      cctv: 'Home Security & CCTV',
      'water-purifier': 'RO Water Purifier',
      disinfection: 'Sanitization & Disinfection',
      solar: 'Solar & Inverter Care',
      'smart-home': 'Smart Home Automation',
    };
    return map[slug] || 'Home Service';
  }, [categorySlug]);

  const variants = useMemo(() => {
    const slug = (categorySlug || 'cleaning').toLowerCase();
    if (slug === 'cleaning') {
      return [
        {
          name: 'Classic Full Home Cleaning',
          price: 799,
          duration: '3 - 4 Hours',
          includes: [
            'Deep vacuuming of sofas and carpets',
            'Floor scrubbing with industrial machine',
            'Kitchen oil degreasing & countertop scrub',
            'Complete bathroom descaling & disinfection',
          ],
          excludes: ['Wall painting', 'Exterior balcony glass wash'],
        },
        {
          name: 'Luxury Deep Cleaning (Emerald Edition)',
          price: 1499,
          duration: '5 - 6 Hours',
          includes: [
            'Includes everything in Classic',
            'Steam sterilization for mattresses & curtains',
            'Inside-cabinet cleanup & reorganization',
            'Balcony floor deep chemical restoration',
            'Fragrance misting & sanitization seal',
          ],
          excludes: ['Appliance internal spare replacement'],
        },
        {
          name: 'Mini Bathroom & Kitchen Deep Clean',
          price: 499,
          duration: '2 Hours',
          includes: [
            'Intensive tile grouting & limescale removal',
            'Chimney & stove degreasing',
            'Mirror and glass polishing',
          ],
          excludes: ['Living room or bedrooms'],
        },
      ];
    } else if (slug === 'appliances') {
      return [
        {
          name: 'AC Comprehensive Service & Jet Clean',
          price: 599,
          duration: '60 mins',
          includes: ['Indoor foam wash & jet spray', 'Outdoor unit wash', 'Gas pressure & cooling check'],
          excludes: ['Gas refill charges extra if low'],
        },
        {
          name: 'Washing Machine / Refrigerator Diagnostic',
          price: 299,
          duration: '45 mins',
          includes: ['Comprehensive error code check', 'Motor & drum inspection', 'Transparent quotation'],
          excludes: ['Spare parts at standard rate card'],
        },
      ];
    } else {
      return [
        {
          name: 'Standard Inspection & Minor Fix',
          price: 249,
          duration: '45 mins',
          includes: ['Professional diagnostic', 'Up to 3 minor fixes included', 'Safety check'],
          excludes: ['Major wiring or hardware replacement'],
        },
        {
          name: 'Heavy Duty Installation / Repair',
          price: 549,
          duration: '90 mins',
          includes: ['Complete overhaul & installation', 'Testing with load meters', '30-Day guarantee'],
          excludes: ['Hardware parts'],
        },
      ];
    }
  }, [categorySlug]);

  const currentVariant = variants[selectedVariant] || variants[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            triggerHapticFeedback('selection');
            router.back();
          }}
          hitSlop={12}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>{categoryTitle}</Text>
          <Text style={styles.headerSubtitle}>Verified Experts • 30-Day Warranty</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Rating Hero Bar */}
        <View style={styles.heroRatingBar}>
          <View style={styles.ratingItem}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingVal}>4.88 / 5</Text>
            <Text style={styles.ratingCount}>(12,400+ bookings)</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.ratingItem}>
            <ShieldCheck size={16} color="#0F766E" />
            <Text style={styles.assuranceText}>REHVO Assured</Text>
          </View>
        </View>

        {/* Package Variants */}
        <Text style={styles.sectionHeader}>SELECT PACKAGE</Text>
        <View style={{ gap: 12 }}>
          {variants.map((variant, idx) => {
            const isChosen = selectedVariant === idx;
            return (
              <Pressable
                key={variant.name}
                style={[styles.variantCard, isChosen && styles.variantCardChosen]}
                onPress={() => {
                  triggerHapticFeedback('selection');
                  setSelectedVariant(idx);
                }}
              >
                <View style={styles.variantTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.variantName}>{variant.name}</Text>
                    <View style={styles.durationRow}>
                      <Clock size={12} color="#64748B" />
                      <Text style={styles.durationText}>{variant.duration}</Text>
                    </View>
                  </View>
                  <Text style={styles.variantPrice}>₹{variant.price}</Text>
                </View>

                {/* What's included checklist */}
                <View style={styles.checklist}>
                  {variant.includes.map((inc) => (
                    <View key={inc} style={styles.checkItem}>
                      <CheckCircle2 size={13} color="#0F766E" />
                      <Text style={styles.checkText}>{inc}</Text>
                    </View>
                  ))}
                  {variant.excludes.map((exc) => (
                    <View key={exc} style={styles.checkItem}>
                      <XCircle size={13} color="#94A3B8" />
                      <Text style={[styles.checkText, { color: '#94A3B8' }]}>{exc}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Available Technicians */}
        {technicians && technicians.length > 0 && (
          <View style={{ gap: 12, marginTop: 10 }}>
            <Text style={styles.sectionHeader}>ASSIGNED / RECOMMENDED TECHNICIAN</Text>
            {technicians.slice(0, 2).map((tech) => (
              <V4TechnicianCard
                key={tech.id}
                technician={tech}
                isSelected={selectedTech?.id === tech.id}
                onSelect={() => {
                  triggerHapticFeedback('selection');
                  setSelectedTech(selectedTech?.id === tech.id ? null : tech);
                }}
              />
            ))}
          </View>
        )}

        {/* 30-Day Guarantee Card */}
        <View style={styles.guaranteeCard}>
          <Sparkles size={24} color="#0F766E" />
          <View style={{ flex: 1 }}>
            <Text style={styles.guaranteeTitle}>30-Day REHVO Warranty</Text>
            <Text style={styles.guaranteeDesc}>
              Not completely satisfied? We will re-service your home completely free of charge.
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.bottomPrice}>₹{currentVariant.price}</Text>
          <Text style={styles.bottomSub}>{currentVariant.name.slice(0, 24)}...</Text>
        </View>

        <Pressable
          style={styles.bookNowBtn}
          onPress={() => {
            triggerHapticFeedback('impactMedium');
            setBookingSheetVisible(true);
          }}
        >
          <Text style={styles.bookNowBtnText}>Book Service</Text>
          <ChevronRight size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Booking Sheet Modal */}
      <V4ServiceBookingSheet
        visible={bookingSheetVisible}
        onClose={() => setBookingSheetVisible(false)}
        serviceName={`${categoryTitle} (${currentVariant.name})`}
        categoryId={categorySlug}
        basePrice={currentVariant.price}
        defaultAddress={userAddress}
        technicianId={selectedTech?.id}
        onBookingSuccess={(bookingId) => {
          showToast?.('Technician scheduled!', 'success');
          router.push('/(renter)/services' as any);
        }}
      />
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
  heroRatingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  ratingCount: {
    fontSize: 11,
    color: '#64748B',
  },
  heroDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
  },
  assuranceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  variantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.card,
  },
  variantCardChosen: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  variantTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  variantName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  durationText: {
    fontSize: 11,
    color: '#64748B',
  },
  variantPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F766E',
  },
  checklist: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkText: {
    fontSize: 12,
    color: '#334155',
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 12,
  },
  guaranteeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F766E',
  },
  guaranteeDesc: {
    fontSize: 11,
    color: '#0F766E',
    marginTop: 2,
    lineHeight: 15,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    ...V4_SHADOWS.card,
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  bottomSub: {
    fontSize: 11,
    color: '#64748B',
  },
  bookNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 14,
    gap: 6,
    ...V4_SHADOWS.card,
  },
  bookNowBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
