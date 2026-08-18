import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OwnerPropertiesSummaryProps {
  totalCount: number;
  activeCount: number;
  draftCount: number;
  pausedCount: number;
  rentedCount: number;
}

export const OwnerPropertiesSummary: React.FC<OwnerPropertiesSummaryProps> = ({
  totalCount,
  activeCount,
  draftCount,
  pausedCount,
  rentedCount,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.totalRow}>
          <Text style={styles.totalNum}>{totalCount}</Text>
          <Text style={styles.totalLabel}>
            {totalCount === 1 ? 'Property listed' : 'Total Properties'}
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          <View style={styles.pill}>
            <View style={[styles.dot, { backgroundColor: '#32B768' }]} />
            <Text style={styles.pillText}>{activeCount} Active</Text>
          </View>

          {draftCount > 0 && (
            <View style={styles.pill}>
              <View style={[styles.dot, { backgroundColor: '#86828F' }]} />
              <Text style={styles.pillText}>{draftCount} Draft</Text>
            </View>
          )}

          {pausedCount > 0 && (
            <View style={styles.pill}>
              <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.pillText}>{pausedCount} Paused</Text>
            </View>
          )}

          {rentedCount > 0 && (
            <View style={styles.pill}>
              <View style={[styles.dot, { backgroundColor: '#777482' }]} />
              <Text style={styles.pillText}>{rentedCount} Rented</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  totalNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171522',
  },
  totalLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#777482',
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#171522',
  },
});
