import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { V4PropertyDetailsScreen } from '../../../src/components/v4/screens/V4PropertyDetailsScreen';
import { useAppStore } from '../../../src/store/useAppStore';
import * as propertyService from '../../../src/services/properties';
import { Property } from '../../../src/types';

export default function PropertyDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { properties } = useAppStore();

  const [remoteProperty, setRemoteProperty] = useState<Property | null>(null);

  // Check local store first
  const localProperty = properties.find((p) => p.id === id);

  useEffect(() => {
    if (!localProperty && id) {
      propertyService.getPropertyById(id).then((res) => {
        if (res.success && res.data) {
          setRemoteProperty(res.data);
        }
      });
    }
  }, [id, localProperty]);

  const property = localProperty || remoteProperty || undefined;

  return <V4PropertyDetailsScreen property={property} />;
}
