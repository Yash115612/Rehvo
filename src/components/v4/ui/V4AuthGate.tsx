import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Lock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  LogIn,
  UserPlus,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';

export interface V4AuthGateProps {
  title?: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }> | React.ReactNode;
  featureName?: string;
  benefits?: string[];
  onSignIn?: () => void;
  onCreateAccount?: () => void;
  style?: ViewStyle;
  fullScreen?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
  onBack?: () => void;
}

export const V4AuthGate: React.FC<V4AuthGateProps> = ({
  title = 'Sign in to Continue',
  subtitle,
  description,
  badgeText = 'MEMBERS ONLY',
  icon,
  featureName,
  benefits,
  onSignIn,
  onCreateAccount,
  style,
  fullScreen = true,
  showHeader = false,
  headerTitle = '',
  onBack,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const descText = subtitle || description || 'Sign in to access your personal dashboard, chat with owners, and unlock exclusive rewards.';

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      router.push({
        pathname: '/(auth)/login' as any,
        params: { mode: 'signin' },
      });
    }
  };

  const handleCreateAccount = () => {
    if (onCreateAccount) {
      onCreateAccount();
    } else {
      router.push({
        pathname: '/(auth)/login' as any,
        params: { mode: 'signup' },
      });
    }
  };

  const defaultBenefits = [
    'Verified direct communication with owners & trusted brokers',
    'AI roommate matching and instant mutual waves',
    'Earn up to ₹5,000 R-Cash on rent & bill payments',
    'Free DigiLocker identity verification & trust score',
  ];

  const activeBenefits = benefits && benefits.length > 0 ? benefits : defaultBenefits;

  return (
    <View
      style={[
        styles.root,
        fullScreen && {
          paddingTop: showHeader ? 0 : Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 20),
        },
        style,
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Glowing Icon Container */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconGlow} />
          <View style={styles.iconBox}>
            {icon ? (
              React.isValidElement(icon) ? (
                icon
              ) : (
                React.createElement(icon as any, {
                  size: 32,
                  color: '#059669',
                  strokeWidth: 2.4,
                })
              )
            ) : (
              <Lock size={32} color="#059669" strokeWidth={2.4} />
            )}
          </View>
        </View>

        {/* Badge Pill */}
        {badgeText ? (
          <View style={styles.badgePill}>
            <Sparkles size={12} color="#059669" strokeWidth={2.5} />
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        ) : null}

        {/* Title & Description */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{descText}</Text>

        {/* Benefits Container */}
        <View style={styles.benefitsCard}>
          <View style={styles.benefitsHeader}>
            <ShieldCheck size={16} color="#0F766E" strokeWidth={2.4} />
            <Text style={styles.benefitsHeaderTitle}>
              {featureName ? `WHY SIGN IN FOR ${featureName.toUpperCase()}?` : 'REHVO MEMBER PERKS'}
            </Text>
          </View>

          <View style={styles.benefitsList}>
            {activeBenefits.map((item, idx) => (
              <View key={idx} style={styles.benefitRow}>
                <View style={styles.checkCircle}>
                  <CheckCircle2 size={14} color="#059669" strokeWidth={2.6} />
                </View>
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action CTAs */}
        <View style={styles.actionsGroup}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
            ]}
            onPress={handleSignIn}
          >
            <LogIn size={18} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.primaryBtnText}>Sign In</Text>
            <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && { opacity: 0.85, backgroundColor: '#F0FDF4' },
            ]}
            onPress={handleCreateAccount}
          >
            <UserPlus size={18} color="#059669" strokeWidth={2.2} />
            <Text style={styles.secondaryBtnText}>Create Account</Text>
          </Pressable>
        </View>

        {/* Trust Disclaimer */}
        <View style={styles.trustDisclaimer}>
          <Text style={styles.trustText}>
            🔒 100% Secure • Verified Listing • Govt ID DigiLocker Verified
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 32,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(5, 150, 105, 0.15)',
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    ...V4_SHADOWS.card,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#031B2A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 340,
    marginBottom: 24,
  },
  benefitsCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    marginBottom: 24,
    ...V4_SHADOWS.soft,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  benefitsHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.6,
  },
  benefitsList: {
    gap: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkCircle: {
    marginTop: 2,
  },
  benefitText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
    lineHeight: 18,
    flex: 1,
  },
  actionsGroup: {
    width: '100%',
    maxWidth: 380,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...V4_SHADOWS.card,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#059669',
  },
  secondaryBtnText: {
    color: '#059669',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  trustDisclaimer: {
    marginTop: 20,
    alignItems: 'center',
  },
  trustText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
});
