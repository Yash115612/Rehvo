import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Check, X } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { triggerHaptic } from '../../../utils/haptics';

export interface V4ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  count?: number;
  disabled?: boolean;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const V4ChipComponent: React.FC<V4ChipProps> = ({
  label,
  selected = false,
  onPress,
  onDismiss,
  icon,
  count,
  disabled = false,
  size = 'md',
  style,
  testID,
}) => {
  const isDismissible = Boolean(onDismiss);

  const handlePress = () => {
    if (disabled) return;
    triggerHaptic('selection');
    onPress?.();
  };

  const handleDismiss = (e: any) => {
    e?.stopPropagation?.();
    triggerHaptic('light');
    onDismiss?.();
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={`${label}${selected ? ', selected' : ''}${count !== undefined ? `, ${count} items` : ''}`}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={({ pressed }) => [
        styles.chip,
        size === 'sm' && styles.chipSm,
        selected && styles.chipActive,
        disabled && styles.chipDisabled,
        pressed && !disabled && styles.chipPressed,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      {selected && !isDismissible ? (
        <Check size={size === 'sm' ? 11 : 13} color="#FFFFFF" strokeWidth={3} />
      ) : (
        icon && <View style={styles.iconWrap}>{icon}</View>
      )}

      <Text
        style={[
          styles.label,
          size === 'sm' && styles.labelSm,
          selected && styles.labelActive,
        ]}
      >
        {label}
      </Text>

      {count !== undefined && (
        <View
          style={[
            styles.countBadge,
            selected && styles.countBadgeActive,
            size === 'sm' && styles.countBadgeSm,
          ]}
        >
          <Text
            style={[
              styles.countText,
              size === 'sm' && styles.countTextSm,
              selected && styles.countTextActive,
            ]}
          >
            {count}
          </Text>
        </View>
      )}

      {isDismissible && (
        <Pressable
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={handleDismiss}
          style={styles.dismissBtn}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
        >
          <X
            size={size === 'sm' ? 12 : 14}
            color={selected ? '#FFFFFF' : V4_COLORS.textSecondary}
            strokeWidth={2.5}
          />
        </Pressable>
      )}
    </Pressable>
  );
};

export const V4Chip = React.memo(V4ChipComponent);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: V4_RADIUS.pill,
    backgroundColor: V4_COLORS.surface,
    borderWidth: 1.2,
    borderColor: V4_COLORS.border,
    minHeight: 38,
    ...V4_SHADOWS.soft,
  },
  chipSm: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    minHeight: 32,
    gap: 4,
  },
  chipActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primaryDark,
    shadowColor: V4_COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipPressed: {
    transform: [{ scale: 0.97 }],
  },
  iconWrap: {
    marginRight: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
    letterSpacing: -0.2,
  },
  labelSm: {
    fontSize: 11.5,
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  countBadge: {
    backgroundColor: V4_COLORS.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  countBadgeSm: {
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: 10,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
  },
  countTextSm: {
    fontSize: 9,
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  dismissBtn: {
    marginLeft: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
