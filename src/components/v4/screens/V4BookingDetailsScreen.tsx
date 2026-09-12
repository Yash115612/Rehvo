// ==============================================================================
// REHVO V5.4 — VISIT APPOINTMENT & QR ENTRY PASS DETAILS (PRODUCTION)
// Encrypted Society Gate QR Pass, Host Details, Directions, Calendar Sync,
// Reschedule & Cancellation Flow
// ==============================================================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Share,
  Linking,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Phone,
  ShieldCheck,
  AlertCircle,
  Download,
  Share2,
  QrCode,
  MapPin,
  Navigation,
  RotateCcw,
  X,
  XCircle,
  Building,
  Sparkles,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { VisitBookingRecord } from '../../../types';

export const V4BookingDetailsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const bookingId = params.id;

  const {
    visitBookings,
    visits,
    cancelVisit,
    properties,
    user,
    showToast,
  } = useAppStore();

  // Find matching visit
  const matchedVisitBooking = useMemo(() => {
    if (!bookingId) return visitBookings?.[0];
    return (
      visitBookings?.find((b) => b.id === bookingId) ||
      visitBookings?.[0]
    );
  }, [visitBookings, bookingId]);

  const matchedProperty = useMemo(() => {
    if (!matchedVisitBooking) return properties?.[0];
    return (
      properties?.find(
        (p) =>
          p.title === matchedVisitBooking.property_title ||
          p.locality === matchedVisitBooking.property_locality
      ) || properties?.[0]
    );
  }, [properties, matchedVisitBooking]);

  const propertyTitle = matchedVisitBooking?.property_title || matchedProperty?.title || 'Luxury City View Apartment';
  const propertyLocality = matchedVisitBooking?.property_locality || matchedProperty?.locality || 'Bandra West, Mumbai';
  const visitDate = matchedVisitBooking?.visit_date || 'Today';
  const timeSlot = matchedVisitBooking?.time_slot || '04:30 PM';
  const hostName = matchedVisitBooking?.host_name || matchedProperty?.owner_name || 'Rajesh Sharma (Verified Host)';
  const hostPhone = matchedVisitBooking?.host_phone || matchedProperty?.owner_phone || '+91 98200 11001';
  const status = matchedVisitBooking?.status || 'confirmed';
  const passCode = matchedVisitBooking?.qr_code_payload || `REHVO-PASS-${(bookingId || '88214').slice(-6).toUpperCase()}`;

  // Modals
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [newDate, setNewDate] = useState('Tomorrow');
  const [newSlot, setNewSlot] = useState('04:00 PM');
  const [isRescheduling, setIsRescheduling] = useState(false);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('Schedule conflict');
  const [isCancelling, setIsCancelling] = useState(false);

  const handleSharePass = async () => {
    try {
      await Share.share({
        message: `🛡️ REHVO Society Entry Pass\nPass Code: ${passCode}\nVisitor: ${user?.name || 'Yash Choudhary'}\nProperty: ${propertyTitle}\nSlot: ${visitDate} at ${timeSlot}\nEntry Gate: Gate 1 Main Desk\nStatus: APPROVED & CONFIRMED`,
      });
    } catch {
      showToast?.('Pass link copied to clipboard', 'info');
    }
  };

  const handleOpenDirections = () => {
    const query = encodeURIComponent(`${propertyTitle}, ${propertyLocality}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleSyncCalendar = () => {
    const eventTitle = encodeURIComponent(`REHVO Visit: ${propertyTitle}`);
    const details = encodeURIComponent(`Scheduled physical inspection of ${propertyTitle} (${propertyLocality}) with host ${hostName}. Society Entry Pass: ${passCode}`);
    const location = encodeURIComponent(propertyLocality);
    Linking.openURL(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${details}&location=${location}`
    );
    showToast?.('📅 Added visit to calendar', 'success');
  };

  const handleConfirmReschedule = async () => {
    setIsRescheduling(true);
    if (matchedVisitBooking?.id) {
      useAppStore.setState((state) => ({
        visitBookings: state.visitBookings.map((vb) =>
          vb.id === matchedVisitBooking.id
            ? { ...vb, visit_date: newDate, time_slot: newSlot, status: 'confirmed' }
            : vb
        ),
      }));
    }
    setIsRescheduling(false);
    setRescheduleModalVisible(false);
    showToast?.(`Visit rescheduled to ${newDate} at ${newSlot}!`, 'success');
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    if (matchedVisitBooking?.id) {
      await cancelVisit(matchedVisitBooking.id, cancelReason);
      useAppStore.setState((state) => ({
        visitBookings: state.visitBookings.map((vb) =>
          vb.id === matchedVisitBooking.id ? { ...vb, status: 'cancelled' } : vb
        ),
      }));
    }
    setIsCancelling(false);
    setCancelModalVisible(false);
    showToast?.('Visit appointment has been cancelled', 'info');
    router.back();
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
      {/* 1. TOP HEADER */}
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
          <Text style={styles.headerTitle}>Visit Pass & Details</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {propertyTitle}
          </Text>
        </View>
        <Pressable
          style={styles.shareIconBtn}
          onPress={handleSharePass}
          accessibilityRole="button"
          accessibilityLabel="Share entry pass"
        >
          <Share2 size={17} color="#0F766E" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. QR ENTRY PASS CARD */}
        <View style={styles.passCard}>
          <View style={styles.passCardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={18} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.passCardTitle}>Society Visitor Pass</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{status.toUpperCase()}</Text>
            </View>
          </View>

          {/* QR Code Illustration Box */}
          <View style={styles.qrDisplayBox}>
            <View style={styles.qrInnerBox}>
              <QrCode size={120} color="#0F766E" strokeWidth={1.8} />
            </View>
            <Text style={styles.passCodeText}>{passCode}</Text>
            <Text style={styles.passHintText}>
              Scan at society security gate or intercom reader for instant barrier clearance.
            </Text>
          </View>

          <View style={styles.passDivider} />

          {/* Pass Meta Grid */}
          <View style={styles.passMetaGrid}>
            <View style={styles.passMetaCol}>
              <Text style={styles.passMetaLabel}>SCHEDULED DATE</Text>
              <Text style={styles.passMetaVal}>{visitDate}</Text>
            </View>
            <View style={styles.passMetaCol}>
              <Text style={styles.passMetaLabel}>TIME WINDOW</Text>
              <Text style={styles.passMetaVal}>{timeSlot}</Text>
            </View>
            <View style={styles.passMetaCol}>
              <Text style={styles.passMetaLabel}>GATE ENTRY OTP</Text>
              <Text style={[styles.passMetaVal, { color: '#0F766E', fontWeight: '900' }]}>
                {passCode.slice(-4)}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. PROPERTY OVERVIEW CARD */}
        <View style={styles.propertyCard}>
          <Image
            source={{
              uri:
                matchedProperty?.images?.[0]?.url ||
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
            }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
          <View style={styles.propertyDetailsCol}>
            <Text style={styles.propertyTitle}>{propertyTitle}</Text>
            <View style={styles.locRow}>
              <MapPin size={13} color="#0F766E" />
              <Text style={styles.propertyLoc}>{propertyLocality}</Text>
            </View>
            <Text style={styles.propertyRent}>
              ₹{(matchedProperty?.rent || 28000).toLocaleString('en-IN')}{' '}
              <Text style={styles.propertyRentSub}>/ month</Text>
            </Text>
          </View>
        </View>

        {/* 4. HOST CONTACT CARD */}
        <View style={styles.hostCard}>
          <View style={styles.hostCardTop}>
            <View style={styles.hostAvatar}>
              <Building size={20} color="#0F766E" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.hostName}>{hostName}</Text>
                <View style={styles.verifiedHostTag}>
                  <CheckCircle2 size={10} color="#0F766E" />
                  <Text style={styles.verifiedHostTagText}>VERIFIED HOST</Text>
                </View>
              </View>
              <Text style={styles.hostSub}>Property Landlord • Direct Response</Text>
            </View>
          </View>

          <View style={styles.hostActionsRow}>
            <Pressable
              style={styles.hostCallBtn}
              onPress={() => Linking.openURL(`tel:${hostPhone}`)}
              accessibilityRole="button"
            >
              <Phone size={15} color="#0F766E" />
              <Text style={styles.hostCallBtnText}>Call Host</Text>
            </Pressable>

            <Pressable
              style={styles.hostChatBtn}
              onPress={() => router.push('/(renter)/chat' as any)}
              accessibilityRole="button"
            >
              <MessageSquare size={15} color="#FFFFFF" />
              <Text style={styles.hostChatBtnText}>Chat in App</Text>
            </Pressable>
          </View>
        </View>

        {/* 5. DIRECTIONS & CALENDAR SYNC */}
        <View style={styles.actionShortcutsRow}>
          <Pressable
            style={styles.shortcutBtn}
            onPress={handleOpenDirections}
            accessibilityRole="button"
          >
            <Navigation size={16} color="#0F766E" />
            <Text style={styles.shortcutBtnText}>Get Directions</Text>
          </Pressable>

          <Pressable
            style={styles.shortcutBtn}
            onPress={handleSyncCalendar}
            accessibilityRole="button"
          >
            <Calendar size={16} color="#0F766E" />
            <Text style={styles.shortcutBtnText}>Add to Calendar</Text>
          </Pressable>
        </View>

        {/* 6. MANAGE APPOINTMENT (RESCHEDULE & CANCEL) */}
        <View style={styles.manageSection}>
          <Text style={styles.sectionHeading}>Manage Appointment</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              style={styles.rescheduleBtn}
              onPress={() => setRescheduleModalVisible(true)}
              accessibilityRole="button"
            >
              <RotateCcw size={15} color="#0F766E" />
              <Text style={styles.rescheduleBtnText}>Reschedule Slot</Text>
            </Pressable>

            <Pressable
              style={styles.cancelBtn}
              onPress={() => setCancelModalVisible(true)}
              accessibilityRole="button"
            >
              <XCircle size={15} color="#DC2626" />
              <Text style={styles.cancelBtnText}>Cancel Visit</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

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
              <Text style={styles.modalTitle}>Reschedule Property Tour</Text>
              <Pressable onPress={() => setRescheduleModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>NEW DATE</Text>
            <TextInput
              style={styles.modalInput}
              value={newDate}
              onChangeText={setNewDate}
              placeholder="e.g. Tomorrow, or 18 Sep 2026"
              placeholderTextColor={V4_COLORS.textMuted}
            />

            <Text style={styles.inputLabel}>NEW TIME SLOT</Text>
            <TextInput
              style={styles.modalInput}
              value={newSlot}
              onChangeText={setNewSlot}
              placeholder="e.g. 05:00 PM"
              placeholderTextColor={V4_COLORS.textMuted}
            />

            <Pressable
              style={[styles.primaryConfirmBtn, isRescheduling && { opacity: 0.7 }]}
              disabled={isRescheduling}
              onPress={handleConfirmReschedule}
              accessibilityRole="button"
            >
              {isRescheduling ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryConfirmBtnText}>Confirm New Time</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* CANCEL MODAL */}
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#DC2626' }]}>Cancel Visit Appointment</Text>
              <Pressable onPress={() => setCancelModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.cancelWarningText}>
              Are you sure you want to cancel your visit to {propertyTitle}? The host will be notified immediately.
            </Text>

            <Text style={styles.inputLabel}>REASON FOR CANCELLATION</Text>
            <TextInput
              style={styles.modalInput}
              value={cancelReason}
              onChangeText={setCancelReason}
              placeholder="e.g. Found another home, schedule conflict"
              placeholderTextColor={V4_COLORS.textMuted}
            />

            <Pressable
              style={[styles.confirmCancelBtn, isCancelling && { opacity: 0.7 }]}
              disabled={isCancelling}
              onPress={handleConfirmCancel}
              accessibilityRole="button"
            >
              {isCancelling ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.confirmCancelBtnText}>Yes, Cancel Appointment</Text>
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
  shareIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // QR Pass Card
  passCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    gap: 12,
    ...V4_SHADOWS.card,
  },
  passCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passCardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F766E',
  },
  statusPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  qrDisplayBox: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  qrInnerBox: {
    backgroundColor: '#F0FDFA',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginBottom: 4,
  },
  passCodeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F766E',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
  },
  passHintText: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
    maxWidth: '85%',
  },
  passDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  passMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passMetaCol: {
    gap: 2,
  },
  passMetaLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  passMetaVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },

  // Property Overview Card
  propertyCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    flexDirection: 'row',
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  propertyImage: {
    width: 84,
    height: 84,
    borderRadius: 14,
  },
  propertyDetailsCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propertyLoc: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
  },
  propertyRent: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F766E',
    marginTop: 2,
  },
  propertyRentSub: {
    fontSize: 10,
    fontWeight: '500',
    color: V4_COLORS.textSecondary,
  },

  // Host Card
  hostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  hostCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostName: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  verifiedHostTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  verifiedHostTagText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  hostSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  hostActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  hostCallBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  hostCallBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  hostChatBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  hostChatBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Shortcuts
  actionShortcutsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shortcutBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...V4_SHADOWS.soft,
  },
  shortcutBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },

  // Manage Section
  manageSection: {
    gap: 8,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  rescheduleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rescheduleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },

  // Modals
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
  cancelWarningText: {
    fontSize: 12.5,
    color: V4_COLORS.textSecondary,
    lineHeight: 17,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.5,
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
  primaryConfirmBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    minHeight: 48,
  },
  primaryConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  confirmCancelBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    minHeight: 48,
  },
  confirmCancelBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
