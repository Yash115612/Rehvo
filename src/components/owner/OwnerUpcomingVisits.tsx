import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CalendarDays, Clock, ArrowRight, UserCheck } from 'lucide-react-native';
import { Visit } from '../../types';

interface OwnerUpcomingVisitsProps {
  visits: Visit[];
  onViewAll: () => void;
  onSelectVisit: (visit: Visit) => void;
}

export const OwnerUpcomingVisits: React.FC<OwnerUpcomingVisitsProps> = ({
  visits,
  onViewAll,
  onSelectVisit,
}) => {
  if (!visits || visits.length === 0) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return { label: 'Confirmed', bg: '#EAF8F0', text: '#32B768' };
      case 'REQUESTED':
        return { label: 'Awaiting confirmation', bg: '#FEF3C7', text: '#D97706' };
      default:
        return { label: status, bg: '#F3F0EA', text: '#777482' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Upcoming visits</Text>
        <Pressable
          style={styles.viewAllBtn}
          onPress={onViewAll}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="View all visits"
        >
          <Text style={styles.viewAllText}>View all</Text>
          <ArrowRight size={14} color="#6C4DFF" strokeWidth={2.2} />
        </Pressable>
      </View>

      <View style={styles.list}>
        {visits.slice(0, 3).map((item) => {
          const statusInfo = getStatusBadge(item.status);

          return (
            <Pressable
              key={item.id}
              style={styles.visitCard}
              onPress={() => onSelectVisit(item)}
              accessibilityRole="button"
              accessibilityLabel={`Visit for ${item.property_title}`}
            >
              <View style={styles.iconCircle}>
                <CalendarDays size={20} color="#6C4DFF" strokeWidth={2} />
              </View>

              <View style={styles.detailsCol}>
                <View style={styles.dateTimeRow}>
                  <Text style={styles.dateTimeText}>
                    {item.date} · {item.time}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusInfo.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: statusInfo.text },
                      ]}
                    >
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>

                <Text style={styles.propTitle} numberOfLines={1}>
                  {item.property_title} · {item.property_locality}
                </Text>

                <View style={styles.renterRow}>
                  <UserCheck size={12} color="#777482" strokeWidth={2} />
                  <Text style={styles.renterName}>
                    Renter: {item.renter_name}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  list: {
    gap: 10,
  },
  visitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCol: {
    flex: 1,
    gap: 3,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  dateTimeText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  propTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#6C4DFF',
  },
  renterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  renterName: {
    fontSize: 11.5,
    color: '#777482',
    fontWeight: '500',
  },
});
