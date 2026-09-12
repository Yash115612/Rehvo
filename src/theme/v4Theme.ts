import { StyleSheet, Platform } from 'react-native';

export const V4_COLORS = {
  // Primary Palette (Signature Emerald / Teal)
  primary: '#0F766E', // Teal 700 (Primary brand)
  primaryDark: '#115E59', // Teal 800 (Deep accents)
  primaryLight: '#CCFBF1', // Teal 100 (Soft tints)
  primarySoft: '#E6FFFA', // Ultra soft background
  secondary: '#CCFBF1', // Teal secondary tint
  accent: '#14B8A6', // Teal 500 (Vibrant action)
  accentGlow: 'rgba(20, 184, 166, 0.25)',

  // Named Standard Emerald Palette
  emerald: '#0F766E',
  emeraldDark: '#064E3B',
  emeraldMedium: '#10B981',
  emeraldLight: '#CCFBF1',
  emeraldSoft: '#E6FFFA',

  // Background & Surfaces
  background: '#F8FAFB', // Canvas background
  surface: '#FFFFFF', // Card & modal surface
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#F1F5F9', // Secondary subtle surface
  surfaceMuted: '#E2E8F0',

  // Borders & Dividers
  border: '#E5EEF0',
  borderLight: '#EDF4F6',
  borderDark: '#CBD5E1',

  // Typography Colors
  textPrimary: '#031B2A', // Deep obsidian ink
  textSecondary: '#64748B', // Muted slate
  textMuted: '#94A3B8', // Placeholder grey
  textWhite: '#FFFFFF',
  textTeal: '#0F766E',

  // Semantic Colors
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  info: '#0284C7',
  infoLight: '#E0F2FE',
  neutral: '#64748B',
  neutralLight: '#F1F5F9',

  // Specialty & Category Accents
  gold: '#F59E0B',
  goldLight: '#FEF3C7',
  purple: '#8B5CF6',
  purpleLight: '#F3E8FF',
  rose: '#F43F5E',
  roseLight: '#FFE4E6',
  indigo: '#6366F1',
  indigoLight: '#EEF2FF',
  amber: '#D97706',

  // Frosted Glass & Overlays
  overlayDark: 'rgba(3, 27, 42, 0.65)',
  overlayLight: 'rgba(255, 255, 255, 0.85)',
  glassBg: 'rgba(255, 255, 255, 0.92)',
  glassBorder: 'rgba(255, 255, 255, 0.4)',
};

export const V4_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
  // Direct numeric token access
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
  40: 40,
  48: 48,
};

export const V4_RADIUS = {
  // Standard scale
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  // Application specific tokens
  button: 22,
  card: 28,
  search: 30,
  sheet: 32,
  nav: 36,
  pill: 999,
  full: 9999,
};

export const V4_SHADOWS = StyleSheet.create({
  soft: {
    ...Platform.select({
      ios: {
        shadowColor: '#031B2A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 12px rgba(3, 27, 42, 0.05)',
      },
    }),
  },
  card: {
    ...Platform.select({
      ios: {
        shadowColor: '#031B2A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 8px 20px rgba(3, 27, 42, 0.07)',
      },
    }),
  },
  medium: {
    ...Platform.select({
      ios: {
        shadowColor: '#031B2A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 8px 18px rgba(3, 27, 42, 0.08)',
      },
    }),
  },
  floating: {
    ...Platform.select({
      ios: {
        shadowColor: '#031B2A',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 28,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 12px 28px rgba(3, 27, 42, 0.12)',
      },
    }),
  },
  glow: {
    ...Platform.select({
      ios: {
        shadowColor: '#0F766E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 6px 16px rgba(15, 118, 110, 0.35)',
      },
    }),
  },
  nav: {
    ...Platform.select({
      ios: {
        shadowColor: '#031B2A',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: '0 -4px 24px rgba(3, 27, 42, 0.1)',
      },
    }),
  },
  sm: {
    ...Platform.select({
      ios: {
        shadowColor: '#031B2A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(3, 27, 42, 0.05)',
      },
    }),
  },
  md: {
    ...Platform.select({
      ios: {
        shadowColor: '#031B2A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 6px 16px rgba(3, 27, 42, 0.08)',
      },
    }),
  },
  lg: {
    ...Platform.select({
      ios: {
        shadowColor: '#031B2A',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 28,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 12px 28px rgba(3, 27, 42, 0.12)',
      },
    }),
  },
});

export const V4_TYPOGRAPHY = {
  // Standard variants
  display: {
    fontSize: 32,
    fontWeight: '900' as const,
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: V4_COLORS.textPrimary,
    lineHeight: 18,
  },
  // Existing layout variants
  hero: {
    fontSize: 34,
    fontWeight: '900' as const,
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 42,
  },
  h1: {
    fontSize: 26,
    fontWeight: '900' as const,
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  section: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800' as const,
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  body: {
    fontSize: 14.5,
    fontWeight: '500' as const,
    color: V4_COLORS.textPrimary,
    lineHeight: 20,
  },
  bodySecondary: {
    fontSize: 13.5,
    fontWeight: '500' as const,
    color: V4_COLORS.textSecondary,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: V4_COLORS.textSecondary,
    lineHeight: 16,
  },
  micro: {
    fontSize: 10.5,
    fontWeight: '700' as const,
    color: V4_COLORS.textMuted,
    letterSpacing: 0.3,
  },
};

