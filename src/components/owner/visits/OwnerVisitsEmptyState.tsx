import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CalendarX, ArrowRight } from 'lucide-react-native';
import { VisitFilterTab } from './OwnerVisitsStatusTabs';

interface OwnerVisitsEmptyStateProps {
  activeTab: VisitFilterTab;
  onViewEnquiries: () => void;
}

export const OwnerVisitsEmptyState: React.FC<OwnerVisitsEmptyStateProps> = ({
  activeTab,
  onViewEnquiries,
}) => {
  const getEmptyInfo = () => {
    switch (activeTab) {
      case 'PENDING':
        return {
          title: 'No visits awaiting confirmation',
          sub: 'All tour requests have been responded to.',
        };
      case 'CONFIRMED':
        return {
          title: 'No confirmed visits',
          sub: 'When you accept visit requests from renters, they will appear here.',
        };
      case 'COMPLETED':
        return {
          title: 'No completed visits yet',
          sub: 'Visits you mark as completed will be archived here.',
        };
      case 'CANCELLED':
        return {
          title: 'No cancelled visits',
          sub: 'Cancelled visit requests will appear here for your records.',
        };
      case 'ALL':
      default:
        return {
          title: 'No scheduled visits',
          sub: 'When renters book visits to your properties, you can confirm and track them here.',
        };
    }
  };

  const info = getEmptyInfo();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <CalendarX size={34} color="#6C4DFF" strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>{info.title}</Text>
      <Text style={styles.subtitle}>{info.sub}</Text>

      <Pressable
        style={styles.ctaBtn}
        onPress={onViewEnquiries}
        accessibilityRole="button"
        accessibilityLabel="View tenant enquiries"
      >
        <Text style={styles.ctaText}>View tenant enquiries</Text>
        <ArrowRight size={14} color="#FFFFFF" strokeWidth={2.2} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 24,
    marginHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#171522',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
    maxWidth: 280,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 6,
  },
  ctaText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
