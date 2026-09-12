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
  Lock,
  ShieldCheck,
  EyeOff,
  Server,
  KeyRound,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

export const V4PrivacyScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const privacySections = [
    {
      title: '1. What Information We Collect',
      content:
        'We collect basic profile information (name, phone number, email) and property preferences to deliver personalized rental listings and site visit bookings.',
    },
    {
      title: '2. DigiLocker & Government KYC Privacy',
      content:
        'When you complete identity verification, REHVO connects directly with DigiLocker / UIDAI using tokenized authentication. We do not store your raw Aadhaar number or biometric data on our servers.',
    },
    {
      title: '3. Data Encryption & Security Standards',
      content:
        'All data in transit and at rest is secured with 256-bit AES encryption. Our cloud infrastructure is hosted in ISO 27001-certified Indian data centers complying with RBI data localization norms.',
    },
    {
      title: '4. Third-Party Sharing Policy',
      content:
        'We NEVER sell or monetize your personal information to third-party telemarketers or external advertisers. Your contact details are only shared with landlords upon your explicit site visit confirmation.',
    },
    {
      title: '5. Right to Erasure & Data Deletion',
      content:
        'You have full control over your data. You can export your data history or permanently delete your account directly through Settings -> Delete Account at any time.',
    },
  ];

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.privacyBanner}>
          <ShieldCheck size={20} color="#16A34A" strokeWidth={2.4} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.privacyBannerTitle}>Your Privacy is our First Priority</Text>
            <Text style={styles.privacyBannerSubtitle}>
              256-bit encryption • 0 spam guarantee • DigiLocker UIDAI compliant
            </Text>
          </View>
        </View>

        {privacySections.map((sec, idx) => (
          <View key={idx} style={styles.sectionCard}>
            <Text style={styles.secTitle}>{sec.title}</Text>
            <Text style={styles.secContent}>{sec.content}</Text>
          </View>
        ))}

        <View style={styles.dpoCard}>
          <KeyRound size={16} color={V4_COLORS.primary} strokeWidth={2.4} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.dpoTitle}>Data Protection Officer (DPO)</Text>
            <Text style={styles.dpoEmail}>privacy@rehvo.in • Mumbai, India</Text>
          </View>
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
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  privacyBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16A34A',
  },
  privacyBannerSubtitle: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 2,
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
  dpoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    marginTop: 8,
    marginBottom: 24,
    ...V4_SHADOWS.soft,
  },
  dpoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  dpoEmail: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
