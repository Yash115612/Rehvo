import React from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { triggerTabHaptic } from '../../../utils/haptics';

export type LeadActionButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'destructive'
  | 'success';

export interface V4LeadActionButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  variant?: LeadActionButtonVariant;
  fullWidth?: boolean;
  flex?: number;
  minWidth?: number;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const V4LeadActionButton: React.FC<V4LeadActionButtonProps> = ({
  label,
  onPress,
  icon: Icon,
  variant = 'secondary',
  fullWidth = false,
  flex,
  minWidth,
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withTiming(0.96, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withTiming(1, { duration: 120 });
    }
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      triggerTabHaptic();
      onPress();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          button: styles.primaryButton,
          text: styles.primaryText,
          iconColor: '#FFFFFF',
        };
      case 'destructive':
        return {
          button: styles.destructiveButton,
          text: styles.destructiveText,
          iconColor: '#DC2626',
        };
      case 'success':
        return {
          button: styles.successButton,
          text: styles.successText,
          iconColor: '#FFFFFF',
        };
      case 'outline':
        return {
          button: styles.outlineButton,
          text: styles.outlineText,
          iconColor: '#475569',
        };
      case 'secondary':
      default:
        return {
          button: styles.secondaryButton,
          text: styles.secondaryText,
          iconColor: '#0F766E',
        };
    }
  };

  const { button: variantBtnStyle, text: variantTxtStyle, iconColor } = getVariantStyles();

  return (
    <AnimatedPressable
      style={[
        styles.baseButton,
        variantBtnStyle,
        fullWidth && styles.fullWidth,
        flex !== undefined && { flex },
        minWidth !== undefined && { minWidth },
        (disabled || loading) && styles.disabled,
        animatedStyle,
        style,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'success' ? '#FFFFFF' : '#0F766E'}
        />
      ) : (
        <>
          {Icon && <Icon size={16} color={iconColor} strokeWidth={2.2} />}
          <Text
            style={[styles.baseText, variantTxtStyle, textStyle]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {label}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    minHeight: 44,
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 6,
  },
  baseText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  fullWidth: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#064E3B',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  secondaryText: {
    color: '#0F766E',
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  outlineText: {
    color: '#475569',
  },
  destructiveButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  destructiveText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  successButton: {
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#064E3B',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  successText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.5,
  },
});
