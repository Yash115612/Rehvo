import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SEARCH_COLORS } from './searchConstants';

interface SearchHeaderProps {
  onBack: () => void;
  onFilterPress: () => void;
  filterCount: number;
}

export function SearchHeader({ onBack, onFilterPress, filterCount }: SearchHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        style={styles.iconButton}
        onPress={onBack}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Text style={styles.backArrow}>←</Text>
      </Pressable>

      <Text style={styles.title}>Search</Text>

      <Pressable
        style={styles.iconButton}
        onPress={onFilterPress}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Text style={styles.filterIcon}>☰</Text>
        {filterCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{filterCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 54,
    paddingHorizontal: 16,
    backgroundColor: SEARCH_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: SEARCH_COLORS.border,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    fontWeight: '600',
    color: SEARCH_COLORS.darkText,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: SEARCH_COLORS.darkText,
  },
  filterIcon: {
    fontSize: 18,
    color: SEARCH_COLORS.darkText,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: SEARCH_COLORS.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: SEARCH_COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
