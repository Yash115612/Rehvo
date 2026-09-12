import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShieldCheck,
  Sparkles,
  MapPin,
  Heart,
  MessageCircle,
  Briefcase,
  Hand,
  ChevronRight,
  Check,
  Calendar,
  Zap,
  Coffee,
  Quote,
  Flame,
} from 'lucide-react-native';
import { FlatmateProfile } from '../../../types';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import { calculateCompatibilityScore } from '../../../services/flatmatesData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface V4FlatmateCardProps {
  flatmate: FlatmateProfile;
  variant?: 'grid' | 'carousel' | 'feed';
  onMatchCelebration?: (flatmate: FlatmateProfile) => void;
  isSaved?: boolean;
  onPress?: () => void;
  onToggleSave?: () => void;
  onWave?: () => void;
  onChat?: () => void;
}

export const V4FlatmateCard: React.FC<V4FlatmateCardProps> = ({
  flatmate,
  variant = 'feed',
  onMatchCelebration,
  isSaved: customIsSaved,
  onPress: customOnPress,
  onToggleSave: customOnToggleSave,
  onWave: customOnWave,
  onChat: customOnChat,
}) => {
  const router = useRouter();
  const {
    savedFlatmateIds,
    toggleSaveFlatmate,
    wavedFlatmateIds,
    sendFlatmateWave,
    swipeFlatmate,
    startOrGetFlatmateConversation,
    showToast,
    isAuthenticated,
    myFlatmateProfile,
  } = useAppStore();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [waving, setWaving] = useState(false);

  const isSaved =
    typeof customIsSaved === 'boolean'
      ? customIsSaved
      : savedFlatmateIds?.includes(flatmate.id);
  const isWaved = wavedFlatmateIds?.includes(flatmate.id);

  const compatibilityInfo = calculateCompatibilityScore(myFlatmateProfile, flatmate);
  const synergyScore = compatibilityInfo.overallScore || flatmate.match_score || 92;

  const photos =
    flatmate.photos && flatmate.photos.length > 0
      ? flatmate.photos
      : [
          flatmate.avatar ||
            flatmate.avatar_url ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        ];

  const handlePrevPhoto = (e: any) => {
    e?.stopPropagation?.();
    if (photos.length <= 1) return;
    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextPhoto = (e: any) => {
    e?.stopPropagation?.();
    if (photos.length <= 1) return;
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const handleWave = async (e: any) => {
    e?.stopPropagation?.();
    if (!isAuthenticated) {
      router.push('/(auth)/login' as any);
      return;
    }
    if (customOnWave) {
      customOnWave();
      return;
    }
    if (isWaved) {
      showToast('Wave already sent! Waiting for response.', 'info');
      return;
    }
    setWaving(true);
    await sendFlatmateWave(
      flatmate.id,
      flatmate.name,
      photos[0],
      flatmate.locality || flatmate.city
    );
    const res = await swipeFlatmate(flatmate.id, 'like');
    setWaving(false);
    if (res?.isMatch) {
      if (onMatchCelebration) {
        onMatchCelebration(flatmate);
      } else {
        showToast(`🎉 It's a Match with ${flatmate.name}!`, 'success');
      }
    } else {
      showToast(`👋 Wave sent to ${flatmate.name.split(' ')[0]}!`, 'success');
    }
  };

  const handleChat = async (e: any) => {
    e?.stopPropagation?.();
    if (!isAuthenticated) {
      router.push('/(auth)/login' as any);
      return;
    }
    if (customOnChat) {
      customOnChat();
      return;
    }
    const convoId = await startOrGetFlatmateConversation(flatmate);
    if (convoId) {
      router.push(`/(renter)/chat/${convoId}` as any);
    }
  };

  const handleCardPress = () => {
    if (customOnPress) {
      customOnPress();
    } else {
      router.push(`/(renter)/flatmate/${flatmate.id}` as any);
    }
  };

  const handleToggleBookmark = (e: any) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/(auth)/login' as any);
      return;
    }
    if (customOnToggleSave) {
      customOnToggleSave();
    } else {
      toggleSaveFlatmate(flatmate.id);
      showToast(isSaved ? 'Removed from wishlist' : 'Saved to wishlist ❤️', 'info');
    }
  };

  const isCarousel = variant === 'carousel';
  const isVerified =
    flatmate.is_kyc_verified ||
    flatmate.verifications?.is_identity_verified ||
    (flatmate as any).is_verified !== false;

  const lifestyleTags = (
    flatmate.lifestyle_preferences ||
    flatmate.lifestyle_tags || [
      '🚭 Non-Smoker',
      '🥗 Pure Veg',
      '💻 Hybrid WFH',
      '🐶 Pet Friendly',
    ]
  ).slice(0, 4);

  const genderLabel =
    flatmate.gender?.toLowerCase() === 'female'
      ? '👩 Female'
      : flatmate.gender?.toLowerCase() === 'male'
      ? '👨 Male'
      : null;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        isCarousel && styles.carouselCard,
        pressed && styles.cardPressed,
      ]}
      onPress={handleCardPress}
    >
      {/* 1. SOCIAL STORY PHOTO HERO */}
      <View style={[styles.imageWrapper, isCarousel && styles.carouselImageWrap]}>
        <Image source={{ uri: photos[activePhotoIdx] }} style={styles.photo} />

        {/* Story Tap Zones (Left: Prev, Right: Next) */}
        {photos.length > 1 && (
          <View style={styles.storyTapZones}>
            <Pressable style={styles.storyTapLeft} onPress={handlePrevPhoto} />
            <Pressable style={styles.storyTapRight} onPress={handleNextPhoto} />
          </View>
        )}

        {/* Multi-Photo Instagram Story Progress Bars */}
        {photos.length > 1 && (
          <View style={styles.storyBarsRow}>
            {photos.map((_, i) => (
              <View key={i} style={styles.storyBarTrack}>
                <View
                  style={[
                    styles.storyBarFill,
                    i === activePhotoIdx && styles.storyBarFillActive,
                    i < activePhotoIdx && styles.storyBarFillDone,
                  ]}
                />
              </View>
            ))}
          </View>
        )}

        {/* Floating Top Left Badges: Verified + Synergy Pill */}
        <View style={styles.topFloatingLeft}>
          {isVerified && (
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={11} color="#FFFFFF" strokeWidth={2.8} />
              <Text style={styles.verifiedBadgeText}>ID VERIFIED</Text>
            </View>
          )}

          <View style={styles.synergyPill}>
            <Zap size={10} color="#059669" strokeWidth={2.8} />
            <Text style={styles.synergyPillText}>{synergyScore}% SYNERGY</Text>
          </View>
        </View>

        {/* Floating Top Right Bookmark */}
        <Pressable
          style={[styles.bookmarkBtn, isSaved && styles.bookmarkBtnActive]}
          onPress={handleToggleBookmark}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Save profile"
        >
          <Heart
            size={16}
            color={isSaved ? '#EF4444' : '#FFFFFF'}
            fill={isSaved ? '#EF4444' : 'transparent'}
            strokeWidth={2.4}
          />
        </Pressable>

        {/* Floating Photo Counter Badge */}
        {photos.length > 1 && (
          <View style={styles.photoCounterBadge}>
            <Text style={styles.photoCounterText}>
              {activePhotoIdx + 1}/{photos.length}
            </Text>
          </View>
        )}

        {/* Bottom Photo Gradient Overlay with Identity Meta */}
        <View style={styles.photoBottomVignette}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {flatmate.name}, {flatmate.age || 24}
            </Text>
            {genderLabel && (
              <View style={styles.genderChip}>
                <Text style={styles.genderChipText}>{genderLabel}</Text>
              </View>
            )}
          </View>

          {/* Profession & Company */}
          <View style={styles.professionRow}>
            <Briefcase size={12} color="#E2ECEF" strokeWidth={2.2} />
            <Text style={styles.professionText} numberOfLines={1}>
              {flatmate.profession || flatmate.occupation || 'Working Professional'}
              {flatmate.company_or_college ? ` @ ${flatmate.company_or_college}` : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. RICH CARD BODY & SOCIAL FEATURES */}
      <View style={styles.cardBody}>
        {/* Specs Ribbon: Location, Room Type, Budget */}
        <View style={styles.specsRow}>
          <View style={styles.specChip}>
            <MapPin size={11.5} color="#059669" strokeWidth={2.4} />
            <Text style={styles.specChipText} numberOfLines={1}>
              {flatmate.locality ||
                flatmate.preferred_localities?.[0] ||
                flatmate.city ||
                'Bandra West'}
            </Text>
          </View>

          <View style={styles.roomTypeChip}>
            <Text style={styles.roomTypeChipText}>
              {flatmate.room_type_preference === 'shared_room'
                ? '👥 Shared Room'
                : '🛏️ Private Room'}
            </Text>
          </View>

          <View style={styles.budgetChip}>
            <Text style={styles.budgetText}>
              ₹{((flatmate.budget_min || 18000) / 1000).toFixed(0)}k–
              {((flatmate.budget_max || 32000) / 1000).toFixed(0)}k
              <Text style={styles.budgetPeriod}>/mo</Text>
            </Text>
          </View>
        </View>

        {/* Hinge / Social Prompt Quote Box */}
        {!!flatmate.bio && (
          <View style={styles.promptBubble}>
            <View style={styles.promptHeader}>
              <Quote size={12} color="#059669" strokeWidth={2.4} />
              <Text style={styles.promptLabel}>ROOMMATE VIBE</Text>
            </View>
            <Text style={styles.promptText} numberOfLines={2}>
              "{flatmate.bio}"
            </Text>
          </View>
        )}

        {/* Lifestyle Habit Tag Chips */}
        <View style={styles.tagsContainer}>
          {lifestyleTags.map((tag, idx) => (
            <View key={idx} style={styles.lifestylePill}>
              <Text style={styles.lifestylePillText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Move-in Status Line */}
        <View style={styles.moveInRow}>
          <Calendar size={11.5} color="#64748B" strokeWidth={2.2} />
          <Text style={styles.moveInText}>
            Target Move-in: <Text style={styles.moveInBold}>{flatmate.move_in_date || 'Immediate / Flexible'}</Text>
          </Text>
        </View>

        {/* 3. SOCIAL ACTION DOCK */}
        <View style={styles.cardFooterDock}>
          <Pressable style={styles.viewProfileLink} onPress={handleCardPress}>
            <Text style={styles.viewProfileLinkText}>View Profile</Text>
            <ChevronRight size={13} color="#059669" strokeWidth={2.4} />
          </Pressable>

          <View style={styles.actionsBtnRow}>
            {/* Wave Button */}
            <Pressable
              style={[styles.waveActionBtn, isWaved && styles.waveActionBtnDone]}
              onPress={handleWave}
              disabled={waving}
            >
              {isWaved ? (
                <>
                  <Check size={13} color="#FFFFFF" strokeWidth={3} />
                  <Text style={styles.waveActionBtnDoneText}>Waved ✨</Text>
                </>
              ) : (
                <>
                  <Hand size={13} color="#059669" strokeWidth={2.4} />
                  <Text style={styles.waveActionBtnText}>Wave 👋</Text>
                </>
              )}
            </Pressable>

            {/* Direct Instant Chat Button */}
            <Pressable style={styles.chatActionBtn} onPress={handleChat}>
              <MessageCircle size={13} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.chatActionBtnText}>Chat</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...V4_SHADOWS.card,
  },
  carouselCard: {
    width: SCREEN_WIDTH * 0.82,
    marginRight: 14,
    marginBottom: 8,
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },

  /* 1. PHOTO CONTAINER */
  imageWrapper: {
    width: '100%',
    height: 310,
    backgroundColor: '#031B2A',
    position: 'relative',
  },
  carouselImageWrap: {
    height: 250,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storyTapZones: {
    position: 'absolute',
    top: 0,
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  storyTapLeft: {
    flex: 1,
  },
  storyTapRight: {
    flex: 1,
  },
  storyBarsRow: {
    position: 'absolute',
    top: 10,
    left: 14,
    right: 14,
    flexDirection: 'row',
    gap: 4,
    zIndex: 15,
  },
  storyBarTrack: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    overflow: 'hidden',
  },
  storyBarFill: {
    height: '100%',
    width: '0%',
    backgroundColor: '#FFFFFF',
  },
  storyBarFillActive: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  storyBarFillDone: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  topFloatingLeft: {
    position: 'absolute',
    top: 22,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(5, 150, 105, 0.92)',
    paddingHorizontal: 7.5,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 243, 208, 0.5)',
    ...V4_SHADOWS.soft,
  },
  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  synergyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    backgroundColor: 'rgba(236, 253, 245, 0.94)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    ...V4_SHADOWS.soft,
  },
  synergyPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.4,
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 22,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...V4_SHADOWS.soft,
  },
  bookmarkBtnActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FEE2E2',
  },
  photoCounterBadge: {
    position: 'absolute',
    bottom: 66,
    right: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 6.5,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  photoCounterText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  photoBottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 36,
    backgroundColor: 'rgba(3, 27, 42, 0.76)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    flex: 1,
  },
  genderChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 7.5,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  genderChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  professionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  professionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E2ECEF',
  },

  /* 2. CARD BODY */
  cardBody: {
    padding: 16,
    gap: 11,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    flex: 1,
  },
  specChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  roomTypeChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 10,
  },
  roomTypeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  budgetChip: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  budgetText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#059669',
  },
  budgetPeriod: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#059669',
  },
  promptBubble: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 11,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  promptLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },
  promptText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16.5,
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  lifestylePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
  },
  lifestylePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  moveInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  moveInText: {
    fontSize: 11,
    color: '#64748B',
  },
  moveInBold: {
    fontWeight: '700',
    color: '#0F172A',
  },

  /* 3. CARD FOOTER DOCK */
  cardFooterDock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 2,
  },
  viewProfileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewProfileLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  actionsBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  waveActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 7.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  waveActionBtnDone: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  waveActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  waveActionBtnDoneText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  chatActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 7.5,
    borderRadius: 12,
    ...V4_SHADOWS.soft,
  },
  chatActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
