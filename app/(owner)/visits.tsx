import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4OwnerVisitsScreen } from '../../src/components/v4/screens/V4OwnerVisitsScreen';

export default function OwnerVisitsRoute() {
  return (
    <View style={styles.container}>
      <V4OwnerVisitsScreen hideHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
