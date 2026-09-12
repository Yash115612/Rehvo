import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4OwnerProfileScreen } from '../../src/components/v4/screens/V4OwnerProfileScreen';

export default function OwnerProfileRoute() {
  return (
    <View style={styles.container}>
      <V4OwnerProfileScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
