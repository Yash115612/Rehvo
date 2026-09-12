import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4OwnerRentScreen } from '../../src/components/v4/screens/V4OwnerRentScreen';

export default function OwnerRentCollectionRoute() {
  return (
    <View style={styles.container}>
      <V4OwnerRentScreen hideHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
