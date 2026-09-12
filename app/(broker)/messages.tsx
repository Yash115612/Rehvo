import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4BrokerMessagesScreen } from '../../src/components/v4/screens/V4BrokerMessagesScreen';

export default function BrokerMessagesRoute() {
  return (
    <View style={styles.container}>
      <V4BrokerMessagesScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
