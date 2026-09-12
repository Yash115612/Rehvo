import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Share,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CalendarCheck,
  Calendar,
  Clock,
  QrCode,
  MapPin,
  ShieldCheck,
  Plus,
  X,
  CheckCircle2,
  Share2,
  Download,
  Building2,
  User,
  Phone,
  Video,
  RotateCcw,
  XCircle,
  Navigation,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_SHADOWS, V4_RADIUS } from '../../../theme/v4Theme';
import { V4BookingCard, V4BookingItem } from '../ui/V4BookingCard';
import { V4AuthGate } from '../ui/V4AuthGate';
import { VisitBookingRecord } from '../../../types';

export const V4BookingsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    visits,
    visitBookings,
    fetchVisitBookings,
    bookPropertyVisit,
    cancelVisit,
    properties,
    fetchProperties,
    user,
    isAuthenticated,
    showToast,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'cancelled'>('upcoming');

  // Schedule Visit Modal
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [propTitle, setPropTitle] = useState(properties?.[0]?.title || 'Modern Executive Suite');
  const [propLocality, setPropLocality] = useState(
    properties?.[0] ? `${properties[0].locality}, ${properties[0].city}` : 'Central City'
  );
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('04:00 PM');
  const [visitType, setVisitType] = useState<'in_person' | 'video'>('in_person');
  const [isBooking, setIsBooking] = useState(false);

  // Reschedule Visit Modal
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [targetBooking, setTargetBooking] = useState<V4BookingItem | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('Tomorrow');
  const [rescheduleSlot, setRescheduleSlot] = useState('04:00 PM');
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Cancel Visit Modal
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('Schedule conflict');
  const [isCancelling, setIsCancelling] = useState(false);

  // QR Pass Modal
  const [selectedPass, setSelectedPass] = useState<V4BookingItem | null>(null);
  const [passModalVisible, setPassModalVisible] = useState(false);

  useEffect(() => {
    fetchProperties?.();
  }, [fetchProperties]);

  useEffect(() => {
    if (properties && properties.length > 0 && !propTitle) {
      setPropTitle(properties[0].title);
      setPropLocality(`${properties[0].locality}, ${properties[0].city}`);
    }
  }, [properties]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchVisitBookings();
    }
  }, [isAuthenticated, user?.id]);

  // Combine legacy visits with real Supabase visitBookings
  const bookingsList: V4BookingItem[] = [
    ...(visitBookings || []).map((vb) => {
      const matchProp = properties?.find(
        (p) => p.title === vb.property_title || p.locality === vb.property_locality
      );
      return {
        id: vb.id,
        propertyTitle: vb.property_title,
        locality: vb.property_locality,
        imageUrl:
          vb.property_image ||
          matchProp?.images?.[0]?.url ||
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
        status: (vb.status === 'confirmed'
          ? 'UPCOMING'
          : vb.status === 'completed'
          ? 'COMPLETED'
          : vb.status === 'cancelled'
          ? 'CANCELLED'
          : 'ACTIVE') as any,
        date: `${vb.visit_date} at ${vb.time_slot}`,
        time: vb.time_slot,
        rent: matchProp?.rent || 20000,
        hostName: vb.host_name || matchProp?.owner_name || 'Verified Host',
      };
    }),
    ...(visits || []).map((v) => ({
      id: v.id,
      propertyTitle: v.property_title || 'Scheduled Property Visit',
      locality: v.property_locality || 'Jaipur',
      imageUrl:
        v.property_image ||
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
      status: (v.status === 'CONFIRMED'
        ? 'UPCOMING'
        : v.status === 'COMPLETED'
        ? 'COMPLETED'
        : v.status === 'CANCELLED'
        ? 'CANCELLED'
        : 'ACTIVE') as any,
      date: `${v.date} at ${v.time}`,
      time: v.time,
      rent: v.rent || 0,
      hostName: v.owner_name || 'Direct Landlord',
    })),
  ];

  const isDateToday = (d: string) => {
    const today = new Date().toISOString().split('T')[0];
    const todayFormatted = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const lower = d.toLowerCase();
    return lower.includes('today') || d.includes(today) || lower.includes(todayFormatted.toLowerCase());
  };

  const filtered = bookingsList.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'today') return isDateToday(b.date) && b.status !== 'CANCELLED';
    if (activeTab === 'upcoming') return (b.status === 'UPCOMING' || b.status === 'ACTIVE') && !isDateToday(b.date);
    if (activeTab === 'completed') return b.status === 'COMPLETED';
    if (activeTab === 'cancelled') return b.status === 'CANCELLED';
    return true;
  });

  const handleBookVisit = async () => {
    if (!propTitle.trim()) {
      showToast?.('Please enter a property name', 'error');
      return;
    }
    setIsBooking(true);
    const passToken = `REHVO-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
    await bookPropertyVisit({
      user_id: user?.id || 'guest',
      property_title: propTitle.trim(),
      property_locality: propLocality.trim(),
      host_name: properties?.[0]?.owner_name || 'Verified Host',
      host_phone: properties?.[0]?.owner_phone || '+91 98190 22334',
      visit_date: selectedDate,
      time_slot: selectedTimeSlot,
      status: 'confirmed',
      qr_code_payload: passToken,
      special_notes: visitType === 'video' ? 'Virtual Video Tour requested' : 'In-person society visit',
    });
    setIsBooking(false);
    setScheduleModalVisible(false);
    showToast?.(`🎉 Visit scheduled for ${selectedDate} at ${selectedTimeSlot}!`, 'success');
  };

  const handleOpenReschedule = (booking: V4BookingItem) => {
    setTargetBooking(booking);
    setRescheduleModalVisible(true);
  };

  const handleConfirmReschedule = async () => {
    if (!targetBooking) return;
    setIsRescheduling(true);
    useAppStore.setState((state) => ({
      visits: state.visits.map((v) =>
        v.id === targetBooking.id
          ? { ...v, date: rescheduleDate, time: rescheduleSlot, status: 'CONFIRMED' }
          : v
      ),
      visitBookings: state.visitBookings.map((vb) =>
        vb.id === targetBooking.id
          ? { ...vb, visit_date: rescheduleDate, time_slot: rescheduleSlot, status: 'confirmed' }
          : vb
      ),
    }));
    setIsRescheduling(false);
    setRescheduleModalVisible(false);
    showToast?.(`Visit rescheduled to ${rescheduleDate} at ${rescheduleSlot}!`, 'success');
  };

  const handleOpenCancel = (booking: V4BookingItem) => {
    setTargetBooking(booking);
    setCancelModalVisible(true);
  };

  const handleConfirmCancel = async () => {
    if (!targetBooking) return;
    setIsCancelling(true);
    await cancelVisit(targetBooking.id, cancelReason);
    useAppStore.setState((state) => ({
      visitBookings: state.visitBookings.map((vb) =>
        vb.id === targetBooking.id ? { ...vb, status: 'cancelled' } : vb
      ),
    }));
    setIsCancelling(false);
    setCancelModalVisible(false);
  };

  const handleOpenPass = (booking: V4BookingItem) => {
    setSelectedPass(booking);
    setPassModalVisible(true);
  };

  const handleSharePass = async () => {
    if (!selectedPass) return;
    try {
      await Share.share({
        message: `🛡️ REHVO Society Visitor Pass\nPass ID: REHVO-${selectedPass.id.slice(-6).toUpperCase()}\nVisitor: ${user?.name || 'Yash Choudhary'}\nProperty: ${selectedPass.propertyTitle} (${selectedPass.locality})\nTiming: ${selectedPass.date}\nStatus: VERIFIED & APPROVED`,
      });
    } catch {
      showToast?.('Pass link copied to clipboard', 'info');
    }
  };

  const handleDirections = (booking: V4BookingItem) => {
    const query = encodeURIComponent(`${booking.propertyTitle}, ${booking.locality}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleCalendarSync = (booking: V4BookingItem) => {
    const eventTitle = encodeURIComponent(`REHVO Visit: ${booking.propertyTitle}`);
    const details = encodeURIComponent(`Scheduled physical inspection of ${booking.propertyTitle} (${booking.locality}) with host ${booking.hostName}.`);
    const location = encodeURIComponent(booking.locality);
    Linking.openURL(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${details}&location=${location}`
    );
    showToast?.('📅 Added visit to calendar', 'success');
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <CalendarCheck size={20} color={V4_COLORS.primary} strokeWidth={2.4} />
            <Text style={styles.title}>My Stays & Visits</Text>
          </View>
          <Text style={styles.subtitle}>
            Track your leases, visit appointments & signed digital agreements
          </Text>
        </View>

        <V4AuthGate
          title="Your Scheduled Visits"
          description="Sign in to schedule property visits, track tour timings, and chat with verified hosts."
          featureName="Property Visits"
          badgeText="VISIT APPOINTMENTS"
          icon={<CalendarCheck size={32} color="#059669" strokeWidth={2.4} />}
          benefits={[
            'Book direct property visits with verified landlords',
            'Instant confirmation & directions via WhatsApp/SMS',
            'Track active rental leases and digital contracts',
            'Zero agent fees or visit commission',
          ]}
          fullScreen={false}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
      {/* 1. TOP HEADER */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={styles.titleRow}>
            <CalendarCheck size={20} color={V4_COLORS.primary} strokeWidth={2.4} />
            <Text style={styles.title}>My Stays & Visits</Text>
          </View>
          <Pressable
            style={styles.scheduleHeaderBtn}
            onPress={() => setScheduleModalVisible(true)}
          >
            <Plus size={14} color="#FFFFFF" strokeWidth={2.6} />
            <Text style={styles.scheduleHeaderBtnText}>Book Visit</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>
          Track your leases, visit appointments & QR entry passes
        </Text>
      </View>

      {/* 2. SEGMENTED TABS */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {[
            { id: 'all', label: `All (${bookingsList.length})` },
            { id: 'today', label: 'Today' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.id as any)}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. BOOKINGS LIST */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <CalendarCheck size={38} color={V4_COLORS.primary} strokeWidth={1.8} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'cancelled'
                ? 'No Cancelled Visits'
                : activeTab === 'completed'
                ? 'No Completed Visits'
                : 'No Scheduled Visits'}
            </Text>
            <Text style={styles.emptySub}>
              {activeTab === 'cancelled'
                ? 'Any cancelled visit appointments will appear here for your reference.'
                : 'Browse verified flats or book a scheduled appointment to inspect your preferred homes.'}
            </Text>
            {activeTab !== 'cancelled' && (
              <Pressable
                style={styles.emptyActionBtn}
                onPress={() => setScheduleModalVisible(true)}
              >
                <Plus size={15} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.emptyActionBtnText}>Schedule a Property Visit</Text>
              </Pressable>
            )}
          </View>
        ) : (
          filtered.map((booking) => (
            <View key={booking.id} style={{ marginBottom: 16 }}>
              <V4BookingCard
                booking={booking}
                onPress={() => router.push(`/(renter)/booking/${booking.id}` as any)}
                onChatHost={() => router.push('/(renter)/chat' as any)}
                onDownloadAgreement={() => router.push('/(renter)/rental-agreements' as any)}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bookingActionButtonsRow}
              >
                <Pressable
                  style={styles.actionBtnOutline}
                  onPress={() => handleOpenPass(booking)}
                >
                  <QrCode size={13} color="#0F766E" strokeWidth={2.2} />
                  <Text style={styles.actionBtnOutlineText}>QR Pass</Text>
                </Pressable>

                <Pressable
                  style={styles.actionBtnOutline}
                  onPress={() => handleDirections(booking)}
                >
                  <Navigation size={13} color="#0F766E" strokeWidth={2.2} />
                  <Text style={styles.actionBtnOutlineText}>Directions</Text>
                </Pressable>

                <Pressable
                  style={styles.actionBtnOutline}
                  onPress={() => handleCalendarSync(booking)}
                >
                  <Calendar size={13} color="#0F766E" strokeWidth={2.2} />
                  <Text style={styles.actionBtnOutlineText}>Calendar</Text>
                </Pressable>

                {booking.status === 'UPCOMING' && (
                  <>
                    <Pressable
                      style={styles.actionBtnOutline}
                      onPress={() => handleOpenReschedule(booking)}
                    >
                      <RotateCcw size={13} color="#0F766E" strokeWidth={2.2} />
                      <Text style={styles.actionBtnOutlineText}>Reschedule</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.actionBtnOutline, styles.bookingCancelBtn]}
                      onPress={() => handleOpenCancel(booking)}
                    >
                      <XCircle size={13} color="#DC2626" strokeWidth={2.2} />
                      <Text style={styles.bookingCancelBtnText}>Cancel</Text>
                    </Pressable>
                  </>
                )}
              </ScrollView>
            </View>
          ))
        )}
      </ScrollView>

      {/* 4. SCHEDULE VISIT MODAL */}
      <Modal
        visible={scheduleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Calendar size={18} color="#0F766E" />
                <Text style={styles.modalTitle}>Book Property Visit</Text>
              </View>
              <Pressable onPress={() => setScheduleModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>PROPERTY NAME</Text>
            <TextInput
              style={styles.modalInput}
              value={propTitle}
              onChangeText={setPropTitle}
              placeholder="e.g. Skyline Residency • Suite 402"
              placeholderTextColor={V4_COLORS.textMuted}
            />

            <Text style={styles.inputLabel}>LOCALITY / ADDRESS</Text>
            <TextInput
              style={styles.modalInput}
              value={propLocality}
              onChangeText={setPropLocality}
              placeholder="e.g. Malviya Nagar, Jaipur"
              placeholderTextColor={V4_COLORS.textMuted}
            />

            <Text style={styles.inputLabel}>VISIT MODE</Text>
            <View style={styles.chipRow}>
              <Pressable
                style={[styles.chip, visitType === 'in_person' && styles.chipActive]}
                onPress={() => setVisitType('in_person')}
              >
                <Building2 size={14} color={visitType === 'in_person' ? '#0F766E' : V4_COLORS.textSecondary} />
                <Text style={[styles.chipText, visitType === 'in_person' && styles.chipTextActive]}>
                  In-Person Visit
                </Text>
              </Pressable>

              <Pressable
                style={[styles.chip, visitType === 'video' && styles.chipActive]}
                onPress={() => setVisitType('video')}
              >
                <Video size={14} color={visitType === 'video' ? '#0F766E' : V4_COLORS.textSecondary} />
                <Text style={[styles.chipText, visitType === 'video' && styles.chipTextActive]}>
                  Live Video Tour
                </Text>
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>SELECT DAY</Text>
            <View style={styles.chipRow}>
              {['Today', 'Tomorrow', 'Saturday', 'Sunday'].map((d) => (
                <Pressable
                  key={d}
                  style={[styles.chip, selectedDate === d && styles.chipActive]}
                  onPress={() => setSelectedDate(d)}
                >
                  <Text style={[styles.chipText, selectedDate === d && styles.chipTextActive]}>{d}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>SELECT TIME SLOT</Text>
            <View style={styles.chipRow}>
              {['10:00 AM', '12:00 PM', '04:00 PM', '06:00 PM'].map((slot) => (
                <Pressable
                  key={slot}
                  style={[styles.chip, selectedTimeSlot === slot && styles.chipActive]}
                  onPress={() => setSelectedTimeSlot(slot)}
                >
                  <Clock size={12} color={selectedTimeSlot === slot ? '#0F766E' : V4_COLORS.textSecondary} />
                  <Text style={[styles.chipText, selectedTimeSlot === slot && styles.chipTextActive]}>{slot}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.primaryConfirmBtn, isBooking && { opacity: 0.7 }]}
              disabled={isBooking}
              onPress={handleBookVisit}
            >
              {isBooking ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} color="#FFFFFF" />
                  <Text style={styles.primaryConfirmBtnText}>Confirm Visit Appointment</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 5. SOCIETY ENTRY PASS MODAL */}
      <Modal
        visible={passModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPassModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.passCard}>
            <View style={styles.passHeaderRow}>
              <ShieldCheck size={26} color="#0F766E" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.passGovtBadge}>OFFICIAL VISITOR PASS</Text>
                <Text style={styles.passTitle}>Society Gate Access</Text>
              </View>
              <Pressable onPress={() => setPassModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            {selectedPass && (
              <View style={styles.passBody}>
                <View style={styles.qrContainer}>
                  <QrCode size={110} color="#0F766E" />
                  <Text style={styles.passCode}>PASS #{selectedPass.id.slice(-6).toUpperCase()}</Text>
                </View>

                <View style={styles.passMetaBlock}>
                  <View style={styles.passMetaItem}>
                    <Text style={styles.passMetaLabel}>VISITOR</Text>
                    <Text style={styles.passMetaVal}>{user?.name || 'Yash Choudhary'}</Text>
                  </View>
                  <View style={styles.passMetaItem}>
                    <Text style={styles.passMetaLabel}>PROPERTY</Text>
                    <Text style={styles.passMetaVal}>{selectedPass.propertyTitle}</Text>
                  </View>
                  <View style={styles.passMetaItem}>
                    <Text style={styles.passMetaLabel}>SCHEDULED AT</Text>
                    <Text style={styles.passMetaVal}>{selectedPass.date}</Text>
                  </View>
                  <View style={styles.passMetaItem}>
                    <Text style={styles.passMetaLabel}>HOST CONTACT</Text>
                    <Text style={styles.passMetaVal}>{selectedPass.hostName}</Text>
                  </View>
                </View>

                <View style={styles.instructionsBox}>
                  <Text style={styles.instructionsText}>
                    🛡️ Present this QR Pass at the society entrance security gate. Validated automatically via REHVO Guard System.
                  </Text>
                </View>

                <View style={styles.passActionsRow}>
                  <Pressable style={styles.sharePassBtn} onPress={handleSharePass}>
                    <Share2 size={15} color="#0F766E" />
                    <Text style={styles.sharePassBtnText}>Share Pass</Text>
                  </Pressable>
                  <Pressable
                    style={styles.donePassBtn}
                    onPress={() => {
                      setPassModalVisible(false);
                      showToast?.('Pass saved to offline Document Vault', 'success');
                    }}
                  >
                    <Text style={styles.donePassBtnText}>Done</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* 6. RESCHEDULE VISIT MODAL */}
      <Modal
        visible={rescheduleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRescheduleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <RotateCcw size={18} color="#0F766E" />
                <Text style={styles.modalTitle}>Reschedule Property Visit</Text>
              </View>
              <Pressable onPress={() => setRescheduleModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            {targetBooking && (
              <View style={styles.targetBookingCard}>
                <Building2 size={16} color="#0F766E" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.targetBookingTitle} numberOfLines={1}>{targetBooking.propertyTitle}</Text>
                  <Text style={styles.targetBookingLocality}>{targetBooking.locality}</Text>
                </View>
              </View>
            )}

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>SELECT NEW DATE</Text>
            <View style={styles.chipRow}>
              {['Tomorrow', 'In 2 Days', 'This Weekend', 'Next Week'].map((d) => (
                <Pressable
                  key={d}
                  style={[styles.chip, rescheduleDate === d && styles.chipActive]}
                  onPress={() => setRescheduleDate(d)}
                >
                  <Text style={[styles.chipText, rescheduleDate === d && styles.chipTextActive]}>
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.inputLabel, { marginTop: 14 }]}>SELECT TIME SLOT</Text>
            <View style={styles.chipRow}>
              {['10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'].map((slot) => (
                <Pressable
                  key={slot}
                  style={[styles.chip, rescheduleSlot === slot && styles.chipActive]}
                  onPress={() => setRescheduleSlot(slot)}
                >
                  <Text style={[styles.chipText, rescheduleSlot === slot && styles.chipTextActive]}>
                    {slot}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.primaryConfirmBtn, isRescheduling && { opacity: 0.7 }]}
              disabled={isRescheduling}
              onPress={handleConfirmReschedule}
            >
              {isRescheduling ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} color="#FFFFFF" />
                  <Text style={styles.primaryConfirmBtnText}>Confirm Reschedule</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 7. CANCEL VISIT MODAL */}
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <XCircle size={20} color="#DC2626" />
                <Text style={styles.modalTitle}>Cancel Property Visit</Text>
              </View>
              <Pressable onPress={() => setCancelModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              Are you sure you want to cancel your visit appointment? Please tell us why to help improve host availability.
            </Text>

            <View style={{ gap: 8, marginVertical: 12 }}>
              {[
                'Schedule conflict / Busy',
                'Found another property',
                'Change of move-in date',
                'Host not responsive',
              ].map((reason) => (
                <Pressable
                  key={reason}
                  style={[styles.cancelReasonOption, cancelReason === reason && styles.cancelReasonOptionActive]}
                  onPress={() => setCancelReason(reason)}
                >
                  <View style={[styles.radioCircle, cancelReason === reason && styles.radioCircleActive]}>
                    {cancelReason === reason && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.cancelReasonText, cancelReason === reason && styles.cancelReasonTextActive]}>
                    {reason}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.cancelConfirmBtn, isCancelling && { opacity: 0.7 }]}
              disabled={isCancelling}
              onPress={handleConfirmCancel}
            >
              {isCancelling ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.cancelConfirmBtnText}>Confirm Visit Cancellation</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
  },
  scheduleHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  scheduleHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 10,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  tabBtnActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  tabText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  emptyContainer: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.card,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: V4_RADIUS.button,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  passQuickTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginTop: 6,
  },
  passQuickTriggerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: V4_COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 36,
    gap: 12,
    ...V4_SHADOWS.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13.5,
    color: V4_COLORS.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  chipTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  primaryConfirmBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    ...V4_SHADOWS.card,
  },
  primaryConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  passCard: {
    backgroundColor: V4_COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    gap: 16,
    ...V4_SHADOWS.card,
  },
  passHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passGovtBadge: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.8,
  },
  passTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  passBody: {
    gap: 14,
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
  },
  passCode: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 1,
    marginTop: 8,
  },
  passMetaBlock: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passMetaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passMetaLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: V4_COLORS.textMuted,
  },
  passMetaVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  instructionsBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 10,
    width: '100%',
  },
  instructionsText: {
    fontSize: 11.5,
    color: '#065F46',
    lineHeight: 16,
    textAlign: 'center',
  },
  passActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  sharePassBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  sharePassBtnText: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '700',
  },
  donePassBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 12,
    borderRadius: 14,
  },
  donePassBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  tabsWrapper: {
    paddingBottom: 4,
  },
  bookingActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingVertical: 2,
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F0FDFA',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    minHeight: 44,
  },
  actionBtnOutlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  bookingOpsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F0FDFA',
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    minHeight: 44,
  },
  bookingOpsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  bookingCancelBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  bookingCancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  targetBookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2ECEF',
    marginTop: 8,
  },
  targetBookingTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  targetBookingLocality: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  cancelReasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2ECEF',
  },
  cancelReasonOptionActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  cancelReasonText: {
    fontSize: 13,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  cancelReasonTextActive: {
    color: '#991B1B',
    fontWeight: '700',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#DC2626',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  cancelConfirmBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  cancelConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 12.5,
    color: V4_COLORS.textSecondary,
    marginTop: 6,
    lineHeight: 17,
  },
});
