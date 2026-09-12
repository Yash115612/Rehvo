import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, ArrowRight, ShieldCheck, Sparkles, Building2, Users } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    id: 's1',
    badge: '100% DIRECT OWNERS',
    title: 'Verified Marketplace Homes Across India',
    subtitle: 'Connect directly with verified homeowners on WhatsApp and enjoy transparent pricing on every rental.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 's2',
    badge: 'DIGILOCKER VERIFIED',
    title: '100% Legal E-Stamp Agreements',
    subtitle: 'Complete biometric verified lease registration in 15 minutes without stepping outside your home.',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 's3',
    badge: 'VIBE MATCH ROOMMATES',
    title: 'Find Compatible Flatmates',
    subtitle: 'Browse 95+ active roommate profiles matched by food habits, work timings, budget, and lifestyle preferences.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80',
  },
];

const V4OnboardingScreenComponent: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < ONBOARDING_SLIDES.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      router.replace('/(renter)/home' as any);
    }
  };

  const handleSkip = () => {
    router.replace('/(renter)/home' as any);
  };

  const slide = ONBOARDING_SLIDES[activeStep];

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={{ uri: slide.imageUrl }} style={styles.bgImage} resizeMode="cover" />
      <View style={styles.overlay} />

      {/* Top Header Row (Skip Button) */}
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
        <View style={styles.brandPill}>
          <Text style={styles.brandPillText}>REHVO</Text>
        </View>

        <Pressable style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Bottom Floating Glass Card */}
      <View style={[styles.bottomCard, { paddingBottom: Math.max(insets.bottom, 20) + 10 }]}>
        {/* Top Tag */}
        <View style={styles.badgePill}>
          <Sparkles size={11} color="#5EEAD4" />
          <Text style={styles.badgeText}>{slide.badge}</Text>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        {/* Step Indicators & CTA Row */}
        <View style={styles.actionRow}>
          {/* Step Dots */}
          <View style={styles.dotsRow}>
            {ONBOARDING_SLIDES.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  activeStep === idx && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* Next / Get Started Button */}
          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {activeStep === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.6} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031B2A',
    position: 'relative',
  },
  bgImage: {
    width: '100%',
    height: '65%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 27, 42, 0.45)',
  },
  topHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  brandPill: {
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  brandPillText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  skipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(3, 27, 42, 0.95)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.3)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#5EEAD4',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 29,
  },
  subtitle: {
    fontSize: 13.5,
    color: V4_COLORS.textSecondary,
    lineHeight: 19,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  dotActive: {
    width: 24,
    backgroundColor: V4_COLORS.primary,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
    borderRadius: 18,
    ...V4_SHADOWS.soft,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});

export const V4OnboardingScreen = React.memo(V4OnboardingScreenComponent);
