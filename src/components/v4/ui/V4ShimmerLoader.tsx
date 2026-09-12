import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { V4_COLORS, V4_RADIUS } from '../../../theme/v4Theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const V4ShimmerCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.imageSkeleton} />
      <View style={styles.contentSkeleton}>
        <View style={styles.lineLong} />
        <View style={styles.lineMedium} />
        <View style={styles.lineShort} />
      </View>
    </View>
  );
};

export const V4ShimmerFeed: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <View style={styles.feed}>
      {Array.from({ length: count }).map((_, idx) => (
        <V4ShimmerCard key={idx} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  feed: {
    paddingHorizontal: 16,
    gap: 14,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    overflow: 'hidden',
  },
  imageSkeleton: {
    width: '100%',
    height: 190,
    backgroundColor: '#E2E8F0',
  },
  contentSkeleton: {
    padding: 16,
    gap: 10,
  },
  lineLong: {
    width: '80%',
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  lineMedium: {
    width: '55%',
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F1F5F9',
  },
  lineShort: {
    width: '35%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
});
