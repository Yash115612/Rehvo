import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useAppStore } from '../../../../src/store/useAppStore';
import { CompatibilityInsightsScreen } from '../../../../src/components/flatmates/CompatibilityInsightsScreen';
import { CURATED_FLATMATES } from '../../../../src/services/flatmatesData';

export default function CompatibilityInsightsPage() {
  const { id } = useLocalSearchParams();
  const { flatmates } = useAppStore();

  const profile =
    flatmates.find((fm) => fm.id === id) ||
    CURATED_FLATMATES.find((fm) => fm.id === id) ||
    CURATED_FLATMATES[0];

  return <CompatibilityInsightsScreen profile={profile} />;
}
