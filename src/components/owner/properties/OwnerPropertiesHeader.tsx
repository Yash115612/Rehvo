import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ArrowUpDown, Plus } from 'lucide-react-native';

interface OwnerPropertiesHeaderProps {
  onSortPress: () => void;
  onAddPress: () => void;
  activeSortLabel?: string;
}

export const OwnerPropertiesHeader: React.FC<OwnerPropertiesHeaderProps> = ({
  onSortPress,
  onAddPress,
  activeSortLabel = 'Recently updated',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <Text style={styles.title}>My Properties</Text>
        <Text style={styles.subtitle}>Manage your rental listings</Text>
      </View>

      <View style={styles.rightActions}>
        {/* Sort Button */}
        <Pressable
          style={styles.sortBtn}
          onPress={onSortPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Sort properties. Currently: ${activeSortLabel}`}
        >
          <ArrowUpDown size={16} color="#171522" strokeWidth={2.2} />
        </Pressable>

        {/* Add Property Button */}
        <Pressable
          style={styles.addBtn}
          onPress={onAddPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="List a new property"
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.addBtnText}>List</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F8F7F4',
  },
  leftCol: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '500',
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 20,
  },
  addBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
