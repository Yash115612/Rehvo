import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

interface V4LifestyleChipProps {
  label: string;
  icon?: string;
  isSelected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  size?: 'small' | 'medium';
}

export const V4LifestyleChip: React.FC<V4LifestyleChipProps> = ({
  label,
  icon,
  isSelected = false,
  onPress,
  style,
  size = 'medium',
}) => {
  const isSmall = size === 'small';

  return (
    <Pressable
      style={[
        styles.chip,
        isSmall && styles.chipSmall,
        isSelected && styles.chipSelected,
        style,
      ]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      {!!icon && <Text style={[styles.iconText, isSmall && styles.iconSmall]}>{icon}</Text>}
      <Text style={[styles.labelText, isSmall && styles.labelSmall, isSelected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  chipSmall: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  chipSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  iconText: {
    fontSize: 14,
  },
  iconSmall: {
    fontSize: 12,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  labelSmall: {
    fontSize: 11.5,
  },
  labelSelected: {
    color: '#059669',
    fontWeight: '800',
  },
});
