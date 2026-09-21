import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { ShieldCheck, Sparkles, Star, Zap, Percent, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS } from '../../../theme/v4Theme';

export type V4BadgeType =
  // Status Variants
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'emerald'
  // Marketing & Legacy Variants
  | 'verified'
  | 'zero_commission'
  | 'rating'
  | 'superhost'
  | 'instant'
  | 'discount'
  | 'new'
  | 'custom';

export interface V4BadgeProps {
  type?: V4BadgeType;
  label?: string;
  icon?: React.ReactNode;
  color?: string;
  bgColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const V4BadgeComponent: React.FC<V4BadgeProps> = ({
  type = 'verified',
  label,
  icon,
  color,
  bgColor,
  style,
  textStyle,
  size = 'md',
  dot = false,
}) => {
  let defaultLabel = label;
  let defaultIcon = icon;
  let bg = bgColor || V4_COLORS.primarySoft;
  let textColor = color || V4_COLORS.primary;
  let dotColor = textColor;

  switch (type) {
    // Semantic Statuses
    case 'success':
      defaultLabel = label || 'SUCCESS';
      bg = bgColor || V4_COLORS.successLight;
      textColor = color || V4_COLORS.success;
      dotColor = V4_COLORS.success;
      break;

    case 'warning':
      defaultLabel = label || 'PENDING';
      bg = bgColor || V4_COLORS.warningLight;
      textColor = color || V4_COLORS.warning;
      dotColor = V4_COLORS.warning;
      break;

    case 'danger':
      defaultLabel = label || 'FAILED';
      bg = bgColor || V4_COLORS.dangerLight;
      textColor = color || V4_COLORS.danger;
      dotColor = V4_COLORS.danger;
      break;

    case 'info':
      defaultLabel = label || 'INFO';
      bg = bgColor || V4_COLORS.infoLight;
      textColor = color || V4_COLORS.info;
      dotColor = V4_COLORS.info;
      break;

    case 'neutral':
      defaultLabel = label || 'DEFAULT';
      bg = bgColor || V4_COLORS.surfaceSubtle;
      textColor = color || V4_COLORS.textSecondary;
      dotColor = V4_COLORS.textMuted;
      break;

    case 'emerald':
      defaultLabel = label || 'REHVO';
      bg = bgColor || V4_COLORS.primarySoft;
      textColor = color || V4_COLORS.primary;
      dotColor = V4_COLORS.primary;
      break;

    // Marketing Types
    case 'verified':
      defaultLabel = label || '100% VERIFIED';
      defaultIcon = icon || <ShieldCheck size={size === 'sm' ? 10 : 12} color={V4_COLORS.primary} strokeWidth={2.6} />;
      bg = bgColor || 'rgba(15, 118, 110, 0.12)';
      textColor = color || V4_COLORS.primary;
      dotColor = V4_COLORS.primary;
      break;

    case 'zero_commission':
      defaultLabel = label || 'VERIFIED LISTING';
      defaultIcon = icon || <Sparkles size={size === 'sm' ? 10 : 12} color="#0F766E" strokeWidth={2.4} />;
      bg = bgColor || '#E6FFFA';
      textColor = color || '#0F766E';
      dotColor = '#0F766E';
      break;

    case 'rating':
      defaultLabel = label || '4.9';
      defaultIcon = icon || <Star size={size === 'sm' ? 10 : 12} color="#F59E0B" fill="#F59E0B" />;
      bg = bgColor || '#FEF3C7';
      textColor = color || '#B45309';
      dotColor = '#B45309';
      break;

    case 'superhost':
      defaultLabel = label || 'SUPERHOST';
      defaultIcon = icon || <Zap size={size === 'sm' ? 10 : 12} color="#8B5CF6" strokeWidth={2.4} />;
      bg = bgColor || '#F3E8FF';
      textColor = color || '#7C3AED';
      dotColor = '#7C3AED';
      break;

    case 'instant':
      defaultLabel = label || 'INSTANT BOOK';
      defaultIcon = icon || <CheckCircle2 size={size === 'sm' ? 10 : 12} color="#16A34A" strokeWidth={2.4} />;
      bg = bgColor || '#DCFCE7';
      textColor = color || '#15803D';
      dotColor = '#15803D';
      break;

    case 'discount':
      defaultLabel = label || 'SPECIAL OFFER';
      defaultIcon = icon || <Percent size={size === 'sm' ? 10 : 12} color="#EA580C" strokeWidth={2.4} />;
      bg = bgColor || '#FFEDD5';
      textColor = color || '#C2410C';
      dotColor = '#C2410C';
      break;

    case 'new':
      defaultLabel = label || 'NEW LAUNCH';
      defaultIcon = icon || <Sparkles size={size === 'sm' ? 10 : 12} color="#0284C7" strokeWidth={2.4} />;
      bg = bgColor || '#E0F2FE';
      textColor = color || '#0369A1';
      dotColor = '#0369A1';
      break;
  }

  return (
    <View
      accessibilityRole="text"
      style={[
        styles.badge,
        { backgroundColor: bg },
        size === 'sm' && styles.badgeSm,
        style,
      ]}
    >
      {dot && <View style={[styles.dotIndicator, { backgroundColor: dotColor }, size === 'sm' && styles.dotSm]} />}
      {!dot && defaultIcon && <View style={styles.iconWrap}>{defaultIcon}</View>}
      {defaultLabel && (
        <Text
          style={[
            styles.label,
            { color: textColor },
            size === 'sm' && styles.labelSm,
            textStyle,
          ]}
        >
          {defaultLabel}
        </Text>
      )}
    </View>
  );
};

export const V4Badge = React.memo(V4BadgeComponent);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 5,
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
    gap: 3.5,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotSm: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  labelSm: {
    fontSize: 9,
    letterSpacing: 0.3,
  },
});

