import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Calendar, MapPin, CheckCircle2, Clock, XCircle, ChevronRight, FileText, MessageSquare } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

export interface V4BookingItem {
  id: string;
  propertyTitle: string;
  locality: string;
  imageUrl: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  date: string;
  time?: string;
  rent: number;
  deposit?: number;
  hostName: string;
  agreementUrl?: string;
}

interface V4BookingCardProps {
  booking: V4BookingItem;
  onPress?: () => void;
  onChatHost?: () => void;
  onDownloadAgreement?: () => void;
}

export const V4BookingCard: React.FC<V4BookingCardProps> = ({
  booking,
  onPress,
  onChatHost,
  onDownloadAgreement,
}) => {
  const getStatusBadge = () => {
    switch (booking.status) {
      case 'ACTIVE':
        return { label: 'CURRENT STAY', bg: '#DCFCE7', color: '#16A34A', icon: CheckCircle2 };
      case 'UPCOMING':
        return { label: 'CONFIRMED VISIT', bg: '#E0F2FE', color: '#0284C7', icon: Clock };
      case 'COMPLETED':
        return { label: 'COMPLETED', bg: '#F1F5F9', color: '#64748B', icon: CheckCircle2 };
      case 'CANCELLED':
        return { label: 'CANCELLED', bg: '#FEE2E2', color: '#DC2626', icon: XCircle };
    }
  };

  const badge = getStatusBadge();
  const IconComp = badge.icon;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Top Header with Status */}
      <View style={styles.topRow}>
        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <IconComp size={11} color={badge.color} strokeWidth={2.4} />
          <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
        </View>

        <Text style={styles.dateText}>📅 {booking.date}</Text>
      </View>

      {/* Main Info Row */}
      <View style={styles.infoRow}>
        <Image source={{ uri: booking.imageUrl }} style={styles.thumb} resizeMode="cover" />

        <View style={styles.infoCol}>
          <Text style={styles.title} numberOfLines={1}>{booking.propertyTitle}</Text>

          <View style={styles.locRow}>
            <MapPin size={11} color={V4_COLORS.primary} strokeWidth={2.2} />
            <Text style={styles.locText} numberOfLines={1}>{booking.locality}</Text>
          </View>

          <View style={styles.rentRow}>
            <Text style={styles.rent}>₹{booking.rent.toLocaleString('en-IN')}</Text>
            <Text style={styles.rentPeriod}>/mo</Text>
            <Text style={styles.hostText}>• Host: {booking.hostName}</Text>
          </View>
        </View>
      </View>

      {/* Action Footer */}
      <View style={styles.footerRow}>
        {onDownloadAgreement && (
          <Pressable style={styles.actionBtnOutline} onPress={onDownloadAgreement}>
            <FileText size={12} color={V4_COLORS.primary} />
            <Text style={styles.actionTextOutline}>Agreement</Text>
          </Pressable>
        )}

        {onChatHost && (
          <Pressable style={styles.actionBtnPrimary} onPress={onChatHost}>
            <MessageSquare size={12} color="#FFFFFF" />
            <Text style={styles.actionTextPrimary}>Chat Host</Text>
          </Pressable>
        )}

        <Pressable style={styles.detailsBtn} onPress={onPress}>
          <Text style={styles.detailsText}>View Details</Text>
          <ChevronRight size={13} color={V4_COLORS.textSecondary} />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.card,
    padding: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 12,
    ...V4_SHADOWS.card,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  thumb: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  infoCol: {
    flex: 1,
    gap: 3,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locText: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  rentRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginTop: 2,
  },
  rent: {
    fontSize: 14,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  rentPeriod: {
    fontSize: 10,
    color: V4_COLORS.textSecondary,
  },
  hostText: {
    fontSize: 11,
    color: V4_COLORS.textMuted,
    marginLeft: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 118, 110, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  actionTextOutline: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  actionTextPrimary: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  detailsBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailsText: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
});
