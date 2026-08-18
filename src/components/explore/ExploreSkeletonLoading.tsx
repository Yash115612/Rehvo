import React from 'react';
import { View, StyleSheet } from 'react-native';

export const ExploreSkeletonLoading: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.headerSkeleton} />

      {/* Search Bar Skeleton */}
      <View style={styles.searchSkeleton} />

      {/* Filter Chips Skeleton */}
      <View style={styles.chipRow}>
        <View style={styles.chipSkeleton1} />
        <View style={styles.chipSkeleton2} />
        <View style={styles.chipSkeleton3} />
      </View>

      {/* Cards Grid Skeleton */}
      <View style={styles.cardsGrid}>
        {[1, 2, 3, 4].map((idx) => (
          <React.Fragment key={idx}>
            <View style={styles.cardSkeleton}>
              <View style={styles.imageSkeleton} />
              <View style={styles.titleSkeleton} />
              <View style={styles.subSkeleton} />
              <View style={styles.cardFooter}>
                <View style={styles.priceSkeleton} />
                <View style={styles.btnSkeleton} />
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  headerSkeleton: {
    height: 32,
    width: 180,
    backgroundColor: '#E4E2DD',
    borderRadius: 16,
  },
  searchSkeleton: {
    height: 52,
    width: '100%',
    backgroundColor: '#E4E2DD',
    borderRadius: 24,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipSkeleton1: {
    height: 36,
    width: 90,
    backgroundColor: '#E4E2DD',
    borderRadius: 18,
  },
  chipSkeleton2: {
    height: 36,
    width: 80,
    backgroundColor: '#E4E2DD',
    borderRadius: 18,
  },
  chipSkeleton3: {
    height: 36,
    width: 100,
    backgroundColor: '#E4E2DD',
    borderRadius: 18,
  },
  cardsGrid: {
    gap: 16,
  },
  cardSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    padding: 12,
    gap: 10,
  },
  imageSkeleton: {
    height: 160,
    width: '100%',
    backgroundColor: '#E4E2DD',
    borderRadius: 16,
  },
  titleSkeleton: {
    height: 16,
    width: '75%',
    backgroundColor: '#E4E2DD',
    borderRadius: 6,
  },
  subSkeleton: {
    height: 12,
    width: '50%',
    backgroundColor: '#E4E2DD',
    borderRadius: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0EEE9',
  },
  priceSkeleton: {
    height: 20,
    width: 90,
    backgroundColor: '#E4E2DD',
    borderRadius: 6,
  },
  btnSkeleton: {
    height: 28,
    width: 70,
    backgroundColor: '#E4E2DD',
    borderRadius: 12,
  },
});

