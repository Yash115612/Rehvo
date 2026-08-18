import React from 'react';
import { View, StyleSheet } from 'react-native';

export const SavedSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      {/* Image Skeleton */}
      <View style={styles.imageBlock} />

      {/* Body Skeleton */}
      <View style={styles.body}>
        <View style={styles.row}>
          <View style={styles.titleLine} />
          <View style={styles.priceLine} />
        </View>

        <View style={styles.locationLine} />

        <View style={styles.specsLine} />

        <View style={styles.footerLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageBlock: {
    width: '100%',
    height: 205,
    backgroundColor: '#EAE7E1',
  },
  body: {
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleLine: {
    width: '55%',
    height: 18,
    borderRadius: 6,
    backgroundColor: '#EAE7E1',
  },
  priceLine: {
    width: '25%',
    height: 18,
    borderRadius: 6,
    backgroundColor: '#EAE7E1',
  },
  locationLine: {
    width: '40%',
    height: 14,
    borderRadius: 5,
    backgroundColor: '#F0EEE9',
  },
  specsLine: {
    width: '70%',
    height: 14,
    borderRadius: 5,
    backgroundColor: '#F0EEE9',
  },
  footerLine: {
    width: '35%',
    height: 16,
    borderRadius: 6,
    backgroundColor: '#F4F2F6',
    marginTop: 4,
  },
});
