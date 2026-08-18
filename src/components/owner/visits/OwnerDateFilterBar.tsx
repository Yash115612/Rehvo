import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

export interface DateFilterOption {
  id: string;
  label: string;
}

const DATE_OPTIONS: DateFilterOption[] = [
  { id: 'ALL', label: 'All Dates' },
  { id: 'TODAY', label: 'Today' },
  { id: 'TOMORROW', label: 'Tomorrow' },
  { id: 'THIS_WEEK', label: 'This Week' },
  { id: 'UPCOMING', label: 'Upcoming' },
];

interface OwnerDateFilterBarProps {
  selectedDateId: string;
  onSelectDate: (id: string) => void;
}

export const OwnerDateFilterBar: React.FC<OwnerDateFilterBarProps> = ({
  selectedDateId,
  onSelectDate,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {DATE_OPTIONS.map((item) => {
          const isSelected = selectedDateId === item.id;

          return (
            <Pressable
              key={item.id}
              style={[styles.pill, isSelected && styles.pillActive]}
              onPress={() => onSelectDate(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Filter date: ${item.label}`}
            >
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextActive,
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
    alignItems: 'center',
    height: 38,
  },
  pill: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 12,
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
    fontSize: 12.5,
    fontWeight: '600',
    color: '#171522',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
