import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { SearchPropertyCategory } from './searchConstants';

interface PropertyTypeFilterProps {
  selected: SearchPropertyCategory;
  onSelect: (type: SearchPropertyCategory) => void;
}

const CATEGORIES: { id: SearchPropertyCategory; label: string }[] = [
  { id: 'All', label: 'All' },
  { id: 'Flats', label: 'Flats' },
  { id: 'PG / Co-living', label: 'PG / Co-living' },
  { id: 'Rooms', label: 'Rooms' },
  { id: 'Flatmates', label: 'Flatmates' },
];

export const PropertyTypeFilter: React.FC<PropertyTypeFilterProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.id;
        return (
          <Pressable
            key={cat.id}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onSelect(cat.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 2,
  },
  pill: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
