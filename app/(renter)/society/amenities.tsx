import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  QrCode,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../src/theme/v4Theme';
import { triggerHapticFeedback } from '../../../src/utils/haptics';
import { AmenityBookingRecord } from '../../../src/types';

export default function SocietyAmenitiesRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    properties,
    leaseAgreements,
    amenityBookings,
    fetchAmenityBookings,
    bookSocietyAmenity,
    showToast,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'catalog' | 'bookings'>('catalog');
  const [selectedAmenity, setSelectedAmenity] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('06:00 PM - 07:00 PM');
  const [guestCount, setGuestCount] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [qrModalBooking, setQrModalBooking] = useState<AmenityBookingRecord | null>(null);

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
    fetchAmenityBookings();
  }, []);

  const amenitiesList = [
    {
      id: 'pool',
      name: 'Swimming Pool & Jacuzzi',
      timings: '06:00 AM - 10:00 PM',
      capacity: '12 / 20 slots free',
      rules: 'Swimming costume mandatory. Shower before entering.',
      price: 'Free for Residents',
      bg: '#ECFDF5',
      color: '#059669',
    },
    {
      id: 'badminton',
      name: 'Badminton Court #1 (Wooden)',
      timings: '06:00 AM - 11:00 PM',
      capacity: '4 / 4 players max',
      rules: 'Non-marking gum sole shoes only. 1 hour max per flat.',
      price: 'Free for Residents',
      bg: '#EFF6FF',
      color: '#2563EB',
    },
    {
      id: 'tennis',
      name: 'Tennis Court (Floodlit)',
      timings: '06:00 AM - 09:00 PM',
      capacity: '2 / 4 players',
      rules: 'Bring your own racquets and balls.',
      price: 'Free for Residents',
      bg: '#FEF3C7',
      color: '#D97706',
    },
    {
      id: 'clubhouse',
      name: 'Banquet Hall & Clubhouse',
      timings: '10:00 AM - 11:00 PM',
      capacity: 'Max 80 Guests',
      rules: 'Security deposit refundable. Music cutoff at 10 PM.',
      price: '₹2,500 / day',
      bg: '#F5F3FF',
      color: '#7C3AED',
    },
    {
      id: 'gym',
      name: 'Cardio & Strength Gym Slot',
      timings: '05:30 AM - 10:30 PM',
      capacity: '15 / 25 slots free',
      rules: 'Clean gym shoes and sweat towel required.',
      price: 'Free for Residents',
      bg: '#FFF1F2',
      color: '#E11D48',
    },
    {
      id: 'squash',
      name: 'Squash Court',
      timings: '06:00 AM - 10:00 PM',
      capacity: '2 / 2 players',
      rules: 'Non-marking shoes mandatory.',
      price: 'Free for Residents',
      bg: '#F0FDF4',
      color: '#16A34A',
    },
  ];

  const timeSlots = [
    '06:00 AM - 07:00 AM',
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM',
    '08:00 PM - 09:00 PM',
  ];

  const handleConfirmBooking = async () => {
    if (!selectedAmenity) return;

    setIsBooking(true);
    triggerHapticFeedback('impactMedium');

    const bookingDateStr = bookingDate === 'Today'
      ? new Date().toISOString().split('T')[0]
      : new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const res = await bookSocietyAmenity({
      amenity_name: selectedAmenity.name,
      booking_date: bookingDateStr,
      time_slot: selectedSlot,
      society_name: societyName,
      unit_number: unitNumber,
      guest_count: guestCount,
    });

    setIsBooking(false);

    if (res.success && res.data) {
      triggerHapticFeedback('notificationSuccess');
      showToast?.(`Slot booked for ${selectedAmenity.name}!`, 'success');
      const bookedRecord = res.data;
      setSelectedAmenity(null);
      setQrModalBooking(bookedRecord);
      setActiveTab('bookings');
    } else {
      triggerHapticFeedback('notificationError');
      showToast?.(res.error || 'Failed to book slot', 'error');
    }
  };

  const activeBookings = useMemo(
    () => amenityBookings.filter((b) => b.status === 'confirmed'),
    [amenityBookings]
  );

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
          <Text style={styles.headerTitle}>Amenity Booking</Text>
          <Text style={styles.headerSubtitle}>{societyName}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabBtn, activeTab === 'catalog' && styles.tabBtnActive]}
          onPress={() => {
            triggerHapticFeedback('selection');
            setActiveTab('catalog');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'catalog' && styles.tabTextActive]}>
            Explore Amenities
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === 'bookings' && styles.tabBtnActive]}
          onPress={() => {
            triggerHapticFeedback('selection');
            setActiveTab('bookings');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'bookings' && styles.tabTextActive]}>
            My Bookings ({activeBookings.length})
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* TAB 1: CATALOG */}
        {activeTab === 'catalog' && (
          <View style={{ gap: 14 }}>
            {amenitiesList.map((amenity) => (
              <View key={amenity.id} style={styles.amenityCard}>
                <View style={styles.amenityHeader}>
                  <View style={[styles.amenityDot, { backgroundColor: amenity.color }]} />
                  <Text style={styles.amenityName}>{amenity.name}</Text>
                </View>

                <View style={styles.amenityMetaRow}>
                  <View style={styles.amenityMeta}>
                    <Clock size={14} color="#64748B" />
                    <Text style={styles.amenityMetaText}>{amenity.timings}</Text>
                  </View>
                  <View style={styles.amenityMeta}>
                    <Users size={14} color="#64748B" />
                    <Text style={styles.amenityMetaText}>{amenity.capacity}</Text>
                  </View>
                </View>

                <Text style={styles.amenityRules}>📌 {amenity.rules}</Text>

                <View style={styles.amenityFooter}>
                  <Text style={styles.amenityPrice}>{amenity.price}</Text>
                  <Pressable
                    style={styles.bookSlotBtn}
                    onPress={() => {
                      triggerHapticFeedback('selection');
                      setSelectedAmenity(amenity);
                    }}
                  >
                    <Text style={styles.bookSlotBtnText}>Book Slot</Text>
                    <ChevronRight size={16} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <View style={{ gap: 12 }}>
            {activeBookings.length === 0 ? (
              <View style={styles.emptyCard}>
                <Calendar size={44} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Active Bookings</Text>
                <Text style={styles.emptySubtitle}>Book swimming pool, gym or courts slot anytime</Text>
                <Pressable
                  style={styles.emptyBtn}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setActiveTab('catalog');
                  }}
                >
                  <Text style={styles.emptyBtnText}>Explore Amenities</Text>
                </Pressable>
              </View>
            ) : (
              activeBookings.map((b) => (
                <View key={b.id} style={styles.bookingCard}>
                  <View style={styles.bookingTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bookingTitle}>{b.amenity_name}</Text>
                      <Text style={styles.bookingDate}>
                        📅 {b.booking_date} • ⏰ {b.time_slot}
                      </Text>
                    </View>
                    <View style={styles.confirmedBadge}>
                      <Text style={styles.confirmedBadgeText}>CONFIRMED</Text>
                    </View>
                  </View>

                  <View style={styles.qrShortcutRow}>
                    <View style={styles.qrCodeIconBox}>
                      <QrCode size={24} color="#0F766E" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.qrShortcutTitle}>Entry Passcode: {b.pass_code}</Text>
                      <Text style={styles.qrShortcutSub}>Show at Clubhouse / Court Turnstile</Text>
                    </View>
                    <Pressable
                      style={styles.viewQrBtn}
                      onPress={() => {
                        triggerHapticFeedback('selection');
                        setQrModalBooking(b);
                      }}
                    >
                      <Text style={styles.viewQrBtnText}>Show QR</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Booking Slot Modal */}
      <Modal visible={!!selectedAmenity} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>{selectedAmenity?.name}</Text>
                <Text style={styles.modalSub}>{selectedAmenity?.price}</Text>
              </View>
              <Pressable
                onPress={() => setSelectedAmenity(null)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color="#64748B" />
              </Pressable>
            </View>

            {/* Date Selection */}
            <Text style={styles.modalLabel}>SELECT DAY</Text>
            <View style={styles.dayRow}>
              {['Today', 'Tomorrow'].map((day) => (
                <Pressable
                  key={day}
                  style={[styles.dayBtn, bookingDate === day && styles.dayBtnActive]}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setBookingDate(day);
                  }}
                >
                  <Text style={[styles.dayBtnText, bookingDate === day && styles.dayBtnTextActive]}>
                    {day}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Slot Selection */}
            <Text style={styles.modalLabel}>AVAILABLE SLOTS</Text>
            <ScrollView style={{ maxHeight: 180 }} showsVerticalScrollIndicator={false}>
              <View style={{ gap: 8 }}>
                {timeSlots.map((slot) => (
                  <Pressable
                    key={slot}
                    style={[styles.slotRow, selectedSlot === slot && styles.slotRowActive]}
                    onPress={() => {
                      triggerHapticFeedback('selection');
                      setSelectedSlot(slot);
                    }}
                  >
                    <Clock size={16} color={selectedSlot === slot ? '#0F766E' : '#64748B'} />
                    <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>
                      {slot}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Guests */}
            <Text style={styles.modalLabel}>NUMBER OF RESIDENTS / GUESTS</Text>
            <View style={styles.guestRow}>
              {[1, 2, 3, 4].map((n) => (
                <Pressable
                  key={n}
                  style={[styles.guestPill, guestCount === n && styles.guestPillActive]}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setGuestCount(n);
                  }}
                >
                  <Text style={[styles.guestPillText, guestCount === n && styles.guestPillTextActive]}>
                    {n} {n === 1 ? 'Person' : 'People'}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Confirm CTA */}
            <Pressable
              style={[styles.confirmBtn, isBooking && { opacity: 0.6 }]}
              disabled={isBooking}
              onPress={handleConfirmBooking}
            >
              {isBooking ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmBtnText}>Confirm Slot & Generate QR Pass</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* QR Code Entry Pass Modal */}
      <Modal visible={!!qrModalBooking} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: 'center' }]}>
            <View style={styles.qrCheckCircle}>
              <CheckCircle2 size={32} color="#10B981" />
            </View>
            <Text style={styles.qrModalTitle}>Amenity Access Pass</Text>
            <Text style={styles.qrModalSub}>{qrModalBooking?.amenity_name}</Text>

            <View style={styles.qrCodeBox}>
              <QrCode size={160} color="#0F172A" />
              <Text style={styles.qrCodeNumber}>PASSCODE: {qrModalBooking?.pass_code}</Text>
            </View>

            <Text style={styles.qrInfoText}>
              Scan at turnstile or show to amenity caretaker at entry.
            </Text>

            <Pressable
              style={styles.qrCloseBtn}
              onPress={() => {
                triggerHapticFeedback('selection');
                setQrModalBooking(null);
              }}
            >
              <Text style={styles.qrCloseBtnText}>Close Pass</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  tabBtnActive: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#0F766E',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0F766E',
  },
  scrollContent: {
    padding: 20,
  },
  amenityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    ...V4_SHADOWS.card,
  },
  amenityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amenityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  amenityName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  amenityMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  amenityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  amenityMetaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  amenityRules: {
    fontSize: 12,
    color: '#475569',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
  },
  amenityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  amenityPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  bookSlotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
    minHeight: 38,
  },
  bookSlotBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  emptyBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 16,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.card,
  },
  bookingTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bookingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  bookingDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  confirmedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confirmedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  qrShortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  qrCodeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrShortcutTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  qrShortcutSub: {
    fontSize: 11,
    color: '#0F766E',
  },
  viewQrBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewQrBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '700',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.6,
    marginTop: 14,
    marginBottom: 8,
  },
  dayRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dayBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  dayBtnActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  dayBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  dayBtnTextActive: {
    color: '#0F766E',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotRowActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  slotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  slotTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  guestRow: {
    flexDirection: 'row',
    gap: 8,
  },
  guestPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  guestPillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  guestPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  guestPillTextActive: {
    color: '#FFFFFF',
  },
  confirmBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    ...V4_SHADOWS.card,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  qrCheckCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  qrModalSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  qrCodeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0F766E',
    marginVertical: 16,
    gap: 8,
  },
  qrCodeNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 2,
  },
  qrInfoText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  qrCloseBtn: {
    width: '100%',
    height: 46,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCloseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
});
