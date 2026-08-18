import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SearchX, RotateCcw, MapPin } from 'lucide-react-native';

interface SearchEmptyStateProps {
  onClearFilters: () => void;
  onChangeLocation?: () => void;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  onClearFilters,
  onChangeLocation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <SearchX size={28} color="#6C4DFF" strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>No homes found</Text>
      <Text style={styles.subtitle}>
        Try another area or adjust your filters to see available listings.
      </Text>
      <View style={styles.actionRow}>
        <Pressable
          style={styles.primaryBtn}
          onPress={onClearFilters}
          accessibilityRole="button"
          accessibilityLabel="Clear filters"
        >
          <RotateCcw size={14} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.primaryBtnText}>Clear filters</Text>
        </Pressable>

        {onChangeLocation && (
          <Pressable
            style={styles.secondaryBtn}
            onPress={onChangeLocation}
            accessibilityRole="button"
            accessibilityLabel="Change location"
          >
            <MapPin size={14} color="#171522" strokeWidth={2} />
            <Text style={styles.secondaryBtnText}>Change location</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#171522',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#171522',
  },
});
