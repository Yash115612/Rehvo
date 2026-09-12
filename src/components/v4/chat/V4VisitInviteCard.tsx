import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Linking } from 'react-native';
import { Calendar, Clock, MapPin, Check, X, RefreshCw, QrCode, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { VisitMessageMeta } from '../../../types';
import { V4_SHADOWS } from '../../../theme/v4Theme';

interface V4VisitInviteCardProps {
  visit: VisitMessageMeta;
  isMe?: boolean;
  onAccept?: () => void;
  onReschedule?: () => void;
  onDecline?: () => void;
}

export const V4VisitInviteCard: React.FC<V4VisitInviteCardProps> = ({
  visit,
  isMe = false,
  onAccept,
  onReschedule,
  onDecline,
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const isConfirmed = visit.status === 'confirmed';
  const isDeclined = visit.status === 'declined';

  const handleCalendarSync = () => {
    const title = encodeURIComponent(`REHVO Tour: ${visit.property_title || 'Flat Tour'}`);
    const details = encodeURIComponent(`Physical property site tour booked via REHVO with verified host. Location: ${visit.location || 'Property'}.`);
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${encodeURIComponent(visit.location || 'Mumbai')}`;
    Linking.openURL(calUrl).catch(() => {});
  };

  return (
    <>
      <View style={[styles.card, isMe ? styles.cardMe : styles.cardOther]}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.iconBox}>
            <Calendar size={15} color="#0F766E" strokeWidth={2.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, isMe && styles.titleMe]}>
              {isConfirmed ? 'Site Visit Confirmed' : 'Site Visit Invitation'}
            </Text>
            <Text style={[styles.subText, isMe && styles.subTextMe]} numberOfLines={1}>
              {visit.property_title || 'Verified Property Tour'}
            </Text>
          </View>

          <View
            style={[
              styles.statusPill,
              isConfirmed && styles.statusPillConfirmed,
              isDeclined && styles.statusPillDeclined,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isConfirmed && styles.statusTextConfirmed,
                isDeclined && styles.statusTextDeclined,
              ]}
            >
              {isConfirmed ? 'Confirmed' : isDeclined ? 'Declined' : 'Pending'}
            </Text>
          </View>
        </View>

        {/* Slots Info */}
        <View style={[styles.detailsBox, isMe && styles.detailsBoxMe]}>
          <View style={styles.detailRow}>
            <Clock size={13} color={isMe ? '#99F6E4' : '#0F766E'} />
            <Text style={[styles.detailText, isMe && styles.detailTextMe]}>
              {visit.date || 'Tomorrow'}, {visit.time || '5:00 PM'}
            </Text>
          </View>

          {visit.location && (
            <View style={[styles.detailRow, { marginTop: 4 }]}>
              <MapPin size={13} color={isMe ? '#99F6E4' : '#0F766E'} />
              <Text style={[styles.detailText, isMe && styles.detailTextMe]} numberOfLines={1}>
                {visit.location}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons (If not confirmed yet) */}
        {!isConfirmed && !isDeclined && (
          <View style={styles.actionRow}>
            <Pressable style={[styles.btn, styles.btnDecline]} onPress={onDecline}>
              <X size={12} color="#DC2626" strokeWidth={2.4} />
              <Text style={styles.btnDeclineText}>Decline</Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.btnReschedule]} onPress={onReschedule}>
              <RefreshCw size={11} color="#475569" />
              <Text style={styles.btnRescheduleText}>Reschedule</Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.btnAccept]} onPress={onAccept}>
              <Check size={12} color="#FFFFFF" strokeWidth={2.6} />
              <Text style={styles.btnAcceptText}>Accept</Text>
            </Pressable>
          </View>
        )}

        {isConfirmed && (
          <View style={styles.confirmedFooter}>
            <Text style={[styles.confirmedFooterText, isMe && styles.confirmedFooterTextMe]}>
              ✓ QR Entry Pass generated for security gate
            </Text>

            <View style={styles.confirmedActionRow}>
              <Pressable
                style={[styles.qrBtn, isMe && styles.qrBtnMe]}
                onPress={() => setShowQrModal(true)}
              >
                <QrCode size={12} color={isMe ? '#064E3B' : '#0F766E'} strokeWidth={2.4} />
                <Text style={[styles.qrBtnText, isMe && styles.qrBtnTextMe]}>View QR Pass</Text>
              </Pressable>

              <Pressable
                style={[styles.calBtn, isMe && styles.calBtnMe]}
                onPress={handleCalendarSync}
              >
                <Calendar size={12} color={isMe ? '#FFFFFF' : '#475569'} strokeWidth={2.4} />
                <Text style={[styles.calBtnText, isMe && styles.calBtnTextMe]}>Add to Calendar</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* QR PASS MODAL */}
      <Modal visible={showQrModal} transparent animationType="fade" onRequestClose={() => setShowQrModal(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowQrModal(false)}>
          <View style={styles.qrModalCard}>
            <View style={styles.qrModalHeader}>
              <View style={styles.badgeRow}>
                <ShieldCheck size={14} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.badgeText}>VERIFIED REHVO VISIT PASS</Text>
              </View>
              <Pressable onPress={() => setShowQrModal(false)}>
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <Text style={styles.qrModalTitle}>{visit.property_title || 'Luxury Property Tour'}</Text>
            <Text style={styles.qrModalTime}>
              📅 {visit.date || 'Tomorrow'} at {visit.time || '5:00 PM'}
            </Text>
            <Text style={styles.qrModalLoc}>📍 {visit.location || 'Mumbai'}</Text>

            <View style={styles.qrBox}>
              <QrCode size={130} color="#0F766E" strokeWidth={2} />
              <Text style={styles.qrPassId}>
                PASS ID: {visit.visit_id ? visit.visit_id.toUpperCase().slice(0, 8) : 'REHVO-VT99'}
              </Text>
            </View>

            <Text style={styles.qrGateNote}>
              Present this encrypted QR code at the society security gate for seamless entry without physical register check-in.
            </Text>

            <Pressable style={styles.doneBtn} onPress={() => setShowQrModal(false)}>
              <Text style={styles.doneBtnText}>Close Pass</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 13,
    width: '100%',
    maxWidth: 290,
    marginVertical: 4,
    borderWidth: 1,
    ...V4_SHADOWS.card,
  },
  cardMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  cardOther: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  titleMe: {
    color: '#FFFFFF',
  },
  subText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  subTextMe: {
    color: '#CCFBF1',
  },
  statusPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillConfirmed: {
    backgroundColor: '#DCFCE7',
  },
  statusPillDeclined: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  statusTextConfirmed: {
    color: '#15803D',
  },
  statusTextDeclined: {
    color: '#B91C1C',
  },
  detailsBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    padding: 9,
    marginTop: 10,
  },
  detailsBoxMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
    flex: 1,
  },
  detailTextMe: {
    color: '#CCFBF1',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: 8,
    minHeight: 34,
  },
  btnDecline: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  btnDeclineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  btnReschedule: {
    flex: 1.2,
    backgroundColor: '#F1F5F9',
  },
  btnRescheduleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  btnAccept: {
    flex: 1,
    backgroundColor: '#0F766E',
  },
  btnAcceptText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  confirmedFooter: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  confirmedFooterText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  confirmedFooterTextMe: {
    color: '#A7F3D0',
  },
  confirmedActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  qrBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#CCFBF1',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  qrBtnMe: {
    backgroundColor: '#FFFFFF',
  },
  qrBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  qrBtnTextMe: {
    color: '#064E3B',
  },
  calBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  calBtnMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  calBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  calBtnTextMe: {
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  qrModalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    ...V4_SHADOWS.card,
  },
  qrModalHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  qrModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  qrModalTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
    marginTop: 4,
  },
  qrModalLoc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  qrBox: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    marginVertical: 14,
    gap: 8,
  },
  qrPassId: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 1.0,
  },
  qrGateNote: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 16,
  },
  doneBtn: {
    width: '100%',
    backgroundColor: '#0F766E',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
