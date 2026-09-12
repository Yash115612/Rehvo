import React from 'react';
import { View, StyleSheet } from 'react-native';
import { V4RentalIncomeEstimatorScreen } from '../../src/components/v4/screens/V4RentalIncomeEstimatorScreen';

export default function OwnerRentalEstimatorRoute() {
  return (
    <View style={styles.container}>
      <V4RentalIncomeEstimatorScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
