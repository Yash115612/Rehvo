import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS, V4_SPACING } from '../../../theme/v4Theme';
import { triggerHaptic } from '../../../utils/haptics';

export type V4CardVariant = 'elevated' | 'flat' | 'outlined' | 'glass';
export type V4CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface V4CardProps {
  children?: React.ReactNode;
  variant?: V4CardVariant;
  padding?: V4CardPadding;
  borderRadius?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'none';
  testID?: string;
  enableHaptics?: boolean;
}

export const V4CardComponent: React.FC<V4CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'md',
  borderRadius,
  onPress,
  style,
  disabled = false,
  accessibilityLabel,
  accessibilityRole,
  testID,
  enableHaptics = false,
}) => {
  const isPressable = Boolean(onPress);

  const handlePress = () => {
    if (disabled || !onPress) return;
    if (enableHaptics) {
      triggerHaptic('light');
    }
    onPress();
  };

  const containerStyles = [
    styles.base,
    styles[variant],
    styles[`padding_${padding}`],
    borderRadius !== undefined && { borderRadius },
    style,
  ];

  if (isPressable) {
    return (
      <Pressable
        testID={testID}
        accessibilityRole={accessibilityRole || 'button'}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          containerStyles,
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      style={containerStyles}
    >
      {children}
    </View>
  );
};

export const V4Card = React.memo(V4CardComponent);

const styles = StyleSheet.create({
  base: {
    borderRadius: V4_RADIUS.card,
    overflow: 'hidden',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.55,
  },

  // Variants
  elevated: {
    backgroundColor: V4_COLORS.surface,
    ...V4_SHADOWS.card,
  },
  flat: {
    backgroundColor: V4_COLORS.surfaceSubtle,
  },
  outlined: {
    backgroundColor: V4_COLORS.surface,
    borderWidth: 1.2,
    borderColor: V4_COLORS.border,
  },
  glass: {
    backgroundColor: V4_COLORS.glassBg,
    borderWidth: 1,
    borderColor: V4_COLORS.glassBorder,
    ...V4_SHADOWS.soft,
  },

  // Padding presets
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: V4_SPACING.md,
  },
  padding_md: {
    padding: V4_SPACING.lg,
  },
  padding_lg: {
    padding: V4_SPACING['2xl'],
  },
});
