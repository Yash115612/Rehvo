import React from 'react';
import { View, StyleSheet } from 'react-native';

export const SearchSkeletonCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.imageBlock} />
      <View style={styles.body}>
        <View style={styles.titlePriceRow}>
          <View style={styles.titleLine} />
          <View style={styles.priceLine} />
        </View>

        <View style={styles.locationLine} />
        <View style={styles.specsLine} />
        <View style={styles.tagsLine} />
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
  titlePriceRow: {
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
    width: '38%',
    height: 14,
    borderRadius: 5,
    backgroundColor: '#F0EEE9',
  },
  specsLine: {
    width: '65%',
    height: 14,
    borderRadius: 5,
    backgroundColor: '#F0EEE9',
  },
  tagsLine: {
    width: '45%',
    height: 14,
    borderRadius: 5,
    backgroundColor: '#F4F2F6',
  },
});
