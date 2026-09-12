import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4BrokerDashboardScreen } from '../../src/components/v4/screens/V4BrokerDashboardScreen';

export default function BrokerDashboardRoute() {
  return (
    <View style={styles.container}>
      <V4BrokerDashboardScreen hideHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
