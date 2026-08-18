import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SearchX, RotateCcw } from 'lucide-react-native';

interface CategoryEmptyStateProps {
  title: string;
  subtitle: string;
  onResetFilters?: () => void;
  resetLabel?: string;
}

export const CategoryEmptyState: React.FC<CategoryEmptyStateProps> = ({
  title,
  subtitle,
  onResetFilters,
  resetLabel = 'Reset Filters',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <SearchX size={32} color="#6C4DFF" strokeWidth={1.8} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {onResetFilters && (
        <Pressable
          style={styles.resetBtn}
          onPress={onResetFilters}
          accessibilityRole="button"
          accessibilityLabel={resetLabel}
        >
          <RotateCcw size={15} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.resetBtnText}>{resetLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 48,
    gap: 8,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 20,
    marginTop: 12,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  resetBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
