import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Building2, MessageCircle, CalendarDays, Eye } from 'lucide-react-native';

interface OwnerActivityOverviewProps {
  activePropertiesCount: number;
  enquiriesCount: number;
  upcomingVisitsCount: number;
  totalViewsCount: number;
}

export const OwnerActivityOverview: React.FC<OwnerActivityOverviewProps> = ({
  activePropertiesCount,
  enquiriesCount,
  upcomingVisitsCount,
  totalViewsCount,
}) => {
  const metrics = [
    {
      id: 'props',
      label: 'Active Listings',
      value: activePropertiesCount,
      icon: Building2,
      color: '#6C4DFF',
      bg: '#F0ECFF',
    },
    {
      id: 'enquiries',
      label: 'Enquiries',
      value: enquiriesCount,
      icon: MessageCircle,
      color: '#32B768',
      bg: '#EAF8F0',
    },
    {
      id: 'visits',
      label: 'Visits',
      value: upcomingVisitsCount,
      icon: CalendarDays,
      color: '#F59E0B',
      bg: '#FEF3C7',
    },
    {
      id: 'views',
      label: 'Total Views',
      value: totalViewsCount,
      icon: Eye,
      color: '#8B5CF6',
      bg: '#F5F3FF',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>My Activity</Text>

      <View style={styles.grid}>
        {metrics.map((m) => {
          const Icon = m.icon;

          return (
            <View key={m.id} style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: m.bg }]}>
                <Icon size={16} color={m.color} strokeWidth={2.2} />
              </View>
              <Text style={styles.metricVal}>{m.value}</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
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
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48.3%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
    gap: 6,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171522',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777482',
  },
});
