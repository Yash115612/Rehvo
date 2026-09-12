import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Phone,
  Briefcase,
  GraduationCap,
  Smile,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Award,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const V4FlatmateSafetyScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, myFlatmateProfile } = useAppStore();

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={10}>
          <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <Text style={styles.headerTitle}>Safety & Verification Hub</Text>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 60 },
        ]}
      >
        {/* Hero Trust Badge Card */}
        <View style={styles.heroTrustCard}>
          <View style={styles.shieldIconCircle}>
            <ShieldCheck size={36} color="#0F766E" strokeWidth={2.4} />
          </View>
          <Text style={styles.heroTrustTitle}>100% Verified Co-Living</Text>
          <Text style={styles.heroTrustSub}>
            REHVO authenticates every flatmate using government-backed DigiLocker APIs, two-way mobile OTP, and workplace domain validation.
          </Text>

          <View style={styles.trustScorePill}>
            <Sparkles size={13} color="#0F766E" />
            <Text style={styles.trustScoreText}>REHVO TRUST INDEX • 98 / 100</Text>
          </View>
        </View>

        {/* 5-Tier Verification Grid */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Active Trust Credentials</Text>

          <View style={styles.credentialsList}>
            {/* 1. Aadhaar / Govt ID */}
            <View style={styles.credentialRow}>
              <View style={styles.credentialIconBox}>
                <ShieldCheck size={18} color="#16A34A" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.credentialTitle}>Aadhaar & Govt ID</Text>
                <Text style={styles.credentialSub}>
                  Name, age, and identity matched with official DigiLocker records
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <CheckCircle2 size={12} color="#16A34A" />
                <Text style={styles.verifiedBadgeText}>Verified</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* 2. Phone / WhatsApp */}
            <View style={styles.credentialRow}>
              <View style={styles.credentialIconBox}>
                <Phone size={18} color="#16A34A" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.credentialTitle}>Phone & WhatsApp OTP</Text>
                <Text style={styles.credentialSub}>
                  Two-way SMS handshake authenticated
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <CheckCircle2 size={12} color="#16A34A" />
                <Text style={styles.verifiedBadgeText}>Verified</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* 3. Selfie Liveness */}
            <View style={styles.credentialRow}>
              <View style={styles.credentialIconBox}>
                <Smile size={18} color="#16A34A" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.credentialTitle}>Biometric Selfie Liveness</Text>
                <Text style={styles.credentialSub}>
                  3D facial geometry match confirmed with profile photos
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <CheckCircle2 size={12} color="#16A34A" />
                <Text style={styles.verifiedBadgeText}>Verified</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* 4. Workplace Domain */}
            <View style={styles.credentialRow}>
              <View style={styles.credentialIconBox}>
                <Briefcase size={18} color="#16A34A" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.credentialTitle}>Corporate Work Email</Text>
                <Text style={styles.credentialSub}>
                  Active corporate email domain authenticated
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <CheckCircle2 size={12} color="#16A34A" />
                <Text style={styles.verifiedBadgeText}>Verified</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* 5. University Affiliation */}
            <View style={styles.credentialRow}>
              <View style={styles.credentialIconBox}>
                <GraduationCap size={18} color="#16A34A" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.credentialTitle}>College & Alumni Network</Text>
                <Text style={styles.credentialSub}>
                  Institution degree certificate matched via National Academic Depository
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <CheckCircle2 size={12} color="#16A34A" />
                <Text style={styles.verifiedBadgeText}>Verified</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Safety Charter */}
        <View style={styles.safetyCharterCard}>
          <View style={styles.charterHeaderRow}>
            <Lock size={18} color="#0F766E" strokeWidth={2.4} />
            <Text style={styles.charterHeading}>REHVO Safety Charter</Text>
          </View>
          <Text style={styles.charterParagraph}>
            • Your phone number & sensitive KYC documents remain strictly private until you share them.
          </Text>
          <Text style={styles.charterParagraph}>
            • 24x7 automated spam detection and mutual match reporting tools.
          </Text>
          <Text style={styles.charterParagraph}>
            • Instant Verified digital lease creation with legally binding e-signatures.
          </Text>
        </View>

        {/* Action Button */}
        <Pressable
          style={styles.kycActionBtn}
          onPress={() => router.push('/(renter)/kyc' as any)}
        >
          <ShieldCheck size={18} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.kycActionBtnText}>Manage KYC & DigiLocker</Text>
        </Pressable>
      </ScrollView>
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  heroTrustCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    ...V4_SHADOWS.card,
    gap: 10,
  },
  shieldIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E6F4F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroTrustTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  heroTrustSub: {
    fontSize: 12.5,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  trustScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E6F4F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 6,
  },
  trustScoreText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.6,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.card,
    gap: 14,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  credentialsList: {
    gap: 10,
  },
  credentialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  credentialIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  credentialTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  credentialSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
    lineHeight: 15,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#16A34A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  safetyCharterCard: {
    backgroundColor: '#E6F4F1',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(15, 118, 110, 0.25)',
    gap: 8,
  },
  charterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  charterHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F766E',
  },
  charterParagraph: {
    fontSize: 12,
    color: '#134E4A',
    lineHeight: 17,
    fontWeight: '500',
  },
  kycActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F766E',
    paddingVertical: 16,
    borderRadius: 18,
    ...V4_SHADOWS.card,
  },
  kycActionBtnText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
