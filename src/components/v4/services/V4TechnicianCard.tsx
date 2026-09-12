import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import {
  CheckCircle2,
  Star,
  PhoneCall,
  ShieldCheck,
  Award,
  Wrench,
} from 'lucide-react-native';
import { TechnicianRecord } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { triggerHapticFeedback } from '../../../utils/haptics';

interface V4TechnicianCardProps {
  technician: TechnicianRecord;
  isSelected?: boolean;
  onSelect?: () => void;
  showCallButton?: boolean;
}

export const V4TechnicianCard: React.FC<V4TechnicianCardProps> = ({
  technician,
  isSelected = false,
  onSelect,
  showCallButton = true,
}) => {
  const handleCall = () => {
    triggerHapticFeedback('selection');
    if (technician.phone) {
      Linking.openURL(`tel:${technician.phone}`).catch(() => {});
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <Pressable
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onSelect}
    >
      <View style={styles.cardHeader}>
        {/* Avatar circle */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(technician.name)}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{technician.name}</Text>
            {technician.is_verified && (
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={12} color="#0F766E" />
                <Text style={styles.verifiedText}>REHVO Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.specialization}>
            {technician.specialization || 'Home Services Pro'}
          </Text>
        </View>

        {showCallButton && technician.phone && (
          <Pressable style={styles.callBtn} onPress={handleCall} hitSlop={8}>
            <PhoneCall size={16} color="#0F766E" />
          </Pressable>
        )}
      </View>

      {/* Stats bar */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingText}>{technician.rating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>(500+ reviews)</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Wrench size={13} color="#64748B" />
          <Text style={styles.statVal}>{technician.total_jobs}+</Text>
          <Text style={styles.statLabel}>Jobs Done</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Award size={13} color="#0F766E" />
          <Text style={styles.badgeText}>Top Rated</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.card,
  },
  cardSelected: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F766E',
  },
  specialization: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  statVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#E2E8F0',
  },
});
