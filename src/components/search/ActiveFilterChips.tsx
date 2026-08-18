import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { X } from 'lucide-react-native';

export interface ActiveFilterChip {
  id: string;
  label: string;
}

interface ActiveFilterChipsProps {
  chips: ActiveFilterChip[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  chips,
  onRemove,
  onClearAll,
}) => {
  if (chips.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {chips.map((chip) => (
          <Pressable
            key={chip.id}
            style={styles.chip}
            onPress={() => onRemove(chip.id)}
            accessibilityRole="button"
            accessibilityLabel={`Remove filter ${chip.label}`}
          >
            <Text style={styles.chipText}>{chip.label}</Text>
            <X size={13} color="#6C4DFF" strokeWidth={2.5} />
          </Pressable>
        ))}

        {chips.length > 1 && onClearAll && (
          <Pressable
            style={styles.clearBtn}
            onPress={onClearAll}
            accessibilityRole="button"
            accessibilityLabel="Clear all active filters"
          >
            <Text style={styles.clearBtnText}>Clear all</Text>
          </Pressable>
        )}
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
  },
  chip: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#F0ECFF',
    borderWidth: 1,
    borderColor: '#E4DBFF',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777482',
    textDecorationLine: 'underline',
  },
});
