import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4BrokerProfileScreen } from '../../src/components/v4/screens/V4BrokerProfileScreen';

export default function BrokerProfileRoute() {
  return (
    <View style={styles.container}>
      <V4BrokerProfileScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
