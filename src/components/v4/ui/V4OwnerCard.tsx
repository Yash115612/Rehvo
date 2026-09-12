import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { ShieldCheck, Star, MessageSquare, Phone, CheckCircle2 } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4OwnerCardProps {
  name: string;
  avatarUrl?: string;
  isDigiLockerVerified?: boolean;
  rating?: number;
  responseRate?: string;
  propertiesCount?: number;
  onChat?: () => void;
  onCall?: () => void;
  onViewProfile?: () => void;
}

export const V4OwnerCard: React.FC<V4OwnerCardProps> = ({
  name = 'Sanjay Mehra',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  isDigiLockerVerified = true,
  rating = 4.9,
  responseRate = 'within 15 mins',
  propertiesCount = 4,
  onChat,
  onCall,
  onViewProfile,
}) => {
  return (
    <View style={styles.card}>
      <Pressable style={styles.topRow} onPress={onViewProfile}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          {isDigiLockerVerified && (
            <View style={styles.verifiedDot}>
              <CheckCircle2 size={10} color="#FFFFFF" strokeWidth={3} />
            </View>
          )}
        </View>

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {isDigiLockerVerified && (
              <View style={styles.kycBadge}>
                <ShieldCheck size={10} color="#16A34A" />
                <Text style={styles.kycText}>Aadhaar KYC</Text>
              </View>
            )}
          </View>

          <Text style={styles.metaText}>
            Direct Property Owner • {propertiesCount} Listings
          </Text>

          <View style={styles.ratingRow}>
            <Star size={11} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.responseRateText}>• Responds {responseRate}</Text>
          </View>
        </View>
      </Pressable>

      {/* Action Triggers: Chat & Call */}
      <View style={styles.actionsRow}>
        {onChat && (
          <Pressable style={styles.chatBtn} onPress={onChat}>
            <MessageSquare size={14} color="#0F766E" strokeWidth={2.4} />
            <Text style={styles.chatBtnText}>Chat on WhatsApp</Text>
          </Pressable>
        )}

        {onCall && (
          <Pressable style={styles.callBtn} onPress={onCall}>
            <Phone size={14} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.callBtnText}>Call Owner</Text>
          </Pressable>
        )}
      </View>
    </View>
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
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  verifiedDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#16A34A',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  kycText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#15803D',
  },
  metaText: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#031B2A',
  },
  responseRateText: {
    fontSize: 11,
    color: '#64748B',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 118, 110, 0.1)',
    paddingVertical: 10,
    borderRadius: 12,
  },
  chatBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: V4_COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
