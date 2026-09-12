import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

interface V4InterestChipProps {
  label: string;
  icon?: string;
  isSelected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const V4InterestChip: React.FC<V4InterestChipProps> = ({
  label,
  icon,
  isSelected = false,
  onPress,
  style,
}) => {
  return (
    <Pressable
      style={[
        styles.chip,
        isSelected && styles.chipSelected,
        style,
      ]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      {!!icon && <Text style={styles.iconText}>{icon}</Text>}
      <Text style={[styles.labelText, isSelected && styles.labelSelected]}>
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
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  iconText: {
    fontSize: 13,
  },
  labelText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  labelSelected: {
    color: '#059669',
    fontWeight: '800',
  },
});
