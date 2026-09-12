import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  Building2,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
} from 'lucide-react-native';
import { V4BrandLogo } from '../ui/V4BrandLogo';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RoleType = 'renter' | 'owner' | 'broker';

interface RoleOption {
  id: RoleType;
  title: string;
  roleTag: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  icon: any;
  headline: string;
  description: string;
  perks: string[];
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'renter',
    title: 'Renter',
    roleTag: 'TENANTS & FLATMATES',
    badge: 'VERIFIED LISTING',
    badgeBg: '#D1FAE5',
    badgeColor: '#065F46',
    icon: Compass,
    headline: 'Find Your Next Luxury Space',
    description: 'Browse verified marketplace flats, discover verified flatmates, and move in with state-stamped e-leases.',
    perks: [
      'Direct owner chat with zero middleman fees',
      'DigiLocker KYC & government e-lease agreements',
      'Curated flatmate matching & lifestyle wave invites',
    ],
  },
  {
    id: 'owner',
    title: 'Owner / Lister',
    roleTag: 'PROPERTY OWNERS & LANDLORDS',
    badge: 'AUTOMATED CRM',
    badgeBg: '#FEF3C7',
    badgeColor: '#92400E',
    icon: Building2,
    headline: 'Manage Your Property Portfolio',
    description: 'List luxury properties for free, screen pre-verified tenant applications, and auto-collect rent via UPI AutoPay.',
    perks: [
      '100% verified tenant applicants (Aadhaar + PAN + police)',
      'Automated rent reconciliation on the 1st of every month',
      'Legally binding 11-month registered e-leases in 1-tap',
    ],
  },
  {
    id: 'broker',
    title: 'Broker / Real Estate Agent',
    roleTag: 'RERA CERTIFIED AGENTS & AGENCIES',
    badge: 'RERA VERIFIED PARTNER',
    badgeBg: '#EDE9FE',
    badgeColor: '#5B21B6',
    icon: Briefcase,
    headline: 'Scale Your Agency Pipeline',
    description: 'Manage exclusive inventory, connect with pre-screened luxury buyers and tenants, and close deals faster.',
    perks: [
      'Dedicated agency CRM with inventory broadsheets',
      'High-intent qualified leads in Mumbai’s prime corridors',
      'Official verified broker badge with RERA credential display',
    ],
  },
];

export const V4RoleSelectionScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setPendingAuthRole } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<RoleType>('renter');

  const handleContinue = (role: RoleType) => {
    setSelectedRole(role);
    setPendingAuthRole(role);
    router.push({
      pathname: '/(auth)/login',
      params: { role, mode: 'signup' },
    } as any);
  };

  const handleSignInDirect = (role: RoleType) => {
    setPendingAuthRole(role);
    router.push({
      pathname: '/(auth)/login',
      params: { role, mode: 'signin' },
    } as any);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* TOP BRAND HEADER */}
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
        <View style={styles.headerBrandRow}>
          <V4BrandLogo variant="horizontal" size="md" />
          <View style={styles.versionPill}>
            <Text style={styles.versionPillText}>V6.1</Text>
          </View>
        </View>

        <Text style={styles.screenHeading}>Choose Your Experience</Text>
        <Text style={styles.screenSub}>
          Select how you want to use REHVO today. You can switch between experiences anytime from your profile.
        </Text>
      </View>

      {/* ROLE SELECTION CARDS */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: Math.max(insets.bottom, 24) + 30 },
        ]}
      >
        <View style={styles.cardsWrap}>
          {ROLE_OPTIONS.map((opt) => {
            const isSelected = selectedRole === opt.id;
            const IconComponent = opt.icon;

            return (
              <Pressable
                key={opt.id}
                style={[
                  styles.roleCard,
                  isSelected && styles.roleCardSelected,
                ]}
                onPress={() => setSelectedRole(opt.id)}
              >
                {/* Top Row: Icon + Badge */}
                <View style={styles.cardTopRow}>
                  <View
                    style={[
                      styles.iconCircle,
                      isSelected && styles.iconCircleSelected,
                    ]}
                  >
                    <IconComponent
                      size={24}
                      color={isSelected ? '#FFFFFF' : '#0F766E'}
                      strokeWidth={2.4}
                    />
                  </View>

                  <View style={[styles.roleBadge, { backgroundColor: opt.badgeBg }]}>
                    <Sparkles size={11} color={opt.badgeColor} />
                    <Text style={[styles.roleBadgeText, { color: opt.badgeColor }]}>
                      {opt.badge}
                    </Text>
                  </View>
                </View>

                {/* Role Title & Headline */}
                <Text style={styles.roleTitleTag}>{opt.roleTag}</Text>
                <Text style={styles.roleMainTitle}>{opt.title}</Text>
                <Text style={styles.roleDesc}>{opt.description}</Text>

                {/* Perks Checklist */}
                <View style={styles.perksContainer}>
                  {opt.perks.map((perk, pIdx) => (
                    <View key={pIdx} style={styles.perkRow}>
                      <CheckCircle2 size={13} color="#16A34A" strokeWidth={2.4} />
                      <Text style={styles.perkText}>{perk}</Text>
                    </View>
                  ))}
                </View>

                {/* Primary CTA Button */}
                <Pressable
                  style={[
                    styles.continueBtn,
                    isSelected && styles.continueBtnSelected,
                  ]}
                  onPress={() => handleContinue(opt.id)}
                >
                  <Text
                    style={[
                      styles.continueBtnText,
                      isSelected && styles.continueBtnTextSelected,
                    ]}
                  >
                    Continue as {opt.title.split(' ')[0]}
                  </Text>
                  <ArrowRight
                    size={16}
                    color={isSelected ? '#FFFFFF' : '#0F766E'}
                    strokeWidth={2.4}
                  />
                </Pressable>

                {/* Quick Sign In Link for Existing Accounts */}
                <Pressable
                  style={styles.signInLinkRow}
                  onPress={() => handleSignInDirect(opt.id)}
                >
                  <Text style={styles.signInLinkText}>
                    Already have a {opt.title.split(' ')[0]} account?{' '}
                    <Text style={styles.signInLinkBold}>Sign In</Text>
                  </Text>
                </Pressable>
              </Pressable>
            );
          })}
        </View>

        {/* Guest Browse Option */}
        <View style={styles.guestFooter}>
          <Pressable
            style={styles.guestBtn}
            onPress={() => router.replace('/(renter)/home' as any)}
          >
            <Text style={styles.guestBtnText}>Browse REHVO as Guest</Text>
            <ChevronRight size={15} color="#64748B" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  versionPill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  versionPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5,
  },
  screenHeading: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  screenSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  scrollContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  cardsWrap: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  roleCardSelected: {
    borderColor: '#0F766E',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F766E',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  iconCircleSelected: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  roleTitleTag: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  roleMainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  roleDesc: {
    fontSize: 13,
    color: '#475569',
    marginTop: 6,
    lineHeight: 18,
  },
  perksContainer: {
    marginTop: 14,
    marginBottom: 16,
    gap: 7,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
  },
  perkText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    lineHeight: 16,
    fontWeight: '500',
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  continueBtnSelected: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F766E',
  },
  continueBtnTextSelected: {
    color: '#FFFFFF',
  },
  signInLinkRow: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 4,
  },
  signInLinkText: {
    fontSize: 12,
    color: '#64748B',
  },
  signInLinkBold: {
    color: '#0F766E',
    fontWeight: '800',
  },
  guestFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  guestBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
});
