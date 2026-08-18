import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Clock, Zap } from 'lucide-react-native';

interface OwnerPerformanceSnapshotProps {
  viewsThisWeek?: number;
  viewsLastWeek?: number;
  totalEnquiries?: number;
  contactedEnquiries?: number;
  activeVisitsCount?: number;
}

export const OwnerPerformanceSnapshot: React.FC<OwnerPerformanceSnapshotProps> = ({
  viewsThisWeek = 0,
  viewsLastWeek = 0,
  totalEnquiries = 0,
  contactedEnquiries = 0,
  activeVisitsCount = 0,
}) => {
  // Real week-over-week trend calculation
  let trendLabel = 'Active';
  if (viewsLastWeek > 0) {
    const diff = viewsThisWeek - viewsLastWeek;
    const pct = Math.round((diff / viewsLastWeek) * 100);
    trendLabel = pct >= 0 ? `+${pct}% vs last week` : `${pct}% vs last week`;
  } else if (viewsThisWeek > 0) {
    trendLabel = `+${viewsThisWeek} this week`;
  } else {
    trendLabel = '0 this week';
  }

  // Real response rate calculation
  const responseRate =
    totalEnquiries > 0
      ? `${Math.round((contactedEnquiries / totalEnquiries) * 100)}% responded`
      : 'No enquiries yet';

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Listing performance</Text>

      <View style={styles.card}>
        {/* Col 1: Views this week */}
        <View style={styles.col}>
          <View style={styles.headerRow}>
            <TrendingUp size={15} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.colTitle}>Views this week</Text>
          </View>
          <Text style={styles.mainNum}>{viewsThisWeek.toLocaleString('en-IN')}</Text>
          <Text style={styles.trendText}>{trendLabel}</Text>
        </View>

        <View style={styles.divider} />

        {/* Col 2: Real Enquiries & Response Rate */}
        <View style={styles.col}>
          <View style={styles.headerRow}>
            <Zap size={15} color="#6C4DFF" strokeWidth={2.2} />
            <Text style={styles.colTitle}>Total Enquiries</Text>
          </View>
          <Text style={styles.mainNum}>{totalEnquiries.toString()}</Text>
          <Text style={styles.trendText}>{responseRate}</Text>
        </View>

        <View style={styles.divider} />

        {/* Col 3: Real Visits / Activity */}
        <View style={styles.col}>
          <View style={styles.headerRow}>
            <Clock size={15} color="#FF735C" strokeWidth={2.2} />
            <Text style={styles.colTitle}>Visits</Text>
          </View>
          <Text style={styles.mainNum}>{activeVisitsCount.toString()}</Text>
          <Text style={styles.greenSub}>
            {activeVisitsCount > 0 ? `${activeVisitsCount} scheduled` : '0 scheduled'}
          </Text>
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
