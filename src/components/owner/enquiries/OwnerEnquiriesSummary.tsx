import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OwnerEnquiriesSummaryProps {
  totalCount: number;
  newCount: number;
  repliedCount: number;
  visitsCount: number;
}

export const OwnerEnquiriesSummary: React.FC<OwnerEnquiriesSummaryProps> = ({
  totalCount,
  newCount,
  repliedCount,
  visitsCount,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.totalRow}>
          <Text style={styles.totalNum}>{totalCount}</Text>
          <Text style={styles.totalLabel}>
            {totalCount === 1 ? 'Enquiry' : 'Total Enquiries'}
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          {newCount > 0 && (
            <View style={[styles.pill, styles.newPill]}>
              <Text style={styles.newPillText}>{newCount} New</Text>
            </View>
          )}

          {repliedCount > 0 && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{repliedCount} Replied</Text>
            </View>
          )}

          {visitsCount > 0 && (
            <View style={[styles.pill, styles.visitPill]}>
              <Text style={styles.visitPillText}>{visitsCount} Visits</Text>
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
  newPill: {
    backgroundColor: '#F0ECFF',
  },
  newPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  visitPill: {
    backgroundColor: '#EAF8F0',
  },
  visitPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#32B768',
  },
});
