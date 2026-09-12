import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { CompatibilityInsightsScreen } from '../../../src/components/flatmates/CompatibilityInsightsScreen';
import { CURATED_FLATMATES } from '../../../src/services/flatmatesData';
import { V4_COLORS } from '../../../src/theme/v4Theme';

export default function FlatmateInsightsRoute() {
  const { flatmates, myFlatmateProfile } = useAppStore();

  const profile =
    flatmates.find((f) => f.id !== myFlatmateProfile?.id) ||
    flatmates[0] ||
    CURATED_FLATMATES[0];

  if (!profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={V4_COLORS.primary} />
      </View>
    );
  }

  return <CompatibilityInsightsScreen profile={profile} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFB',
  },
});
