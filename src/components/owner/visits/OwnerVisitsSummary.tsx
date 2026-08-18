import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OwnerVisitsSummaryProps {
  totalCount: number;
  todayCount: number;
  thisWeekCount: number;
  pendingCount: number;
}

export const OwnerVisitsSummary: React.FC<OwnerVisitsSummaryProps> = ({
  totalCount,
  todayCount,
  thisWeekCount,
  pendingCount,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.totalRow}>
          <Text style={styles.totalNum}>{totalCount}</Text>
          <Text style={styles.totalLabel}>
            {totalCount === 1 ? 'Upcoming visit' : 'Upcoming visits'}
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          {todayCount > 0 && (
            <View style={[styles.pill, styles.todayPill]}>
              <Text style={styles.todayPillText}>{todayCount} Today</Text>
            </View>
          )}

          {thisWeekCount > 0 && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{thisWeekCount} This Week</Text>
            </View>
          )}

          {pendingCount > 0 && (
            <View style={[styles.pill, styles.pendingPill]}>
              <Text style={styles.pendingPillText}>
                {pendingCount} Pending
              </Text>
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
  },
  pill: {
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#171522',
  },
  todayPill: {
    backgroundColor: '#F0ECFF',
  },
  todayPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  pendingPill: {
    backgroundColor: '#FEF3C7',
  },
  pendingPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#D97706',
  },
});
