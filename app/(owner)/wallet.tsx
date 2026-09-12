import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4OwnerWalletScreen } from '../../src/components/v4/screens/V4OwnerWalletScreen';

export default function OwnerWalletRoute() {
  return (
    <View style={styles.container}>
      <V4OwnerWalletScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
