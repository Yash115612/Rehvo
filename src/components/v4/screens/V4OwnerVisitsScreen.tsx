import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Dimensions,
  RefreshControl,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  QrCode,
  CheckCircle2,
  XCircle,
  Phone,
  UserCheck,
  Building2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  RotateCcw,
} from 'lucide-react-native';
import { VisitCheckinRecord, VisitCheckinStatus } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CalendarMode = 'DAILY' | 'WEEKLY' | 'MONTHLY';

interface V4OwnerVisitsScreenProps {
  hideHeader?: boolean;
}

export const V4OwnerVisitsScreen: React.FC<V4OwnerVisitsScreenProps> = ({
  hideHeader = false,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    ownerVisits,
    updateVisitCheckin,
    fetchOwnerEcosystemData,
  } = useAppStore();

  const [calendarMode, setCalendarMode] = useState<CalendarMode>('WEEKLY');
  const [selectedDayOffset, setSelectedDayOffset] = useState(1); // default to tomorrow
  const [refreshing, setRefreshing] = useState(false);

  // QR Modal State
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [activeVisit, setActiveVisit] = useState<VisitCheckinRecord | null>(null);

  // Reschedule Modal State
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [newSlot, setNewSlot] = useState('Saturday, 4:00 PM');

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOwnerEcosystemData();
    setRefreshing(false);
  };

  // 7-day carousel data
  const daysList = useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6].map((offset) => {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      return {
        offset,
        dayName: offset === 0 ? 'Today' : offset === 1 ? 'Tmrw' : d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
      };
    });
  }, []);

  const handleOpenQrModal = (visit: VisitCheckinRecord) => {
    setActiveVisit(visit);
    setQrModalVisible(true);
  };

  const handleSimulateCheckin = async () => {
    if (activeVisit) {
      await updateVisitCheckin(
        activeVisit.id,
        'CHECKED_IN',
        'Verified via on-site QR Code Scanner at property gate'
      );
      setQrModalVisible(false);
    }
  };

  const handleCompleteVisit = async (visitId: string) => {
    await updateVisitCheckin(visitId, 'COMPLETED', 'Tour completed. Visitor requested draft lease.');
  };

  const handleCancelVisit = async (visitId: string) => {
    await updateVisitCheckin(visitId, 'CANCELLED', 'Cancelled by landlord/visitor request');
  };

  const handleOpenRescheduleModal = (visit: VisitCheckinRecord) => {
    setActiveVisit(visit);
    setRescheduleModalVisible(true);
  };

  const handleConfirmReschedule = async () => {
    if (activeVisit) {
      await updateVisitCheckin(
        activeVisit.id,
        'RESCHEDULED',
        `Rescheduled slot confirmed: ${newSlot}`
      );
      setRescheduleModalVisible(false);
    }
  };

  const getStatusBadge = (status: VisitCheckinStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return { bg: '#DBEAFE', color: '#1D4ED8', label: 'Scheduled' };
      case 'CHECKED_IN':
        return { bg: '#FEF3C7', color: '#B45309', label: 'Checked In' };
      case 'COMPLETED':
        return { bg: '#DCFCE7', color: '#15803D', label: 'Completed' };
      case 'RESCHEDULED':
        return { bg: '#F3E8FF', color: '#7E22CE', label: 'Rescheduled' };
      case 'CANCELLED':
      default:
        return { bg: '#FFE4E6', color: '#BE123C', label: 'Cancelled' };
    }
  };

  return (
    <View style={[styles.container, !hideHeader && { paddingTop: insets.top }]}>
      {/* Top Header */}
      {!hideHeader && (
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
          </Pressable>
          <View style={styles.topNavCenter}>
            <Text style={styles.topNavTitle}>Visit Management</Text>
            <Text style={styles.topNavSub}>Live Property Tour Calendar</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      )}

      {/* Calendar Mode Tabs */}
      <View style={styles.modeTabsRow}>
        {(['DAILY', 'WEEKLY', 'MONTHLY'] as CalendarMode[]).map((mode) => (
          <Pressable
            key={mode}
            style={[styles.modeTabBtn, calendarMode === mode && styles.modeTabBtnActive]}
            onPress={() => setCalendarMode(mode)}
          >
            <Text
              style={[styles.modeTabTxt, calendarMode === mode && styles.modeTabTxtActive]}
            >
              {mode}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 7-Day Interactive Strip */}
      <View style={styles.daysStripWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysStripScroll}
        >
          {daysList.map((day) => {
            const isSelected = selectedDayOffset === day.offset;
            return (
              <Pressable
                key={day.offset}
                style={[styles.dayCard, isSelected && styles.dayCardActive]}
                onPress={() => setSelectedDayOffset(day.offset)}
              >
                <Text style={[styles.dayNameTxt, isSelected && styles.dayNameTxtActive]}>
                  {day.dayName}
                </Text>
                <Text style={[styles.dateNumTxt, isSelected && styles.dateNumTxtActive]}>
                  {day.dateNum}
                </Text>
                <Text style={[styles.monthTxt, isSelected && styles.monthTxtActive]}>
                  {day.month}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Visits List */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0F766E" />
        }
      >
        <View style={styles.visitsHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>ALL SCHEDULED APPOINTMENTS</Text>
          <Text style={styles.visitsCountText}>{ownerVisits.length} Visits</Text>
        </View>

        {ownerVisits.length === 0 ? (
          <View style={styles.emptyState}>
            <CalendarIcon size={44} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Visits Booked</Text>
            <Text style={styles.emptySub}>
              Tenant visit requests will appear here with instant QR passes.
            </Text>
          </View>
        ) : (
          ownerVisits.map((visit) => {
            const badge = getStatusBadge(visit.checkin_status);
            const timeFormatted = new Date(visit.scheduled_time).toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <View key={visit.id} style={styles.visitCard}>
                {/* Header Row */}
                <View style={styles.visitHeaderRow}>
                  <View style={styles.propertyWrap}>
                    <Building2 size={16} color="#0F766E" />
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                      {visit.property_title}
                    </Text>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: badge.color }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                {/* Visitor Details */}
                <View style={styles.visitorRow}>
                  <Image
                    source={{
                      uri:
                        visit.visitor_avatar ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                    }}
                    style={styles.visitorAvatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.visitorName}>{visit.visitor_name}</Text>
                    <View style={styles.timeRow}>
                      <Clock size={12} color="#64748B" />
                      <Text style={styles.timeTxt}>{timeFormatted}</Text>
                    </View>
                  </View>

                  <Pressable
                    style={styles.qrBtn}
                    onPress={() => handleOpenQrModal(visit)}
                  >
                    <QrCode size={18} color="#064E3B" />
                    <Text style={styles.qrBtnTxt}>QR Pass</Text>
                  </Pressable>
                </View>

                {/* Notes if any */}
                {visit.attendance_notes ? (
                  <View style={styles.notesBox}>
                    <Text style={styles.notesTxt}>{visit.attendance_notes}</Text>
                  </View>
                ) : null}

                {/* Action Buttons */}
                <View style={styles.actionsRow}>
                  <Pressable
                    style={styles.actionBtn}
                    onPress={() => Linking.openURL(`tel:${visit.visitor_phone.replace(/\s+/g, '')}`).catch(() => {})}
                  >
                    <Phone size={14} color="#0F766E" />
                    <Text style={styles.actionBtnTxt}>Call</Text>
                  </Pressable>

                  <Pressable
                    style={styles.actionBtn}
                    onPress={() => handleOpenRescheduleModal(visit)}
                  >
                    <RotateCcw size={14} color="#2563EB" />
                    <Text style={[styles.actionBtnTxt, { color: '#2563EB' }]}>Reschedule</Text>
                  </Pressable>

                  {visit.checkin_status !== 'COMPLETED' && (
                    <Pressable
                      style={styles.completeBtn}
                      onPress={() => handleCompleteVisit(visit.id)}
                    >
                      <CheckCircle2 size={14} color="#FFFFFF" />
                      <Text style={styles.completeBtnTxt}>Complete</Text>
                    </Pressable>
                  )}

                  {visit.checkin_status !== 'CANCELLED' && visit.checkin_status !== 'COMPLETED' && (
                    <Pressable
                      style={styles.cancelBtn}
                      onPress={() => handleCancelVisit(visit.id)}
                    >
                      <XCircle size={15} color="#DC2626" />
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* =====================================================================
          QR CHECK-IN MODAL
         ===================================================================== */}
      <Modal
        visible={qrModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Tenant Visit QR Pass</Text>
              <Pressable onPress={() => setQrModalVisible(false)}>
                <Text style={{ fontSize: 16, color: '#64748B' }}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.qrModalSubtitle}>
              Scan at property gate to verify attendance and unlock security pass.
            </Text>

            {/* QR Visual */}
            <View style={styles.qrCodeContainer}>
              <QrCode size={140} color="#064E3B" strokeWidth={2} />
              <View style={styles.qrCodeBadge}>
                <ShieldCheck size={14} color="#065F46" />
                <Text style={styles.qrCodeBadgeTxt}>OFFICIALLY VERIFIED PASS</Text>
              </View>
              <Text style={styles.qrHashTxt}>
                {activeVisit?.qr_code_hash || 'REHVO-PASS-2026-X88'}
              </Text>
            </View>

            <View style={styles.qrDetailBox}>
              <Text style={styles.qrDetailLabel}>Visitor</Text>
              <Text style={styles.qrDetailVal}>{activeVisit?.visitor_name}</Text>
              <Text style={[styles.qrDetailLabel, { marginTop: 6 }]}>Property</Text>
              <Text style={styles.qrDetailVal}>{activeVisit?.property_title}</Text>
            </View>

            <View style={{ marginTop: 16, gap: 8 }}>
              <V4Button
                title="Simulate Gate Check-in"
                variant="primary"
                onPress={handleSimulateCheckin}
              />
              <V4Button
                title="Close Pass"
                variant="outline"
                onPress={() => setQrModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          RESCHEDULE MODAL
         ===================================================================== */}
      <Modal
        visible={rescheduleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRescheduleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.rescheduleModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Reschedule Visit</Text>
              <Pressable onPress={() => setRescheduleModalVisible(false)}>
                <Text style={{ fontSize: 16, color: '#64748B' }}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.qrModalSubtitle}>
              Select a new slot for {activeVisit?.visitor_name}
            </Text>

            <View style={{ gap: 8, marginVertical: 14 }}>
              {[
                'Today, 6:00 PM',
                'Tomorrow, 11:30 AM',
                'Saturday, 4:00 PM',
                'Sunday, 12:00 PM',
              ].map((slot) => (
                <Pressable
                  key={slot}
                  style={[styles.slotOption, newSlot === slot && styles.slotOptionActive]}
                  onPress={() => setNewSlot(slot)}
                >
                  <Text
                    style={[styles.slotOptionTxt, newSlot === slot && styles.slotOptionTxtActive]}
                  >
                    {slot}
                  </Text>
                </Pressable>
              ))}
            </View>

            <V4Button
              title="Confirm New Slot"
              variant="primary"
              onPress={handleConfirmReschedule}
            />
          </View>
        </View>
      </Modal>
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
  modeTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  modeTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  modeTabBtnActive: {
    backgroundColor: '#064E3B',
  },
  modeTabTxt: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  modeTabTxtActive: {
    color: '#FFFFFF',
  },
  daysStripWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
  },
  daysStripScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  dayCard: {
    width: 60,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dayCardActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  dayNameTxt: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  dayNameTxtActive: {
    color: '#A7F3D0',
  },
  dateNumTxt: {
    fontSize: 16,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  dateNumTxtActive: {
    color: '#FFFFFF',
  },
  monthTxt: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
  monthTxtActive: {
    color: '#D1FAE5',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  visitsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  visitsCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 14,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  visitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  visitHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  propertyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  propertyTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  visitorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  visitorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  visitorName: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  timeTxt: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  qrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  qrBtnTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#064E3B',
  },
  notesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
  },
  notesTxt: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionBtnTxt: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064E3B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginLeft: 'auto',
  },
  completeBtnTxt: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cancelBtn: {
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
  },
  rescheduleModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  qrModalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#F0FDFA',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  qrCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 12,
  },
  qrCodeBadgeTxt: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#065F46',
  },
  qrHashTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 6,
    letterSpacing: 1,
  },
  qrDetailBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrDetailLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  qrDetailVal: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  slotOption: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotOptionActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#059669',
  },
  slotOptionTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  slotOptionTxtActive: {
    color: '#064E3B',
    fontWeight: '800',
  },
});
