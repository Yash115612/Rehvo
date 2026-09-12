'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

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

export interface CardStyle {
  gradient: string;
  glowColor: string;
  borderColor: string;
  tagBg: string;
  tagColor: string;
  tagText: string;
  titleColor?: string;
  subtextColor: string;
  iconBg: string;
  iconColor: string;
  ctaBg: string;
  ctaColor: string;
  shadow: string;
}

export interface CardThemeSet {
  tallCard: CardStyle;
  pgCard: CardStyle;
  commercialCard: CardStyle;
}

export const HERO_ADS: HeroAdItem[] = [
  {
    id: 'ad-1',
    superTag: 'INDIA’S VERIFIED RENTAL MARKETPLACE',
    superColor: '#6366F1',
    title: 'VERIFIED HOMES',
    titleSub: 'OWNERS & TRUSTED BROKERS',
    pillText: 'Verified Listings • Transparent Pricing • Direct Chat',
    pillBg: '#FFE4E6',
    pillColor: '#E11D48',
    bgGradient: '#FAF5FF', // Soft lilac tint
    route: '/search',
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
    bgGradient: '#F0FDFA', // Soft mint cyan tint
    route: '/download',
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
    bgGradient: '#F5F3FF', // Soft violet tint
    route: '/services',
  },
  {
    id: 'ad-4',
    superTag: 'LANDLORD & BROKER HUB',
    superColor: '#D97706',
    title: 'LIST & EARN BONUS',
    titleSub: '₹5,000 HOST LAUNCH BONUS',
    pillText: 'List in 3 mins • Verified Tenants • Direct WhatsApp',
    pillBg: '#FEF3C7',
    pillColor: '#D97706',
    bgGradient: '#FFFBEB', // Soft golden warm tint
    route: '/list-property',
  },
];

export const CARD_THEMES: CardThemeSet[] = [
  // Slide 0 (Lilac / Verified Marketplace): Soft Mint Fresh + Lavender Glow + Sky Cyan Light
  {
    tallCard: {
      gradient: 'linear-gradient(145deg, #F0FDF4 0%, #E6FFFA 50%, #FAF5FF 100%)',
      glowColor: 'rgba(15, 118, 110, 0.08)',
      borderColor: '#CCFBF1',
      tagBg: '#CCFBF1',
      tagColor: '#0F766E',
      tagText: 'RESIDENTIAL • VERIFIED HOMES',
      titleColor: '#031B2A',
      subtextColor: '#475569',
      iconBg: '#FFFFFF',
      iconColor: '#0F766E',
      ctaBg: '#0F766E',
      ctaColor: '#FFFFFF',
      shadow: '0 12px 32px rgba(15, 118, 110, 0.06)',
    },
    pgCard: {
      gradient: 'linear-gradient(145deg, #EEF2FF 0%, #F5F3FF 100%)',
      glowColor: 'rgba(99, 102, 241, 0.08)',
      borderColor: '#E0E7FF',
      tagBg: '#E0E7FF',
      tagColor: '#4338CA',
      tagText: 'PG & HOSTEL',
      titleColor: '#031B2A',
      subtextColor: '#475569',
      iconBg: '#FFFFFF',
      iconColor: '#4F46E5',
      ctaBg: '#4F46E5',
      ctaColor: '#FFFFFF',
      shadow: '0 10px 28px rgba(99, 102, 241, 0.06)',
    },
    commercialCard: {
      gradient: 'linear-gradient(145deg, #F0F9FF 0%, #E0F2FE 100%)',
      glowColor: 'rgba(2, 132, 199, 0.08)',
      borderColor: '#BAE6FD',
      tagBg: '#E0F2FE',
      tagColor: '#0284C7',
      tagText: 'BUSINESS & WORKSPACE',
      titleColor: '#031B2A',
      subtextColor: '#475569',
      iconBg: '#FFFFFF',
      iconColor: '#0284C7',
      ctaBg: '#0284C7',
      ctaColor: '#FFFFFF',
      shadow: '0 10px 28px rgba(2, 132, 199, 0.06)',
    },
  },

  // Slide 1 (Mint / Pay Rent & Earn): Radiant Mint Lagoon + Crystal Cyan + Fresh Meadow
  {
    tallCard: {
      gradient: 'linear-gradient(145deg, #F0FDFA 0%, #E6FFFA 50%, #CCFBF1 100%)',
      glowColor: 'rgba(20, 184, 166, 0.08)',
      borderColor: '#99F6E4',
      tagBg: '#FEF3C7',
      tagColor: '#92400E',
      tagText: 'CASHBACK READY • VERIFIED',
      titleColor: '#031B2A',
      subtextColor: '#475569',
      iconBg: '#FFFFFF',
      iconColor: '#0F766E',
      ctaBg: '#0F766E',
      ctaColor: '#FFFFFF',
      shadow: '0 12px 32px rgba(15, 118, 110, 0.06)',
    },
    pgCard: {
      gradient: 'linear-gradient(145deg, #ECFEFF 0%, #CFFAFE 100%)',
      glowColor: 'rgba(6, 182, 212, 0.08)',
      borderColor: '#A5F3FC',
      tagBg: '#CFFAFE',
      tagColor: '#0E7490',
      tagText: 'INSTANT REWARDS',
      titleColor: '#031B2A',
      subtextColor: '#475569',
      iconBg: '#FFFFFF',
      iconColor: '#0891B2',
      ctaBg: '#0891B2',
      ctaColor: '#FFFFFF',
      shadow: '0 10px 28px rgba(8, 145, 178, 0.06)',
    },
    commercialCard: {
      gradient: 'linear-gradient(145deg, #F0FDF4 0%, #DCFCE7 100%)',
      glowColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: '#BBF7D0',
      tagBg: '#DCFCE7',
      tagColor: '#065F46',
      tagText: 'RETAIL & OFFICES',
      titleColor: '#031B2A',
      subtextColor: '#475569',
      iconBg: '#FFFFFF',
      iconColor: '#059669',
      ctaBg: '#059669',
      ctaColor: '#FFFFFF',
      shadow: '0 10px 28px rgba(5, 150, 105, 0.06)',
    },
  },

  // Slide 2 (Violet / Digital Lease): Soft Iris Violet + Sweet Fuchsia + Royal Mist
  {
    tallCard: {
      gradient: 'linear-gradient(145deg, #FAF5FF 0%, #F3E8FF 50%, #EDE9FE 100%)',
      glowColor: 'rgba(124, 58, 237, 0.08)',
      borderColor: '#DDD6FE',
      tagBg: '#EDE9FE',
      tagColor: '#6D28D9',
      tagText: 'VERIFIED LEASE • 100% LEGAL',
      titleColor: '#031B2A',
      subtextColor: '#475569',
      iconBg: '#FFFFFF',
      iconColor: '#7C3AED',
      ctaBg: '#7C3AED',
      ctaColor: '#FFFFFF',
      shadow: '0 12px 32px rgba(124, 58, 237, 0.06)',
    },
    pgCard: {
      gradient: 'linear-gradient(145deg, #FDF4FF 0%, #FAE8FF 100%)',
      glowColor: 'rgba(192, 38, 211, 0.08)',
      borderColor: '#F5D0FE',
      tagBg: '#FCE7F3',
      tagColor: '#9D174D',
      tagText: 'DIGITAL NOC INCLUDED',
      titleColor: '#031B2A',
      subtextColor: '#475569',
      iconBg: '#FFFFFF',
      iconColor: '#A21CAF',
      ctaBg: '#A21CAF',
      ctaColor: '#FFFFFF',
      shadow: '0 10px 28px rgba(162, 28, 175, 0.06)',
    },
    commercialCard: {
      gradient: 'linear-gradient(145deg, #EEF2FF 0%, #E0E7FF 100%)',
      glowColor: 'rgba(79, 70, 229, 0.08)',
      borderColor: '#C7D2FE',
      tagBg: '#EEF2FF',
      tagColor: '#4338CA',
      tagText: 'COMMERCIAL LEASE',
      titleColor: '#031B2A',
      subtextColor: '#475569',
      iconBg: '#FFFFFF',
      iconColor: '#4F46E5',
      ctaBg: '#4F46E5',
      ctaColor: '#FFFFFF',
      shadow: '0 10px 28px rgba(79, 70, 229, 0.06)',
    },
  },

  // Slide 3 (Gold / Landlord Bonus): Sunlit Gold Warmth + Peach Glow + Platinum Slate
  {
    tallCard: {
      gradient: 'linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)',
      glowColor: 'rgba(217, 119, 6, 0.08)',
      borderColor: '#FCD34D',
      tagBg: '#FEF3C7',
      tagColor: '#92400E',
      tagText: '₹5,000 HOST LAUNCH BONUS',
      titleColor: '#031B2A',
      subtextColor: '#475569',
      iconBg: '#FFFFFF',
      iconColor: '#D97706',
      ctaBg: '#D97706',
      ctaColor: '#FFFFFF',
      shadow: '0 12px 32px rgba(217, 119, 6, 0.06)',
    },
    pgCard: {
      gradient: 'linear-gradient(145deg, #FFF7ED 0%, #FFEDD5 100%)',
      glowColor: 'rgba(234, 88, 12, 0.08)',
      borderColor: '#FED7AA',
      tagBg: '#FFEDD5',
      tagColor: '#C2410C',
      tagText: 'ZERO VACANCY',
      titleColor: '#031B2A',
      subtextColor: '#475569',
      iconBg: '#FFFFFF',
      iconColor: '#EA580C',
      ctaBg: '#EA580C',
      ctaColor: '#FFFFFF',
      shadow: '0 10px 28px rgba(234, 88, 12, 0.06)',
    },
    commercialCard: {
      gradient: 'linear-gradient(145deg, #F8FAFC 0%, #F1F5F9 100%)',
      glowColor: 'rgba(100, 116, 139, 0.08)',
      borderColor: '#CBD5E1',
      tagBg: '#F1F5F9',
      tagColor: '#334155',
      tagText: 'PREMIUM ASSETS',
      titleColor: '#031B2A',
      subtextColor: '#475569',
      iconBg: '#FFFFFF',
      iconColor: '#475569',
      ctaBg: '#334155',
      ctaColor: '#FFFFFF',
      shadow: '0 10px 28px rgba(51, 65, 85, 0.06)',
    },
  },
];

interface HeroThemeContextValue {
  activeAdIndex: number;
  currentAd: HeroAdItem;
  currentCardTheme: CardThemeSet;
  setActiveAdIndex: (index: number) => void;
  nextAd: () => void;
  prevAd: () => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

const HeroThemeContext = createContext<HeroThemeContextValue | null>(null);

export const HeroThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto rotate hero ad every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveAdIndex((prev) => (prev + 1) % HERO_ADS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextAd = useCallback(() => {
    setActiveAdIndex((prev) => (prev + 1) % HERO_ADS.length);
  }, []);

  const prevAd = useCallback(() => {
    setActiveAdIndex((prev) => (prev === 0 ? HERO_ADS.length - 1 : prev - 1));
  }, []);

  const currentAd = HERO_ADS[activeAdIndex] || HERO_ADS[0];
  const currentCardTheme = CARD_THEMES[activeAdIndex] || CARD_THEMES[0];

  return (
    <HeroThemeContext.Provider
      value={{
        activeAdIndex,
        currentAd,
        currentCardTheme,
        setActiveAdIndex,
        nextAd,
        prevAd,
        isPaused,
        setIsPaused,
      }}
    >
      {children}
    </HeroThemeContext.Provider>
  );
};

export const useHeroTheme = (): HeroThemeContextValue => {
  const context = useContext(HeroThemeContext);
  if (!context) {
    return {
      activeAdIndex: 0,
      currentAd: HERO_ADS[0],
      currentCardTheme: CARD_THEMES[0],
      setActiveAdIndex: () => {},
      nextAd: () => {},
      prevAd: () => {},
      isPaused: false,
      setIsPaused: () => {},
    };
  }
  return context;
};
