import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Clock, Zap } from 'lucide-react-native';

export const OwnerPerformanceSnapshot: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Listing performance</Text>

      <View style={styles.card}>
        <View style={styles.col}>
          <View style={styles.headerRow}>
            <TrendingUp size={15} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.colTitle}>Views this week</Text>
          </View>
          <Text style={styles.mainNum}>1,248</Text>
          <Text style={styles.trendText}>+18% vs last week</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.col}>
          <View style={styles.headerRow}>
            <Zap size={15} color="#6C4DFF" strokeWidth={2.2} />
            <Text style={styles.colTitle}>Enquiries</Text>
          </View>
          <Text style={styles.mainNum}>36</Text>
          <Text style={styles.trendText}>+6% response rate</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.col}>
          <View style={styles.headerRow}>
            <Clock size={15} color="#FF735C" strokeWidth={2.2} />
            <Text style={styles.colTitle}>Avg Response</Text>
          </View>
          <Text style={styles.mainNum}>8 min</Text>
          <Text style={styles.greenSub}>Top 5% in Mumbai</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
  },
  col: {
    flex: 1,
    gap: 2,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  colTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777482',
  },
  mainNum: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
    marginTop: 2,
  },
  trendText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#32B768',
    marginTop: 1,
  },
  greenSub: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6C4DFF',
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#E8E5EC',
  },
});
