import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import {
  Heart,
  MapPin,
  IndianRupee,
  BedDouble,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import { FlatmateProfile } from '../../types';

interface FlatmateCardProps {
  profile: FlatmateProfile;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onPress: (profile: FlatmateProfile) => void;
}

export const FlatmateCard: React.FC<FlatmateCardProps> = ({
  profile,
  isSaved,
  onToggleSave,
  onPress,
}) => {
  const avatarUri =
    profile.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

  const budgetDisplay = `₹${(profile.budget_min / 1000).toFixed(0)}K – ₹${(
    profile.budget_max / 1000
  ).toFixed(0)}K`;

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(profile)}
      accessibilityRole="button"
      accessibilityLabel={`Flatmate profile of ${profile.name}`}
    >
      {/* Top Row: Avatar + Info + Save Button */}
      <View style={styles.topRow}>
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={12} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </View>

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {profile.display_name || profile.name}
            </Text>
            {profile.age ? (
              <Text style={styles.age}>, {profile.age}</Text>
            ) : null}
          </View>

          <Text style={styles.occupation} numberOfLines={1}>
            {profile.occupation || 'Working Professional'}
          </Text>

          {/* Looking for Pill */}
          {profile.looking_for ? (
            <View style={styles.lookingForPill}>
              <Text style={styles.lookingForText} numberOfLines={1}>
                {profile.looking_for}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Save/Heart Button */}
        <Pressable
          style={[styles.saveBtn, isSaved && styles.saveBtnActive]}
          onPress={() => onToggleSave(profile.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? 'Unsave profile' : 'Save profile'}
        >
          <Heart
            size={18}
            color={isSaved ? '#FF4D4D' : '#777482'}
            fill={isSaved ? '#FF4D4D' : 'transparent'}
            strokeWidth={2}
          />
        </Pressable>
      </View>

      {/* Short Bio Snippet */}
      {profile.bio ? (
        <Text style={styles.bio} numberOfLines={2}>
          "{profile.bio}"
        </Text>
      ) : null}

      {/* Details Grid: Location, Budget, Room, Timing */}
      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <MapPin size={13} color="#6C4DFF" strokeWidth={2.2} />
          <Text style={styles.metaText} numberOfLines={1}>
            {profile.preferred_locations?.length
              ? profile.preferred_locations.slice(0, 2).join(', ')
              : profile.locality || 'Mumbai'}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <IndianRupee size={13} color="#6C4DFF" strokeWidth={2.2} />
          <Text style={styles.metaText}>{budgetDisplay} / mo</Text>
        </View>

        <View style={styles.metaItem}>
          <BedDouble size={13} color="#6C4DFF" strokeWidth={2.2} />
          <Text style={styles.metaText}>{profile.room_preference}</Text>
        </View>

        <View style={styles.metaItem}>
          <Calendar size={13} color="#6C4DFF" strokeWidth={2.2} />
          <Text style={styles.metaText}>
            {profile.move_in_timing || profile.move_in_date || 'Flexible'}
          </Text>
        </View>
      </View>

      {/* Lifestyle Tags Row */}
      {profile.lifestyle_preferences?.length ? (
        <View style={styles.tagsRow}>
          {profile.lifestyle_preferences.slice(0, 3).map((tag, idx) => (
            <View key={idx} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {profile.lifestyle_preferences.length > 3 && (
            <View style={styles.tagPillMore}>
              <Text style={styles.tagTextMore}>
                +{profile.lifestyle_preferences.length - 3}
              </Text>
            </View>
          )}
        </View>
      ) : null}

      {/* Bottom Row: Match reason + View Profile CTA */}
      <View style={styles.bottomRow}>
        <View style={styles.matchPill}>
          <Sparkles size={12} color="#32B768" strokeWidth={2.5} />
          <Text style={styles.matchText}>
            {profile.match_reasons?.[0] || 'Great roommate match'}
          </Text>
        </View>

        <View style={styles.viewBtn}>
          <Text style={styles.viewBtnText}>View</Text>
          <ChevronRight size={14} color="#6C4DFF" strokeWidth={2.5} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    gap: 12,
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8E5EC',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#32B768',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
  },
  age: {
    fontSize: 15,
    fontWeight: '600',
    color: '#777482',
  },
  occupation: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
  },
  lookingForPill: {
    backgroundColor: '#FAF9FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  lookingForText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6C4DFF',
  },
  saveBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnActive: {
    backgroundColor: '#FFF0F0',
  },
  bio: {
    fontSize: 13,
    color: '#48464B',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#FAF9FF',
    padding: 10,
    borderRadius: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: '45%',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171522',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#777482',
  },
  tagPillMore: {
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagTextMore: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F3F0EA',
  },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  matchText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1B8246',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
});
