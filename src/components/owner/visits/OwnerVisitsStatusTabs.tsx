import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { VisitStatus } from '../../../types';

export type VisitFilterTab =
  | 'ALL'
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

interface StatusOption {
  id: VisitFilterTab;
  label: string;
  count: number;
}

interface OwnerVisitsStatusTabsProps {
  activeTab: VisitFilterTab;
  onSelectTab: (tab: VisitFilterTab) => void;
  counts: Record<VisitFilterTab, number>;
}

export const OwnerVisitsStatusTabs: React.FC<OwnerVisitsStatusTabsProps> = ({
  activeTab,
  onSelectTab,
  counts,
}) => {
  const tabs: StatusOption[] = [
    { id: 'ALL', label: 'All', count: counts.ALL },
    { id: 'PENDING', label: 'Pending', count: counts.PENDING },
    { id: 'CONFIRMED', label: 'Confirmed', count: counts.CONFIRMED },
    { id: 'COMPLETED', label: 'Completed', count: counts.COMPLETED },
    { id: 'CANCELLED', label: 'Cancelled', count: counts.CANCELLED },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              style={[styles.pill, isSelected && styles.pillActive]}
              onPress={() => onSelectTab(tab.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${tab.label} visits (${tab.count})`}
            >
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextActive,
                ]}
              >
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View
                  style={[
                    styles.countBadge,
                    isSelected && styles.countBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isSelected && styles.countTextActive,
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
    height: 40,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  pillActive: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: '#F3F0EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777482',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
});
