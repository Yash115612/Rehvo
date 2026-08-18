import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';

export interface QuickFilterItem {
  id: string;
  label: string;
  active: boolean;
  hasDropdown?: boolean;
}

interface QuickFilterRowProps {
  filters: QuickFilterItem[];
  onPress: (id: string) => void;
}

export const QuickFilterRow: React.FC<QuickFilterRowProps> = ({
  filters,
  onPress,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {filters.map((filter) => {
        const isActive = filter.active;
        return (
          <Pressable
            key={filter.id}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onPress(filter.id)}
            accessibilityRole="button"
            accessibilityLabel={`Quick filter: ${filter.label}`}
          >
            {isActive && !filter.hasDropdown && (
              <Check size={13} color="#6C4DFF" strokeWidth={2.5} />
            )}
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {filter.label}
            </Text>
            {filter.hasDropdown && (
              <ChevronDown
                size={13}
                color={isActive ? '#6C4DFF' : '#777482'}
                strokeWidth={2}
              />
            )}
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
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  pillActive: {
    backgroundColor: '#F0ECFF',
    borderColor: '#6C4DFF',
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#48464B',
  },
  pillTextActive: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
});
