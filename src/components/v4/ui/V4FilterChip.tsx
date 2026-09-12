import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';

interface V4FilterChipProps {
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  count?: number;
}

export const V4FilterChip: React.FC<V4FilterChipProps> = ({
  label,
  isSelected = false,
  onPress,
  icon,
  count,
}) => {
  return (
    <Pressable
      style={[styles.chip, isSelected && styles.chipActive]}
      onPress={onPress}
    >
      {isSelected ? (
        <Check size={12} color="#FFFFFF" strokeWidth={3} />
      ) : (
        icon && <View style={styles.iconWrap}>{icon}</View>
      )}

      <Text style={[styles.label, isSelected && styles.labelActive]}>
        {label}
      </Text>

      {count !== undefined && (
        <View
          style={[styles.countBadge, isSelected && styles.countBadgeActive]}
        >
          <Text
            style={[styles.countText, isSelected && styles.countTextActive]}
          >
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#031B2A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chipActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  iconWrap: {
    marginRight: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  countBadge: {
    backgroundColor: 'rgba(241, 245, 249, 0.9)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
});
