import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Sparkles,
  IndianRupee,
  MapPin,
  Utensils,
  Moon,
  Calendar,
  Briefcase,
  CheckCircle2,
  Lightbulb,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  Heart,
} from 'lucide-react-native';
import { FlatmateProfile } from '../../types';
import { V4CompatibilityRing } from './ui/V4CompatibilityRing';
import { useAppStore } from '../../store/useAppStore';
import { calculateCompatibilityScore } from '../../services/flatmatesData';

interface CompatibilityInsightsScreenProps {
  profile: FlatmateProfile;
}

export const CompatibilityInsightsScreen: React.FC<CompatibilityInsightsScreenProps> = ({
  profile,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { myFlatmateProfile } = useAppStore();

  const synergy = useMemo(() => {
    return calculateCompatibilityScore(myFlatmateProfile, profile);
  }, [myFlatmateProfile, profile]);

  const score = synergy.overallScore;
  const firstName = profile.name ? profile.name.split(' ')[0] : 'Flatmate';

  const breakdown = [
    {
      title: 'Budget Match (20%)',
      icon: <IndianRupee size={16} color="#059669" strokeWidth={2.4} />,
      score: synergy.budgetScore,
      desc: `Budget synergy aligned: rent range matches ₹${((profile.budget_min || 15000) / 1000).toFixed(0)}k–₹${((profile.budget_max || 30000) / 1000).toFixed(0)}k/mo expectation.`,
    },
    {
      title: 'Area & Locality Match (20%)',
      icon: <MapPin size={16} color="#059669" strokeWidth={2.4} />,
      score: synergy.locationScore,
      desc: `Preferred neighborhoods in ${profile.locality || profile.preferred_locations?.[0] || 'prime areas'} and neighboring zones.`,
    },
    {
      title: 'Lifestyle & Diet Match (20%)',
      icon: <Utensils size={16} color="#059669" strokeWidth={2.4} />,
      score: synergy.lifestyleScore,
      desc: `${profile.food_preference || 'Vegetarian friendly'} dietary preference with ${profile.smoking === 'never' ? 'non-smoker' : 'moderate'} rules.`,
    },
    {
      title: 'Habits & Routine (15%)',
      icon: <Moon size={16} color="#059669" strokeWidth={2.4} />,
      score: synergy.habitsScore,
      desc: `Daily habits align: ${profile.sleep_habit === 'early_bird' ? 'Early riser' : 'Night owl'} and ${profile.work_style || 'hybrid'} work schedule.`,
    },
    {
      title: 'Move-in Timeline (15%)',
      icon: <Calendar size={16} color="#059669" strokeWidth={2.4} />,
      score: synergy.moveInScore,
      desc: `Target move-in timeline: ${profile.move_in_timing || profile.move_in_date || 'Immediate'} timing alignment.`,
    },
    {
      title: 'Shared Interests (10%)',
      icon: <Briefcase size={16} color="#059669" strokeWidth={2.4} />,
      score: synergy.interestsScore,
      desc: `Mutual lifestyle hobbies: ${(profile.lifestyle_tags || profile.lifestyle_preferences || ['Fitness', 'Music', 'Cooking']).slice(0, 3).join(', ')}.`,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color="#0F172A" strokeWidth={2.4} />
        </Pressable>

        <View style={styles.titleWrap}>
          <Text style={styles.headerTitle}>AI Compatibility Breakdown</Text>
          <Text style={styles.headerSub}>Synergy report with {profile.name}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 60 },
        ]}
      >
        {/* 1. Hero Ring & Score Card */}
        <View style={styles.heroScoreCard}>
          <V4CompatibilityRing score={score} size={84} strokeWidth={6} showLabel labelText="SYNERGY" showSparkle />

          <View style={styles.heroScoreInfo}>
            <View style={styles.highMatchPill}>
              <Sparkles size={13} color="#059669" />
              <Text style={styles.highMatchPillText}>EXCELLENT ROOMMATE MATCH</Text>
            </View>
            <Text style={styles.heroScoreTitle}>
              You & {firstName} have {score}% synergy
            </Text>
            <Text style={styles.heroScoreSub}>
              Highest compatibility across budget, location, and daily co-living habits.
            </Text>
          </View>
        </View>

        {/* 2. AI Synthesis Insight Box */}
        <View style={styles.aiInsightBox}>
          <View style={styles.aiInsightHeader}>
            <Sparkles size={16} color="#059669" />
            <Text style={styles.aiInsightTitle}>REHVO AI Co-Living Analysis</Text>
          </View>
          <Text style={styles.aiInsightText}>
            {profile.compatibility?.explanation ||
              `You and ${firstName} have nearly identical budget parameters and shared locality priorities in ${profile.locality || 'Mumbai'}. Your non-smoking and neat lifestyle preferences make this pairing ideal for a peaceful long-term flatshare.`}
          </Text>
        </View>

        {/* 3. Breakdown Cards */}
        <Text style={styles.sectionHeaderTitle}>Compatibility Pillars</Text>
        <View style={styles.breakdownStack}>
          {breakdown.map((item, idx) => (
            <View key={idx} style={styles.breakdownCard}>
              <View style={styles.breakdownTopRow}>
                <View style={styles.breakdownIconCircle}>{item.icon}</View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.breakdownTitle}>{item.title}</Text>
                </View>
                <View style={styles.breakdownScoreBadge}>
                  <Text style={styles.breakdownScoreText}>{item.score}%</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${item.score}%` }]} />
              </View>

              <Text style={styles.breakdownDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>

        {/* 4. Improvement Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Lightbulb size={18} color="#D97706" />
            <Text style={styles.tipsTitle}>Tips to Boost Roommate Synergy</Text>
          </View>

          <View style={styles.tipRow}>
            <CheckCircle2 size={15} color="#059669" />
            <Text style={styles.tipText}>Complete DigiLocker KYC verification for instant trust.</Text>
          </View>

          <View style={styles.tipRow}>
            <CheckCircle2 size={15} color="#059669" />
            <Text style={styles.tipText}>Add your workplace or college verification badge.</Text>
          </View>

          <View style={styles.tipRow}>
            <CheckCircle2 size={15} color="#059669" />
            <Text style={styles.tipText}>List specific weekend hobbies and language fluencies.</Text>
          </View>
        </View>

        {/* Action CTA */}
        <Pressable
          style={styles.chatCTA}
          onPress={() => router.push(`/(renter)/flatmate/${profile.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`View ${firstName}'s profile`}
        >
          <Text style={styles.chatCTAText}>View {firstName}'s Full Profile</Text>
          <ChevronRight size={16} color="#FFFFFF" strokeWidth={2.4} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  heroScoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.2,
    borderColor: '#CCFBF1',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  heroScoreInfo: {
    flex: 1,
    gap: 4,
  },
  highMatchPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  highMatchPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.4,
  },
  heroScoreTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  heroScoreSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  aiInsightBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#99F6E4',
    padding: 16,
    gap: 8,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiInsightTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  aiInsightText: {
    fontSize: 13,
    color: '#134E4A',
    lineHeight: 19,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  breakdownStack: {
    gap: 10,
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 8,
  },
  breakdownTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  breakdownIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  breakdownScoreBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  breakdownScoreText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#059669',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 3,
  },
  breakdownDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  tipsCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#FDE68A',
    padding: 16,
    gap: 10,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipsTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#B45309',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#78350F',
    flex: 1,
    lineHeight: 16,
  },
  chatCTA: {
    height: 50,
    backgroundColor: '#059669',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
  },
  chatCTAText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
