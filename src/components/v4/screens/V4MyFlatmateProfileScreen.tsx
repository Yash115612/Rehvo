import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Edit3,
  ShieldCheck,
  Sparkles,
  Users,
  PlusCircle,
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
  CheckCircle2,
  Lock,
  Eye,
  PauseCircle,
  PlayCircle,
  Trash2,
  Quote,
  Flame,
  Check,
  Shield,
  Heart,
  MessageCircle,
  Building2,
  Home,
  ChefHat,
  X,
  Layers,
  CheckCheck,
  Zap,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import { V4AuthGate } from '../ui/V4AuthGate';
import { V4Image } from '../ui/V4Image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const V4MyFlatmateProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    myFlatmateProfile,
    flatmateDraft,
    incomingWaves,
    savedFlatmateIds,
    matchedFlatmateIds,
    acceptedWaveFlatmateIds,
    myFlatmateAnalytics,
    fetchMyFlatmateAnalytics,
    pauseFlatmateProfile,
    resumeFlatmateProfile,
    deleteFlatmateProfile,
    showToast,
    isAuthenticated,
  } = useAppStore();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <View style={[styles.root, { paddingTop: Math.max(insets.top, 20) + 10, paddingHorizontal: 20 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Pressable
            style={styles.circleGlassBtn}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
          </Pressable>
          <Text style={{ fontSize: 20, fontWeight: '900', color: V4_COLORS.textPrimary }}>
            My Flatmate Profile
          </Text>
        </View>

        <V4AuthGate
          icon={Users}
          title="Create Your Flatmate Profile"
          description="Find compatible roommates, get discovered, and live with verified people you'll love."
          benefits={[
            'Personalized AI compatibility matching score',
            'Connect & exchange waves with verified roommates',
            'Direct instant in-app chat with verified marketplace',
            'Verified identity badge for safe coliving',
          ]}
          fullScreen={false}
        />
      </View>
    );
  }

  const hasProfile = Boolean(myFlatmateProfile || flatmateDraft);

  if (!hasProfile) {
    return (
      <View style={[styles.root, { paddingTop: Math.max(insets.top, 20) + 10, paddingHorizontal: 20 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Pressable
            style={styles.circleGlassBtn}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
          </Pressable>
          <Text style={{ fontSize: 20, fontWeight: '900', color: V4_COLORS.textPrimary }}>
            My Flatmate Profile
          </Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14, paddingBottom: 60 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={36} color="#059669" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '900', color: V4_COLORS.textPrimary, textAlign: 'center' }}>
            No Flatmate Profile Created
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: V4_COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
              maxWidth: 320,
            }}
          >
            Create your verified roommate profile to find compatible flatmates, get discovered, and exchange waves with verified marketplace.
          </Text>
          <Pressable
            style={{
              backgroundColor: '#059669',
              borderRadius: 16,
              paddingHorizontal: 24,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginTop: 12,
              ...V4_SHADOWS.medium,
            }}
            onPress={() => router.push('/(renter)/flatmate/create' as any)}
          >
            <PlusCircle size={18} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 15 }}>
              Create Flatmate Profile
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const profile = (myFlatmateProfile || flatmateDraft)!;
  const photos =
    (profile as any).photos && (profile as any).photos.length > 0
      ? (profile as any).photos
      : [(profile as any).avatar_url || (profile as any).avatar || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80'];

  const budgetMin = profile.budget_min || 18000;
  const budgetMax = profile.budget_max || 28000;
  const firstName = (profile.name || user?.name || 'Roommate').split(' ')[0];

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
    ];
  }, [photos]);

  useEffect(() => {
    if (profile?.id) {
      fetchMyFlatmateAnalytics();
    }
  }, [profile?.id, fetchMyFlatmateAnalytics]);

  const stats = useMemo(() => {
    const views = myFlatmateAnalytics?.viewsCount || (profile as any).views_count || 48;
    const wavesCount = myFlatmateAnalytics?.wavesReceived ?? (incomingWaves.length + (savedFlatmateIds?.length || 0) || 12);
    const chatsCount = myFlatmateAnalytics?.matchesCount ?? (Array.from(new Set([...matchedFlatmateIds, ...acceptedWaveFlatmateIds])).length || 5);
    const responseRate = myFlatmateAnalytics?.responseRate ?? 94;
    return { views, wavesCount, chatsCount, responseRate };
  }, [myFlatmateAnalytics, profile, incomingWaves, savedFlatmateIds, matchedFlatmateIds, acceptedWaveFlatmateIds]);

  const completionScore = useMemo(() => {
    if (myFlatmateAnalytics?.profileCompletion) {
      return myFlatmateAnalytics.profileCompletion;
    }
    let score = 0;
    if (photos.length >= 2) score += 25;
    else if (photos.length === 1) score += 15;
    if (profile.bio && profile.bio.length >= 20) score += 25;
    if (profile.verifications?.is_identity_verified || profile.is_kyc_verified) score += 25;
    if (
      (profile.lifestyle_tags && profile.lifestyle_tags.length >= 2) ||
      (profile.lifestyle_preferences && profile.lifestyle_preferences.length >= 2)
    ) {
      score += 25;
    }
    return Math.min(100, Math.max(score, 50));
  }, [myFlatmateAnalytics, photos, profile]);

  const handleTogglePause = async () => {
    if (profile.is_paused) {
      await resumeFlatmateProfile(profile.id);
      showToast('Profile is now LIVE & discoverable! 🟢', 'success');
    } else {
      await pauseFlatmateProfile(profile.id);
      showToast('Profile paused and hidden from search ⏸️', 'info');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Flatmate Profile',
      'Are you sure you want to delete your flatmate profile? You can always create a new one.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteFlatmateProfile(profile.id);
            router.replace('/(renter)/profile' as any);
          },
        },
      ]
    );
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

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 96 },
        ]}
      >
        {/* 1. HERO PROFILE GALLERY */}
        <View style={styles.heroWrap}>
          <V4Image source={{ uri: photos[activePhotoIdx] }} style={styles.heroImage} resizeMode="cover" />

          <View style={styles.topVignette} />
          <View style={styles.bottomVignette} />

          {photos.length > 1 && (
            <View style={styles.tapZonesRow}>
              <Pressable style={styles.tapZone} onPress={handlePrevPhoto} />
              <Pressable style={styles.tapZone} onPress={handleNextPhoto} />
            </View>
          )}

          {/* Floating Top Header */}
          <View style={[styles.floatingHeader, { paddingTop: Math.max(insets.top, 14) }]}>
            <Pressable
              style={styles.circleGlassBtn}
              onPress={() => router.back()}
              hitSlop={10}
            >
              <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.4} />
            </Pressable>

            <View style={styles.previewModePill}>
              <Eye size={13} color="#5EEAD4" />
              <Text style={styles.previewModeText}>PUBLIC VIEW PREVIEW</Text>
            </View>

            <Pressable
              style={styles.circleGlassBtn}
              onPress={() => router.push(myFlatmateProfile ? ('/(renter)/flatmate/edit' as any) : ('/(renter)/flatmate/create' as any))}
              hitSlop={10}
            >
              <Edit3 size={18} color="#FFFFFF" strokeWidth={2.2} />
            </Pressable>
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
              <View style={[styles.liveStatusTag, profile.is_paused && styles.liveStatusTagPaused]}>
                <View style={[styles.liveDot, profile.is_paused && styles.liveDotPaused]} />
                <Text style={[styles.liveStatusText, profile.is_paused && styles.liveStatusTextPaused]}>
                  {profile.is_paused ? 'PAUSED' : 'LIVE & DISCOVERABLE'}
                </Text>
              </View>
            </View>

            <View style={styles.heroNameRow}>
              <Text style={styles.heroNameText}>{profile.name}</Text>
              <Text style={styles.heroAgeText}>, {profile.age}</Text>
              <View style={styles.heroCheckCircle}>
                <Check size={11} color="#FFFFFF" strokeWidth={3.5} />
              </View>
            </View>

            <View style={styles.heroMetaRow}>
              <Briefcase size={14} color="#5EEAD4" strokeWidth={2.4} />
              <Text style={styles.heroMetaText} numberOfLines={1}>
                {profile.profession || 'Professional'}
                {profile.company_or_college ? ` @ ${profile.company_or_college}` : ''}
              </Text>
            </View>

            <View style={styles.heroMetaRow}>
              <MapPin size={14} color="#E2ECEF" strokeWidth={2.2} />
              <Text style={styles.heroLocText} numberOfLines={1}>
                Looking in {profile.locality || 'Bandra West'}, {profile.city || 'Mumbai'}
              </Text>
            </View>
          </View>
        </View>

        {/* 1.5 PROFILE STRENGTH & COMPLETENESS */}
        <View style={styles.sectionWrap}>
          <View style={styles.completionCard}>
            <View style={styles.completionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} color="#059669" />
                <Text style={styles.completionTitle}>Profile Strength</Text>
              </View>
              <Text style={styles.completionScoreText}>{completionScore}%</Text>
            </View>
            <View style={styles.completionTrack}>
              <View style={[styles.completionFill, { width: `${completionScore}%` }]} />
            </View>
            <Text style={styles.completionSub}>
              {completionScore >= 90
                ? '🌟 Excellent profile! High visibility in roommate search results.'
                : '💡 Add more photos & verify ID to reach 100% and get 3.5x more waves.'}
            </Text>
          </View>
        </View>

        {/* 2. ACTIVITY & DISCOVERY METRICS */}
        <View style={styles.sectionWrap}>
          <View style={styles.activityStatsCard}>
            <View style={styles.statBox}>
              <Eye size={16} color="#0F766E" />
              <Text style={styles.statNum}>{stats.views}</Text>
              <Text style={styles.statLabel}>Profile Views</Text>
            </View>
            <View style={styles.statBox}>
              <Heart size={16} color="#EF4444" />
              <Text style={styles.statNum}>{stats.wavesCount}</Text>
              <Text style={styles.statLabel}>Waves</Text>
            </View>
            <View style={styles.statBox}>
              <MessageCircle size={16} color="#0F766E" />
              <Text style={styles.statNum}>{stats.chatsCount}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statBox}>
              <TrendingUp size={16} color="#059669" />
              <Text style={styles.statNum}>{stats.responseRate}%</Text>
              <Text style={styles.statLabel}>Response</Text>
            </View>
          </View>
        </View>

        {/* 3. DIGILOCKER TRUST & VERIFICATION STATUS */}
        <View style={styles.sectionWrap}>
          {profile.verifications?.is_identity_verified || profile.is_kyc_verified ? (
            <View style={styles.verifiedCard}>
              <View style={styles.verifiedIconWrap}>
                <ShieldCheck size={22} color="#059669" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.verifiedTitle}>DigiLocker Verified</Text>
                  <View style={styles.verifiedBadgePill}>
                    <Check size={11} color="#059669" strokeWidth={3} />
                    <Text style={styles.verifiedBadgePillText}>100% Valid</Text>
                  </View>
                </View>
                <Text style={styles.verifiedSub}>
                  Government Aadhaar & Identity Authenticated for co-living.
                </Text>
              </View>
            </View>
          ) : (
            <Pressable
              style={styles.unverifiedCard}
              onPress={() => router.push('/(renter)/flatmate/verification' as any)}
            >
              <View style={styles.unverifiedIconWrap}>
                <Shield size={22} color="#D97706" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.unverifiedTitle}>Profile Unverified</Text>
                  <View style={styles.unverifiedBadgePill}>
                    <Text style={styles.unverifiedBadgePillText}>Action Needed</Text>
                  </View>
                </View>
                <Text style={styles.unverifiedSub}>
                  Verify your identity with DigiLocker to get 3x more roommate responses.
                </Text>
              </View>
              <View style={styles.verifyNowBtn}>
                <Text style={styles.verifyNowBtnText}>Verify ID</Text>
                <ChevronRight size={13} color="#FFFFFF" strokeWidth={2.4} />
              </View>
            </Pressable>
          )}
        </View>

        {/* 4. LIFESTYLE SNAPSHOT GRID */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>Lifestyle Snapshot</Text>
          <View style={styles.snapshotGrid}>
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

            <View style={styles.snapshotCard}>
              <View style={styles.snapshotIconBox}>
                <Text style={styles.snapshotEmoji}>🛏️</Text>
              </View>
              <Text style={styles.snapshotLabel}>ROOM TYPE</Text>
              <Text style={styles.snapshotValue}>
                {profile.room_type_preference === 'shared_room' ? 'Shared Room' : 'Private Room'}
              </Text>
              <Text style={styles.snapshotSub}>Preferred space</Text>
            </View>

            <View style={styles.snapshotCard}>
              <View style={styles.snapshotIconBox}>
                <Text style={styles.snapshotEmoji}>📅</Text>
              </View>
              <Text style={styles.snapshotLabel}>MOVE-IN DATE</Text>
              <Text style={styles.snapshotValue}>
                {profile.move_in_date || 'Immediate'}
              </Text>
              <Text style={styles.snapshotSub}>Flexible timing</Text>
            </View>

            <View style={styles.snapshotCard}>
              <View style={styles.snapshotIconBox}>
                <Text style={styles.snapshotEmoji}>💻</Text>
              </View>
              <Text style={styles.snapshotLabel}>WORK STYLE</Text>
              <Text style={styles.snapshotValue}>
                {profile.work_style === 'wfh' ? 'Remote (WFH)' : 'Hybrid Setup'}
              </Text>
              <Text style={styles.snapshotSub}>Quiet day routine</Text>
            </View>
          </View>
        </View>

        {/* 4. ABOUT ME CARD */}
        <View style={styles.sectionWrap}>
          <View style={styles.aboutCard}>
            <View style={styles.aboutHeaderRow}>
              <Quote size={18} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.aboutTitle}>About Me</Text>
            </View>
            <Text style={styles.aboutParagraph} numberOfLines={3}>
              {profile.bio ||
                "Hey! Looking for a clean, friendly flatmate in Bandra/Khar. I work in product design, value personal space & clean common areas, and love exploring cafes on weekends."}
            </Text>
          </View>
        </View>

        {/* 5. APARTMENT PREFERENCES */}
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
                  ₹{budgetMin.toLocaleString('en-IN')} – ₹{budgetMax.toLocaleString('en-IN')}/mo
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
                  {(profile.preferred_localities || ['Bandra West', 'Khar', 'Santacruz', 'Pali Hill']).join(', ')}
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
                  2BHK / 3BHK with verified chill flatmates
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

        {/* 6. LIFESTYLE & HABITS */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>Lifestyle & Habits</Text>
          <View style={styles.habitsChipsWrap}>
            <View style={styles.habitChip}>
              <Utensils size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>
                {profile.food_preference === 'veg' ? 'Pure Vegetarian 🥗' : 'Non-Vegetarian 🍗'}
              </Text>
            </View>

            <View style={styles.habitChip}>
              <Cigarette size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>
                {profile.smoking === 'never' ? 'Non-Smoker 🚭' : 'Balcony Only 🚬'}
              </Text>
            </View>

            <View style={styles.habitChip}>
              <Wine size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>
                {profile.drinking === 'never' ? 'Non-Drinker 💧' : 'Social Drinker 🍻'}
              </Text>
            </View>

            <View style={styles.habitChip}>
              <Dog size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>
                {profile.pets === 'has_pets' ? 'Has Pets 🐾' : 'Pet Friendly 🐶'}
              </Text>
            </View>

            <View style={styles.habitChip}>
              <Clock size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>
                {profile.sleep_habit === 'early_bird' ? 'Early Riser (6 AM) 🌅' : 'Night Owl (1 AM) 🌙'}
              </Text>
            </View>

            <View style={styles.habitChip}>
              <ChefHat size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.habitChipText}>Cooks Daily / Meal Prep 🍳</Text>
            </View>
          </View>
        </View>

        {/* 7. INTERESTS */}
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

        {/* 8. GALLERY */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>Photo & Lifestyle Gallery</Text>
          <View style={styles.pinterestGrid}>
            {lifestyleGallery.map((item, idx) => (
              <Pressable
                key={idx}
                style={styles.pinterestItem}
                onPress={() => setSelectedGalleryPhoto(item.uri)}
              >
                <V4Image source={{ uri: item.uri }} style={styles.pinterestImage} resizeMode="cover" />
                <View style={styles.pinterestTagPill}>
                  <Text style={styles.pinterestTagText}>{item.tag}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 9. CONTROLS & VISIBILITY CARD */}
        <View style={styles.sectionWrap}>
          <View style={styles.manageCard}>
            <Text style={styles.manageTitle}>Profile Visibility & Controls</Text>

            <Pressable style={styles.manageRow} onPress={handleTogglePause}>
              {profile.is_paused ? (
                <PlayCircle size={22} color="#0F766E" strokeWidth={2.2} />
              ) : (
                <PauseCircle size={22} color="#D97706" strokeWidth={2.2} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.manageRowTitle}>
                  {profile.is_paused ? 'Resume Profile' : 'Pause Profile'}
                </Text>
                <Text style={styles.manageRowSub}>
                  {profile.is_paused
                    ? 'Make your profile visible in roommate search feeds'
                    : 'Temporarily hide from roommate searches'}
                </Text>
              </View>
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.manageRow}
              onPress={() => router.push('/(renter)/flatmate/create' as any)}
            >
              <Edit3 size={22} color="#0F766E" strokeWidth={2.2} />
              <View style={{ flex: 1 }}>
                <Text style={styles.manageRowTitle}>Edit Co-Living Profile</Text>
                <Text style={styles.manageRowSub}>
                  Update budget, preferred localities, habits or photos
                </Text>
              </View>
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={styles.manageRow} onPress={handleDelete}>
              <Trash2 size={22} color="#EF4444" strokeWidth={2.2} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.manageRowTitle, { color: '#EF4444' }]}>
                  Delete Profile
                </Text>
                <Text style={styles.manageRowSub}>
                  Remove flatmate profile from REHVO
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* FLOATING ACTION CTA */}
      <View
        style={[
          styles.bottomActionBar,
          { paddingBottom: Math.max(insets.bottom, 12) + 6 },
        ]}
      >
        <Pressable
          style={styles.editPrimaryBtn}
          onPress={() => router.push('/(renter)/flatmate/create' as any)}
        >
          <Edit3 size={18} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.editPrimaryText}>Edit Co-Living Details</Text>
        </Pressable>
      </View>

      {/* Lightbox Modal */}
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
            <V4Image
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
  heroWrap: {
    width: '100%',
    height: 460,
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
    height: 200,
    backgroundColor: 'rgba(3, 27, 42, 0.85)',
  },
  tapZonesRow: {
    position: 'absolute',
    top: 90,
    bottom: 120,
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
  previewModePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(3, 27, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.3)',
  },
  previewModeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#5EEAD4',
    letterSpacing: 0.8,
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
  liveStatusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 118, 110, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
  },
  liveStatusTagPaused: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  liveDotPaused: {
    backgroundColor: '#D97706',
  },
  liveStatusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#5EEAD4',
    letterSpacing: 0.5,
  },
  liveStatusTextPaused: {
    color: '#B45309',
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroNameText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroAgeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E2ECEF',
  },
  heroCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
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
    fontSize: 13.5,
    fontWeight: '700',
    color: '#5EEAD4',
  },
  heroLocText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E2ECEF',
  },
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
  completionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.card,
    gap: 8,
  },
  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  completionScoreText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#059669',
  },
  completionTrack: {
    height: 6,
    backgroundColor: '#E2ECEF',
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  completionFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 3,
  },
  completionSub: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  activityStatsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.card,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFB',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2ECEF',
    gap: 2,
  },
  statNum: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  verifiedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    ...V4_SHADOWS.card,
  },
  verifiedIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  verifiedBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedBadgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  unverifiedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    ...V4_SHADOWS.card,
  },
  unverifiedIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unverifiedTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  unverifiedSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  unverifiedBadgePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  unverifiedBadgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  verifyNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  verifyNowBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
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
  pinterestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pinterestItem: {
    width: (SCREEN_WIDTH - 32 - 10) / 2,
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#031B2A',
    ...V4_SHADOWS.card,
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
  manageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.card,
    gap: 12,
  },
  manageTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    marginBottom: 4,
  },
  manageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  manageRowTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  manageRowSub: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2ECEF',
    ...V4_SHADOWS.card,
  },
  editPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F766E',
    paddingVertical: 14,
    borderRadius: 16,
    ...V4_SHADOWS.card,
  },
  editPrimaryText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
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
