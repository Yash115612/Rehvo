/**
 * REHVO AI Tour™ — Tenant 3D Virtual Tour Screen
 * Fullscreen immersive spatial walkthrough.
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getTourByPropertyId } from '../../../src/lib/ai-tour/supabase';
import { PropertyTour3D } from '../../../src/types/tour';
import { TourViewer } from '../../../src/components/tour/TourViewer';
import { TourLoader } from '../../../src/components/tour/TourLoader';

export default function TourDetailRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tour, setTour] = useState<PropertyTour3D | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      getTourByPropertyId(id).then((t) => {
        setTour(t);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <TourLoader progressPercent={44} stepName="Streaming 3D Spatial Geometry..." />
      </View>
    );
  }

  if (!tour) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load 3D virtual tour.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TourViewer tour={tour} onExit={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#031B2A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#031B2A',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#031B2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
});
