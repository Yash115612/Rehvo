import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4OwnerAnalyticsScreen } from '../../src/components/v4/screens/V4OwnerAnalyticsScreen';

export default function OwnerAnalyticsRoute() {
  return (
    <View style={styles.container}>
      <V4OwnerAnalyticsScreen hideHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
