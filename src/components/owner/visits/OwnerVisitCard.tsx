import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Clock, MapPin, ChevronRight, User } from 'lucide-react-native';
import { Visit, VisitStatus } from '../../../types';

interface OwnerVisitCardProps {
  visit: Visit;
  onPress: () => void;
}

export const OwnerVisitCard: React.FC<OwnerVisitCardProps> = ({
  visit,
  onPress,
}) => {
  const getStatusBadge = (status: VisitStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return { label: 'Confirmed', bg: '#EAF8F0', text: '#32B768' };
      case 'REQUESTED':
        return { label: 'Pending', bg: '#FEF3C7', text: '#D97706' };
      case 'RESCHEDULED':
        return { label: 'Rescheduled', bg: '#FEF3C7', text: '#D97706' };
      case 'COMPLETED':
        return { label: 'Completed', bg: '#EAF8F0', text: '#32B768' };
      case 'CANCELLED':
      default:
        return { label: 'Cancelled', bg: '#F3F0EA', text: '#777482' };
    }
  };

  const statusInfo = getStatusBadge(visit.status);
  const coverImage =
    visit.property_image ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Visit at ${visit.time} for ${visit.renter_name}`}
    >
      {/* Time Column */}
      <View style={styles.timeCol}>
        <Clock size={15} color="#6C4DFF" strokeWidth={2.2} />
        <Text style={styles.timeText}>{visit.time}</Text>
      </View>

      {/* Property Thumbnail */}
      <Image source={{ uri: coverImage }} style={styles.thumbnail} />

      {/* Center Info */}
      <View style={styles.infoCol}>
        <Text style={styles.renterName} numberOfLines={1}>
          {visit.renter_name}
        </Text>

        <Text style={styles.propTitle} numberOfLines={1}>
          {visit.property_title}
        </Text>

        <View style={styles.locRow}>
          <MapPin size={11} color="#777482" strokeWidth={2} />
          <Text style={styles.locText} numberOfLines={1}>
            {visit.property_locality}
          </Text>
        </View>
      </View>

      {/* Right: Status & Chevron */}
      <View style={styles.rightCol}>
        <View
          style={[styles.statusPill, { backgroundColor: statusInfo.bg }]}
        >
          <Text style={[styles.statusText, { color: statusInfo.text }]}>
            {statusInfo.label}
          </Text>
        </View>
        <ChevronRight size={16} color="#86828F" />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 12,
    gap: 12,
    marginBottom: 8,
  },
  timeCol: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0ECFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    minWidth: 64,
    gap: 3,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6C4DFF',
    textAlign: 'center',
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#E8E5EC',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  renterName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  propTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#171522',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locText: {
    fontSize: 11.5,
    color: '#777482',
    fontWeight: '500',
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});
