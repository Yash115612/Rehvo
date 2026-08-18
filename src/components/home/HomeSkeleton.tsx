import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const HomeSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.headerText}>
          <View style={styles.lineShort} />
          <View style={styles.lineLong} />
        </View>
        <View style={styles.actionPill} />
      </View>

      {/* Search Bar Skeleton */}
      <View style={styles.searchBar} />

      {/* Ad Carousel Skeleton */}
      <View style={styles.adBanner} />

      {/* Quick Filters Skeleton */}
      <View style={styles.filtersRow}>
        <View style={[styles.filterPill, { width: 90 }]} />
        <View style={[styles.filterPill, { width: 110 }]} />
        <View style={[styles.filterPill, { width: 100 }]} />
        <View style={[styles.filterPill, { width: 85 }]} />
      </View>

      {/* Categories Skeleton */}
      <View style={styles.catRow}>
        <View style={styles.catCard} />
        <View style={styles.catCard} />
        <View style={styles.catCard} />
      </View>

      {/* Property Cards Carousel Skeleton */}
      <View style={styles.cardSection}>
        <View style={styles.propCard} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8E5EC',
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  lineShort: {
    width: 90,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E8E5EC',
  },
  lineLong: {
    width: 160,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E8E5EC',
  },
  actionPill: {
    width: 100,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8E5EC',
  },
  searchBar: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8E5EC',
  },
  adBanner: {
    height: 175,
    borderRadius: 22,
    backgroundColor: '#E8E5EC',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    height: 38,
    borderRadius: 14,
    backgroundColor: '#E8E5EC',
  },
  catRow: {
    flexDirection: 'row',
    gap: 12,
  },
  catCard: {
    width: 140,
    height: 160,
    borderRadius: 18,
    backgroundColor: '#E8E5EC',
  },
  cardSection: {
    gap: 12,
  },
  propCard: {
    width: '100%',
    height: 260,
    borderRadius: 20,
    backgroundColor: '#E8E5EC',
  },
});
