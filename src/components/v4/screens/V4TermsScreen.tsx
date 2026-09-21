import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

export const V4TermsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content:
        'By downloading, accessing, or using the REHVO application, you agree to be bound by these Terms of Service and all applicable laws of the Republic of India.',
    },
    {
      title: '2. Verified Marketplace Guarantee',
      content:
        'REHVO operates as a verified rental marketplace connecting property owners, landlords, and prospective tenants. All listings are verified and pricing is transparent.',
    },
    {
      title: '3. DigiLocker Identity Verification',
      content:
        'All users agree to provide authentic Government-issued credentials (Aadhaar / PAN) via UIDAI / DigiLocker. Providing counterfeit or fraudulent documents will result in permanent blacklist and police referral.',
    },
    {
      title: '4. Token Payments & Instant Refunds',
      content:
        'Booking tokens paid to reserve property visits are held in secure escrow. If the tenant or landlord cancels the site visit prior to confirmation, 100% of the token is refunded immediately.',
    },
    {
      title: '5. Rental Agreements & E-Signatures',
      content:
        'All digital rent agreements generated via REHVO conform to the Model Tenancy Act and Information Technology Act (2000). Electronic signatures via Aadhaar OTP carry full legal validity in Indian courts.',
    },
    {
      title: '6. Anti-Discrimination Policy',
      content:
        'REHVO enforces strict equal-opportunity housing standards. Discrimination based on religion, gender, marital status, sexual orientation, food habits, or caste is strictly prohibited.',
    },
  ];

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.lastUpdatedBanner}>
          <FileText size={16} color="#0F766E" strokeWidth={2.2} />
          <Text style={styles.lastUpdatedText}>Effective Date: September 1, 2026</Text>
        </View>

        {sections.map((sec, idx) => (
          <View key={idx} style={styles.sectionCard}>
            <Text style={styles.secTitle}>{sec.title}</Text>
            <Text style={styles.secContent}>{sec.content}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerLegal}>REHVO Technologies Private Limited • Mumbai, Maharashtra</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EEF0',
    ...V4_SHADOWS.soft,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  lastUpdatedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  lastUpdatedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
    marginLeft: 8,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    marginBottom: 14,
    ...V4_SHADOWS.soft,
  },
  secTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginBottom: 8,
  },
  secContent: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    lineHeight: 19,
  },
  footer: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 20,
  },
  footerLegal: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
