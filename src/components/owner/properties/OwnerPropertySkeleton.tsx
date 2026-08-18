import React from 'react';
import { View, StyleSheet } from 'react-native';

export const OwnerPropertySkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {[1, 2].map((k) => (
        <View key={k} style={styles.card}>
          <View style={styles.imageBox} />
          <View style={styles.body}>
            <View style={styles.lineLong} />
            <View style={styles.lineShort} />
            <View style={styles.lineMed} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 14,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
  },
  imageBox: {
    width: '100%',
    height: 180,
    backgroundColor: '#E8E5EC',
  },
  body: {
    padding: 16,
    gap: 10,
  },
  lineLong: {
    width: '75%',
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E8E5EC',
  },
  lineShort: {
    width: '45%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E8E5EC',
  },
  lineMed: {
    width: '60%',
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E8E5EC',
  },
});
