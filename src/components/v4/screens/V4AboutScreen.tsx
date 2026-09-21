import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building,
  Heart,
  Award,
  Globe,
  CheckCircle2,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

export const V4AboutScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.headerTitle}>About REHVO</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Banner */}
        <View style={styles.brandHero}>
          <View style={styles.logoBadge}>
            <Building size={28} color="#FFFFFF" strokeWidth={2.4} />
          </View>
          <Text style={styles.brandName}>REHVO</Text>
          <Text style={styles.brandTagline}>India's Premium Verified Rental Network</Text>
          <View style={styles.versionPill}>
            <Text style={styles.versionPillText}>Version 4.2.0 (Build 2026)</Text>
          </View>
        </View>

        {/* Mission Statement */}
        <Text style={styles.sectionHeading}>OUR MISSION</Text>
        <View style={styles.card}>
          <Text style={styles.missionText}>
            REHVO was born out of a single conviction: <Text style={{ fontWeight: '800', color: V4_COLORS.primary }}>Renting a home in India should be transparent, effortless, and 10verified listing-free.</Text>
          </Text>
          <Text style={[styles.missionText, { marginTop: 10 }]}>
            We replace outdated middleman networks and spam listings with official DigiLocker authentication, digital e-signed agreements, and direct owner-tenant connections.
          </Text>
        </View>

        {/* Core Pillars */}
        <Text style={styles.sectionHeading}>THE REHVO STANDARD</Text>
        <View style={styles.pillarsGrid}>
          <View style={styles.pillarItem}>
            <View style={[styles.pillarIconBox, { backgroundColor: '#E6FFFA' }]}>
              <Sparkles size={18} color="#0F766E" strokeWidth={2.4} />
            </View>
            <Text style={styles.pillarTitle}>Verified Listing</Text>
            <Text style={styles.pillarDesc}>Zero hidden commissions. Connect directly with authentic landlords.</Text>
          </View>

          <View style={styles.pillarItem}>
            <View style={[styles.pillarIconBox, { backgroundColor: '#DCFCE7' }]}>
              <ShieldCheck size={18} color="#16A34A" strokeWidth={2.4} />
            </View>
            <Text style={styles.pillarTitle}>DigiLocker Title Checks</Text>
            <Text style={styles.pillarDesc}>100% Government authenticated property ownership and tenant IDs.</Text>
          </View>

          <View style={styles.pillarItem}>
            <View style={[styles.pillarIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Award size={18} color="#D97706" strokeWidth={2.4} />
            </View>
            <Text style={styles.pillarTitle}>Instant Refund Lock</Text>
            <Text style={styles.pillarDesc}>100% guaranteed deposit refunds directly managed through escrow.</Text>
          </View>

          <View style={styles.pillarItem}>
            <View style={[styles.pillarIconBox, { backgroundColor: '#EEF2FF' }]}>
              <Globe size={18} color="#6366F1" strokeWidth={2.4} />
            </View>
            <Text style={styles.pillarTitle}>Pan-India Presence</Text>
            <Text style={styles.pillarDesc}>Mumbai, Bengaluru, Delhi NCR, Pune, Hyderabad & Goa.</Text>
          </View>
        </View>

        {/* Certifications */}
        <View style={styles.certCard}>
          <View style={styles.certRow}>
            <CheckCircle2 size={16} color="#16A34A" strokeWidth={2.5} />
            <Text style={styles.certText}>ISO 27001 Certified for Data Security</Text>
          </View>
          <View style={styles.certRow}>
            <CheckCircle2 size={16} color="#16A34A" strokeWidth={2.5} />
            <Text style={styles.certText}>Startup India & DPIIT Recognized</Text>
          </View>
          <View style={styles.certRow}>
            <CheckCircle2 size={16} color="#16A34A" strokeWidth={2.5} />
            <Text style={styles.certText}>Official Government DigiLocker Partner</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with 💚 in Mumbai & Bengaluru</Text>
          <Text style={styles.copyrightText}>© 2026 REHVO Technologies Pvt. Ltd. All rights reserved.</Text>
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
    paddingTop: 20,
  },
  brandHero: {
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 24,
    ...V4_SHADOWS.card,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  brandTagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  versionPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 14,
  },
  versionPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    marginBottom: 24,
    ...V4_SHADOWS.soft,
  },
  missionText: {
    fontSize: 13,
    color: V4_COLORS.textPrimary,
    lineHeight: 20,
  },
  pillarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  pillarItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    ...V4_SHADOWS.soft,
  },
  pillarIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  pillarTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  pillarDesc: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  certCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    gap: 12,
    marginBottom: 24,
    ...V4_SHADOWS.soft,
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  copyrightText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
});
