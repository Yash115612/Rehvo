import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  MapPin,
  Utensils,
  Clock,
  Laptop,
  MessageCircle,
  Hand,
  Info,
  ShieldCheck,
  Heart,
  ChevronRight,
  Flame,
  Check,
  Zap,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const V4CompatibilityInsightsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { flatmates, startOrGetFlatmateConversation, sendFlatmateWave, showToast } = useAppStore();

  const flatmate = useMemo(() => {
    return flatmates.find((fm) => fm.id === id) || flatmates[0];
  }, [flatmates, id]);

  if (!flatmate) return null;

  const comp = flatmate.compatibility || {
    overall_score: 96,
    budget_match: 98,
    location_match: 95,
    lifestyle_match: 94,
    habit_match: 96,
    reason_summary:
      'High match based on budget overlap, preferred localities in Western Suburbs, quiet work routines, and aligned lifestyle preferences.',
  };

  const firstName = flatmate.name.split(' ')[0];

  const handleStartChat = async () => {
    const convoId = await startOrGetFlatmateConversation(flatmate);
    router.push(`/(renter)/chat/${convoId}` as any);
  };

  const handleWave = async () => {
    await sendFlatmateWave(
      flatmate.id,
      flatmate.name,
      flatmate.photos?.[0] || flatmate.avatar_url,
      flatmate.preferred_localities?.[0] || flatmate.locality
    );
    showToast(`👋 Wave sent to ${firstName}!`, 'success');
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Compatibility Insights</Text>
          <Text style={styles.headerSubtitle}>Apple Health–Style Co-Living Analytics</Text>
        </View>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
      >
        {/* 1. Hero Score Ring Card */}
        <View style={styles.heroScoreCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.avatarWrap}>
              <Image
                source={{
                  uri:
                    flatmate.photos?.[0] ||
                    flatmate.avatar_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                }}
                style={styles.heroAvatar}
              />
              <View style={styles.avatarCheck}>
                <Check size={11} color="#FFFFFF" strokeWidth={3.5} />
              </View>
            </View>

            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>{comp.overall_score}%</Text>
              <Text style={styles.scoreLabel}>OVERALL SYNERGY</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            Exceptional Match with {firstName}
          </Text>
          <Text style={styles.heroSummary}>
            {comp.reason_summary ||
              `You and ${firstName} have strongly aligned budget targets, daily habits, and location preferences.`}
          </Text>
        </View>

        {/* 2. 5-Axis Health-Style Dimension Cards */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeading}>5-Axis Compatibility Dimensions</Text>

          {/* 1. Budget Overlap */}
          <View style={styles.dimensionCard}>
            <View style={styles.dimensionHeader}>
              <View style={styles.dimensionIconWrap}>
                <Text style={styles.dimensionEmoji}>💰</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dimensionTitle}>Budget & Rent Split</Text>
                <Text style={styles.dimensionSubtitle}>
                  ₹{(flatmate.budget_min || 18000).toLocaleString('en-IN')} – ₹
                  {(flatmate.budget_max || 28000).toLocaleString('en-IN')}/mo
                </Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillText}>{comp.budget_match}%</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${comp.budget_match}%` }]} />
            </View>
            <Text style={styles.dimensionInsight}>
              ✅ Both target ₹20k–₹25k per person. Perfect for splitting 2BHKs 50/50.
            </Text>
          </View>

          {/* 2. Location Synergy */}
          <View style={styles.dimensionCard}>
            <View style={styles.dimensionHeader}>
              <View style={styles.dimensionIconWrap}>
                <Text style={styles.dimensionEmoji}>📍</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dimensionTitle}>Location & Neighborhoods</Text>
                <Text style={styles.dimensionSubtitle}>
                  {(flatmate.preferred_localities || ['Bandra West', 'Khar']).join(', ')}
                </Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillText}>{comp.location_match}%</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${comp.location_match}%` }]} />
            </View>
            <Text style={styles.dimensionInsight}>
              ✅ 100% overlap on Western Mumbai suburbs with 15-min metro connectivity.
            </Text>
          </View>

          {/* 3. Sleep & Daily Routine */}
          <View style={styles.dimensionCard}>
            <View style={styles.dimensionHeader}>
              <View style={styles.dimensionIconWrap}>
                <Text style={styles.dimensionEmoji}>⏰</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dimensionTitle}>Daily Routines & Sleep</Text>
                <Text style={styles.dimensionSubtitle}>
                  {flatmate.sleep_habit === 'early_bird' ? 'Early Riser (6 AM)' : 'Night Owl (1 AM)'}
                </Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillText}>{comp.habit_match}%</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${comp.habit_match}%` }]} />
            </View>
            <Text style={styles.dimensionInsight}>
              ✅ Synchronized morning schedules ensure quiet nights and uninterrupted sleep.
            </Text>
          </View>

          {/* 4. Lifestyle & Cleanliness */}
          <View style={styles.dimensionCard}>
            <View style={styles.dimensionHeader}>
              <View style={styles.dimensionIconWrap}>
                <Text style={styles.dimensionEmoji}>🌿</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dimensionTitle}>Lifestyle & Co-Living Habits</Text>
                <Text style={styles.dimensionSubtitle}>
                  {flatmate.food_preference === 'veg' ? 'Pure Veg' : 'Flexible'} • Non-Smoker
                </Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillText}>{comp.lifestyle_match}%</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${comp.lifestyle_match}%` }]} />
            </View>
            <Text style={styles.dimensionInsight}>
              ✅ Mutual non-smoker preference and shared kitchen respect.
            </Text>
          </View>

          {/* 5. Shared Hobbies & Interests */}
          <View style={styles.dimensionCard}>
            <View style={styles.dimensionHeader}>
              <View style={styles.dimensionIconWrap}>
                <Text style={styles.dimensionEmoji}>🎨</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dimensionTitle}>Shared Interests & Vibes</Text>
                <Text style={styles.dimensionSubtitle}>Coffee, Gym, Cinema, Music</Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillText}>92%</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '92%' }]} />
            </View>
            <Text style={styles.dimensionInsight}>
              ✅ Shared love for fitness, cafe hopping, and weekend chill sessions.
            </Text>
          </View>
        </View>

        {/* REHVO Tenant Guarantee */}
        <View style={styles.guaranteeCard}>
          <ShieldCheck size={20} color="#0F766E" strokeWidth={2.4} />
          <View style={{ flex: 1 }}>
            <Text style={styles.guaranteeTitle}>Verified Joint Tenancy</Text>
            <Text style={styles.guaranteeDesc}>
              Pairing with {firstName} makes both of you eligible for joint lease creation and split security deposit protection under REHVO SafeRent.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View
        style={[
          styles.stickyBottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) + 6 },
        ]}
      >
        <Pressable style={styles.waveBtn} onPress={handleWave}>
          <Hand size={18} color="#0F766E" strokeWidth={2.4} />
          <Text style={styles.waveBtnText}>Wave 👋</Text>
        </Pressable>

        <Pressable style={styles.chatBtn} onPress={handleStartChat}>
          <MessageCircle size={18} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.chatBtnText}>Chat with {firstName}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2ECEF',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  heroScoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    ...V4_SHADOWS.card,
    gap: 12,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0F766E',
    position: 'relative',
  },
  heroAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  avatarCheck: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  scoreCircle: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#5EEAD4',
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  heroSummary: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    fontWeight: '500',
  },
  sectionWrap: {
    gap: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  dimensionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.card,
    gap: 10,
  },
  dimensionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dimensionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimensionEmoji: {
    fontSize: 18,
  },
  dimensionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  dimensionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  scorePill: {
    backgroundColor: '#E6F4F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scorePillText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F766E',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0F766E',
    borderRadius: 3,
  },
  dimensionInsight: {
    fontSize: 11.5,
    color: '#0F766E',
    fontWeight: '600',
    lineHeight: 16,
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#E6F4F1',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.25)',
  },
  guaranteeTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  guaranteeDesc: {
    fontSize: 11.5,
    color: '#134E4A',
    lineHeight: 16,
    marginTop: 2,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2ECEF',
    ...V4_SHADOWS.card,
  },
  waveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#E6F4F1',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(15, 118, 110, 0.25)',
  },
  waveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F766E',
    paddingVertical: 14,
    borderRadius: 16,
    ...V4_SHADOWS.card,
  },
  chatBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
