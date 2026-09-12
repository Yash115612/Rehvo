import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4BrokerClientsScreen } from '../../src/components/v4/screens/V4BrokerClientsScreen';

export default function BrokerClientsRoute() {
  return (
    <View style={styles.container}>
      <V4BrokerClientsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
