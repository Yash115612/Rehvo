import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { MessageCircle, Calendar, IndianRupee, MapPin, Share2, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { FlatmateProfile } from '../../../types';
import { V4CompatibilityRing } from './V4CompatibilityRing';

interface V4MatchCardProps {
  profile: FlatmateProfile;
  lastActive?: string;
  isOnline?: boolean;
  onChat: () => void;
  onScheduleVisit?: () => void;
  onShareProperty?: () => void;
  onViewProfile?: () => void;
}

export const V4MatchCard: React.FC<V4MatchCardProps> = ({
  profile,
  lastActive = 'Active recently',
  isOnline = true,
  onChat,
  onScheduleVisit,
  onShareProperty,
  onViewProfile,
}) => {
  const photo =
    (profile.photos && profile.photos[0]) ||
    profile.avatar ||
    profile.avatar_url ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  const compatibilityScore = profile.match_score || profile.compatibility?.overall || 96;

  return (
    <View style={styles.container}>
      {/* Top Profile Info Row */}
      <Pressable style={styles.topRow} onPress={onViewProfile} accessibilityRole="button">
        <View style={styles.avatarWrap}>
          <Image source={{ uri: photo }} style={styles.avatar} resizeMode="cover" />
          {isOnline && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.infoWrap}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {profile.name}{profile.age ? `, ${profile.age}` : ''}
            </Text>
            {profile.is_kyc_verified && (
              <CheckCircle2 size={15} color="#059669" strokeWidth={2.6} />
            )}
          </View>

          <Text style={styles.occupationText} numberOfLines={1}>
            {profile.occupation || profile.profession || 'Working Professional'}
            {profile.company_or_college ? ` · ${profile.company_or_college}` : ''}
          </Text>

          <View style={styles.locationRow}>
            <MapPin size={12} color="#64748B" strokeWidth={2.2} />
            <Text style={styles.locationText} numberOfLines={1}>
              {profile.locality || (profile.preferred_locations && profile.preferred_locations[0]) || 'Mumbai'}
            </Text>
            <Text style={styles.activeText}>· {isOnline ? 'Online now' : lastActive}</Text>
          </View>
        </View>

        {/* Compatibility Dial */}
        <V4CompatibilityRing score={compatibilityScore} size={48} strokeWidth={3.5} showLabel labelText="MATCH" />
      </Pressable>

      {/* Snapshot Specs Pill Bar */}
      <View style={styles.specsBar}>
        <View style={styles.specItem}>
          <IndianRupee size={13} color="#059669" strokeWidth={2.4} />
          <Text style={styles.specText}>
            ₹{((profile.budget_min || 15000) / 1000).toFixed(0)}k–₹{((profile.budget_max || 30000) / 1000).toFixed(0)}k
          </Text>
        </View>

        <View style={styles.specDivider} />

        <View style={styles.specItem}>
          <Calendar size={13} color="#059669" strokeWidth={2.4} />
          <Text style={styles.specText}>
            {profile.move_in_timing || profile.move_in_date || 'Immediate'}
          </Text>
        </View>

        <View style={styles.specDivider} />

        <View style={styles.specItem}>
          <Text style={styles.specText}>
            {profile.room_preference || profile.room_type_preference || 'Private Room'}
          </Text>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        <Pressable
          style={styles.chatCTA}
          onPress={onChat}
          accessibilityRole="button"
          accessibilityLabel={`Chat with ${profile.name}`}
        >
          <MessageCircle size={16} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.chatCTAText}>Chat with {profile.name.split(' ')[0]}</Text>
        </Pressable>

        {onScheduleVisit && (
          <Pressable
            style={styles.secondaryBtn}
            onPress={onScheduleVisit}
            accessibilityRole="button"
            accessibilityLabel="Schedule visit"
          >
            <Calendar size={15} color="#059669" strokeWidth={2.2} />
            <Text style={styles.secondaryBtnText}>Visit</Text>
          </Pressable>
        )}

        {onShareProperty && (
          <Pressable
            style={styles.secondaryBtn}
            onPress={onShareProperty}
            accessibilityRole="button"
            accessibilityLabel="Share property"
          >
            <Share2 size={15} color="#059669" strokeWidth={2.2} />
            <Text style={styles.secondaryBtnText}>Share</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginVertical: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  infoWrap: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  occupationText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  locationText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  activeText: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  specsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  specDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#E2E8F0',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatCTA: {
    flex: 1,
    height: 44,
    backgroundColor: '#059669',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  chatCTAText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 44,
    paddingHorizontal: 14,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  secondaryBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#059669',
  },
});
