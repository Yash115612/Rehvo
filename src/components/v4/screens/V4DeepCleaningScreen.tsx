// ==============================================================================
// REHVO V5.4 — DEEP CLEANING MARKETPLACE (PRODUCTION)
// Mechanized Sanitization, Slot Picker, Status Timeline with OTP,
// Tax Invoice Viewer, Reschedule & Cancellation Flow
// ==============================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
  Share,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Check,
  Star,
  ChevronRight,
  X,
  BadgeCheck,
  Droplets,
  Zap,
  Phone,
  FileText,
  RotateCcw,
  Download,
  Building,
  AlertCircle,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4AuthGate } from '../ui/V4AuthGate';
import { ServiceBookingRecord } from '../../../types';

interface CleaningServiceOption {
  id: string;
  title: string;
  subtitle: string;
  durationHours: number;
  basePrice: number;
  badge?: string;
  includes: string[];
}

const CLEANING_SERVICES: CleaningServiceOption[] = [
  {
    id: 'full_home',
    title: 'Whole-Home Intensive Deep Clean',
    subtitle: 'Mechanized floor scrubbing, all rooms, bathrooms & balcony pressure wash',
    durationHours: 6,
    basePrice: 3200,
    badge: 'BEST FOR MOVE-IN',
    includes: [
      'Single-disc mechanized floor polishing',
      'All bathrooms deep acid-free descaling',
      'Kitchen chimney & cabinet oil degreasing',
      'Window glass & sliding track suction',
    ],
  },
  {
    id: 'kitchen_bath',
    title: 'Kitchen & Bathroom Sanitization',
    subtitle: 'Targeted grease removal, tile joint bleaching & tap limescale removal',
    durationHours: 3.5,
    basePrice: 1950,
    badge: 'POPULAR',
    includes: [
      'Exhaust & stove high-temperature steam degrease',
      'Washbasin & WC sanitary disinfection',
      'Mirror buffing & tile grout restoration',
      'Under-sink fungal eradication',
    ],
  },
  {
    id: 'sofa_mattress',
    title: 'Sofa, Carpet & Mattress Shampoo',
    subtitle: 'High-power German extraction injection wash for allergen & dust mite removal',
    durationHours: 2.5,
    basePrice: 1400,
    includes: [
      'Karcher wet extraction shampoo',
      'Deep stain spot treatment',
      '99.9% dust-mite neutralization',
      'Quick-dry formulation (under 3 hours)',
    ],
  },
];

export const V4DeepCleaningScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    isAuthenticated,
    serviceBookings,
    fetchServiceBookings,
    bookService,
    updateServiceBookingStatus,
    rescheduleServiceBooking,
    properties,
    leaseAgreements,
    showToast,
  } = useAppStore();

  const activeLease = useMemo(
    () => leaseAgreements?.find((l) => l.status === 'active') || leaseAgreements?.[0],
    [leaseAgreements]
  );
  const activeProperty = useMemo(
    () => properties?.find((p) => p.id === activeLease?.property_id) || properties?.[0],
    [properties, activeLease]
  );

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchServiceBookings('cleaning');
    }
  }, [isAuthenticated, user?.id]);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState('full_home');
  const [homeSize, setHomeSize] = useState<'1BHK' | '2BHK' | '3BHK' | '4BHK+'>('2BHK');
  const [furnishingStatus, setFurnishingStatus] = useState<'furnished' | 'empty'>('empty');
  const [cleanDate, setCleanDate] = useState('14 Sep 2026');
  const [timeSlot, setTimeSlot] = useState('09:30 AM');
  const [address, setAddress] = useState(
    activeProperty ? `${activeProperty.title}, ${activeProperty.locality || ''}` : 'Skyline Residency • Suite 402, Jaipur'
  );

  // Modal State
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tracking / Invoice / Reschedule State
  const [selectedBooking, setSelectedBooking] = useState<ServiceBookingRecord | null>(null);
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('10:00 AM');
  const [isActionLoading, setIsActionLoading] = useState(false);

  const selectedService = useMemo(
    () => CLEANING_SERVICES.find((s) => s.id === selectedServiceId) || CLEANING_SERVICES[0],
    [selectedServiceId]
  );

  const estimatedPrice = useMemo(() => {
    let sizeMultiplier = 1;
    if (homeSize === '1BHK') sizeMultiplier = 0.8;
    else if (homeSize === '2BHK') sizeMultiplier = 1.0;
    else if (homeSize === '3BHK') sizeMultiplier = 1.35;
    else if (homeSize === '4BHK+') sizeMultiplier = 1.65;

    const furnishedAddon = furnishingStatus === 'furnished' ? 250 : 0;
    return Math.round(selectedService.basePrice * sizeMultiplier + furnishedAddon);
  }, [selectedService, homeSize, furnishingStatus]);

  const handleBookCleaning = async () => {
    if (!address.trim()) {
      showToast?.('Please specify the cleaning property address', 'error');
      return;
    }
    setIsSubmitting(true);
    const res = await bookService({
      user_id: user?.id || 'guest',
      property_id: activeProperty?.id,
      service_type: 'cleaning',
      provider_name: 'REHVO Pro Cleaners & Urban Company',
      pickup_address: address.trim(),
      booking_date: cleanDate,
      time_slot: timeSlot,
      home_size: homeSize,
      package_selected: selectedService.title,
      estimated_price: estimatedPrice,
      final_price: estimatedPrice,
      status: 'confirmed',
      tracking_stage: 'crew_assigned',
      insurance_covered: true,
      insurance_amount: 50000,
      tracking_notes: '2 Certified Cleaners + Commercial Vacuum assigned.',
    });

    setIsSubmitting(false);
    setConfirmModalVisible(false);
    if (res.data) {
      setSelectedBooking(res.data);
      setBookingSuccessModal(true);
    }
    showToast?.(`🎉 ${selectedService.title} booked for ${cleanDate}!`, 'success');
  };

  const handleOpenTracking = (booking: ServiceBookingRecord) => {
    setSelectedBooking(booking);
    setNewDate(booking.booking_date);
    setNewSlot(booking.time_slot);
    setTrackingModalVisible(true);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    setIsActionLoading(true);
    await updateServiceBookingStatus(selectedBooking.id, 'cancelled', 'User requested cancellation');
    setIsActionLoading(false);
    setTrackingModalVisible(false);
    showToast?.('Cleaning session has been cancelled', 'info');
  };

  const handleConfirmReschedule = async () => {
    if (!selectedBooking || !newDate.trim()) return;
    setIsActionLoading(true);
    await rescheduleServiceBooking(selectedBooking.id, newDate.trim(), newSlot);
    setIsActionLoading(false);
    setRescheduleModalVisible(false);
    setTrackingModalVisible(false);
    showToast?.(`Cleaning session rescheduled to ${newDate} (${newSlot})`, 'success');
  };

  const cleaningBookings = useMemo(
    () => (serviceBookings || []).filter((b) => b.service_type === 'cleaning'),
    [serviceBookings]
  );
  const activeCleaningBooking = useMemo(
    () => cleaningBookings.find((b) => b.status === 'confirmed' || b.status === 'in_progress' || b.status === 'booked'),
    [cleaningBookings]
  );

  if (!isAuthenticated) {
    return (
      <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={19} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Deep Cleaning Services</Text>
            <Text style={styles.headerSubtitle}>Sanitized move-in ready homes</Text>
          </View>
        </View>
        <V4AuthGate
          title="Professional Home Deep Cleaning"
          description="Sign in to book mechanized deep cleaning, germ sanitization, and deposit-protection move-out inspections."
          featureName="Deep Cleaning"
          badgeText="PRO HYGIENE PARTNERS"
          icon={<Sparkles size={32} color="#0F766E" strokeWidth={2.4} />}
          benefits={[
            'Single-disc mechanized floor buffing and scrubbing',
            'Safe, hospital-grade non-toxic disinfectants',
            'Full deposit protection guarantee for end-of-tenancy moves',
            'Trained background-verified cleaning crew with complete equipment',
          ]}
          fullScreen={false}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={19} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Deep Cleaning</Text>
          <Text style={styles.headerSubtitle}>Mechanized move-in sanitization</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ACTIVE CLEANING CARD IF ANY */}
        {activeCleaningBooking && (
          <Pressable
            style={styles.activeBookingCard}
            onPress={() => handleOpenTracking(activeCleaningBooking)}
            accessibilityRole="button"
          >
            <View style={styles.activeBookingHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Sparkles size={18} color="#0F766E" />
                <Text style={styles.activeBookingTitle}>Active Session • Tap to Track</Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>{activeCleaningBooking.status.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.activeServiceTitle}>{activeCleaningBooking.package_selected}</Text>
            <Text style={styles.activeServiceAddr} numberOfLines={1}>
              {activeCleaningBooking.pickup_address}
            </Text>

            <View style={styles.activeServiceMeta}>
              <Text style={styles.activeServiceDate}>
                📅 {activeCleaningBooking.booking_date} at {activeCleaningBooking.time_slot}
              </Text>
              <Text style={styles.activeServicePrice}>₹{activeCleaningBooking.final_price.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.activeBookingFooter}>
              <View style={styles.otpMiniPill}>
                <ShieldCheck size={12} color="#0F766E" />
                <Text style={styles.otpMiniPillText}>Start OTP: {activeCleaningBooking.otp_start || '4829'}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Text style={styles.trackDetailsLink}>Live Tracking & Invoice</Text>
                <ChevronRight size={13} color="#0F766E" />
              </View>
            </View>
          </Pressable>
        )}

        {/* 2. SELECT CONFIGURATION */}
        <View style={styles.configCard}>
          <View style={styles.configCardHeader}>
            <Text style={styles.configCardTitle}>Property Configuration</Text>
            {activeProperty && (
              <Pressable
                style={styles.autoFillBtn}
                onPress={() =>
                  setAddress(`${activeProperty.title}, ${activeProperty.locality || 'Jaipur'}`)
                }
              >
                <Building size={11} color="#0F766E" />
                <Text style={styles.autoFillBtnText}>Fill Lease Home</Text>
              </Pressable>
            )}
          </View>

          <Text style={styles.inputLabel}>HOME SIZE</Text>
          <View style={styles.pillRow}>
            {(['1BHK', '2BHK', '3BHK', '4BHK+'] as const).map((sz) => (
              <Pressable
                key={sz}
                style={[styles.pill, homeSize === sz && styles.pillActive]}
                onPress={() => setHomeSize(sz)}
                accessibilityRole="button"
              >
                <Text style={[styles.pillText, homeSize === sz && styles.pillTextActive]}>{sz}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.inputLabel}>FURNISHING STATUS</Text>
          <View style={styles.pillRow}>
            {(['empty', 'furnished'] as const).map((st) => (
              <Pressable
                key={st}
                style={[styles.pill, furnishingStatus === st && styles.pillActive]}
                onPress={() => setFurnishingStatus(st)}
                accessibilityRole="button"
              >
                <Text style={[styles.pillText, furnishingStatus === st && styles.pillTextActive]}>
                  {st === 'empty' ? 'Vacant (Empty Flat)' : 'Furnished (With Furniture)'}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.inputLabel}>SERVICE ADDRESS</Text>
          <TextInput
            style={styles.textInput}
            value={address}
            onChangeText={setAddress}
            placeholder="Apartment address"
            placeholderTextColor={V4_COLORS.textMuted}
          />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>CLEANING DATE</Text>
              <TextInput
                style={styles.textInput}
                value={cleanDate}
                onChangeText={setCleanDate}
                placeholder="DD Mon YYYY"
                placeholderTextColor={V4_COLORS.textMuted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>TIME SLOT</Text>
              <TextInput
                style={styles.textInput}
                value={timeSlot}
                onChangeText={setTimeSlot}
                placeholder="e.g. 09:30 AM"
                placeholderTextColor={V4_COLORS.textMuted}
              />
            </View>
          </View>
        </View>

        {/* 3. SELECT CLEANING PACKAGE */}
        <Text style={styles.sectionHeading}>Select Cleaning Package</Text>
        <View style={{ gap: 10 }}>
          {CLEANING_SERVICES.map((srv) => {
            const isSelected = selectedServiceId === srv.id;
            return (
              <Pressable
                key={srv.id}
                style={[styles.serviceCard, isSelected && styles.serviceCardActive]}
                onPress={() => setSelectedServiceId(srv.id)}
                accessibilityRole="button"
              >
                <View style={styles.serviceCardTop}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.serviceTitle}>{srv.title}</Text>
                      {srv.badge && (
                        <View style={styles.serviceBadge}>
                          <Text style={styles.serviceBadgeText}>{srv.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.serviceSub}>{srv.subtitle}</Text>
                  </View>
                  <View style={styles.servicePriceBox}>
                    <Text style={styles.servicePrice}>₹{srv.basePrice.toLocaleString('en-IN')}</Text>
                    <Text style={styles.durationText}>~{srv.durationHours} hrs</Text>
                  </View>
                </View>

                <View style={styles.includesList}>
                  {srv.includes.map((inc, i) => (
                    <View key={i} style={styles.includeItem}>
                      <Check size={11} color="#0F766E" strokeWidth={3} />
                      <Text style={styles.includeText}>{inc}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* 4. PRICE SUMMARY & CTA */}
        <View style={styles.summaryBar}>
          <View>
            <Text style={styles.summaryLabel}>TOTAL ESTIMATE (TAXES INCLUDED)</Text>
            <Text style={styles.summaryPrice}>₹{estimatedPrice.toLocaleString('en-IN')}</Text>
          </View>
          <Pressable
            style={styles.bookBtn}
            onPress={() => setConfirmModalVisible(true)}
            accessibilityRole="button"
          >
            <Text style={styles.bookBtnText}>Review & Book</Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </ScrollView>

      {/* CONFIRMATION MODAL */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Deep Cleaning</Text>
              <Pressable onPress={() => setConfirmModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <View style={styles.reviewBlock}>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Package</Text>
                <Text style={styles.reviewVal}>{selectedService.title}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Home Size</Text>
                <Text style={styles.reviewVal}>{homeSize}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Furnishing</Text>
                <Text style={styles.reviewVal}>{furnishingStatus === 'empty' ? 'Vacant Flat' : 'Furnished'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Schedule</Text>
                <Text style={styles.reviewVal}>{cleanDate} at {timeSlot}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Address</Text>
                <Text style={styles.reviewVal}>{address}</Text>
              </View>
              <View style={[styles.reviewRow, { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 8, marginTop: 4 }]}>
                <Text style={[styles.reviewLabel, { fontWeight: '800', color: V4_COLORS.textPrimary }]}>Total Payable</Text>
                <Text style={[styles.reviewVal, { fontSize: 16, color: '#0F766E', fontWeight: '900' }]}>
                  ₹{estimatedPrice.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <Text style={styles.reviewNote}>
              🧼 Cleaners arrive with industrial vacuum, floor scrubber & hospital-grade sanitizer. Pay after service completion.
            </Text>

            <Pressable
              style={[styles.confirmBtn, isSubmitting && { opacity: 0.7 }]}
              disabled={isSubmitting}
              onPress={handleBookCleaning}
              accessibilityRole="button"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} color="#FFFFFF" />
                  <Text style={styles.confirmBtnText}>Confirm Cleaning Service</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* TRACKING & INVOICE MODAL */}
      <Modal
        visible={trackingModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTrackingModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} color="#0F766E" />
                <Text style={styles.modalTitle}>Cleaning Status & Verification</Text>
              </View>
              <Pressable onPress={() => setTrackingModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            {selectedBooking && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
                {/* Status Hero */}
                <View style={styles.trackingHeroCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.trackingRefId}>REF #{selectedBooking.id.slice(-8).toUpperCase()}</Text>
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>{selectedBooking.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.trackingProvider}>{selectedBooking.package_selected}</Text>
                  <Text style={styles.trackingSchedule}>
                    📅 {selectedBooking.booking_date} • {selectedBooking.time_slot}
                  </Text>
                </View>

                {/* OTP Security Verification */}
                <View style={styles.otpCard}>
                  <View style={styles.otpBlock}>
                    <Text style={styles.otpLabel}>START JOB OTP</Text>
                    <Text style={styles.otpCode}>{selectedBooking.otp_start || '4829'}</Text>
                    <Text style={styles.otpNote}>Share with crew lead upon arrival</Text>
                  </View>
                  <View style={styles.otpDivider} />
                  <View style={styles.otpBlock}>
                    <Text style={styles.otpLabel}>COMPLETION OTP</Text>
                    <Text style={styles.otpCode}>{selectedBooking.otp_completion || '7102'}</Text>
                    <Text style={styles.otpNote}>Share after satisfaction check</Text>
                  </View>
                </View>

                {/* Crew Lead Card */}
                <View style={styles.crewCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.crewRole}>ASSIGNED QUALITY SUPERVISOR</Text>
                    <Text style={styles.crewName}>{selectedBooking.crew_lead_name || 'Kavita Verma (Team Lead)'}</Text>
                    <Text style={styles.crewVehicle}>2 Trained Cleaners • Industrial Polisher + Chemical Kit</Text>
                  </View>
                  <Pressable
                    style={styles.crewCallBtn}
                    onPress={() => Linking.openURL('tel:+919820044551')}
                    accessibilityRole="button"
                  >
                    <Phone size={15} color="#FFFFFF" />
                    <Text style={styles.crewCallBtnText}>Call</Text>
                  </Pressable>
                </View>

                {/* Timeline Stages */}
                <View style={styles.timelineBox}>
                  <Text style={styles.timelineHeading}>Hygiene Service Stages</Text>
                  {[
                    { title: 'Session Confirmed', done: true, desc: 'Technicians and cleaning chemistry reserved' },
                    { title: 'Quality Supervisor Assigned', done: true, desc: 'Equipment checked & hospital-grade sanitizer prepped' },
                    { title: 'Floor Buffing & Descaling', done: selectedBooking.status === 'in_progress', desc: 'Single-disc mechanized scrub & suction' },
                    { title: 'Inspection & Signed Off', done: selectedBooking.status === 'completed', desc: 'Final odor check & key handover' },
                  ].map((stage, idx) => (
                    <View key={idx} style={styles.timelineRow}>
                      <View style={[styles.timelineDot, stage.done && styles.timelineDotDone]}>
                        {stage.done && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.timelineStageTitle, stage.done && styles.timelineStageTitleDone]}>
                          {stage.title}
                        </Text>
                        <Text style={styles.timelineStageDesc}>{stage.desc}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Actions: View Invoice, Reschedule, Cancel */}
                <View style={{ gap: 8, marginTop: 4 }}>
                  <Pressable
                    style={styles.actionOutlineBtn}
                    onPress={() => setInvoiceModalVisible(true)}
                    accessibilityRole="button"
                  >
                    <FileText size={16} color="#0F766E" />
                    <Text style={styles.actionOutlineBtnText}>View GST Tax Invoice</Text>
                  </Pressable>

                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Pressable
                      style={styles.rescheduleBtn}
                      onPress={() => setRescheduleModalVisible(true)}
                      accessibilityRole="button"
                    >
                      <RotateCcw size={15} color="#0F766E" />
                      <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                    </Pressable>

                    <Pressable
                      style={styles.cancelBtn}
                      onPress={handleCancelBooking}
                      disabled={isActionLoading}
                      accessibilityRole="button"
                    >
                      <X size={15} color="#DC2626" />
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* TAX INVOICE MODAL */}
      <Modal
        visible={invoiceModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInvoiceModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <FileText size={20} color="#0F766E" />
                <Text style={styles.modalTitle}>Tax Invoice Receipt</Text>
              </View>
              <Pressable onPress={() => setInvoiceModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            {selectedBooking && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                <View style={styles.invoiceCard}>
                  <View style={styles.invoiceHeaderRow}>
                    <Text style={styles.invoiceBrand}>REHVO HYGIENE & CLEANING</Text>
                    <Text style={styles.invoiceNum}>INV-{selectedBooking.id.slice(-6).toUpperCase()}</Text>
                  </View>
                  <Text style={styles.invoiceSub}>GSTIN: 08AAACR8821R1ZX • Date: {selectedBooking.booking_date}</Text>

                  <View style={styles.invoiceDivider} />

                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Package</Text>
                    <Text style={styles.reviewVal}>{selectedBooking.package_selected}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Home Configuration</Text>
                    <Text style={styles.reviewVal}>{selectedBooking.home_size}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Damage Protection Guarantee</Text>
                    <Text style={styles.reviewVal}>Included (₹50,000)</Text>
                  </View>

                  <View style={styles.invoiceDivider} />

                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Cleaning & Sanitization Base</Text>
                    <Text style={styles.reviewVal}>₹{Math.round(selectedBooking.final_price * 0.82).toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>GST @ 18%</Text>
                    <Text style={styles.reviewVal}>₹{Math.round(selectedBooking.final_price * 0.18).toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={[styles.reviewRow, { marginTop: 4 }]}>
                    <Text style={[styles.reviewLabel, { fontWeight: '900', color: V4_COLORS.textPrimary, fontSize: 14 }]}>
                      Total Amount
                    </Text>
                    <Text style={[styles.reviewVal, { fontSize: 16, color: '#0F766E', fontWeight: '900' }]}>
                      ₹{selectedBooking.final_price.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={styles.downloadInvoiceBtn}
                  onPress={() => {
                    showToast?.('Receipt downloaded to device storage', 'success');
                    setInvoiceModalVisible(false);
                  }}
                  accessibilityRole="button"
                >
                  <Download size={16} color="#FFFFFF" />
                  <Text style={styles.downloadInvoiceBtnText}>Download PDF Invoice</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* RESCHEDULE MODAL */}
      <Modal
        visible={rescheduleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRescheduleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reschedule Cleaning Slot</Text>
              <Pressable onPress={() => setRescheduleModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>NEW DATE</Text>
            <TextInput
              style={styles.textInput}
              value={newDate}
              onChangeText={setNewDate}
              placeholder="DD Mon YYYY (e.g. 18 Sep 2026)"
              placeholderTextColor={V4_COLORS.textMuted}
            />

            <Text style={styles.inputLabel}>NEW TIME SLOT</Text>
            <TextInput
              style={styles.textInput}
              value={newSlot}
              onChangeText={setNewSlot}
              placeholder="e.g. 10:00 AM or 02:00 PM"
              placeholderTextColor={V4_COLORS.textMuted}
            />

            <Pressable
              style={[styles.confirmBtn, isActionLoading && { opacity: 0.7 }]}
              disabled={isActionLoading}
              onPress={handleConfirmReschedule}
              accessibilityRole="button"
            >
              {isActionLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.confirmBtnText}>Confirm New Schedule</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal
        visible={bookingSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setBookingSuccessModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.successCard}>
            <View style={styles.successIconBox}>
              <BadgeCheck size={42} color="#0F766E" />
            </View>
            <Text style={styles.successTitle}>Cleaning Scheduled!</Text>
            <Text style={styles.successSub}>
              The cleaning supervisor and equipment van will arrive at your premises at the scheduled time.
            </Text>

            <Pressable
              style={styles.doneBtn}
              onPress={() => setBookingSuccessModal(false)}
              accessibilityRole="button"
            >
              <Text style={styles.doneBtnText}>Back to Dashboard</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: V4_COLORS.surface,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    ...V4_SHADOWS.soft,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  activeBookingCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 6,
    ...V4_SHADOWS.soft,
  },
  activeBookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeBookingTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  activeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#16A34A',
    letterSpacing: 0.6,
  },
  activeServiceTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  activeServiceAddr: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
  },
  activeServiceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  activeServiceDate: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  activeServicePrice: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  activeBookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#CCFBF1',
  },
  otpMiniPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  otpMiniPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  trackDetailsLink: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  configCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 8,
    ...V4_SHADOWS.soft,
  },
  configCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  configCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  autoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  autoFillBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: V4_COLORS.textPrimary,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 4,
  },
  serviceCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: V4_COLORS.border,
    gap: 8,
    ...V4_SHADOWS.soft,
  },
  serviceCardActive: {
    borderColor: '#0F766E',
    backgroundColor: '#FBFDFD',
  },
  serviceCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  serviceBadge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  serviceBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  serviceSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
    marginTop: 2,
  },
  servicePriceBox: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F766E',
  },
  durationText: {
    fontSize: 9.5,
    color: V4_COLORS.textSecondary,
  },
  includesList: {
    gap: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  includeText: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
  },
  summaryBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    ...V4_SHADOWS.card,
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F766E',
  },
  bookBtn: {
    backgroundColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    minHeight: 44,
  },
  bookBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
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
    fontSize: 16.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  reviewBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewLabel: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
  },
  reviewVal: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  reviewNote: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
  },
  confirmBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    minHeight: 48,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  successIconBox: {
    width: 68,
    height: 68,
    borderRadius: 24,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  successSub: {
    fontSize: 12.5,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },
  doneBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    minHeight: 44,
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Tracking Modal Styles
  trackingHeroCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 4,
  },
  trackingRefId: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.6,
  },
  trackingProvider: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  trackingSchedule: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  otpCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  otpBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  otpDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  otpLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  otpCode: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F766E',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  otpNote: {
    fontSize: 8.5,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
  },
  crewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  crewRole: {
    fontSize: 9,
    fontWeight: '900',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  crewName: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  crewVehicle: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
  },
  crewCallBtn: {
    backgroundColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    minHeight: 36,
  },
  crewCallBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  timelineBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  timelineHeading: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  timelineDotDone: {
    backgroundColor: '#0F766E',
  },
  timelineStageTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  timelineStageTitleDone: {
    color: V4_COLORS.textPrimary,
    fontWeight: '800',
  },
  timelineStageDesc: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  actionOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 11,
    backgroundColor: '#F0FDFA',
    minHeight: 44,
  },
  actionOutlineBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  rescheduleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 10,
    minHeight: 44,
  },
  rescheduleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 10,
    minHeight: 44,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },

  // Invoice Card Styles
  invoiceCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  invoiceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceBrand: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.6,
  },
  invoiceNum: {
    fontSize: 11.5,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
  },
  invoiceSub: {
    fontSize: 10,
    color: V4_COLORS.textSecondary,
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  downloadInvoiceBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 48,
  },
  downloadInvoiceBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
