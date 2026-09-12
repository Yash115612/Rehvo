import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export interface HeroAdItem {
  id: string;
  superTag: string;
  superColor: string;
  title: string;
  titleSub: string;
  pillText: string;
  pillBg: string;
  pillColor: string;
  bgGradient: string;
  route: string;
}

export const HERO_ADS: HeroAdItem[] = [
  {
    id: 'ad-1',
    superTag: 'MORE MONTHS = MORE SAVINGS',
    superColor: '#6366F1',
    title: 'VERIFIED LISTING',
    titleSub: 'DIRECT OWNER HOMES',
    pillText: 'Book for 6+ months • Free E-Agreement • 1% Cashback',
    pillBg: '#FFE4E6',
    pillColor: '#E11D48',
    bgGradient: '#FAF5FF',
    route: '/(renter)/search',
  },
  {
    id: 'ad-2',
    superTag: 'INSTANT REWARDS ON RENT',
    superColor: '#0F766E',
    title: 'PAY RENT & EARN',
    titleSub: '1% CASHBACK + 45-DAY CREDIT',
    pillText: 'Pay with Credit Card • ₹650 R-Cash • 0% Transfer Fee',
    pillBg: '#DCFCE7',
    pillColor: '#16A34A',
    bgGradient: '#F0FDFA',
    route: '/(renter)/pay-rent',
  },
  {
    id: 'ad-3',
    superTag: '100% GOVERNMENT COMPLIANT',
    superColor: '#8B5CF6',
    title: 'DIGITAL LEASE & NOC',
    titleSub: 'MODEL TENANCY ACT 2026',
    pillText: 'Aadhaar E-Sign in 2 mins • Valid in Court • 0 Police Visits',
    pillBg: '#F3E8FF',
    pillColor: '#7C3AED',
    bgGradient: '#F5F3FF',
    route: '/(renter)/rental-agreements',
  },
  {
    id: 'ad-4',
    superTag: 'LANDLORD EXCLUSIVE ZONE',
    superColor: '#D97706',
    title: 'LIST & EARN BONUS',
    titleSub: '₹5,000 HOST LAUNCH BONUS',
    pillText: 'List in 3 mins • Verified Tenants • Direct WhatsApp',
    pillBg: '#FEF3C7',
    pillColor: '#D97706',
    bgGradient: '#FFFBEB',
    route: '/(renter)/listing',
  },
];

interface V4HeroAdBannerProps {
  onPressAd?: (route: string) => void;
  onBgColorChange?: (color: string) => void;
}

const V4HeroAdBannerComponent: React.FC<V4HeroAdBannerProps> = ({ onPressAd, onBgColorChange }) => {
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  // Auto rotate hero ad every 4 seconds (pure state update only)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAdIndex((prev) => (prev + 1) % HERO_ADS.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Notify parent of background gradient change AFTER state update / mount
  useEffect(() => {
    if (!onBgColorChange) return;

    const ad = HERO_ADS[activeAdIndex] || HERO_ADS[0];
    if (ad?.bgGradient) {
      onBgColorChange(ad.bgGradient);
    }
  }, [activeAdIndex, onBgColorChange]);

  const currentAd = HERO_ADS[activeAdIndex] || HERO_ADS[0];

  const handlePressAd = useCallback(() => {
    const ad = HERO_ADS[activeAdIndex] || HERO_ADS[0];
    if (ad?.route) {
      onPressAd?.(ad.route);
    }
  }, [onPressAd, activeAdIndex]);

  const handleSelectSlide = useCallback((idx: number) => {
    setActiveAdIndex(idx);
  }, []);

  return (
    <Pressable
      style={styles.heroAdCard}
      onPress={handlePressAd}
      accessibilityRole="button"
      accessibilityLabel={`${currentAd.title} - ${currentAd.pillText}`}
    >
      {/* Super Tag */}
      <Text style={[styles.heroSuperTag, { color: currentAd.superColor }]}>
        {currentAd.superTag}
      </Text>

      {/* Headline */}
      <Text style={styles.heroMainTitle}>{currentAd.title}</Text>
      <Text style={styles.heroSubTitle}>{currentAd.titleSub}</Text>

      {/* Feature Pill */}
      <View style={[styles.heroPill, { backgroundColor: currentAd.pillBg }]}>
        <Text style={[styles.heroPillText, { color: currentAd.pillColor }]}>
          {currentAd.pillText}
        </Text>
      </View>

      {/* Pagination Dots */}
      <View style={styles.heroDotsRow}>
        {HERO_ADS.map((_, idx) => {
          const isActive = idx === activeAdIndex;
          return (
            <Pressable
              key={idx}
              style={[
                styles.heroDot,
                isActive && [styles.heroDotActive, { backgroundColor: currentAd.superColor }],
              ]}
              onPress={() => handleSelectSlide(idx)}
              hitSlop={8}
              accessibilityLabel={`Go to slide ${idx + 1}`}
              accessibilityRole="button"
            />
          );
        })}
      </View>
    </Pressable>
  );
};

export const V4HeroAdBanner = React.memo(V4HeroAdBannerComponent);

const styles = StyleSheet.create({
  heroAdCard: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 4,
  },
  heroSuperTag: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroMainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#031B2A',
    letterSpacing: 1,
    textAlign: 'center',
  },
  heroSubTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.5,
    marginTop: 1,
    marginBottom: 10,
  },
  heroPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 14,
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  heroDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  heroDotActive: {
    width: 18,
    borderRadius: 3,
  },
});

export default V4HeroAdBanner;
