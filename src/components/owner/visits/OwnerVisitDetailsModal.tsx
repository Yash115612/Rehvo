import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  Phone,
  MessageCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MoreVertical,
} from 'lucide-react-native';
import { Visit, Property, VisitStatus } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';

interface OwnerVisitDetailsModalProps {
  visit: Visit | null;
  property: Property | null;
  visible: boolean;
  onClose: () => void;
  onViewProperty: (prop: Property) => void;
  onOpenReschedule: (visit: Visit) => void;
  onOpenCancel: (visit: Visit) => void;
}

export const OwnerVisitDetailsModal: React.FC<
  OwnerVisitDetailsModalProps
> = ({
  visit,
  property,
  visible,
  onClose,
  onViewProperty,
  onOpenReschedule,
  onOpenCancel,
}) => {
  const { updateVisitStatus, showToast } = useAppStore();

  if (!visit) return null;

  const isPending = visit.status === 'REQUESTED';
  const isConfirmed = visit.status === 'CONFIRMED';
  const isRescheduled = visit.status === 'RESCHEDULED';
  const isCompleted = visit.status === 'COMPLETED';
  const isCancelled = visit.status === 'CANCELLED';

  const getStatusBadge = (status: VisitStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return { label: 'Confirmed', bg: '#EAF8F0', text: '#32B768' };
      case 'REQUESTED':
        return { label: 'Pending Confirmation', bg: '#FEF3C7', text: '#D97706' };
      case 'RESCHEDULED':
        return { label: 'Reschedule Requested', bg: '#FEF3C7', text: '#D97706' };
      case 'COMPLETED':
        return { label: 'Completed', bg: '#EAF8F0', text: '#32B768' };
      case 'CANCELLED':
      default:
        return { label: 'Cancelled', bg: '#F3F0EA', text: '#777482' };
    }
  };

  const statusInfo = getStatusBadge(visit.status);
  const avatarUri =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  const coverImage =
    visit.property_image ||
    property?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

  const handleConfirmVisit = () => {
    updateVisitStatus(visit.id, 'CONFIRMED');
    showToast('Visit confirmed successfully!', 'success');
  };

  const handleMarkCompleted = () => {
    updateVisitStatus(visit.id, 'COMPLETED');
    showToast('Visit marked as completed.', 'success');
  };

  const handleWhatsApp = () => {
    const rawPhone = visit.renter_phone.replace(/\D/g, '') || '919876543210';
    const message = `Hi ${visit.renter_name}, regarding your scheduled visit for "${visit.property_title}" on ${visit.date} at ${visit.time}. Looking forward to seeing you!`;
    const url = `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {});
  };

  const handleCall = () => {
    Linking.openURL(`tel:${visit.renter_phone}`).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* 1. Dedicated Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={onClose}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Back to visits"
          >
            <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
          </Pressable>

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Visit Details</Text>
            <Text style={styles.headerSubtitle}>{visit.date}</Text>
          </View>

          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 2. Date & Time Status Card */}
          <View style={styles.dateTimeCard}>
            <View style={styles.dateTimeRow}>
              <View style={styles.calendarIconCircle}>
                <CalendarDays size={24} color="#6C4DFF" strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dateHeadline}>{visit.date}</Text>
                <View style={styles.timeRow}>
                  <Clock size={13} color="#777482" strokeWidth={2} />
                  <Text style={styles.timeSub}>{visit.time}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusInfo.bg },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: statusInfo.text },
                  ]}
                >
                  {statusInfo.label}
                </Text>
              </View>
            </View>
          </View>

          {/* 3. Renter Profile Info */}
          <View style={styles.renterCard}>
            <Image source={{ uri: avatarUri }} style={styles.renterAvatar} />
            <View style={styles.renterInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.renterName}>{visit.renter_name}</Text>
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={12} color="#32B768" strokeWidth={2.5} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
              <Text style={styles.phoneText}>{visit.renter_phone}</Text>
            </View>

            <View style={styles.contactActions}>
              <Pressable
                style={styles.iconBtn}
                onPress={handleWhatsApp}
                accessibilityRole="button"
                accessibilityLabel="WhatsApp renter"
              >
                <MessageCircle size={18} color="#6C4DFF" strokeWidth={2.2} />
              </Pressable>
              <Pressable
                style={styles.iconBtn}
                onPress={handleCall}
                accessibilityRole="button"
                accessibilityLabel="Call renter"
              >
                <Phone size={18} color="#32B768" strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>

          {/* 4. Property Context Card */}
          <Pressable
            style={styles.propertyCard}
            onPress={() => {
              if (property) onViewProperty(property);
            }}
            accessibilityRole="button"
            accessibilityLabel="View property details"
          >
            <Image source={{ uri: coverImage }} style={styles.propThumb} />
            <View style={styles.propInfo}>
              <Text style={styles.propTitle} numberOfLines={1}>
                {visit.property_title}
              </Text>
              <View style={styles.locRow}>
                <MapPin size={11} color="#777482" strokeWidth={2} />
                <Text style={styles.locText}>
                  {visit.property_locality}, Mumbai
                </Text>
              </View>
              <Text style={styles.rentText}>
                ₹{visit.rent.toLocaleString('en-IN')} / month
              </Text>
            </View>
          </Pressable>

          {/* 5. Notes / Instructions */}
          {visit.notes ? (
            <View style={styles.notesCard}>
              <Text style={styles.notesLabel}>Notes from renter</Text>
              <Text style={styles.notesText}>"{visit.notes}"</Text>
            </View>
          ) : null}

          {/* 6. Action Buttons Grid */}
          <View style={styles.actionsSection}>
            <Text style={styles.actionsLabel}>Manage Visit</Text>

            {/* Pending State -> Confirm or Cancel */}
            {isPending && (
              <View style={styles.btnStack}>
                <Pressable
                  style={styles.confirmBtn}
                  onPress={handleConfirmVisit}
                >
                  <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.2} />
                  <Text style={styles.confirmBtnText}>Confirm Visit</Text>
                </Pressable>

                <Pressable
                  style={styles.secondaryBtn}
                  onPress={() => onOpenReschedule(visit)}
                >
                  <RefreshCw size={16} color="#171522" strokeWidth={2.2} />
                  <Text style={styles.secondaryBtnText}>
                    Suggest Another Time
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Confirmed State -> Reschedule, Mark Completed, or Cancel */}
            {isConfirmed && (
              <View style={styles.btnStack}>
                <Pressable
                  style={styles.completeBtn}
                  onPress={handleMarkCompleted}
                >
                  <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.2} />
                  <Text style={styles.completeBtnText}>
                    Mark as Completed
                  </Text>
                </Pressable>

                <View style={styles.btnRow}>
                  <Pressable
                    style={styles.rescheduleBtn}
                    onPress={() => onOpenReschedule(visit)}
                  >
                    <RefreshCw size={16} color="#6C4DFF" strokeWidth={2.2} />
                    <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                  </Pressable>

                  <Pressable
                    style={styles.cancelBtn}
                    onPress={() => onOpenCancel(visit)}
                  >
                    <XCircle size={16} color="#E5484D" strokeWidth={2.2} />
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Rescheduled State */}
            {isRescheduled && (
              <View style={styles.btnStack}>
                <Pressable
                  style={styles.confirmBtn}
                  onPress={handleConfirmVisit}
                >
                  <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.2} />
                  <Text style={styles.confirmBtnText}>Approve Time</Text>
                </Pressable>

                <Pressable
                  style={styles.cancelBtn}
                  onPress={() => onOpenCancel(visit)}
                >
                  <XCircle size={16} color="#E5484D" strokeWidth={2.2} />
                  <Text style={styles.cancelBtnText}>Cancel Visit</Text>
                </Pressable>
              </View>
            )}

            {/* Completed or Cancelled State */}
            {(isCompleted || isCancelled) && (
              <View style={styles.statusNotice}>
                <Text style={styles.statusNoticeText}>
                  This visit has been{' '}
                  {isCompleted ? 'completed' : 'cancelled'}.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E5EC',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  dateTimeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calendarIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateHeadline: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  timeSub: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  renterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
    gap: 12,
  },
  renterAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E8E5EC',
  },
  renterInfo: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  renterName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#32B768',
  },
  phoneText: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 12,
    gap: 12,
  },
  propThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#E8E5EC',
  },
  propInfo: {
    flex: 1,
    gap: 2,
  },
  propTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locText: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
  rentText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6C4DFF',
    marginTop: 1,
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
    gap: 4,
  },
  notesLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
  },
  notesText: {
    fontSize: 13,
    color: '#171522',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  actionsSection: {
    gap: 10,
    marginTop: 6,
  },
  actionsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  btnStack: {
    gap: 10,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#32B768',
  },
  confirmBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
  },
  completeBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
  },
  secondaryBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rescheduleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F0ECFF',
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  rescheduleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FEEFEF',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E5484D',
  },
  statusNotice: {
    backgroundColor: '#F7F5F0',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  statusNoticeText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#777482',
  },
});
