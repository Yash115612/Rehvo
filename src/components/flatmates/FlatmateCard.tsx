import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Heart,
  MapPin,
  IndianRupee,
  BedDouble,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Hand,
  MessageCircle,
  Check,
  Briefcase,
} from 'lucide-react-native';
import { FlatmateProfile } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { V4_COLORS, V4_SHADOWS } from '../../theme/v4Theme';

interface FlatmateCardProps {
  profile: FlatmateProfile;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onPress?: (profile: FlatmateProfile) => void;
  onWave?: (profile: FlatmateProfile) => void;
  onChat?: (profile: FlatmateProfile) => void;
}

export const FlatmateCard: React.FC<FlatmateCardProps> = ({
  profile,
  isSaved: customIsSaved,
  onToggleSave: customOnToggleSave,
  onPress: customOnPress,
  onWave: customOnWave,
  onChat: customOnChat,
}) => {
  const router = useRouter();
  const {
    user,
    myFlatmateProfile,
    savedFlatmateIds,
    toggleSaveFlatmate,
    wavedFlatmateIds,
    sendFlatmateWave,
    startOrGetFlatmateConversation,
    showToast,
  } = useAppStore();

  const [isWaving, setIsWaving] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  const isSaved =
    typeof customIsSaved === 'boolean'
      ? customIsSaved
      : savedFlatmateIds?.includes(profile.id);

  const isWaved = wavedFlatmateIds?.includes(profile.id);

  const isOwnProfile = Boolean(
    (user?.id && profile.user_id && user.id === profile.user_id) ||
    (myFlatmateProfile && myFlatmateProfile.id === profile.id)
  );

  const avatarUri =
    profile.avatar ||
    profile.avatar_url ||
    (profile.photos && profile.photos[0]) ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

  const budgetDisplay = `₹${((profile.budget_min || 15000) / 1000).toFixed(0)}K – ₹${(
    (profile.budget_max || 30000) / 1000
  ).toFixed(0)}K`;

  const handleCardPress = () => {
    if (customOnPress) {
      customOnPress(profile);
    } else {
      router.push(`/(renter)/flatmate/${profile.id}`);
    }
  };

  const handleToggleBookmark = (e: any) => {
    e.stopPropagation();
    if (customOnToggleSave) {
      customOnToggleSave(profile.id);
    } else {
      toggleSaveFlatmate(profile.id);
    }
  };

  const handleWave = async (e: any) => {
    e.stopPropagation();
    if (customOnWave) {
      customOnWave(profile);
      return;
    }
    if (isWaved) {
      showToast(`Wave already sent to ${profile.name.split(' ')[0]}!`, 'info');
      return;
    }
    if (isOwnProfile) {
      showToast('You cannot wave at yourself.', 'info');
      return;
    }

    setIsWaving(true);
    await sendFlatmateWave(
      profile.id,
      profile.name,
      avatarUri,
      profile.locality || (profile.preferred_locations && profile.preferred_locations[0]) || 'Mumbai'
    );
    setIsWaving(false);
    showToast(`👋 Wave sent to ${profile.name.split(' ')[0]}!`, 'success');
  };

  const handleChat = async (e: any) => {
    e.stopPropagation();
    if (customOnChat) {
      customOnChat(profile);
      return;
    }
    if (isOwnProfile) {
      router.push('/(renter)/flatmate/edit');
      return;
    }

    if (!user?.id) {
      showToast('Please sign in to message this flatmate', 'info');
      return;
    }

    setIsStartingChat(true);
    try {
      const convId = await startOrGetFlatmateConversation(profile);
      if (convId) {
        router.push(`/(renter)/chat/${convId}`);
      }
    } catch (err: any) {
      showToast('Unable to start chat. Please try again.', 'error');
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={handleCardPress}
      accessibilityRole="button"
      accessibilityLabel={`Flatmate profile of ${profile.name}`}
    >
      {/* 1. Top Row: Avatar + Info + Bookmark Button */}
      <View style={styles.topRow}>
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={11} color="#FFFFFF" strokeWidth={2.8} />
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
            <View style={styles.verifiedPill}>
              <Text style={styles.verifiedPillText}>VERIFIED</Text>
            </View>
          </View>

          <View style={styles.occupationRow}>
            <Briefcase size={12} color="#64748B" />
            <Text style={styles.occupation} numberOfLines={1}>
              {profile.occupation || profile.profession || 'Working Professional'}
              {profile.company_or_college ? ` • ${profile.company_or_college}` : ''}
            </Text>
          </View>

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
          onPress={handleToggleBookmark}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? 'Unsave profile' : 'Save profile'}
        >
          <Heart
            size={17}
            color={isSaved ? '#EF4444' : '#64748B'}
            fill={isSaved ? '#EF4444' : 'transparent'}
            strokeWidth={2.2}
          />
        </Pressable>
      </View>

      {/* 2. Short Bio Snippet */}
      {profile.bio ? (
        <Text style={styles.bio} numberOfLines={2}>
          "{profile.bio}"
        </Text>
      ) : null}

      {/* 3. Details Grid: Location, Budget, Room, Timing */}
      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <MapPin size={13} color="#0F766E" strokeWidth={2.4} />
          <Text style={styles.metaText} numberOfLines={1}>
            {profile.preferred_locations?.length
              ? profile.preferred_locations.slice(0, 2).join(', ')
              : profile.locality || 'Mumbai'}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <IndianRupee size={13} color="#0F766E" strokeWidth={2.4} />
          <Text style={styles.metaText}>{budgetDisplay} / mo</Text>
        </View>

        <View style={styles.metaItem}>
          <BedDouble size={13} color="#0F766E" strokeWidth={2.4} />
          <Text style={styles.metaText}>{profile.room_preference || 'Private Room'}</Text>
        </View>

        <View style={styles.metaItem}>
          <Calendar size={13} color="#0F766E" strokeWidth={2.4} />
          <Text style={styles.metaText}>
            {profile.move_in_timing || profile.move_in_date || 'Flexible'}
          </Text>
        </View>
      </View>

      {/* 4. Lifestyle Tags Row */}
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

      {/* 5. Bottom Action Row: Synergy Match + Wave & Chat Buttons */}
      <View style={styles.bottomRow}>
        <View style={styles.matchPill}>
          <Sparkles size={11} color="#0F766E" strokeWidth={2.6} />
          <Text style={styles.matchText}>
            {profile.match_score || 96}% MATCH
          </Text>
        </View>

        {/* Action Buttons Group (Wave + Chat) */}
        <View style={styles.actionsBtnGroup}>
          {/* Wave Button */}
          <Pressable
            style={[styles.waveBtn, isWaved && styles.waveBtnDone]}
            onPress={handleWave}
            disabled={isWaving}
            hitSlop={4}
          >
            {isWaving ? (
              <ActivityIndicator size="small" color="#0F766E" />
            ) : isWaved ? (
              <>
                <Check size={13} color="#0F766E" strokeWidth={3} />
                <Text style={styles.waveBtnTextDone}>Waved</Text>
              </>
            ) : (
              <>
                <Hand size={13} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.waveBtnText}>Wave 👋</Text>
              </>
            )}
          </Pressable>

          {/* Chat Button */}
          <Pressable
            style={styles.chatBtn}
            onPress={handleChat}
            disabled={isStartingChat}
            hitSlop={4}
          >
            {isStartingChat ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MessageCircle size={13} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.chatBtnText}>Chat</Text>
              </>
            )}
          </Pressable>

          {/* View Profile Arrow */}
          <Pressable
            style={styles.viewLinkBtn}
            onPress={handleCardPress}
            hitSlop={6}
          >
            <ChevronRight size={16} color="#0F766E" strokeWidth={2.4} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 15,
    gap: 11,
    ...V4_SHADOWS.card,
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
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
    borderRadius: 29,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#10B981',
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
    gap: 4,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#031B2A',
    letterSpacing: -0.2,
  },
  age: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#64748B',
  },
  verifiedPill: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginLeft: 2,
  },
  verifiedPillText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.4,
  },
  occupationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  occupation: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  lookingForPill: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  lookingForText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  saveBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  saveBtnActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  bio: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 17,
    fontStyle: 'italic',
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#F8FAFB',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minWidth: '45%',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#031B2A',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  tagPillMore: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagTextMore: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  matchText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  actionsBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 6.5,
    borderRadius: 11,
  },
  waveBtnDone: {
    backgroundColor: '#CCFBF1',
    borderColor: '#99F6E4',
  },
  waveBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  waveBtnTextDone: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 11,
    ...V4_SHADOWS.soft,
  },
  chatBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  viewLinkBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
});
