import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4OwnerLeadsScreen } from '../../src/components/v4/screens/V4OwnerLeadsScreen';

export default function OwnerLeadsRoute() {
  return (
    <View style={styles.container}>
      <V4OwnerLeadsScreen hideHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
