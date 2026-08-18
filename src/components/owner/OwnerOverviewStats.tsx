import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Building2,
  Eye,
  MessageCircle,
  CalendarDays,
} from 'lucide-react-native';

interface OwnerOverviewStatsProps {
  activeListingsCount: number;
  totalViewsCount: number;
  enquiriesCount: number;
  upcomingVisitsCount: number;
}

export const OwnerOverviewStats: React.FC<OwnerOverviewStatsProps> = ({
  activeListingsCount,
  totalViewsCount,
  enquiriesCount,
  upcomingVisitsCount,
}) => {
  const stats = [
    {
      label: 'Active Listings',
      value: activeListingsCount.toString(),
      icon: Building2,
      iconColor: '#6C4DFF',
      iconBg: '#F0ECFF',
    },
    {
      label: 'Total Views',
      value: totalViewsCount.toLocaleString('en-IN'),
      icon: Eye,
      iconColor: '#32B768',
      iconBg: '#EAF8F0',
    },
    {
      label: 'Enquiries',
      value: enquiriesCount.toString(),
      icon: MessageCircle,
      iconColor: '#6C4DFF',
      iconBg: '#F0ECFF',
    },
    {
      label: 'Upcoming Visits',
      value: upcomingVisitsCount.toString(),
      icon: CalendarDays,
      iconColor: '#FF735C',
      iconBg: '#FFF0ED',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Overview</Text>

      <View style={styles.grid}>
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <View key={idx} style={styles.statCard}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: item.iconBg },
                ]}
              >
                <Icon size={18} color={item.iconColor} strokeWidth={2.2} />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.statVal}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            </View>
          );
        })}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
  },
  statLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#777482',
    marginTop: 1,
  },
});
