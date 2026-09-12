import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { triggerHaptic } from '../../../utils/haptics';

export type V4ButtonVariant = 'primary' | 'secondary' | 'glass' | 'outline' | 'ghost' | 'danger';
export type V4ButtonSize = 'sm' | 'md' | 'lg';

export interface V4ButtonProps {
  label?: string;
  title?: string;
  variant?: V4ButtonVariant;
  size?: V4ButtonSize;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  iconRight?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  fullWidth?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  enableHaptics?: boolean;
}

export const V4ButtonComponent: React.FC<V4ButtonProps> = ({
  label,
  title,
  variant = 'primary',
  size = 'md',
  icon,
  leftIcon,
  iconRight,
  rightIcon,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  accessibilityLabel,
  testID,
  enableHaptics = true,
}) => {
  const buttonText = label || title;
  const resolvedLeftIcon = leftIcon || icon;
  const resolvedRightIcon = rightIcon || iconRight;

  const handlePress = () => {
    if (disabled || loading) return;
    if (enableHaptics) {
      triggerHaptic(variant === 'danger' ? 'medium' : 'light');
    }
    onPress?.();
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof buttonText === 'string' ? buttonText : 'Action')}
      accessibilityState={{ disabled: Boolean(disabled), busy: Boolean(loading) }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      android_ripple={{
        color:
          variant === 'primary' || variant === 'danger'
            ? 'rgba(255, 255, 255, 0.22)'
            : 'rgba(15, 118, 110, 0.12)',
        borderless: false,
      }}
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        variant === 'primary' && V4_SHADOWS.glow,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : V4_COLORS.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {resolvedLeftIcon && <View style={styles.iconLeft}>{resolvedLeftIcon}</View>}
          {buttonText ? (
            <Text
              style={[
                styles.textBase,
                styles[`text_${variant}`],
                styles[`textSize_${size}`],
                textStyle,
              ]}
              numberOfLines={1}
            >
              {buttonText}
            </Text>
          ) : null}
          {resolvedRightIcon && <View style={styles.iconRight}>{resolvedRightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
};

export const V4Button = React.memo(V4ButtonComponent);

const styles = StyleSheet.create({
  base: {
    borderRadius: V4_RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    minHeight: 48,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.45,
  },
  iconLeft: {
    marginRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRight: {
    marginLeft: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Variants
  primary: {
    backgroundColor: V4_COLORS.primary,
  },
  secondary: {
    backgroundColor: V4_COLORS.primaryLight,
  },
  glass: {
    backgroundColor: V4_COLORS.glassBg,
    borderWidth: 1,
    borderColor: V4_COLORS.glassBorder,
    ...V4_SHADOWS.card,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: V4_COLORS.borderDark,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: V4_COLORS.danger,
  },

  // Sizes
  size_sm: {
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: V4_RADIUS.md,
  },
  size_md: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: V4_RADIUS.lg,
  },
  size_lg: {
    minHeight: 52,
    paddingVertical: 15,
    paddingHorizontal: 26,
    borderRadius: V4_RADIUS.button || 22,
  },

  // Text Styling
  textBase: {
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: V4_COLORS.primary,
  },
  text_glass: {
    color: V4_COLORS.textPrimary,
  },
  text_outline: {
    color: V4_COLORS.textPrimary,
  },
  text_ghost: {
    color: V4_COLORS.primary,
  },
  text_danger: {
    color: '#FFFFFF',
  },

  textSize_sm: {
    fontSize: 13,
  },
  textSize_md: {
    fontSize: 14.5,
  },
  textSize_lg: {
    fontSize: 16,
  },
});

