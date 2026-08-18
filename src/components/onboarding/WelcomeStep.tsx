import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react-native';
import { REHVOLogo } from '../brand/REHVOLogo';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WelcomeStepProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onGetStarted,
  onSignIn,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Top Header: Logo */}
        <View style={styles.header}>
          <REHVOLogo size="small" />
          <View style={styles.verifiedPill}>
            <ShieldCheck size={13} color="#32B768" strokeWidth={2.5} />
            <Text style={styles.verifiedPillText}>Verified Rentals</Text>
          </View>
        </View>

        {/* Hero Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Subtle overlay pill */}
          <View style={styles.imageFloatingBadge}>
            <Sparkles size={14} color="#6C4DFF" strokeWidth={2.2} />
            <Text style={styles.floatingBadgeText}>
              Direct connect · Zero spam
            </Text>
          </View>
        </View>

        {/* Bottom Content & CTAs */}
        <View style={styles.bottomSection}>
          <View style={styles.textGroup}>
            <Text style={styles.headline}>
              Find a place that feels like home.
            </Text>
            <Text style={styles.subheadline}>
              Discover verified rentals across Mumbai, compare options with
              transparency, and connect directly with property owners.
            </Text>
          </View>

          <View style={styles.actionGroup}>
            {/* Primary CTA */}
            <Pressable
              style={styles.primaryBtn}
              onPress={onGetStarted}
              accessibilityRole="button"
              accessibilityLabel="Get started with setup"
            >
              <Text style={styles.primaryBtnText}>Get started</Text>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
            </Pressable>

            {/* Secondary Sign In CTA */}
            <Pressable
              style={styles.secondaryBtn}
              onPress={onSignIn}
              accessibilityRole="button"
              accessibilityLabel="Sign in to existing account"
            >
              <Text style={styles.secondaryBtnText}>
                Already have an account?{' '}
                <Text style={styles.secondaryBtnHighlight}>Sign in</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C3EEDB',
  },
  verifiedPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1B8246',
  },
  imageWrapper: {
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.44,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 12,
    backgroundColor: '#E8E5EC',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageFloatingBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171522',
  },
  bottomSection: {
    gap: 20,
    paddingBottom: 4,
  },
  textGroup: {
    gap: 8,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  subheadline: {
    fontSize: 14,
    color: '#777482',
    lineHeight: 21,
    fontWeight: '500',
  },
  actionGroup: {
    gap: 12,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  secondaryBtnText: {
    fontSize: 13.5,
    color: '#777482',
    fontWeight: '500',
  },
  secondaryBtnHighlight: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
});
