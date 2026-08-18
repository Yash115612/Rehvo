import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddRoute() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(renter)/listing/property-type' as any);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#6C4DFF" />
    </View>
  );
}
