import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4HostPlansScreen } from '../../src/components/v4/screens/V4HostPlansScreen';

export default function OwnerSubscriptionRoute() {
  return (
    <View style={styles.container}>
      <V4HostPlansScreen hideHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
