import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Share,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  Share2,
  ShieldCheck,
  Sparkles,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Utensils,
  Cigarette,
  Wine,
  Dog,
  Clock,
  Laptop,
  Globe,
  ChevronRight,
  MessageCircle,
  Hand,
  CheckCircle2,
  Lock,
  Star,
  Check,
  Moon,
  Sun,
  Coffee,
  Smile,
  Shield,
  Zap,
  Quote,
  Flame,
  Award,
  Compass,
  Music,
  Dumbbell,
  BookOpen,
  Home,
  Building2,
  ChefHat,
  Plane,
  Film,
  X,
  Layers,
  CheckCheck,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import { FlatmateProfile } from '../../../types';
import { calculateCompatibilityScore } from '../../../services/flatmatesData';
import { calculateCompatibilityScore2 } from '../../../services/flatmateCompatibility';
import { calculateTrustScore } from '../../../services/trustSafety';
import { getSharedApartmentSuggestions } from '../../../services/apartmentSuggestions';
import * as flatmateService from '../../../services/flatmates';
import { V4Image } from '../ui/V4Image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface V4FlatmateProfileDetailsScreenProps {
  profile?: FlatmateProfile;
}

export const V4FlatmateProfileDetailsScreen: React.FC<V4FlatmateProfileDetailsScreenProps> = ({
  profile: initialProfile,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    user,
    flatmates,
    properties,
    myFlatmateProfile,
    isFlatmateSaved,
    saveFlatmate,
    unsaveFlatmate,
    sendFlatmateWave,
    superWaveFlatmate,
    startOrGetFlatmateConversation,
    showToast,
  } = useAppStore();

  const [remoteProfile, setRemoteProfile] = useState<FlatmateProfile | null>(initialProfile || null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [hasWaved, setHasWaved] = useState(false);
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<string | null>(null);

  // Sync / fetch remote profile if not available in store
  React.useEffect(() => {
    if (initialProfile) {
      setRemoteProfile(initialProfile);
      return;
    }
    if (id) {
      const match = flatmates.find((fm) => fm.id === id);
      if (match) {
        setRemoteProfile(match);
      } else {
        flatmateService.getFlatmateProfile(id).then((res) => {
          if (res.success && res.data) {
            setRemoteProfile(res.data);
          }
        });
      }
    }
  }, [initialProfile, id, flatmates]);

  // Find flatmate by id or fallback
  const flatmate = useMemo(() => {
    return initialProfile || remoteProfile || flatmates.find((fm) => fm.id === id) || flatmates[0];
  }, [initialProfile, remoteProfile, flatmates, id]);

  // Record profile view
  React.useEffect(() => {
    if (flatmate?.id && flatmate.id !== myFlatmateProfile?.id) {
      flatmateService.recordFlatmateProfileView(flatmate.id, user?.id);
    }
  }, [flatmate?.id, myFlatmateProfile?.id, user?.id]);

  const synergy = useMemo(() => {
    if (!flatmate) return null;
    return calculateCompatibilityScore2(myFlatmateProfile, flatmate);
  }, [myFlatmateProfile, flatmate]);

  const trust = useMemo(() => {
    if (!flatmate) return null;
    return calculateTrustScore(flatmate);
  }, [flatmate]);

  const coLivingSuggestions = useMemo(() => {
    if (!flatmate) return [];
    return getSharedApartmentSuggestions(flatmate, myFlatmateProfile, properties, 4);
  }, [flatmate, myFlatmateProfile, properties]);

  const isSaved = isFlatmateSaved(flatmate?.id || '');

  // High-res profile and apartment lifestyle photos for gallery
  const photos = useMemo(() => {
    if (!flatmate) return [];
    if (flatmate.photos && flatmate.photos.length > 0) return flatmate.photos;
    return [
      flatmate.avatar_url ||
        flatmate.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
    ];
  }, [flatmate]);

  // Curated gallery items (Profile + Apartment lifestyle photos)
  const lifestyleGallery = useMemo(() => {
    return [
      {
        uri: photos[0],
        title: 'Profile Portrait',
        tag: '👤 Verified',
      },
      {
        uri:
          photos[1] ||
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
        title: 'Living Space Vibe',
        tag: '🏡 Living Room',
      },
      {
        uri:
          photos[2] ||
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
        title: 'Work & Coffee Corner',
        tag: '☕ Work Setup',
      },
      {
        uri:
          photos[3] ||
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
        title: 'Kitchen & Meal Space',
        tag: '🍳 Kitchen',
      },
      {
        uri: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
        title: 'Bedroom Preference',
        tag: '🛏️ Bedroom',
      },
      {
        uri: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
        title: 'Balcony & Sunlight',
        tag: '🌿 Balcony',
      },
    ];
  }, [photos]);

  const handleToggleSave = async () => {
    if (!flatmate) return;
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to save flatmates to your wishlist.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/(auth)/login' as any) },
        ]
      );
      return;
    }
    if (isSaved) {
      await unsaveFlatmate(flatmate.id);
      showToast('Removed from saved flatmates', 'info');
    } else {
      await saveFlatmate(flatmate.id);
      showToast('Saved to your wishlist ❤️', 'success');
    }
  };

  const handleShare = async () => {
    if (!flatmate) return;
    try {
      await Share.share({
        message: `Check out ${flatmate.name}'s flatmate profile on REHVO! Looking for roommates in ${
          flatmate.preferred_localities?.[0] || flatmate.locality || 'Mumbai'
        }.`,
      });
    } catch (e) {
      // Ignored
    }
  };

  const handleMatch = async () => {
    if (!flatmate) return;
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to send match waves.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/(auth)/login' as any) },
        ]
      );
      return;
    }

    setHasWaved(true);
    const res = await sendFlatmateWave(
      flatmate.id,
      flatmate.name,
      photos[0],
      flatmate.preferred_localities?.[0] || flatmate.locality
    );

    if (res.isMatched && res.conversationId) {
      Alert.alert(
        "It's a Mutual Match! 🎉",
        `You and ${flatmate.name.split(' ')[0]} liked each other! Start chatting now to coordinate flat hunting.`,
        [
          {
            text: 'Start Chatting',
            onPress: () => router.push(`/(renter)/chat/${res.conversationId}` as any),
          },
          { text: 'Later', style: 'cancel' },
        ]
      );
    } else {
      showToast(`⚡ Match request sent to ${flatmate.name.split(' ')[0]}!`, 'success');
    }
  };

  const handleStartChat = async () => {
    if (!flatmate) return;
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to start chatting with flatmates.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/(auth)/login' as any) },
        ]
      );
      return;
    }
    const convoId = await startOrGetFlatmateConversation(flatmate);
    router.push(`/(renter)/chat/${convoId}` as any);
  };

  const handleNextPhoto = (e?: any) => {
    e?.stopPropagation?.();
    if (photos.length > 1) {
      setActivePhotoIdx((prev) => (prev + 1) % photos.length);
    }
  };

  const handlePrevPhoto = (e?: any) => {
    e?.stopPropagation?.();
    if (photos.length > 1) {
      setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  if (!flatmate) return null;

  const score = synergy?.overallScore || flatmate.compatibility?.overall_score || flatmate.match_score || 96;
  const budgetMin = flatmate.budget_min || 18000;
  const budgetMax = flatmate.budget_max || 28000;
  const firstName = flatmate.name.split(' ')[0];

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 96 },
        ]}
      >
        {/* ========================================================= */}
        {/* 1. FULL-SCREEN HERO PROFILE IMAGE WITH GLASS OVERLAY     */}
        {/* ========================================================= */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: photos[activePhotoIdx] }} style={styles.heroImage} />

          {/* Vignette Gradients */}
          <View style={styles.topVignette} />
          <View style={styles.bottomVignette} />

          {/* Left/Right Tap Zones for Instant Photo Flipping */}
          {photos.length > 1 && (
            <View style={styles.tapZonesRow}>
              <Pressable style={styles.tapZone} onPress={handlePrevPhoto} />
              <Pressable style={styles.tapZone} onPress={handleNextPhoto} />
            </View>
          )}

          {/* Floating Top Liquid Glass Header */}
          <View style={[styles.floatingHeader, { paddingTop: Math.max(insets.top, 14) }]}>
            <Pressable
              style={styles.circleGlassBtn}
              onPress={() => router.back()}
              hitSlop={10}
            >
              <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.4} />
            </Pressable>

            {/* Compatibility Badge in Header */}
            <Pressable
              style={styles.synergyHeaderPill}
              onPress={() =>
                router.push(`/(renter)/flatmate/compatibility/${flatmate.id}` as any)
              }
            >
              <Sparkles size={13} color="#5EEAD4" />
              <Text style={styles.synergyHeaderText}>{score}% SYNERGY</Text>
            </Pressable>

            {/* Right Action Icons */}
            <View style={styles.headerRightBtns}>
              <Pressable style={styles.circleGlassBtn} onPress={handleShare} hitSlop={10}>
                <Share2 size={18} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>

              <Pressable style={styles.circleGlassBtn} onPress={handleToggleSave} hitSlop={10}>
                <Heart
                  size={19}
                  color={isSaved ? '#EF4444' : '#FFFFFF'}
                  fill={isSaved ? '#EF4444' : 'transparent'}
                  strokeWidth={2.2}
                />
              </Pressable>
            </View>
          </View>

          {/* Story Progress Bars */}
          {photos.length > 1 && (
            <View style={[styles.photoDashesWrap, { top: Math.max(insets.top, 14) + 48 }]}>
              {photos.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.photoDash,
                    idx === activePhotoIdx && styles.photoDashActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Hero Bottom Glass Identity Overlay */}
          <View style={styles.heroGlassOverlay}>
            <View style={styles.heroBadgesRow}>
              {/* Verified Flatmate Badge */}
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={13} color="#5EEAD4" strokeWidth={2.6} />
                <Text style={styles.verifiedBadgeText}>VERIFIED FLATMATE</Text>
              </View>

              {/* Live Presence */}
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineBadgeText}>Active Today</Text>
              </View>
            </View>

            {/* Name, Age & Verified Check */}
            <View style={styles.heroNameRow}>
              <Text style={styles.heroNameText}>{flatmate.name}</Text>
              <Text style={styles.heroAgeText}>, {flatmate.age || 24}</Text>
              <View style={styles.heroCheckCircle}>
                <Check size={11} color="#FFFFFF" strokeWidth={3.5} />
              </View>
            </View>

            {/* Occupation & Workplace */}
            <View style={styles.heroMetaRow}>
              <Briefcase size={14} color="#5EEAD4" strokeWidth={2.4} />
              <Text style={styles.heroMetaText} numberOfLines={1}>
                {flatmate.profession || flatmate.occupation || 'Professional'}
                {flatmate.company_or_college ? ` @ ${flatmate.company_or_college}` : ''}
              </Text>
            </View>

            {/* Location */}
            <View style={styles.heroMetaRow}>
              <MapPin size={14} color="#E2ECEF" strokeWidth={2.2} />
              <Text style={styles.heroLocText} numberOfLines={1}>
                Looking in {flatmate.locality || flatmate.preferred_localities?.[0] || 'Bandra West'}, {flatmate.city || 'Mumbai'}
              </Text>
            </View>

            {/* Lifestyle Badges On Hero */}
            <View style={styles.heroLifestyleTagsRow}>
              <View style={styles.heroLifestyleTag}>
                <Text style={styles.heroLifestyleTagText}>
                  {flatmate.food_preference === 'veg' ? '🥗 Pure Veg' : '🍗 Non-Veg OK'}
                </Text>
              </View>
              <View style={styles.heroLifestyleTag}>
                <Text style={styles.heroLifestyleTagText}>
                  {flatmate.smoking === 'never' ? '🚭 Non-Smoker' : '🚬 Smoker'}
                </Text>
              </View>
              <View style={styles.heroLifestyleTag}>
                <Text style={styles.heroLifestyleTagText}>
                  {flatmate.work_style === 'wfh' ? '💻 WFH' : '🏢 Hybrid'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 2. FLOATING COMPATIBILITY SCORE CARD                      */}
        {/* ========================================================= */}
        <Pressable
          style={styles.floatingCompatCard}
          onPress={() =>
            router.push(`/(renter)/flatmate/compatibility/${flatmate.id}` as any)
          }
        >
          <View style={styles.compatCardHeader}>
            <View style={styles.compatTitleCluster}>
              <View style={styles.compatIconWrap}>
                <Sparkles size={16} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.compatCardTitle}>Compatibility Synergy</Text>
                <Text style={styles.compatCardSub}>AI Co-Living Match Score</Text>
              </View>
            </View>

            <View style={styles.compatScoreRing}>
              <Text style={styles.compatScoreRingNum}>{score}%</Text>
              <Text style={styles.compatScoreRingLabel}>MATCH</Text>
            </View>
          </View>

          {/* Explanation Text */}
          <Text style={styles.compatExplanationText}>
            {flatmate.compatibility?.reason_summary ||
              `You and ${firstName} have a ${score}% synergy: matching budget bands (₹${(budgetMin / 1000).toFixed(0)}k–₹${(budgetMax / 1000).toFixed(0)}k), shared early morning routines, and aligned food preferences.`}
          </Text>

          {/* 4 Category Breakdown Progress Bars */}
          <View style={styles.compatGrid}>
            <View style={styles.compatMetricItem}>
              <View style={styles.compatMetricTop}>
                <Text style={styles.compatMetricName}>💰 Budget</Text>
                <Text style={styles.compatMetricVal}>{synergy?.budgetScore || 98}%</Text>
              </View>
              <View style={styles.compatMetricTrack}>
                <View style={[styles.compatMetricFill, { width: `${synergy?.budgetScore || 98}%` }]} />
              </View>
            </View>

            <View style={styles.compatMetricItem}>
              <View style={styles.compatMetricTop}>
                <Text style={styles.compatMetricName}>🌿 Lifestyle</Text>
                <Text style={styles.compatMetricVal}>{synergy?.lifestyleScore || 95}%</Text>
              </View>
              <View style={styles.compatMetricTrack}>
                <View style={[styles.compatMetricFill, { width: `${synergy?.lifestyleScore || 95}%` }]} />
              </View>
            </View>

            <View style={styles.compatMetricItem}>
              <View style={styles.compatMetricTop}>
                <Text style={styles.compatMetricName}>📍 Location</Text>
                <Text style={styles.compatMetricVal}>{synergy?.locationScore || 96}%</Text>
              </View>
              <View style={styles.compatMetricTrack}>
                <View style={[styles.compatMetricFill, { width: `${synergy?.locationScore || 96}%` }]} />
              </View>
            </View>

            <View style={styles.compatMetricItem}>
              <View style={styles.compatMetricTop}>
                <Text style={styles.compatMetricName}>⏰ Habits</Text>
                <Text style={styles.compatMetricVal}>{synergy?.habitsScore || 94}%</Text>
              </View>
              <View style={styles.compatMetricTrack}>
                <View style={[styles.compatMetricFill, { width: `${synergy?.habitsScore || 94}%` }]} />
              </View>
            </View>
          </View>

          <View style={styles.compatCardFooter}>
            <Text style={styles.compatCardFooterText}>View Full AI Compatibility Breakdown</Text>
            <ChevronRight size={14} color="#0F766E" strokeWidth={2.4} />
          </View>
        </Pressable>

        {/* ========================================================= */}
        {/* 3. LIFESTYLE SNAPSHOT GRID (4 ICON CARDS)                 */}
        {/* ========================================================= */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>Lifestyle Snapshot</Text>
          <View style={styles.snapshotGrid}>
            {/* 1. Budget */}
            <View style={styles.snapshotCard}>
              <View style={styles.snapshotIconBox}>
                <Text style={styles.snapshotEmoji}>💰</Text>
              </View>
              <Text style={styles.snapshotLabel}>MONTHLY BUDGET</Text>
              <Text style={styles.snapshotValue}>
                ₹{(budgetMin / 1000).toFixed(0)}k – ₹{(budgetMax / 1000).toFixed(0)}k
              </Text>
              <Text style={styles.snapshotSub}>per month</Text>
            </View>

            {/* 2. Room Type */}
            <View style={styles.snapshotCard}>
              <View style={styles.snapshotIconBox}>
                <Text style={styles.snapshotEmoji}>🛏️</Text>
              </View>
              <Text style={styles.snapshotLabel}>ROOM TYPE</Text>
              <Text style={styles.snapshotValue}>
                {flatmate.room_type_preference === 'shared_room' ? 'Shared Room' : 'Private Room'}
              </Text>
              <Text style={styles.snapshotSub}>Preferred space</Text>
            </View>

            {/* 3. Move-in Date */}
            <View style={styles.snapshotCard}>
              <View style={styles.snapshotIconBox}>
                <Text style={styles.snapshotEmoji}>📅</Text>
              </View>
              <Text style={styles.snapshotLabel}>MOVE-IN DATE</Text>
              <Text style={styles.snapshotValue}>
                {flatmate.move_in_date || 'Immediate'}
              </Text>
              <Text style={styles.snapshotSub}>Flexible timing</Text>
            </View>

            {/* 4. Work Style */}
            <View style={styles.snapshotCard}>
              <View style={styles.snapshotIconBox}>
                <Text style={styles.snapshotEmoji}>💻</Text>
              </View>
              <Text style={styles.snapshotLabel}>WORK STYLE</Text>
              <Text style={styles.snapshotValue}>
                {flatmate.work_style === 'wfh' ? 'Remote (WFH)' : 'Hybrid Setup'}
              </Text>
              <Text style={styles.snapshotSub}>Quiet day routine</Text>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 4. ABOUT ME CARD (MAXIMUM 3 LINES)                        */}
        {/* ========================================================= */}
        <View style={styles.sectionWrap}>
          <View style={styles.aboutCard}>
            <View style={styles.aboutHeaderRow}>
              <Quote size={18} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.aboutTitle}>About {firstName}</Text>
            </View>
            <Text style={styles.aboutParagraph} numberOfLines={3}>
              {flatmate.bio ||
                "Hey! Looking for a clean, friendly flatmate in Bandra/Khar. I work in product design, value personal space & clean common areas, and love exploring cafes on weekends."}
            </Text>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 5. APARTMENT PREFERENCES CARDS                            */}
        {/* ========================================================= */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>Apartment Preferences</Text>
          <View style={styles.preferencesGrid}>
            <View style={styles.prefCard}>
              <View style={styles.prefIconWrap}>
                <Building2 size={16} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.prefCardLabel}>Target Budget</Text>
                <Text style={styles.prefCardVal}>
                  ₹{(budgetMin).toLocaleString('en-IN')} – ₹{(budgetMax).toLocaleString('en-IN')}/mo
                </Text>
              </View>
            </View>

            <View style={styles.prefCard}>
              <View style={styles.prefIconWrap}>
                <MapPin size={16} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.prefCardLabel}>Preferred Areas</Text>
                <Text style={styles.prefCardVal}>
                  {(flatmate.preferred_localities || ['Bandra West', 'Khar', 'Santacruz', 'Pali Hill']).join(', ')}
                </Text>
              </View>
            </View>

            <View style={styles.prefCard}>
              <View style={styles.prefIconWrap}>
                <Home size={16} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.prefCardLabel}>Looking For</Text>
                <Text style={styles.prefCardVal}>
                  {flatmate.looking_for || '2BHK / 3BHK with verified chill flatmates'}
                </Text>
              </View>
            </View>

            <View style={styles.prefCard}>
              <View style={styles.prefIconWrap}>
                <Calendar size={16} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.prefCardLabel}>Lease Duration</Text>
                <Text style={styles.prefCardVal}>11 Months (Standard Agreement)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 6. LIFESTYLE & HABITS (CHIPS INSTEAD OF PARAGRAPHS)       */}
        {/* ========================================================= */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>Lifestyle & Habits</Text>
          <View style={styles.habitsChipsWrap}>
            {/* Food */}
            <View style={styles.habitChip}>
              <Utensils size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>
                {flatmate.food_preference === 'veg'
                  ? 'Pure Vegetarian 🥗'
                  : flatmate.food_preference === 'non_veg'
                  ? 'Non-Vegetarian 🍗'
                  : 'Eggetarian 🍳'}
              </Text>
            </View>

            {/* Smoking */}
            <View style={styles.habitChip}>
              <Cigarette size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>
                {flatmate.smoking === 'never' ? 'Non-Smoker 🚭' : 'Balcony Only 🚬'}
              </Text>
            </View>

            {/* Drinking */}
            <View style={styles.habitChip}>
              <Wine size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>
                {flatmate.drinking === 'never' ? 'Non-Drinker 💧' : 'Social Drinker 🍻'}
              </Text>
            </View>

            {/* Pets */}
            <View style={styles.habitChip}>
              <Dog size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>
                {flatmate.pets === 'has_pets' ? 'Has Pets 🐾' : 'Pet Friendly 🐶'}
              </Text>
            </View>

            {/* Sleep schedule */}
            <View style={styles.habitChip}>
              <Clock size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>
                {flatmate.sleep_habit === 'early_bird' ? 'Early Riser (6 AM) 🌅' : 'Night Owl (1 AM) 🌙'}
              </Text>
            </View>

            {/* Cooking frequency */}
            <View style={styles.habitChip}>
              <ChefHat size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>Cooks Daily / Meal Prep 🍳</Text>
            </View>

            {/* Work style */}
            <View style={styles.habitChip}>
              <Laptop size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>
                {flatmate.work_style === 'wfh' ? 'Remote (WFH) 💻' : 'Hybrid 3 Days Office 🏢'}
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 7. INTERESTS (COLORFUL CHIPS)                             */}
        {/* ========================================================= */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>Interests & Passions</Text>
          <View style={styles.interestsCloudWrap}>
            {[
              { label: '🎧 Indie & Lo-Fi Music', bg: '#EFF6FF', border: '#BFDBFE', color: '#1E40AF' },
              { label: '🏋️ Fitness & Gym', bg: '#ECFDF5', border: '#A7F3D0', color: '#065F46' },
              { label: '☕ Specialty Coffee', bg: '#FFFBEB', border: '#FDE68A', color: '#92400E' },
              { label: '🍳 Cooking & Baking', bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' },
              { label: '🎬 Cinema & OTT', bg: '#FAF5FF', border: '#E9D5FF', color: '#6B21A8' },
              { label: '✈️ Weekend Travel', bg: '#F0FDFA', border: '#99F6E4', color: '#0F766E' },
              { label: '📚 Non-Fiction Reading', bg: '#F8FAFC', border: '#E2E8F0', color: '#334155' },
              { label: '🎾 Tennis & Badminton', bg: '#F0FDF4', border: '#BBF7D0', color: '#166534' },
            ].map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.interestChip,
                  { backgroundColor: item.bg, borderColor: item.border },
                ]}
              >
                <Text style={[styles.interestChipText, { color: item.color }]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ========================================================= */}
        {/* 8. PINTEREST-STYLE GALLERY                                */}
        {/* ========================================================= */}
        <View style={styles.sectionWrap}>
          <View style={styles.galleryHeaderRow}>
            <View>
              <Text style={styles.sectionHeaderTitle}>Photo & Lifestyle Gallery</Text>
              <Text style={styles.gallerySub}>Profile portraits and apartment aesthetics</Text>
            </View>
            <View style={styles.galleryCountBadge}>
              <Layers size={13} color="#0F766E" />
              <Text style={styles.galleryCountText}>{lifestyleGallery.length} Photos</Text>
            </View>
          </View>

          <View style={styles.pinterestGrid}>
            {lifestyleGallery.map((item, idx) => {
              const isLarge = idx === 0 || idx === 3;
              return (
                <Pressable
                  key={idx}
                  style={[
                    styles.pinterestItem,
                    isLarge ? styles.pinterestItemLarge : styles.pinterestItemNormal,
                  ]}
                  onPress={() => setSelectedGalleryPhoto(item.uri)}
                >
                  <Image source={{ uri: item.uri }} style={styles.pinterestImage} />
                  <View style={styles.pinterestTagPill}>
                    <Text style={styles.pinterestTagText}>{item.tag}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ========================================================= */}
        {/* 9. VERIFICATION & TRUST SECTION                           */}
        {/* ========================================================= */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>Verification & Trust Credentials</Text>

          <View style={styles.trustCard}>
            <View style={styles.trustBadgesGrid}>
              <View style={styles.trustBadgeItem}>
                <CheckCircle2 size={18} color="#16A34A" strokeWidth={2.4} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.trustBadgeTitle}>Aadhaar Verified</Text>
                  <Text style={styles.trustBadgeSub}>Govt ID validated via DigiLocker</Text>
                </View>
              </View>

              <View style={styles.trustDivider} />

              <View style={styles.trustBadgeItem}>
                <CheckCircle2 size={18} color="#16A34A" strokeWidth={2.4} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.trustBadgeTitle}>Phone Verified</Text>
                  <Text style={styles.trustBadgeSub}>2-way OTP authenticated number</Text>
                </View>
              </View>

              <View style={styles.trustDivider} />

              <View style={styles.trustBadgeItem}>
                <CheckCircle2 size={18} color="#16A34A" strokeWidth={2.4} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.trustBadgeTitle}>Selfie Liveness Verified</Text>
                  <Text style={styles.trustBadgeSub}>3D facial geometry match confirmed</Text>
                </View>
              </View>

              <View style={styles.trustDivider} />

              <View style={styles.trustBadgeItem}>
                <CheckCircle2 size={18} color="#16A34A" strokeWidth={2.4} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.trustBadgeTitle}>Company / College Verified</Text>
                  <Text style={styles.trustBadgeSub}>
                    {flatmate.company_or_college
                      ? `Workplace domain verified: ${flatmate.company_or_college}`
                      : 'Corporate domain authenticated'}
                  </Text>
                </View>
              </View>
            </View>

            {/* REHVO Verified Guarantee Explainer */}
            <View style={styles.rehvoVerifiedExplainer}>
              <ShieldCheck size={20} color="#0F766E" strokeWidth={2.4} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rehvoVerifiedExplainerTitle}>
                  100% REHVO Verified Co-Living Security
                </Text>
                <Text style={styles.rehvoVerifiedExplainerDesc}>
                  Every verified flatmate passes DigiLocker ID checks, mobile verification, and work/college credentials. Chat safely with end-to-end privacy.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 10. PREFERRED LOCATIONS MAP CARD                          */}
        {/* ========================================================= */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>Preferred Neighborhoods</Text>

          <View style={styles.mapCard}>
            {/* Map Simulation Graphic */}
            <View style={styles.mapVisualContainer}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
                }}
                style={styles.mapVisualImage}
              />
              <View style={styles.mapVisualOverlay} />

              {/* Pin 1: Bandra */}
              <View style={[styles.mapPinContainer, { top: '35%', left: '30%' }]}>
                <View style={styles.mapPinPulse} />
                <View style={styles.mapPinIcon}>
                  <MapPin size={12} color="#FFFFFF" strokeWidth={3} />
                </View>
                <View style={styles.mapPinPill}>
                  <Text style={styles.mapPinText}>Bandra West (Primary)</Text>
                </View>
              </View>

              {/* Pin 2: Khar */}
              <View style={[styles.mapPinContainer, { top: '55%', left: '55%' }]}>
                <View style={styles.mapPinIcon}>
                  <MapPin size={12} color="#FFFFFF" strokeWidth={3} />
                </View>
                <View style={styles.mapPinPill}>
                  <Text style={styles.mapPinText}>Khar West</Text>
                </View>
              </View>
            </View>

            {/* Neighborhood Pills Below Map */}
            <View style={styles.mapNeighborhoodsRow}>
              {(flatmate.preferred_localities || ['Bandra West', 'Khar', 'Santacruz', 'Pali Hill']).map(
                (loc, idx) => (
                  <View key={idx} style={styles.mapNeighborhoodPill}>
                    <MapPin size={12} color="#0F766E" />
                    <Text style={styles.mapNeighborhoodText}>{loc}</Text>
                  </View>
                )
              )}
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 11. REHVO COMPATIBILITY INSIGHTS                          */}
        {/* ========================================================= */}
        <View style={styles.sectionWrap}>
          <View style={styles.insightsCard}>
            <View style={styles.insightsHeader}>
              <Zap size={18} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.insightsTitle}>REHVO Synergy Insights</Text>
            </View>
            <Text style={styles.insightsBody}>
              Based on your search filters and flatmate preferences, you and {firstName} have a top 2% roommate synergy score in Mumbai Western Suburbs.
            </Text>
            <View style={styles.insightsFeaturesList}>
              <View style={styles.insightsFeatureRow}>
                <CheckCheck size={14} color="#0F766E" strokeWidth={2.6} />
                <Text style={styles.insightsFeatureText}>Transparent pricing for joint rentals</Text>
              </View>
              <View style={styles.insightsFeatureRow}>
                <CheckCheck size={14} color="#0F766E" strokeWidth={2.6} />
                <Text style={styles.insightsFeatureText}>Shared Zero-Deposit eligible on REHVO listings</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ========================================================= */}
      {/* 12. STICKY BOTTOM ACTION BAR (SAVE, MATCH, CHAT)           */}
      {/* ========================================================= */}
      <View
        style={[
          styles.stickyBottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) + 6 },
        ]}
      >
        {/* Save Profile Button */}
        <Pressable
          style={[styles.bottomSaveBtn, isSaved && styles.bottomSaveBtnActive]}
          onPress={handleToggleSave}
          hitSlop={6}
        >
          <Heart
            size={20}
            color={isSaved ? '#EF4444' : '#031B2A'}
            fill={isSaved ? '#EF4444' : 'transparent'}
            strokeWidth={2.4}
          />
          <Text style={[styles.bottomSaveText, isSaved && styles.bottomSaveTextActive]}>
            {isSaved ? 'Saved' : 'Save'}
          </Text>
        </Pressable>

        {/* Match Button */}
        <Pressable
          style={[styles.bottomMatchBtn, hasWaved && styles.bottomMatchBtnActive]}
          onPress={handleMatch}
        >
          <Sparkles
            size={18}
            color={hasWaved ? '#0F766E' : '#042F2E'}
            strokeWidth={2.5}
          />
          <Text style={[styles.bottomMatchText, hasWaved && styles.bottomMatchTextActive]}>
            {hasWaved ? 'Matched' : 'Match ⚡'}
          </Text>
        </Pressable>

        {/* Chat Primary CTA */}
        <Pressable
          style={styles.bottomChatBtn}
          onPress={handleStartChat}
        >
          <MessageCircle size={18} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.bottomChatText}>
            Chat with {firstName}
          </Text>
        </Pressable>
      </View>

      {/* Lightbox Photo Preview Modal */}
      {selectedGalleryPhoto && (
        <Modal
          visible={!!selectedGalleryPhoto}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedGalleryPhoto(null)}
        >
          <View style={styles.lightboxBackdrop}>
            <Pressable
              style={styles.lightboxCloseBtn}
              onPress={() => setSelectedGalleryPhoto(null)}
            >
              <X size={24} color="#FFFFFF" />
            </Pressable>
            <Image
              source={{ uri: selectedGalleryPhoto }}
              style={styles.lightboxImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  scrollContent: {
    gap: 18,
  },
  /* 1. HERO PROFILE */
  heroWrap: {
    width: '100%',
    height: 520,
    position: 'relative',
    backgroundColor: '#031B2A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(3, 27, 42, 0.45)',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
    backgroundColor: 'rgba(3, 27, 42, 0.85)',
  },
  tapZonesRow: {
    position: 'absolute',
    top: 90,
    bottom: 140,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 5,
  },
  tapZone: {
    flex: 1,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  circleGlassBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  synergyHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(3, 27, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
  },
  synergyHeaderText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#5EEAD4',
    letterSpacing: 0.8,
  },
  headerRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photoDashesWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 6,
    zIndex: 10,
  },
  photoDash: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  photoDashActive: {
    backgroundColor: '#FFFFFF',
  },
  heroGlassOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 18,
    right: 18,
    zIndex: 8,
    gap: 6,
  },
  heroBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 118, 110, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
  },
  verifiedBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#5EEAD4',
    letterSpacing: 0.6,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 10,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroNameText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },
  heroAgeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E2ECEF',
  },
  heroCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroMetaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5EEAD4',
  },
  heroLocText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E2ECEF',
  },
  heroLifestyleTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  heroLifestyleTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroLifestyleTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* 2. FLOATING COMPATIBILITY CARD */
  floatingCompatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    marginHorizontal: 16,
    marginTop: -28,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    ...V4_SHADOWS.card,
    gap: 14,
  },
  compatCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compatTitleCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  compatIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E6F4F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compatCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  compatCardSub: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0F766E',
  },
  compatScoreRing: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
  },
  compatScoreRingNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  compatScoreRingLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#5EEAD4',
    letterSpacing: 0.5,
  },
  compatExplanationText: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '500',
  },
  compatGrid: {
    gap: 9,
    paddingTop: 4,
  },
  compatMetricItem: {
    gap: 4,
  },
  compatMetricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compatMetricName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  compatMetricVal: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  compatMetricTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2ECEF',
    overflow: 'hidden',
  },
  compatMetricFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#0F766E',
  },
  compatCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  compatCardFooterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },

  /* SECTION COMMON */
  sectionWrap: {
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },

  /* 3. LIFESTYLE SNAPSHOT GRID */
  snapshotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  snapshotCard: {
    width: (SCREEN_WIDTH - 32 - 10) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.card,
  },
  snapshotIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  snapshotEmoji: {
    fontSize: 18,
  },
  snapshotLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  snapshotValue: {
    fontSize: 13.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  snapshotSub: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },

  /* 4. ABOUT ME */
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.card,
    gap: 8,
  },
  aboutHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aboutTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F766E',
  },
  aboutParagraph: {
    fontSize: 13.5,
    color: '#1E293B',
    lineHeight: 21,
    fontWeight: '500',
  },

  /* 5. APARTMENT PREFERENCES */
  preferencesGrid: {
    gap: 10,
  },
  prefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.card,
  },
  prefIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F4F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefCardLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  prefCardVal: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 1,
  },

  /* 6. HABITS CHIPS */
  habitsChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.soft,
  },
  habitChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },

  /* 7. INTERESTS CLOUD */
  interestsCloudWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  interestChipText: {
    fontSize: 12,
    fontWeight: '800',
  },

  /* 8. PINTEREST GALLERY */
  galleryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gallerySub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  galleryCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F4F1',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 10,
  },
  galleryCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  pinterestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  pinterestItem: {
    width: (SCREEN_WIDTH - 32 - 10) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#031B2A',
    ...V4_SHADOWS.card,
  },
  pinterestItemNormal: {
    height: 160,
  },
  pinterestItemLarge: {
    height: 220,
  },
  pinterestImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pinterestTagPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pinterestTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* 9. TRUST & VERIFICATION */
  trustCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.card,
    gap: 14,
  },
  trustBadgesGrid: {
    gap: 8,
  },
  trustBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  trustBadgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  trustBadgeSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  trustDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  rehvoVerifiedExplainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#E6F4F1',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.25)',
  },
  rehvoVerifiedExplainerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F766E',
  },
  rehvoVerifiedExplainerDesc: {
    fontSize: 11,
    color: '#134E4A',
    lineHeight: 15,
    marginTop: 2,
  },

  /* 10. PREFERRED LOCATIONS MAP */
  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.card,
  },
  mapVisualContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: '#031B2A',
  },
  mapVisualImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mapVisualOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(3, 27, 42, 0.35)',
  },
  mapPinContainer: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
  },
  mapPinPulse: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 118, 110, 0.45)',
    top: -4,
  },
  mapPinIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mapPinPill: {
    backgroundColor: 'rgba(3, 27, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.3)',
  },
  mapPinText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#5EEAD4',
  },
  mapNeighborhoodsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 14,
  },
  mapNeighborhoodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAE5D9',
  },
  mapNeighborhoodText: {
    fontSize: 12,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },

  /* 11. REHVO INSIGHTS */
  insightsCard: {
    backgroundColor: '#E6F4F1',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(15, 118, 110, 0.25)',
    gap: 8,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F766E',
  },
  insightsBody: {
    fontSize: 12,
    color: '#134E4A',
    lineHeight: 17,
    fontWeight: '500',
  },
  insightsFeaturesList: {
    gap: 4,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 118, 110, 0.15)',
  },
  insightsFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightsFeatureText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },

  /* 12. STICKY BOTTOM ACTION BAR */
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2ECEF',
    ...V4_SHADOWS.card,
  },
  bottomSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#F8FAFB',
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
  },
  bottomSaveBtnActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  bottomSaveText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#031B2A',
  },
  bottomSaveTextActive: {
    color: '#EF4444',
  },
  bottomMatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#99F6E4',
    borderWidth: 1.5,
    borderColor: '#5EEAD4',
  },
  bottomMatchBtnActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  bottomMatchText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#042F2E',
  },
  bottomMatchTextActive: {
    color: '#0F766E',
  },
  bottomChatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    paddingVertical: 14,
    borderRadius: 18,
    ...V4_SHADOWS.card,
  },
  bottomChatText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  /* LIGHTBOX MODAL */
  lightboxBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  lightboxImage: {
    width: '90%',
    height: '75%',
  },
});
