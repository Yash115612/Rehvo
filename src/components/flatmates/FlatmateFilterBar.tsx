import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { V4_COLORS } from '../../theme/v4Theme';

export type FlatmateFilterId =
  | 'all'
  | 'private_room'
  | 'shared_room'
  | 'under_15k'
  | 'under_25k'
  | 'near_metro'
  | 'wfh'
  | 'pet_friendly';

interface FilterOption {
  id: FlatmateFilterId;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All Flatmates' },
  { id: 'private_room', label: 'Private Room' },
  { id: 'shared_room', label: 'Shared Room' },
  { id: 'under_15k', label: 'Under ₹15K' },
  { id: 'under_25k', label: 'Under ₹25K' },
  { id: 'near_metro', label: 'Near Metro' },
  { id: 'wfh', label: 'Work From Home' },
  { id: 'pet_friendly', label: 'Pet Friendly' },
];

interface FlatmateFilterBarProps {
  activeFilter: FlatmateFilterId;
  onSelectFilter: (filterId: FlatmateFilterId) => void;
}

export const FlatmateFilterBar: React.FC<FlatmateFilterBarProps> = ({
  activeFilter,
  onSelectFilter,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTER_OPTIONS.map((item) => {
          const isSelected = activeFilter === item.id;
          return (
            <Pressable
              key={item.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelectFilter(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Filter by ${item.label}`}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
