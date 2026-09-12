import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4OwnerDashboardScreen } from '../../src/components/v4/screens/V4OwnerDashboardScreen';

export default function OwnerDashboardRoute() {
  return (
    <View style={styles.container}>
      <V4OwnerDashboardScreen hideHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
