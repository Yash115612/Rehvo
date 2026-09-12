import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4BrokerInventoryScreen } from '../../src/components/v4/screens/V4BrokerInventoryScreen';

export default function BrokerInventoryRoute() {
  return (
    <View style={styles.container}>
      <V4BrokerInventoryScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
