import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PropertyDetailsScreen } from '../../../src/components/property/PropertyDetailsScreen';
import { useAppStore } from '../../../src/store/useAppStore';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import * as propertyService from '../../../src/services/properties';
import { Property } from '../../../src/types';

export default function PropertyDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { properties, savedPropertyIds, toggleSaveProperty, recordPropertyView, user } = useAppStore();

  const [remoteProperty, setRemoteProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const hasTrackedViewRef = React.useRef<string | null>(null);

  // Check store first
  const localProperty = properties.find((p) => p.id === id);

  useEffect(() => {
    if (!localProperty && id) {
      setIsLoading(true);
      propertyService.getPropertyById(id).then((res) => {
        setIsLoading(false);
        setFetchAttempted(true);
        if (res.success && res.data) {
          setRemoteProperty(res.data);
        }
      });
    }
  }, [id, localProperty]);

  const property = localProperty || remoteProperty;

  // Real view event logging (once per mount, excluded for owner)
  useEffect(() => {
    if (property?.id && hasTrackedViewRef.current !== property.id) {
      hasTrackedViewRef.current = property.id;
      if (property.owner_id && user?.id && property.owner_id === user.id) {
        return;
      }
      recordPropertyView(property.id);
    }
  }, [property?.id, property?.owner_id, user?.id, recordPropertyView]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C4DFF" />
        <Text style={styles.loadingText}>Loading property details...</Text>
      </View>
    );
  }

  if (!property && (fetchAttempted || !id || properties.length > 0)) {
    return (
      <View style={styles.center}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Property not found</Text>
          <Text style={styles.errorSub}>
            This listing may have been rented, paused, or removed by the owner.
          </Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={16} color="#FFFFFF" />
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C4DFF" />
      </View>
    );
  }

  return (
    <PropertyDetailsScreen
      property={property}
      isSaved={savedPropertyIds.includes(property.id)}
      onToggleSave={toggleSaveProperty}
      onBack={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(renter)/search');
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F7F4',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#777482',
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 24,
    alignItems: 'center',
    gap: 8,
    maxWidth: 320,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
  },
  errorSub: {
    fontSize: 13.5,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
