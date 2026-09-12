import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, AlertCircle } from 'lucide-react-native';

export interface V4VisitData {
  id?: string;
  propertyTitle: string;
  visitDate: string;
  visitTime: string;
  location: string;
  hostName?: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'declined' | 'completed';
}

interface V4VisitCardProps {
  visit: V4VisitData;
  onAccept?: () => void;
  onReschedule?: () => void;
  onDecline?: () => void;
}

export const V4VisitCard: React.FC<V4VisitCardProps> = ({
  visit,
  onAccept,
  onReschedule,
  onDecline,
}) => {
  const getStatusBadge = () => {
    switch (visit.status) {
      case 'confirmed':
        return {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          text: '#059669',
          icon: <CheckCircle2 size={13} color="#059669" strokeWidth={2.4} />,
          label: 'Visit Confirmed',
        };
      case 'declined':
        return {
          bg: '#FEF2F2',
          border: '#FECACA',
          text: '#DC2626',
          icon: <XCircle size={13} color="#DC2626" strokeWidth={2.4} />,
          label: 'Visit Declined',
        };
      case 'rescheduled':
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          text: '#D97706',
          icon: <AlertCircle size={13} color="#D97706" strokeWidth={2.4} />,
          label: 'Rescheduled',
        };
      default:
        return {
          bg: '#F0FDFA',
          border: '#99F6E4',
          text: '#0F766E',
          icon: <Clock size={13} color="#0F766E" strokeWidth={2.4} />,
          label: 'Visit Requested',
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.titleLabel}>SHARED APARTMENT VISIT</Text>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {visit.propertyTitle}
          </Text>
        </View>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: statusInfo.bg, borderColor: statusInfo.border },
          ]}
        >
          {statusInfo.icon}
          <Text style={[styles.statusText, { color: statusInfo.text }]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>

      {/* Details Box */}
      <View style={styles.detailsBox}>
        <View style={styles.detailRow}>
          <Calendar size={15} color="#059669" strokeWidth={2.2} />
          <Text style={styles.detailText}>{visit.visitDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={15} color="#059669" strokeWidth={2.2} />
          <Text style={styles.detailText}>{visit.visitTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={15} color="#059669" strokeWidth={2.2} />
          <Text style={styles.detailText} numberOfLines={1}>
            {visit.location}
          </Text>
        </View>
      </View>

      {/* Action Buttons if Pending */}
      {visit.status === 'pending' && (
        <View style={styles.actionsRow}>
          {onDecline && (
            <Pressable
              style={[styles.btn, styles.declineBtn]}
              onPress={onDecline}
              accessibilityRole="button"
              accessibilityLabel="Decline visit"
            >
              <Text style={styles.declineBtnText}>Decline</Text>
            </Pressable>
          )}
          {onReschedule && (
            <Pressable
              style={[styles.btn, styles.rescheduleBtn]}
              onPress={onReschedule}
              accessibilityRole="button"
              accessibilityLabel="Reschedule visit"
            >
              <Text style={styles.rescheduleBtnText}>Reschedule</Text>
            </Pressable>
          )}
          {onAccept && (
            <Pressable
              style={[styles.btn, styles.acceptBtn]}
              onPress={onAccept}
              accessibilityRole="button"
              accessibilityLabel="Accept visit"
            >
              <Text style={styles.acceptBtnText}>Accept</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 12,
    maxWidth: 320,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  titleLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.6,
  },
  propertyTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  detailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: '#059669',
  },
  acceptBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rescheduleBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  rescheduleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  declineBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  declineBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
});
